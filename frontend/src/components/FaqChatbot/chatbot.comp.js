import React, { useState, useEffect } from "react";
import "./chatbot.css";

const FAQ_DATA = {
  "hi": "Hi there!  How can I assist you today?",
  "hello": "Hello!  How can I help you?",
  "hey": "Hey! Need help with something?",
  "good morning": "Good morning!  How can I assist you today?",
  "good evening": "Good evening!  Let me know how I can help.",
  "how can i reset my password": "You can reset it from the login page by clicking 'Forgot Password'.",
  "how do i view my tickets": "You can view your tickets from the 'My Tickets' section in the dashboard.",
  "how do i create a new ticket": "Click on the 'Add New Ticket' button on your dashboard to raise a support request.",
  "how do i update my ticket": "Open your ticket and use the reply section to add more details or updates.",
  "how can i check the status of my ticket": "Ticket status is shown in your ticket list. You can also open the ticket to see its status and history.",
  "how do i close a ticket": "Tickets are closed automatically once resolved. You can also request closure by replying to the ticket.",
  "can i reopen a closed ticket": "Yes, you can reopen a closed ticket by replying to it or contacting support.",
  "how do i update my company details": "Go to 'Account Settings' and update your company profile from there.",
  "can i assign a ticket to another agent": "Only admins can reassign tickets. Please contact your admin if needed.",
  "how can i escalate an issue": "To escalate, mark the ticket as 'High Priority' or mention 'escalation' in your ticket reply.",
  "how do i change my notification preferences": "You can change your email and notification preferences in your profile settings.",
  "who can see my tickets": "Only you and the assigned support team can see your tickets. Admins may also have access depending on role.",
  "how do i delete my account": "Please contact support directly through a ticket to request account deletion.",
  "what if i entered wrong information in my ticket": "You can add a reply with corrected information, or contact support for help updating it.",
  "how long does it take to get a response": "Our support team typically responds within 24 hours on business days.",
  "i'm getting a 500 error": "A 500 error means something went wrong on our server. Please try again or contact support with the details.",
  "why is my dashboard not loading": "Please try clearing your browser cache or refreshing. If the issue persists, report it via ticket.",
  "how do i upload documents to a ticket": "Open the ticket and use the 'Attach Files' option at the bottom to upload your documents.",
  "can i integrate this with my crm": "Integration support depends on your plan. Please contact us with your CRM type for guidance.",
  "is there an api for ticket creation": "Yes! Our API docs include endpoints for creating, updating, and tracking tickets. Reach out to get access.",
  "can i export ticket history": "Yes. Use the 'Export' button in your ticket list to download ticket history as a CSV or PDF.",
  "how do i change my profile photo": "Go to 'Account Settings' > 'Profile', and you'll see an option to upload a new photo.",
  "how do i change my email address": "You can update your email from 'Profile Settings'. You'll need to confirm it via OTP.",
  "why is the website so slow": "Try clearing your browser cache or using an incognito window. It may also be due to server load — we’re working on improvements.",
"why are images not loading": "This may be a network issue or an ad blocker interfering. Try disabling extensions or reloading the page.",
"the page is stuck loading": "Please refresh the page. If it continues, try using a different browser or device.",
"i'm getting a 404 error": "A 404 error means the page doesn’t exist or the link is broken. Please check the URL or go back to the homepage.",
"i can't log into my account": "Make sure your credentials are correct. If you’ve forgotten your password, use the 'Forgot Password' option.",
"how do i change my password": "Go to 'Account Settings' > 'Security' to change your password.",
"i didn’t receive a verification email": "Check your spam folder. If it’s not there, click 'Resend Verification' on the login page.",
"my payment failed": "Please check if your card details are correct and your account has sufficient funds. Try another card if needed.",
"how do i get an invoice": "Invoices are available under 'Billing' in your account settings. You can download or email them.",
"how do i update my card details": "Go to 'Billing' settings and update your card info securely there."
};

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

 
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greetingMessage = {
        sender: "bot",
        text: "Hi! How can I help you today? You can ask about tickets, profile settings, or support steps."
      };
      setMessages([greetingMessage]);
    }
  }, [isOpen, messages.length]);
  

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
