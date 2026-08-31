import { useState } from "react";

const conversations = [
  {
    id: 1,
    name: "Ananya Sharma",
    image: "https://i.pravatar.cc/150?img=47",
    lastMessage: "Hey, how are you?",
    time: "10:42 PM",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "Riya Verma",
    image: "https://i.pravatar.cc/150?img=44",
    lastMessage: "Nice to connect with you!",
    time: "9:15 PM",
    unread: 0,
    online: true,
  },
  {
    id: 3,
    name: "Kavya Patel",
    image: "https://i.pravatar.cc/150?img=49",
    lastMessage: "Would love to know more about you.",
    time: "8:20 PM",
    unread: 0,
    online: false,
  },
  {
    id: 4,
    name: "Sneha Mehta",
    image: "https://i.pravatar.cc/150?img=45",
    lastMessage: "Have a wonderful evening!",
    time: "Yesterday",
    unread: 0,
    online: false,
  },
];

const messages = [
  {
    id: 1,
    text: "Hi! It's nice to connect with you.",
    sender: "other",
    time: "10:38 PM",
  },
  {
    id: 2,
    text: "Hey Ananya, nice to connect with you too 😊",
    sender: "me",
    time: "10:40 PM",
  },
  {
    id: 3,
    text: "How are you doing?",
    sender: "other",
    time: "10:41 PM",
  },
  {
    id: 4,
    text: "I'm doing great! How about you?",
    sender: "me",
    time: "10:42 PM",
  },
  {
    id: 5,
    text: "I'm good too. Looking forward to knowing you better.",
    sender: "other",
    time: "10:43 PM",
  },
];

const Chat= () => {
  const [selectedChat, setSelectedChat] = useState(conversations[0]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [mobileChat, setMobileChat] = useState(false);

  const filteredChats = conversations.filter((chat) =>
    chat.name.toLowerCase().includes(search.toLowerCase())
  );

  const sendMessage = () => {
    if (!message.trim()) return;

    setMessage("");
  };

  return (
    <main className="messages-page">

      {/* PAGE HEADER */}
      <div className="messages-heading">
        <div>
          <p>YOUR CONVERSATIONS</p>
          <h1>
            Messages <span>&</span> Connections
          </h1>
        </div>

        <div className="message-count">
          <strong>4</strong>
          <small>Conversations</small>
        </div>
      </div>


      {/* CHAT CONTAINER */}
      <section className="chat-container">

        {/* ================= LEFT ================= */}
        <aside
          className={`conversation-panel ${
            mobileChat ? "hide-mobile" : ""
          }`}
        >

          <div className="conversation-header">
            <h2>Conversations</h2>

            <button className="new-message-btn">
              +
            </button>
          </div>


          {/* SEARCH */}
          <div className="chat-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>


          {/* CHAT LIST */}
          <div className="conversation-list">

            {filteredChats.map((chat) => (

              <div
                key={chat.id}
                className={`conversation ${
                  selectedChat.id === chat.id
                    ? "selected-conversation"
                    : ""
                }`}
                onClick={() => {
                  setSelectedChat(chat);
                  setMobileChat(true);
                }}
              >

                <div className="conversation-image">

                  <img
                    src={chat.image}
                    alt={chat.name}
                  />

                  {chat.online && (
                    <span className="online-dot"></span>
                  )}

                </div>


                <div className="conversation-info">

                  <div className="conversation-top">
                    <h3>{chat.name}</h3>
                    <span>{chat.time}</span>
                  </div>

                  <div className="conversation-bottom">

                    <p>{chat.lastMessage}</p>

                    {chat.unread > 0 && (
                      <b>{chat.unread}</b>
                    )}

                  </div>

                </div>

              </div>

            ))}

          </div>

        </aside>


        {/* ================= RIGHT ================= */}
        <section
          className={`chat-window ${
            !mobileChat ? "mobile-empty" : ""
          }`}
        >

          {/* CHAT HEADER */}
          <header className="chat-header">

            <button
              className="back-button"
              onClick={() => setMobileChat(false)}
            >
              ←
            </button>


            <div className="chat-user-image">

              <img
                src={selectedChat.image}
                alt={selectedChat.name}
              />

              {selectedChat.online && (
                <span className="chat-online"></span>
              )}

            </div>


            <div className="chat-user-info">

              <h2>{selectedChat.name}</h2>

              <p>
                {selectedChat.online
                  ? "● Online"
                  : "Last seen recently"}
              </p>

            </div>


            <button className="more-button">
              ⋮
            </button>

          </header>


          {/* CHAT BODY */}
          <div className="chat-body">

            <div className="date-divider">
              <span>Today</span>
            </div>


            <div className="conversation-start">

              <div className="small-profile">

                <img
                  src={selectedChat.image}
                  alt={selectedChat.name}
                />

              </div>

              <h3>{selectedChat.name}</h3>

              <p>
                You matched with {selectedChat.name}.
              </p>

              <span>Start getting to know each other.</span>

            </div>


            {/* MESSAGES */}
            <div className="messages-list">

              {messages.map((msg) => (

                <div
                  key={msg.id}
                  className={`message-row ${
                    msg.sender === "me"
                      ? "my-message"
                      : "other-message"
                  }`}
                >

                  <div className="message-bubble">
                    <p>{msg.text}</p>

                    <span>
                      {msg.time}
                      {msg.sender === "me" && " ✓✓"}
                    </span>
                  </div>

                </div>

              ))}

            </div>

          </div>


          {/* MESSAGE INPUT */}
          <div className="message-input-area">

            <button className="emoji-button">
              ☺
            </button>

            <input
              type="text"
              placeholder="Write a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />

            <button className="send-button" onClick={sendMessage}>
              ➤
            </button>

          </div>

        </section>

      </section>

    </main>
  );
};

export default Chat;

