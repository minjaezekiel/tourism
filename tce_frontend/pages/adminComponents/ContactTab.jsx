import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Spinner, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
const API_URL = import.meta.env.VITE_API_URL;

const ContactTab = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/contactUs`);
      const data = await res.json();
      setMessages(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error('Failed to fetch contact messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    setShowMessageModal(true);
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    
    try {
      await fetch(`${API_URL}/contactUs/${id}`, { method: "DELETE" });
      fetchMessages();
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <>
      <Card className="shadow-sm">
        <Card.Body>
          <h4 className="mb-4">Contact Messages</h4>

          {messages.length === 0 ? (
            <p className="text-center text-muted">No messages found</p>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map(message => (
                  <tr key={message._id}>
                    <td>{message.fullname}</td>
                    <td>{message.email}</td>
                    <td>{message.message}</td>
                    <td>{new Date(message.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleViewMessage(message)}>
                        <FontAwesomeIcon icon={faEye} className="me-1" />
                        View
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteMessage(message._id)}>
                        <FontAwesomeIcon icon={faTrash} className="me-1" />
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* View Message Modal */}
      <Modal show={showMessageModal} onHide={() => setShowMessageModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Message Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMessage && (
            <>
              <div className="mb-3">
                <strong>Name:</strong> {selectedMessage.name}
              </div>
              <div className="mb-3">
                <strong>Email:</strong> {selectedMessage.email}
              </div>
              <div className="mb-3">
                <strong>Subject:</strong> {selectedMessage.subject}
              </div>
              <div className="mb-3">
                <strong>Date:</strong> {new Date(selectedMessage.createdAt).toLocaleString()}
              </div>
              <div className="mb-3">
                <strong>Message:</strong>
                <div className="mt-2 p-3 bg-light rounded">
                  {selectedMessage.message}
                </div>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMessageModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ContactTab;