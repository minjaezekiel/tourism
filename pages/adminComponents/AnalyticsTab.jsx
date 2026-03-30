import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Button, Spinner, Alert, ProgressBar } from 'react-bootstrap';

const API_URL = import.meta.env.VITE_API_URL;

const AnalyticsTab = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // FIX: Use API_URL instead of hardcoded '/api'
      const response = await fetch(`${API_URL}/api/analytics`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const text = await response.text();
      let data;
      
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        throw new Error('Server returned an invalid response.');
      }

      if (!response.ok) {
        throw new Error(data.message || `Server error: ${response.status}`);
      }
      
      setAnalytics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // --- 1. LOADING STATE ---
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
        <Spinner animation="border" />
      </div>
    );
  }

  // --- 2. ERROR STATE ---
  if (error) {
    return (
      <Alert variant="danger" className="d-flex justify-content-between align-items-center">
        <div>
          <strong>Failed to Load Analytics</strong><br />
          {error}
        </div>
        <Button variant="outline-danger" onClick={fetchAnalytics}>
          Retry
        </Button>
      </Alert>
    );
  }

  // --- 3. EMPTY STATE ---
  if (!analytics) {
    return <div className="text-center text-muted p-5">No analytics data available yet.</div>;
  }

  // --- 4. EXTRACT & FORMAT DATA ---
  const totalVisitors = analytics.totalVisitors ?? 0;
  const deviceStats = analytics.deviceStats ?? { desktop: 0, mobile: 0, tablet: 0 };
  const countryStats = analytics.countryStats ?? [];

  const totalDevices = (deviceStats.desktop || 0) + (deviceStats.mobile || 0) + (deviceStats.tablet || 0);
  const getPercentage = (count) => totalDevices === 0 ? 0 : Math.round((count / totalDevices) * 100);

  const deviceList = [
    { name: 'Desktop', icon: '🖥️', count: deviceStats.desktop || 0, variant: 'primary' },
    { name: 'Mobile', icon: '📱', count: deviceStats.mobile || 0, variant: 'info' },
    { name: 'Tablet', icon: '📋', count: deviceStats.tablet || 0, variant: 'secondary' },
  ];

  return (
    <>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Analytics Overview</h4>
        <Button variant="outline-secondary" size="sm" onClick={fetchAnalytics}>
          Refresh Data
        </Button>
      </div>

      {/* Top Cards */}
      <Row className="mb-4">
        {/* Total Visitors */}
        <Col md={4} className="mb-3">
          <Card className="h-100 border-top border-4 border-primary shadow-sm">
            <Card.Body>
              <Card.Subtitle className="text-muted text-uppercase" style={{ fontSize: '0.8rem' }}>Total Visitors</Card.Subtitle>
              <Card.Title className="mt-2 fw-bolder" style={{ fontSize: '2.5rem' }}>
                {totalVisitors.toLocaleString()}
              </Card.Title>
              <small className="text-muted">All time unique sessions</small>
            </Card.Body>
          </Card>
        </Col>

        {/* Device Breakdown */}
        <Col md={8} className="mb-3">
          <Card className="h-100 border-top border-4 border-info shadow-sm">
            <Card.Body>
              <Card.Subtitle className="text-muted text-uppercase mb-3" style={{ fontSize: '0.8rem' }}>Device Breakdown</Card.Subtitle>
              
              {deviceList.map((device) => (
                <div key={device.name} className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="fw-medium" style={{ fontSize: '0.9rem' }}>
                      {device.icon} {device.name}
                    </span>
                    <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                      {device.count.toLocaleString()} ({getPercentage(device.count)}%)
                    </span>
                  </div>
                  <ProgressBar 
                    now={getPercentage(device.count)} 
                    variant={device.variant} 
                    style={{ height: '8px' }} 
                  />
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Top Countries Table */}
      <Card className="shadow-sm">
        <Card.Body>
          <Card.Subtitle className="text-muted text-uppercase mb-3" style={{ fontSize: '0.8rem' }}>Top 5 Countries</Card.Subtitle>
          
          {countryStats.length === 0 ? (
            <p className="text-muted text-center py-4 mb-0">No country data recorded yet.</p>
          ) : (
            <Table hover responsive className="align-middle mb-0">
              <thead>
                <tr>
                  <th className="text-muted" style={{ fontSize: '0.85rem' }}>Rank</th>
                  <th className="text-muted" style={{ fontSize: '0.85rem' }}>Country</th>
                  <th className="text-muted text-end" style={{ fontSize: '0.85rem' }}>Visitors</th>
                  <th className="text-muted text-end" style={{ fontSize: '0.85rem' }}>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {countryStats.slice(0, 5).map((item, index) => {
                  const percent = totalVisitors === 0 ? 0 : ((item.visitors / totalVisitors) * 100).toFixed(1);
                  return (
                    <tr key={index}>
                      <td className="text-muted">#{index + 1}</td>
                      <td className="fw-medium">{item.country}</td>
                      <td className="text-end fw-semibold">{item.visitors.toLocaleString()}</td>
                      <td className="text-end text-muted">{percent}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default AnalyticsTab;