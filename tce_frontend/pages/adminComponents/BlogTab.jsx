import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

const BlogTab = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [newPost, setNewPost] = useState({ title: '', content: '', image: null });

  const fetchBlogPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:3000/blog');
      const data = await res.json();
      setBlogPosts(data.data);
    } catch (err) {
      console.error('Failed to fetch blog posts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const handleAddOrUpdatePost = async () => {
    const formData = new FormData();
    formData.append('title', newPost.title);
    formData.append('content', newPost.content);
    if (newPost.image) formData.append('image', newPost.image);

    try {
      if (editingPost) {
        await fetch(`http://127.0.0.1:3000/blog/${editingPost._id}`, { method: 'PUT', body: formData });
      } else {
        await fetch('http://127.0.0.1:3000/blog', { method: 'POST', body: formData });
      }
      setNewPost({ title: '', content: '', image: null });
      setEditingPost(null);
      setShowModal(false);
      fetchBlogPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await fetch(`http://127.0.0.1:3000/blog/${id}`, { method: 'DELETE' });
      fetchBlogPosts();
    } catch (err) {
      console.error(err);
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
            <h4 className="mb-0">Blog Management</h4>
            <Button variant="primary" onClick={handleOpenModal}>
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Add Post
            </Button>
          </div>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>Author</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogPosts.map(post => (
                <tr key={post._id}>
                  <td>{post.title}</td>
                  <td>{post.date || 'N/A'}</td>
                  <td>{post.author || 'Admin'}</td>
                  <td>
                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEditPost(post)}>
                      <FontAwesomeIcon icon={faEdit} className="me-1" />
                      Edit
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDeletePost(post._id)}>
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

      {/* Add/Edit Blog Post Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingPost ? 'Edit Blog Post' : 'Add New Blog Post'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                placeholder="Enter blog title"
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
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setNewPost({ ...newPost, image: e.target.files[0] })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddOrUpdatePost}>
            {editingPost ? 'Update Post' : 'Add Post'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BlogTab;