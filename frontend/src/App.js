import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import './App.css';

import { Entry } from './page/entry/Entry.page';
import DefaultLayout from "./layout/DefaultLayout";
import Dashboard  from './page/dashboard/Dashboard.page';
import AddNewClientForm  from './page/add_new_client_form/AddNewClientForm';
import Tickets from './page/tickets/Tickets';
import TicketConversations from './page/ticket_conversations/TicketConversations';
import ClientTicketForm from './page/client_ticket_form/ClientTicketForm.js';
import {AddTicket} from "./page/new-ticket/AddTicket.page";

function App() {
  return (
    <Router>
  <Routes>
    <Route path="/" element={<Entry />} />
    <Route
      path="/dashboard"
      element={
        <DefaultLayout>
          <Dashboard />
        </DefaultLayout>
      }
    />
    <Route
      path="/add-ticket"
      element={
        <DefaultLayout>
          <AddTicket />
        </DefaultLayout>
      }
    />
    <Route
      path="/ticket/:tid"
      element={
        <DefaultLayout>
          <TicketConversations/>
        </DefaultLayout>
      }
    />
    
  </Routes>
</Router>

    
  );
}

export default App;
