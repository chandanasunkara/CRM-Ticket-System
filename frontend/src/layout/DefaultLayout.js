import React from "react";
import Header from "./partials/Header.comp";
import Footer from "./partials/Footer.comp";
import Chatbot from "../components/FaqChatbot/chatbot.comp";
export const DefaultLayout = ({ children }) => {
  return (
    <div className="default-layout">
      <header className="header mb-2">
        <Header />
      </header>

      <main className="main">{children}</main>
      <Chatbot />
      <footer className="footer">
        <Footer />
      </footer>
    </div>
  );
};

export default DefaultLayout;
