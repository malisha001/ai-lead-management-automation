const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema(
  {
    status:    { type: String },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const leadSchema = new mongoose.Schema(
  {
    // ── Customer-submitted fields ───────────────────────────────────────────
    name: {
      type:     String,
      required: [true, 'Name is required.'],
      trim:     true,
      maxlength: [100, 'Name cannot exceed 100 characters.'],
    },
    email: {
      type:      String,
      required:  [true, 'Email is required.'],
      lowercase: true,
      trim:      true,
      match:     [/^\S+@\S+\.\S+$/, 'Please enter a valid email address.'],
    },
    phone: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    serviceType: {
      type: String,
      enum: {
        values: [
          'Website Development',
          'Mobile App Development',
          'SEO/Marketing',
          'E-Commerce',
          'CRM/Software',
          'Support',
          'Partnership',
          'General Inquiry',
        ],
        message: '{VALUE} is not a valid service type.',
      },
      default: 'General Inquiry',
    },
    message: {
      type:     String,
      required: [true, 'Message is required.'],
      maxlength: [2000, 'Message cannot exceed 2000 characters.'],
    },

    // ── AI-enriched fields ─────────────────────────────────────────────────
    aiSummary: {
      type:    String,
      default: null, // null = AI failed / not yet run
    },
    category: {
      type: String,
      enum: {
        values: [
          'Website Development',
          'Mobile App Development',
          'SEO/Marketing',
          'E-Commerce',
          'CRM/Software',
          'Support',
          'Partnership',
          'General Inquiry',
        ],
        message: '{VALUE} is not a valid category.',
      },
      default: 'General Inquiry',
    },
    priority: {
      type: String,
      enum: {
        values:  ['High', 'Medium', 'Low'],
        message: 'Priority must be High, Medium, or Low.',
      },
      default: 'Medium',
    },
    // Tracks whether AI enrichment succeeded or fell back to defaults
    aiEnriched: {
      type:    Boolean,
      default: false,
    },

    // ── Status tracking ────────────────────────────────────────────────────
    status: {
      type: String,
      enum: {
        values:  ['new', 'contacted', 'qualified', 'closed'],
        message: 'Status must be new, contacted, qualified, or closed.',
      },
      default: 'new',
    },
    statusHistory: {
      type:    [statusHistorySchema],
      default: [],
    },

    // ── Integration metadata ───────────────────────────────────────────────
    googleSheetRowId: {
      type:    Number,
      default: null,
    },
    emailSent: {
      type:    Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// ── Indexes for query performance ──────────────────────────────────────────────
leadSchema.index({ email: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ priority: 1 });
leadSchema.index({ category: 1 });
leadSchema.index({ createdAt: -1 });

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;
