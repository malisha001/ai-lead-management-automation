const Lead = require('../models/Lead');
const { success, error } = require('../utils/responseHelper');

// ── GET /api/stats ─────────────────────────────────────────────────────────────
const getStats = async (req, res, next) => {
  try {
    const now       = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);

    const [
      totalLeads,
      newLeads,
      highPriority,
      converted,
      newThisWeek,
      byCategory,
      byStatus,
      byPriority,
    ] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ status: 'new' }),
      Lead.countDocuments({ priority: 'High' }),
      Lead.countDocuments({ status: 'closed' }),
      Lead.countDocuments({ createdAt: { $gte: weekStart } }),
      Lead.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Lead.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Lead.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]),
    ]);

    // Transform aggregation arrays to objects
    const toObj = (arr) =>
      arr.reduce((acc, cur) => ({ ...acc, [cur._id]: cur.count }), {});

    return success(res, 200, 'Stats fetched.', {
      totalLeads,
      newLeads,
      highPriority,
      converted,
      newThisWeek,
      conversionRate: totalLeads > 0 ? ((converted / totalLeads) * 100).toFixed(1) : '0.0',
      byCategory:  toObj(byCategory),
      byStatus:    toObj(byStatus),
      byPriority:  toObj(byPriority),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStats };
