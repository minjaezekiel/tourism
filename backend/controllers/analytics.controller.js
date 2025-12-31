const geoip = require('geoip-lite');
const Analytics = require('../models/Analytics');

// Detect device from User-Agent
const detectDevice = (userAgent = '') => {
  if (/tablet|ipad/i.test(userAgent)) return 'tablet';
  if (/mobile/i.test(userAgent)) return 'mobile';
  return 'desktop';
};

// Track visit (AUTO — no frontend data needed)
exports.trackVisit = async (req, res) => {
  try {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded
      ? forwarded.split(',')[0]
      : req.socket.remoteAddress;

    const userAgent = req.headers['user-agent'] || '';
    const device = detectDevice(userAgent);
    const geo = geoip.lookup(ip);

    // Prevent duplicate tracking (same IP in last 30 mins)
    const exists = await Analytics.findOne({
      ip,
      createdAt: { $gte: new Date(Date.now() - 30 * 60 * 1000) }
    });

    if (!exists) {
      await Analytics.create({
        ip,
        device,
        country: geo?.country || 'Unknown'
      });
    }

    res.status(200).json({ tracked: true });
  } catch (err) {
    console.error('Analytics track error:', err.message);
    res.status(500).json({ message: 'Analytics error' });
  }
};

// Fetch analytics for admin dashboard
exports.getAnalytics = async (req, res) => {
  try {
    const totalVisitors = await Analytics.countDocuments();

    const deviceStatsAgg = await Analytics.aggregate([
      { $group: { _id: '$device', count: { $sum: 1 } } }
    ]);

    const countryStatsAgg = await Analytics.aggregate([
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const deviceStats = { desktop: 0, mobile: 0, tablet: 0 };

    deviceStatsAgg.forEach(d => {
      deviceStats[d._id] = d.count;
    });

    res.json({
      totalVisitors,
      deviceStats,
      countryStats: countryStatsAgg.map(c => ({
        country: c._id,
        visitors: c.count
      }))
    });

  } catch (err) {
    console.error('Analytics fetch error:', err.message);
    res.status(500).json({ message: 'Analytics fetch error' });
  }
};
