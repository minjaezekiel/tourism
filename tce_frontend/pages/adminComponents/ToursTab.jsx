import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Button, Modal, Form, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
const API_URL = import.meta.env.VITE_API_URL;
//const API_URL = "http://127.0.0.1:3000/tours";

const ToursTab = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTour, setNewTour] = useState({ title: '', description: '', price: '', link: '', image: null });
  const abortRef = useRef(null);

  const fetchTours = async () => {
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/tours`, { signal: controller.signal });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      const data = await res.json();
      setTours(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Failed to fetch tours:", err);
        setTours([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
    return () => abortRef.current?.abort();
  }, []);

  const handleAddOrUpdateTour = async () => {
    if (isSubmitting) return;

    if (!newTour.title || !newTour.description || !newTour.price || !newTour.link) {
      alert("All fields are required");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", newTour.title);
    formData.append("description", newTour.description);
    formData.append("price", newTour.price);
    formData.append("link", newTour.link);
    if (newTour.image) formData.append("image", newTour.image);

    try {
      const url = editingTour
        ? `${API_URL}/tours/${editingTour._id}`
        : `${API_URL}/tours`;

      const method = editingTour ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData
      });

      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      await fetchTours();

      setNewTour({
        title: "",
        description: "",
        price: "",
        link: "",
        image: null
      });

      setEditingTour(null);
      setShowModal(false);
    } catch (err) {
      console.error("Failed to add/update tour:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTour = async (id) => {
    if (!window.confirm("Delete this tour?")) return;

    try {
      const res = await fetch(`${API_URL}/tours/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      fetchTours();
    } catch (err) {
      console.error("Failed to delete tour:", err);
    }
  };

  const handleEditTour = (tour) => {
    setEditingTour(tour);
    setNewTour({
      title: tour.title,
      description: tour.description,
      price: tour.price,
      link: tour.link,
      image: null
    });
    setShowModal(true);
  };

  const handleOpenModal = () => {
    setEditingTour(null);
    setNewTour({
      title: "",
      description: "",
      price: "",
      link: "",
      image: null
    });
    setShowModal(true);
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
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0">Tours Management</h4>
            <Button variant="primary" onClick={handleOpenModal}>
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Add Tour
            </Button>
          </div>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Link</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tours.map(tour => (
                <tr key={tour._id}>
                  <td>{tour.title}</td>
                  <td>{tour.price}</td>
                  <td><a href={tour.link} target="_blank" rel="noreferrer">{tour.link}</a></td>
                  <td>
                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditTour(tour)}>
                      <FontAwesomeIcon icon={faEdit} className="me-1" />
                      Edit
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDeleteTour(tour._id)}>
                      <FontAwesomeIcon icon={faTrash} className="me-1" />
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Add/Edit Tour Modal */}
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setEditingTour(null);
        }}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{editingTour ? "Edit Tour" : "Add Tour"}</Modal.Title>
        </Modal.Header>

        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddOrUpdateTour();
          }}
        >
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={newTour.title}
                onChange={(e) =>
                  setNewTour({ ...newTour, title: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={newTour.description}
                onChange={(e) =>
                  setNewTour({ ...newTour, description: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="text"
                value={newTour.price}
                onChange={(e) =>
                  setNewTour({ ...newTour, price: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Link</Form.Label>
              <Form.Control
                type="url"
                value={newTour.link}
                onChange={(e) =>
                  setNewTour({ ...newTour, link: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setNewTour({ ...newTour, image: e.target.files[0] })
                }
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              type="button"
              onClick={() => {
                setShowModal(false);
                setEditingTour(null);
              }}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting}
            >
              {editingTour ? "Update Tour" : "Add Tour"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default ToursTab;