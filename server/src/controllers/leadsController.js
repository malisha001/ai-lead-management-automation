const Lead = require('../models/Lead');
const { enrichLead } = require('../services/aiService');
const { appendLeadToSheet } = require('../services/sheetsService');
const { sendLeadNotificationEmail } = require('../services/emailService');

// ─── Helper ───────────────────────────────────────────────────────────────────
const sendSuccess = (res, statusCode, message, data) =>
  res.status(statusCode).json({ success: true, message, data });

const sendError = (res, statusCode, message, errors = null) =>
  res.status(statusCode).json({ success: false, message, ...(errors && { errors }) });

// ─── POST /api/leads ──────────────────────────────────────────────────────────
/**
 * Create a new lead.
 * 1. Validate input
 * 2. Call AI service for enrichment (with fallback)
 * 3. Save to MongoDB
 * 4. Fire-and-forget: Google Sheets + email notifications
 * 5. Return enriched lead
 */
const createLead = async (req, res) => {
  try {
    const { name, email, phone, company, serviceType, message } = req.body;

    // ── Step 1: Basic validation ──────────────────────────────────────────
    if (!name || !email || !message) {
      return sendError(res, 400, 'name, email, and message are required fields.');
    }

    // ── Step 2: AI Enrichment (graceful fallback built into aiService) ────
    const { aiSummary, category, priority, aiEnriched } = await enrichLead({
      message,
      serviceType: serviceType || 'General Inquiry',
    });

    // ── Step 3: Save to MongoDB ───────────────────────────────────────────
    const lead = await Lead.create({
      name,
      email,
      phone,
      company,
      serviceType: serviceType || 'General Inquiry',
      message,
      aiSummary,
      category,
      priority,
      aiEnriched,
      status: 'new',
      statusHistory: [{ status: 'new', changedAt: new Date() }],
    });

    // ── Step 4: Non-blocking side effects ─────────────────────────────────
    // These run async — failures won't affect the API response.

    appendLeadToSheet(lead).catch((err) =>
      console.error('[leadsController] Google Sheets append failed:', err.message)
    );

    sendLeadNotificationEmail(lead).catch((err) =>
      console.error('[leadsController] Email notification failed:', err.message)
    );

    // ── Step 5: Return enriched lead ──────────────────────────────────────
    return sendSuccess(res, 201, 'Lead submitted successfully.', lead);

  } catch (error) {
    console.error('[leadsController] createLead error:', error);

    // Handle Mongoose duplicate key (e.g., duplicate email if indexed)
    if (error.code === 11000) {
      return sendError(res, 409, 'A lead with this email already exists.');
    }

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e) => e.message);
      return sendError(res, 422, 'Validation failed.', errors);
    }

    return sendError(res, 500, 'Internal server error. Please try again later.');
  }
};

// ─── GET /api/leads ───────────────────────────────────────────────────────────
/**
 * Get all leads with pagination, filtering, and search.
 * Requires: JWT auth middleware
 */
const getLeads = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      priority,
      status,
      search,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    // Build MongoDB filter
    const filter = {};
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (status)   filter.status   = status;
    if (search) {
      filter.$or = [
        { name:    { $regex: search, $options: 'i' } },
        { email:   { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    const skip  = (Number(page) - 1) * Number(limit);
    const sort  = { [sortBy]: order === 'asc' ? 1 : -1 };
    const total = await Lead.countDocuments(filter);
    const leads = await Lead.find(filter).sort(sort).skip(skip).limit(Number(limit));

    return sendSuccess(res, 200, 'Leads fetched successfully.', {
      leads,
      pagination: {
        total,
        page:       Number(page),
        limit:      Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('[leadsController] getLeads error:', error);
    return sendError(res, 500, 'Internal server error.');
  }
};

// ─── GET /api/leads/:id ───────────────────────────────────────────────────────
const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return sendError(res, 404, 'Lead not found.');
    return sendSuccess(res, 200, 'Lead fetched successfully.', lead);
  } catch (error) {
    if (error.name === 'CastError') return sendError(res, 400, 'Invalid lead ID.');
    return sendError(res, 500, 'Internal server error.');
  }
};

// ─── PATCH /api/leads/:id/status ─────────────────────────────────────────────
const updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const VALID_STATUSES = ['new', 'contacted', 'qualified', 'closed'];

    if (!status || !VALID_STATUSES.includes(status)) {
      return sendError(res, 400, `status must be one of: ${VALID_STATUSES.join(', ')}.`);
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        status,
        updatedAt: new Date(),
        $push: { statusHistory: { status, changedAt: new Date() } },
      },
      { new: true, runValidators: true }
    );

    if (!lead) return sendError(res, 404, 'Lead not found.');
    return sendSuccess(res, 200, 'Lead status updated.', lead);
  } catch (error) {
    if (error.name === 'CastError') return sendError(res, 400, 'Invalid lead ID.');
    return sendError(res, 500, 'Internal server error.');
  }
};

// ─── DELETE /api/leads/:id ────────────────────────────────────────────────────
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return sendError(res, 404, 'Lead not found.');
    return sendSuccess(res, 200, 'Lead deleted successfully.', null);
  } catch (error) {
    if (error.name === 'CastError') return sendError(res, 400, 'Invalid lead ID.');
    return sendError(res, 500, 'Internal server error.');
  }
};

module.exports = { createLead, getLeads, getLeadById, updateLeadStatus, deleteLead };
