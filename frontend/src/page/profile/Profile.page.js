import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { PageBreadcrumb } from '../../components/breadcrumb/Breadcrumb.comp';
import api from '../../config/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await api.get('/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const userData = response.data;
        setUser(userData);
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          company: userData.company || '',
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await api.put('/api/users/me', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUser(response.data);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="text-center mt-5">Loading profile...</div>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="mt-3">
        <Col>
          <PageBreadcrumb page="Profile" />
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={6} className="mx-auto">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4>Profile Information</h4>
              <Button
                variant={editMode ? "secondary" : "primary"}
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? "Cancel" : "Edit Profile"}
              </Button>
            </Card.Header>
            <Card.Body>
              {editMode ? (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Company</Form.Label>
                    <Form.Control
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit">
                    Save Changes
                  </Button>
                </Form>
              ) : (
                <div>
                  <p><strong>Name:</strong> {user?.name}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>Role:</strong> {user?.role}</p>
                  <p><strong>Phone:</strong> {user?.phone || 'Not provided'}</p>
                  <p><strong>Company:</strong> {user?.company || 'Not provided'}</p>
                  <p><strong>Member since:</strong> {new Date(user?.createdAt).toLocaleDateString()}</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile; 