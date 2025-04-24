import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import  PrivateRoute  from "./components/private-route/PrivateRoute.comp";

import './App.css';

import { Entry } from './page/entry/Entry.page';
//import DefaultLayout from "./layout/DefaultLayout";
import Dashboard  from './page/dashboard/Dashboard.page';
import AddNewClientForm  from './page/add_new_client_form/AddNewClientForm';
import TicketConversations from './page/ticket_conversations/TicketConversations';
import {AddTicket} from "./page/new-ticket/AddTicket.page";

function App() {
  return (
    <Router>
  <Routes>
    <Route path="/" element={<Entry />} />
    {/* Private Routes */}
    <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-ticket"
          element={
            <PrivateRoute>
              <AddTicket />
            </PrivateRoute>
          }
        />
        <Route
          path="/ticket/:tid"
          element={
            <PrivateRoute>
              <TicketConversations />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-client"
          element={
            <PrivateRoute>
              <AddNewClientForm />
            </PrivateRoute>
          }
        />

  </Routes>
</Router>

    
  );
}

export default App;
