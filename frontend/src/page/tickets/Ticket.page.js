import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Alert,
  Form,
} from "react-bootstrap";
import { PageBreadcrumb } from "../../components/breadcrumb/Breadcrumb.comp";
import { MessageHistory } from "../../components/message-history/MessageHistory.comp";
import { UpdateTicket } from "../../components/update-ticket/UpdateTicket.comp";
import { useParams } from "react-router-dom";

import { fetchSingleTicket, closeTicket } from "../ticket-list/ticketsAction";
import { resetResponseMsg } from "../ticket-list/ticketsSlice";

export const Ticket = () => {
  const { tId } = useParams();
  const dispatch = useDispatch();
  const {
    isLoading,
    error,
    selectedTicket,
    replyMsg,
    replyTicketError,
  } = useSelector((state) => state.tickets);

  useEffect(() => {
    dispatch(fetchSingleTicket(tId));

    return () => {
      if (replyMsg || replyTicketError) {
        dispatch(resetResponseMsg());
      }
    };
  }, [tId, dispatch, replyMsg, replyTicketError]);

  return (
    <Container>
      <Row>
        <Col>
          <PageBreadcrumb page="Ticket Conversation" />
        </Col>
      </Row>

      <Row>
        <Col>
          {isLoading && <Spinner variant="primary" animation="border" />}
          {error && <Alert variant="danger">{error}</Alert>}
          {replyTicketError && (
            <Alert variant="danger">{replyTicketError}</Alert>
          )}
          {replyMsg && <Alert variant="success">{replyMsg}</Alert>}
        </Col>
      </Row>

      <Row className="mt-3">
        <Col md={12}>
          <h4>Ticket Info</h4>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>ID</Form.Label>
              <Form.Control value={selectedTicket.id || ""} disabled />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Client Name</Form.Label>
              <Form.Control value={selectedTicket.clientName || ""} disabled />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Created Date</Form.Label>
              <Form.Control
                value={
                  selectedTicket.openAt
                    ? new Date(selectedTicket.openAt).toLocaleDateString()
                    : ""
                }
                disabled
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Service Status</Form.Label>
              <Form.Control value={selectedTicket.status || ""} disabled />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Issue Subject</Form.Label>
              <Form.Control value={selectedTicket.subject || ""} disabled />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control value={selectedTicket.description || ""} disabled />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Provided Solution</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={selectedTicket.solution || ""}
                disabled
              />
            </Form.Group>
          </Form>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          {selectedTicket.conversations && (
            <MessageHistory msg={selectedTicket.conversations} />
          )}
        </Col>
      </Row>
      <hr />

      <Row className="mt-4">
        <Col>
          <UpdateTicket _id={tId} />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col className="text-end">
          <Button
            variant="outline-success"
            onClick={() => dispatch(closeTicket(tId))}
            disabled={selectedTicket.status === "Closed"}
          >
            Close Ticket
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Ticket;
