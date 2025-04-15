
import './App.css';

import { Entry } from './page/entry/Entry.page';
import DefaultLayout from "./layout/DefaultLayout";
import Dashboard  from './page/dashboard/Dashboard.page';
import AddNewClientForm  from './page/add_new_client_form/AddNewClientForm';
import Tickets from './page/tickets/Tickets';
import TicketConversations from './page/ticket_conversations/TicketConversations';
import ClientTicketForm from './page/client_ticket_form/ClientTicketForm.js';

function App() {
  return (
    <div className="App">
      <DefaultLayout >
        <Dashboard/>
      </DefaultLayout>
    </div>
  );
}

export default App;
