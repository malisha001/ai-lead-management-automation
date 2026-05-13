const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  createLead,
  getLeads,
  getLeadById,
  updateLeadStatus,
  deleteLead,
} = require('../controllers/leadsController');
const authMiddleware  = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

// ── Validation rules ──────────────────────────────────────────────────────────
const createLeadValidation = [
  body('name')
    .trim().notEmpty().withMessage('Name is required.')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters.'),
  body('email')
    .trim().notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('phone')
    .optional()
    .isMobilePhone().withMessage('Please provide a valid phone number.'),
  body('message')
    .trim().notEmpty().withMessage('Message is required.')
    .isLength({ min: 10 }).withMessage('Message must be at least 10 characters.')
    .isLength({ max: 2000 }).withMessage('Message cannot exceed 2000 characters.'),
  body('serviceType')
    .optional()
    .isIn([
      'Website Development', 'Mobile App Development', 'SEO/Marketing',
      'E-Commerce', 'CRM/Software', 'Support', 'Partnership', 'General Inquiry',
    ])
    .withMessage('Invalid service type.'),
];

const updateStatusValidation = [
  body('status')
    .notEmpty().withMessage('Status is required.')
    .isIn(['new', 'contacted', 'qualified', 'closed'])
    .withMessage('Status must be: new, contacted, qualified, or closed.'),
];

// ── Routes ────────────────────────────────────────────────────────────────────

// Public — anyone can submit a lead
router.post('/', createLeadValidation, validateRequest, createLead);

// Protected — admin only
router.use(authMiddleware);

router.get('/',     getLeads);
router.get('/:id',  getLeadById);
router.patch('/:id/status', updateStatusValidation, validateRequest, updateLeadStatus);
router.delete('/:id', deleteLead);

module.exports = router;
