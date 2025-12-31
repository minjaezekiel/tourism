import React from 'react';
import { Card, Row, Col, Table, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDesktop, faMobileAlt, faTabletAlt, faGlobe } from '@fortawesome/free-solid-svg-icons';

const AnalyticsTab = ({ loading, analytics }) => {
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <h4 className="mb-4">Site Analytics</h4>
        
        <Row className="mb-4">
          <Col md={4}>
            <Card className="text-center border-primary">
              <Card.Body>
                <h2 className="text-primary mb-0">{analytics.totalVisitors.toLocaleString()}</h2>
                <p className="text-muted mb-0">Total Visitors</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <h5 className="mb-3">Visitors by Device</h5>
        <Row className="mb-4">
          <Col md={4}>
            <Card className="text-center">
              <Card.Body>
                <FontAwesomeIcon icon={faDesktop} size="2x" className="text-primary mb-2" />
                <h4>{analytics.deviceStats.desktop.toLocaleString()}</h4>
                <p className="text-muted mb-0">Desktop</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center">
              <Card.Body>
                <FontAwesomeIcon icon={faMobileAlt} size="2x" className="success mb-2" style={{ color: '#28a745' }} />
                <h4>{analytics.deviceStats.mobile.toLocaleString()}</h4>
                <p className="text-muted mb-0">Mobile</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center">
              <Card.Body>
                <FontAwesomeIcon icon={faTabletAlt} size="2x" className="info mb-2" style={{ color: '#17a2b8' }} />
                <h4>{analytics.deviceStats.tablet.toLocaleString()}</h4>
                <p className="text-muted mb-0">Tablet</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <h5 className="mb-3">Visitors by Country</h5>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Country</th>
              <th>Visitors</th>
            </tr>
          </thead>
          <tbody>
            {analytics.countryStats.map((stat, index) => (
              <tr key={index}>
                <td>
                  <FontAwesomeIcon icon={faGlobe} className="me-2" />
                  {stat.country}
                </td>
                <td>{stat.visitors.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default AnalyticsTab;