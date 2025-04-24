import React, { useState } from "react";
import {
  Form,
  Row,
  Col,
  Button
} from "react-bootstrap";
import { shortText } from "../../utils/validation";

import "./add-ticket-form.style.css";

const initialFrmDt = {
  subject: "",
  issueDate: "",
  message: "",
};
const initialFrmError = {
  subject: false,
  issueDate: false,
  message: false,
};

export const AddTicketForm = () => {
  const [frmData, setFrmData] = useState(initialFrmDt);
  const [frmDataErro, setFrmDataErro] = useState(initialFrmError);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setFrmData({
      ...frmData,
      [name]: value,
    });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    setFrmDataErro(initialFrmError);

    const isSubjectValid = await shortText(frmData.subject);

    setFrmDataErro({
      ...initialFrmError,
      subject: !isSubjectValid,
    });

    
    console.log("Form submitted:", frmData);
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
        <Form.Group as={Row}>
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
        <Form.Group>
          <Form.Label>Issue Found</Form.Label>
          <Form.Control
            as="textarea"
            name="message"
            rows="5"
            value={frmData.message}
            onChange={handleOnChange}
            required
          />
        </Form.Group>

        <Button type="submit" variant="success" block>
          Open Ticket
        </Button>
      </Form>
    </div>
  );
};
