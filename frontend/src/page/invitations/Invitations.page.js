import React from 'react';
import { Container } from 'react-bootstrap';
import { PageBreadcrumb } from '../../components/breadcrumb/Breadcrumb.comp';
import AgentInvitations from '../../components/AgentInvitations';

const Invitations = () => {
  return (
    <Container>
      <PageBreadcrumb page="Invitations" />
      <AgentInvitations />
    </Container>
  );
};

export default Invitations; 