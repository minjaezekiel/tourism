// controllers/analytics.controller.js
const geoip = require('geoip-lite');
const { Op } = require('sequelize'); 
const { Analytics } = require('../models/models');

// Safely detect device from User-Agent
const detectDevice = (userAgent = '') => {
  if (/tablet|ipad/i.test(userAgent)) return 'tablet';
  if (/mobile/i.test(userAgent)) return 'mobile';
  return 'desktop';
};

// Safely extract IP (prevents crashes on serverless/reverse proxies)
const getIP = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.socket?.remoteAddress || req.ip || '127.0.0.1';
};

// Safely lookup GeoIP (prevents geoip-lite from crashing on bad data)
const getGeo = (ip) => {
  try {
    return geoip.lookup(ip) || null;
  } catch (e) {
    return null;
  }
};

// Track visit (AUTO — no frontend data needed)
exports.trackVisit = async (req, res) => {
  try {
    const ip = getIP(req);
    const userAgent = req.headers['user-agent'] || '';
    const device = detectDevice(userAgent);
    const geo = getGeo(ip);

    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    const recentVisit = await Analytics.findOne({
      where: {
        ip: ip,
        created_at: { [Op.gte]: thirtyMinutesAgo }
      }
    });

    if (!recentVisit) {
      await Analytics.create({
        ip: ip,
        device: device,
        country: geo?.country || 'Unknown'
      });
    }

    res.status(200).json({ tracked: true });
  } catch (err) {
    console.error('Analytics track error:', err);
    res.status(500).json({ tracked: false, message: 'Analytics error' });
  }
};

// Fetch analytics for admin dashboard
exports.getAnalytics = async (req, res) => {
  // Fallback structure prevents "Cannot read properties of undefined" on frontend
  const fallback = {
    totalVisitors: 0,
    deviceStats: { desktop: 0, mobile: 0, tablet: 0 },
    countryStats: []
  };

  try {
    const totalVisitors = await Analytics.count();
    const allRecords = await Analytics.findAll();

    const deviceStats = { desktop: 0, mobile: 0, tablet: 0 };
    const countryMap = new Map();

    allRecords.forEach(record => {
      if (record.device && deviceStats.hasOwnProperty(record.device)) {
        deviceStats[record.device]++;
      }
      if (record.country && record.country !== 'Unknown') {
        countryMap.set(record.country, (countryMap.get(record.country) || 0) + 1);
      }
    });
    
    const countryStats = Array.from(countryMap.entries())
      .map(([country, visitors]) => ({ country, visitors }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 10);

    res.json({ totalVisitors, deviceStats, countryStats });

  } catch (err) {
    console.error('Analytics fetch error:', err);
    // Always return JSON structure on failure to prevent JSON.parse errors
    res.status(500).json({ ...fallback, message: 'Failed to fetch analytics' });
  }
};

// Get analytics with date range filter
exports.getAnalyticsByDateRange = async (req, res) => {
  const fallback = {
    totalVisitors: 0, deviceStats: { desktop: 0, mobile: 0, tablet: 0 },
    countryStats: [], dailyVisitors: [], dateRange: { startDate: null, endDate: null }
  };

  try {
    const { startDate, endDate } = req.query;
    const whereClause = {};
    
    if (startDate) whereClause.created_at = { ...whereClause.created_at, [Op.gte]: new Date(startDate) };
    if (endDate) whereClause.created_at = { ...whereClause.created_at, [Op.lte]: new Date(endDate) };

    const records = await Analytics.findAll({
      where: Object.keys(whereClause).length ? whereClause : undefined,
      order: [['created_at', 'DESC']]
    });
    
    const deviceStats = { desktop: 0, mobile: 0, tablet: 0 };
    const countryMap = new Map();
    const dailyStats = new Map();

    records.forEach(record => {
      if (record.device && deviceStats.hasOwnProperty(record.device)) deviceStats[record.device]++;
      if (record.country && record.country !== 'Unknown') countryMap.set(record.country, (countryMap.get(record.country) || 0) + 1);
      if (record.created_at) {
        const date = new Date(record.created_at).toISOString().split('T')[0];
        dailyStats.set(date, (dailyStats.get(date) || 0) + 1);
      }
    });
    
    const countryStats = Array.from(countryMap.entries()).map(([country, visitors]) => ({ country, visitors })).sort((a, b) => b.visitors - a.visitors).slice(0, 10);
    const dailyVisitors = Array.from(dailyStats.entries()).map(([date, count]) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date));
    
    res.json({ totalVisitors: records.length, deviceStats, countryStats, dailyVisitors, dateRange: { startDate: startDate || null, endDate: endDate || null } });
    
  } catch (err) {
    console.error('Analytics date range error:', err);
    res.status(500).json({ ...fallback, message: 'Failed to fetch date range' });
  }
};

// Get unique visitors (by IP)
exports.getUniqueVisitors = async (req, res) => {
  const fallback = { uniqueVisitors: 0, dailyUniqueVisitors: [], period: '7 days' };

  try {
    const { days = 7 } = req.query;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const records = await Analytics.findAll({
      attributes: ['ip', 'created_at'],
      where: { created_at: { [Op.gte]: startDate } }
    });
    
    const uniqueIPs = new Set();
    const dailyUnique = new Map();
    
    records.forEach(record => {
      uniqueIPs.add(record.ip);
      if (record.created_at) {
        const date = new Date(record.created_at).toISOString().split('T')[0];
        if (!dailyUnique.has(date)) dailyUnique.set(date, new Set());
        dailyUnique.get(date).add(record.ip);
      }
    });
    
    const dailyUniqueVisitors = Array.from(dailyUnique.entries()).map(([date, ipSet]) => ({ date, count: ipSet.size })).sort((a, b) => a.date.localeCompare(b.date));
    
    res.json({ uniqueVisitors: uniqueIPs.size, dailyUniqueVisitors, period: `${days} days` });
    
  } catch (err) {
    console.error('Unique visitors error:', err);
    res.status(500).json({ ...fallback, message: 'Failed to fetch unique visitors' });
  }
};

// Get device breakdown over time
exports.getDeviceTrends = async (req, res) => {
  const fallback = { deviceTrends: [], period: '30 days' };

  try {
    const { days = 30 } = req.query;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const records = await Analytics.findAll({
      attributes: ['device', 'created_at'],
      where: { created_at: { [Op.gte]: startDate } }
    });
    
    const trends = new Map();
    
    records.forEach(record => {
      if (!record.created_at || !record.device) return;
      const date = new Date(record.created_at).toISOString().split('T')[0];
      
      if (!trends.has(date)) trends.set(date, { desktop: 0, mobile: 0, tablet: 0 });
      
      const dayData = trends.get(date);
      if (dayData.hasOwnProperty(record.device)) dayData[record.device]++;
    });
    
    const deviceTrends = Array.from(trends.entries()).map(([date, devices]) => ({ date, ...devices })).sort((a, b) => a.date.localeCompare(b.date));
    
    res.json({ deviceTrends, period: `${days} days` });
    
  } catch (err) {
    console.error('Device trends error:', err);
    res.status(500).json({ ...fallback, message: 'Failed to fetch device trends' });
  }
};

// Clear old analytics data (admin only)
exports.clearOldAnalytics = async (req, res) => {
  try {
    const { daysToKeep = 90 } = req.body;
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
    
    const deletedCount = await Analytics.destroy({
      where: { created_at: { [Op.lt]: cutoffDate } }
    });
    
    res.json({ message: `Cleared records older than ${daysToKeep} days`, deletedCount });
    
  } catch (err) {
    console.error('Clear analytics error:', err);
    res.status(500).json({ message: 'Cleanup error', deletedCount: 0 });
  }
};