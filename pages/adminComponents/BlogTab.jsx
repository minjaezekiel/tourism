import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

const API_URL = import.meta.env.VITE_API_URL;

const BlogTab = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', image: null });

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });

  const fetchBlogPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/blog`);
      const text = await res.text();
      const data = JSON.parse(text);
      
      if (!res.ok) throw new Error(data.message || 'Failed to fetch');
      
      setBlogPosts(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const handleAddOrUpdatePost = async () => {
    if (!newPost.title || !newPost.content) {
      alert("Title and Content are required.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('title', newPost.title);
    formData.append('content', newPost.content);

    if (newPost.image) formData.append('image', newPost.image);

    try {
      const url = editingPost 
        ? `${API_URL}/blog/${editingPost.id}` 
        : `${API_URL}/blog`;

      const method = editingPost ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: formData,
        headers: getAuthHeaders()
      });

      const text = await res.text();
      const data = JSON.parse(text);
      
      if (!res.ok) throw new Error(data.message || 'Failed to save post');

      setNewPost({ title: '', content: '', image: null });
      setEditingPost(null);
      setShowModal(false);
      fetchBlogPosts();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`${API_URL}/blog/${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      const text = await res.text();
      const data = JSON.parse(text);
      
      if (!res.ok) throw new Error(data.message || 'Failed to delete');
      
      fetchBlogPosts();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setNewPost({ title: post.title, content: post.content, image: null });
    setShowModal(true);
  };

  const handleOpenModal = () => {
    setEditingPost(null);
    setNewPost({ title: '', content: '', image: null });
    setShowModal(true);
  };

  // SAFELY check for both snake_case and camelCase (Sequelize does this automatically)
  const getDate = (post) => {
    const dateStr = post.created_at || post.createdAt;
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString();
  };

  const getAuthorName = (author) => {
    if (!author) return 'Unknown Author';
    const firstName = author.first_name || author.firstName || '';
    const lastName = author.last_name || author.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || author.username || 'Admin';
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
      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0">Blog Management</h4>
            <Button variant="primary" onClick={handleOpenModal}>
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Add Post
            </Button>
          </div>

          {blogPosts.length === 0 ? (
            <p className="text-center text-muted py-5">No blog posts found. Add your first post!</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Author</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogPosts.map(post => (
                  <tr key={post.id}>
                    <td className="align-middle">{post.title}</td>
                    <td className="align-middle">{getDate(post)}</td>
                    <td className="align-middle">{getAuthorName(post.author)}</td>
                    <td className="align-middle text-center">
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditPost(post)}>
                        <FontAwesomeIcon icon={faEdit} className="me-1" />
                        Edit
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeletePost(post.id)}>
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

      {/* Add/Edit Blog Post Modal */}
      <Modal show={showModal} onHide={() => { setShowModal(false); setEditingPost(null); }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingPost ? 'Edit Blog Post' : 'Add New Blog Post'}</Modal.Title>
        </Modal.Header>
        
        <Form onSubmit={(e) => { e.preventDefault(); handleAddOrUpdatePost(); }}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                placeholder="Enter blog title"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="Enter full blog content"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image (Optional)</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setNewPost({ ...newPost, image: e.target.files[0] })}
              />
              {editingPost?.image && (
                <div className="mt-2">
                  <img 
                    src={`${API_URL}${editingPost.image}`} 
                    alt="Current" 
                    style={{ maxHeight: '100px', objectFit: 'cover' }} 
                    className="rounded border"
                  />
                  <div className="form-text">Upload a new image to replace this one.</div>
                </div>
              )}
            </Form.Group>
          </Modal.Body>
          
          <Modal.Footer>
            <Button variant="secondary" type="button" onClick={() => { setShowModal(false); setEditingPost(null); }}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : editingPost ? 'Update Post' : 'Add Post'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default BlogTab;