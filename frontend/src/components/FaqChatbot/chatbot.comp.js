import React, { useState } from "react";
import "./chatbot.css";

const FAQ_DATA = {
  "how can i reset my password": "You can reset it from the login page by clicking 'Forgot Password'.",
  "what are your support hours": "We are available from 9 AM to 6 PM, Monday to Friday.",
  "how to contact support": "You can email us at support@example.com.",
  "can i change my username": "Usernames cannot be changed once registered.",
  "how do i update my profile info": "You can update your profile info under Account Settings.",
  "where can i view my previous tickets": "You can view them under the 'My Tickets' section after logging in.",
  "how do i close my account": "Please go to Settings > Close Account to begin the process.",
  "what payment methods do you accept": "We accept Visa, Mastercard, PayPal, and bank transfers.",
  "can i get a receipt for my payment": "Yes, all receipts are available under Billing > Receipts.",
  "how do i upgrade my plan": "You can upgrade your plan from the Billing section of your dashboard.",
  "is my data secure": "Yes, we use industry-standard encryption and security practices to protect your data."
};

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSend = () => {
    const userMessage = input.toLowerCase().trim();
    const reply =
      FAQ_DATA[userMessage] ||
      "Sorry, I couldn't find an answer for that. Please create a ticket and our support team will get back to you.";

    setMessages([
      ...messages,
      { sender: "user", text: input },
      { sender: "bot", text: reply },
    ]);
    setInput("");
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chatbot-container">
      <button className="chatbot-toggle" onClick={toggleChatbot}>
        {isOpen ? "×" : "💬"}
      </button>

      <div className={`chatbot-window-wrapper ${isOpen ? "open" : "closed"}`}>
        <div className="chatbot-window">
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`msg ${msg.sender}`}>
                <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong> {msg.text}
              </div>
            ))}
          </div>
          <input
            type="text"
            value={input}
            placeholder="Ask a question..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
