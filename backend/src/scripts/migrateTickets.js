const mongoose = require('mongoose');
const Ticket = require('../models/Ticket');
const User = require('../models/Users');
const config = require('../config/config');

// Connect to database
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const migrateTickets = async () => {
  try {
    console.log('Starting ticket migration...');

    // Get all tickets
    const tickets = await Ticket.find({}).populate('customer');
    
    console.log(`Found ${tickets.length} tickets to migrate`);

    let updatedCount = 0;
    let errorCount = 0;

    for (const ticket of tickets) {
      try {
        // Skip if ticket already has a valid customer
        if (ticket.customer && ticket.customer._id) {
          continue;
        }

        // Find the user who created the first comment (assuming this is the customer)
        const firstComment = ticket.comments[0];
        if (firstComment && firstComment.user) {
          const customer = await User.findById(firstComment.user);
          
          if (customer) {
            // Update ticket with customer
            ticket.customer = customer._id;
            await ticket.save();
            updatedCount++;

            // If customer is a client, find their agent and update relationships
            if (customer.role === 'customer') {
              const agent = await User.findOne({ 
                role: 'agent',
                clients: customer._id 
              });

              if (!agent) {
                // Find an agent to assign (you might want to modify this logic)
                const availableAgent = await User.findOne({ role: 'agent' });
                if (availableAgent) {
                  availableAgent.clients.push(customer._id);
                  await availableAgent.save();
                }
              }
            }
          }
        }
      } catch (err) {
        console.error(`Error migrating ticket ${ticket._id}:`, err);
        errorCount++;
      }
    }

    console.log('Migration completed!');
    console.log(`Updated ${updatedCount} tickets`);
    console.log(`Encountered ${errorCount} errors`);

  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    mongoose.disconnect();
  }
};

migrateTickets(); 