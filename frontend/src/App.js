import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import './App.css';

import { Entry } from './page/entry/Entry.page';
import DefaultLayout from "./layout/DefaultLayout";
import Dashboard  from './page/dashboard/Dashboard.page';
import AddNewClientForm  from './page/add_new_client_form/AddNewClientForm';
import TicketConversations from './page/ticket_conversations/TicketConversations';
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
    
    <Route
  path="/add-client"
  element={
    <DefaultLayout>
      <AddNewClientForm />
    </DefaultLayout>
  }
/>

  </Routes>
</Router>

    
  );
}

export default App;
