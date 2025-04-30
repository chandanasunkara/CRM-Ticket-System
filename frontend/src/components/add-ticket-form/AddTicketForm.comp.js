import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Row,
  Col,
  Button,
  Modal
} from "react-bootstrap";
import { shortText } from "../../utils/validation";
import api from "../../config/api";
import "./add-ticket-form.style.css";

const initialFrmDt = {
  subject: "",
  description: "",
  status: "open",
  priority: "medium",
  category: "technical",
  issueDate: new Date().toISOString().split('T')[0]
};
const initialFrmError = {
  subject: false,
  description: false,
  status: false,
  priority: false,
  category: false
};

export const AddTicketForm = () => {
  const navigate = useNavigate();
  const [frmData, setFrmData] = useState(initialFrmDt);
  const [frmDataErro, setFrmDataErro] = useState(initialFrmError);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFrmData({
      ...frmData,
      [name]: value,
    });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setFrmDataErro(initialFrmError);
    const isSubjectValid = await shortText(frmData.subject);

    if (!isSubjectValid) {
      setFrmDataErro({
        ...initialFrmError,
        subject: !isSubjectValid,
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login again');
        navigate('/');
        return;
      }

      const response = await api.post('/api/tickets', frmData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("Ticket created successfully:", response.data);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert('Failed to create ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="mt-3 add-new-ticket bg-light">
      <h1 className="text-success text-center">Add New Ticket</h1>
      <hr />

      <Form autoComplete="off" onSubmit={handleOnSubmit}>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={3}>
            Subject
          </Form.Label>
          <Col sm={9}>
            <Form.Select
              name="subject"
              value={frmData.subject}
              onChange={handleOnChange}
              required
            >
              <option value="">-- Select Issue Subject --</option>
              <option>Login or Access Issues</option>
              <option>Password Reset Request</option>
              <option>Email Notification Not Received</option>
              <option>Invoice or Billing Discrepancy</option>
              <option>Customer Profile Update Request</option>
              <option>CRM Dashboard Not Loading</option>
              <option>Duplicate or Missing Records</option>
              <option>Permission or Role Issue</option>
              <option>API Access Request or Failure</option>
              <option>New Feature Request</option>
              <option>Mobile App Not Syncing</option>
              <option>Lead Assignment Problem</option>
              <option>Report Generation Issue</option>
              <option>Account Deactivation Request</option>
              <option>Other Technical Issues</option>
            </Form.Select>
            <Form.Text className="text-danger">
              {frmDataErro.subject && "Subject is required!"}
            </Form.Text>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={3}>
            Priority
          </Form.Label>
          <Col sm={9}>
            <Form.Select
              name="priority"
              value={frmData.priority}
              onChange={handleOnChange}
              required
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </Form.Select>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={3}>
            Category
          </Form.Label>
          <Col sm={9}>
            <Form.Select
              name="category"
              value={frmData.category}
              onChange={handleOnChange}
              required
            >
              <option value="technical">Technical</option>
              <option value="billing">Billing</option>
              <option value="account">Account</option>
              <option value="feature-request">Feature Request</option>
              <option value="other">Other</option>
            </Form.Select>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={3}>
            Date
          </Form.Label>
          <Col sm={9}>
            <Form.Control
              type="date"
              name="issueDate"
              value={frmData.issueDate}
              onChange={handleOnChange}
              required
            />
          </Col>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            rows="5"
            value={frmData.description}
            onChange={handleOnChange}
            required
          />
        </Form.Group>

        <Button 
          type="submit" 
          variant="success" 
          block
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Ticket...' : 'Open Ticket'}
        </Button>
      </Form>

      <Modal show={showSuccessModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Success!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div className="mb-4">
            <i className="fas fa-check-circle text-success" style={{ fontSize: '4rem' }}></i>
          </div>
          <h4>Ticket Created Successfully</h4>
          <p className="text-muted">Your ticket has been created and assigned a ticket number.</p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="success" onClick={handleCloseModal}>
            Back to Dashboard
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
