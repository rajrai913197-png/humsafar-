import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useParams } from "react-router-dom";

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [connections, setConnections] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [mobileChat, setMobileChat] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const socketRef = useRef(null);

  const { userId: receiverId } = useParams();

  const navigate = useNavigate();

  // ==============================
  // GET LOGGED IN USER ID
  // ==============================

  const token = localStorage.getItem("token");

  let myId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);

      myId = decoded.userId;

      console.log("MY USER ID:", myId);
    } catch (error) {
      console.log("INVALID TOKEN:", error);
    }
  }

  // ==============================
  // IMAGE
  // ==============================

  const getImage = (person) => {
    if (!person?.image) {
      return "https://i.pravatar.cc/150";
    }

    if (person.image.startsWith("http")) {
      return person.image;
    }

    return `http://localhost:3300/upload/${person.image}`;
  };

  // ==============================
  // GET CONNECTIONS
  // ==============================

  const getConnections = async () => {
    if (!myId) {
      console.log("MY ID NOT FOUND");
      return;
    }

    try {
      console.log(
        "GETTING CONNECTIONS FOR:",
        myId
      );

      const res = await axios.get(
        `http://localhost:3300/myConnections/${myId}`
      );

      console.log(
        "CONNECTION RESPONSE:",
        res.data
      );

      const data =
        res.data.connections || [];

      console.log(
        "CONNECTIONS:",
        data
      );

      setConnections(data);
    } catch (error) {
      console.log(
        "CONNECTION ERROR:",
        error.response?.data ||
          error.message
      );
    }
  };

  // ==============================
  // CONNECTIONS ON LOAD
  // ==============================

  useEffect(() => {
    if (!myId) {
      return;
    }

    getConnections();
  }, [myId]);

  // ==============================
  // GET SELECTED USER
  // ==============================

  useEffect(() => {
    if (!receiverId) {
      setSelectedChat(null);
      setMessages([]);
      setMobileChat(false);

      return;
    }

    const getSelectedUser = async () => {
      try {
        console.log(
          "GET SELECTED USER:",
          receiverId
        );

        const res = await axios.get(
          `http://localhost:3300/getUserBy/${receiverId}`
        );

        console.log(
          "SELECTED USER RESPONSE:",
          res.data
        );

        const user =
          res.data.user ||
          res.data.data ||
          res.data;

        console.log(
          "SELECTED USER:",
          user
        );

        setSelectedChat(user);

        setMobileChat(true);
      } catch (error) {
        console.log(
          "SELECTED USER ERROR:",
          error.response?.data ||
            error.message
        );
      }
    };

    getSelectedUser();
  }, [receiverId]);

  // ==============================
  // GET OLD MESSAGES
  // ==============================

  useEffect(() => {
    if (!myId || !receiverId) {
      setMessages([]);
      return;
    }

    const getMessages = async () => {
      try {
        console.log(
          "GETTING MESSAGES:",
          myId,
          receiverId
        );

        const res = await axios.get(
          `http://localhost:3300/messages/${myId}/${receiverId}`
        );

        console.log(
          "MESSAGES RESPONSE:",
          res.data
        );

        setMessages(
          res.data.messages || []
        );
      } catch (error) {
        console.log(
          "MESSAGES ERROR:",
          error.response?.data ||
            error.message
        );
      }
    };

    getMessages();
  }, [myId, receiverId]);

  // ==============================
  // SOCKET
  // ==============================

  useEffect(() => {
    if (!myId) {
      return;
    }

    console.log(
      "STARTING SOCKET..."
    );

    const socket = io(
      "http://localhost:3300"
    );

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log(
        "SOCKET CONNECTED:",
        socket.id
      );

      console.log(
        "JOINING ROOM:",
        String(myId)
      );

      socket.emit(
        "joinUser",
        String(myId)
      );
    });

    socket.on(
      "onlineUsers",
      (users) => {
        console.log(
          "ONLINE USERS:",
          users
        );

        setOnlineUsers(
          (users || []).map((id) =>
            String(id)
          )
        );
      }
    );

    socket.on(
      "receiveMessage",
      (data) => {
        console.log(
          "🔥 MESSAGE RECEIVED:",
          data
        );

        const senderId = String(
          data.sender?._id ||
            data.sender
        );

        const receiver = String(
          data.receiver?._id ||
            data.receiver
        );

        const currentUser =
          String(myId);

        const currentChat =
          String(receiverId);

        if (
          senderId === currentChat &&
          receiver === currentUser
        ) {
          setMessages((prev) => {
            const alreadyExists =
              prev.some(
                (msg) =>
                  String(msg._id) ===
                  String(data._id)
              );

            if (alreadyExists) {
              return prev;
            }

            return [
              ...prev,
              data
            ];
          });
        }
      }
    );

    socket.on(
      "connect_error",
      (error) => {
        console.log(
          "SOCKET ERROR:",
          error.message
        );
      }
    );

    socket.on(
      "disconnect",
      (reason) => {
        console.log(
          "SOCKET DISCONNECTED:",
          reason
        );
      }
    );

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [myId, receiverId]);

  // ==============================
  // SEND MESSAGE
  // ==============================

  const sendMessage = async () => {
    if (!message.trim()) {
      return;
    }

    if (!myId) {
      console.log(
        "MY ID NOT FOUND"
      );

      return;
    }

    if (!receiverId) {
      console.log(
        "RECEIVER ID NOT FOUND"
      );

      return;
    }

    const text =
      message.trim();

    const messageData = {
      sender: String(myId),
      receiver: String(receiverId),
      message: text,
    };

    try {
      console.log(
        "SENDING:",
        messageData
      );

      const res = await axios.post(
        "http://localhost:3300/sendMessage",
        messageData
      );

      console.log(
        "MESSAGE SAVED:",
        res.data
      );

      const savedMessage =
        res.data.data;

      setMessages((prev) => {
        const exists =
          prev.some(
            (msg) =>
              String(msg._id) ===
              String(
                savedMessage._id
              )
          );

        if (exists) {
          return prev;
        }

        return [
          ...prev,
          savedMessage
        ];
      });

      if (
        socketRef.current &&
        socketRef.current.connected
      ) {
        console.log(
          "EMITTING MESSAGE:",
          savedMessage
        );

        socketRef.current.emit(
          "sendMessage",
          savedMessage
        );
      }

      setMessage("");
    } catch (error) {
      console.log(
        "SEND MESSAGE ERROR:",
        error.response?.data ||
          error.message
      );
    }
  };

  // ==============================
  // ENTER SEND
  // ==============================

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  // ==============================
  // OPEN CHAT
  // ==============================

  const openChat = (id) => {
    navigate(
      `/messages/${id}`
    );
  };

  // ==============================
  // BACK
  // ==============================

  const goBack = () => {
    navigate("/messages");

    setMobileChat(false);
    setSelectedChat(null);
    setMessages([]);
  };

  // ==============================
  // PROFILE
  // ==============================

  const viewProfile = () => {
    if (!receiverId) {
      return;
    }

    navigate(
      `/profiledetail/${receiverId}`
    );
  };

  // ==============================
  // SEARCH
  // ==============================

  const filteredConnections =
    connections.filter((person) =>
      person?.name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  // ==============================
  // ONLINE
  // ==============================

  const isOnline = (id) => {
    return onlineUsers.includes(
      String(id)
    );
  };

  return (
    <main className="messages-page">

      {/* ================= HEADER ================= */}

      <section className="messages-heading">

        <div>
          <p>
            YOUR CONVERSATIONS
          </p>

          <h1>
            Messages{" "}
            <span>
              & Connections
            </span>
          </h1>
        </div>

        <div className="message-count">

          <strong>
            {connections.length}
          </strong>

          <small>
            CONNECTIONS
          </small>

        </div>

      </section>

      {/* ================= CHAT CONTAINER ================= */}

      <section className="chat-container">

        {/* ================= LEFT ================= */}

        <aside
          className={`conversation-panel ${
            mobileChat
              ? "hide-mobile"
              : ""
          }`}
        >

          <div className="conversation-header">

            <h2>
              Conversations
            </h2>

            <button
              className="new-message-btn"
              onClick={() =>
                setSearch("")
              }
            >
              +
            </button>

          </div>

          <div className="chat-search">

            <span>
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>

          <div className="conversation-list">

            {filteredConnections.length ===
            0 ? (

              <div className="empty-chat-list">

                <h3>
                  No conversations
                </h3>

                <p>
                  Accept a connection
                  to start chatting.
                </p>

              </div>

            ) : (

              filteredConnections.map(
                (person) => (

                  <div
                    key={person._id}
                    className={`conversation ${
                      String(
                        receiverId
                      ) ===
                      String(
                        person._id
                      )
                        ? "selected-conversation"
                        : ""
                    }`}
                    onClick={() =>
                      openChat(
                        person._id
                      )
                    }
                  >

                    <div className="conversation-image">

                      <img
                        src={getImage(
                          person
                        )}
                        alt={
                          person.name
                        }
                      />

                      {isOnline(
                        person._id
                      ) && (
                        <span className="online-dot"></span>
                      )}

                    </div>

                    <div className="conversation-info">

                      <div className="conversation-top">

                        <h3>
                          {person.name}
                        </h3>

                      </div>

                      <div className="conversation-bottom">

                        <p>
                          {person.profession ||
                            "Start a conversation"}
                        </p>

                      </div>

                    </div>

                  </div>

                )
              )

            )}

          </div>

        </aside>

        {/* ================= RIGHT CHAT ================= */}

        <section className="chat-window">

          {!selectedChat ? (

            <div className="chat-empty-screen">

              <div>
                💬
              </div>

              <h2>
                Start a conversation
              </h2>

              <p>
                Select one of your
                connections to start
                chatting.
              </p>

            </div>

          ) : (

            <>

              {/* ================= CHAT HEADER ================= */}

              <header className="chat-header">

                <button
                  className="back-button"
                  onClick={goBack}
                >
                  ←
                </button>

                <div className="chat-user-image">

                  <img
                    src={getImage(
                      selectedChat
                    )}
                    alt={
                      selectedChat.name
                    }
                  />

                  {isOnline(
                    selectedChat._id
                  ) && (
                    <span className="chat-online"></span>
                  )}

                </div>

                <div
                  className="chat-user-info"
                  onClick={
                    viewProfile
                  }
                >

                  <h2>
                    {selectedChat.name}
                  </h2>

                  <p>
                    {isOnline(
                      selectedChat._id
                    )
                      ? "Online"
                      : "Offline"}
                  </p>

                </div>

                <button
                  className="more-button"
                  onClick={
                    viewProfile
                  }
                >
                  ⋮
                </button>

              </header>

              {/* ================= BODY ================= */}

              <div className="chat-body">

                <div className="date-divider">
                  <span>
                    TODAY
                  </span>
                </div>

                <div className="conversation-start">

                  <div className="small-profile">

                    <img
                      src={getImage(
                        selectedChat
                      )}
                      alt={
                        selectedChat.name
                      }
                    />

                  </div>

                  <h3>
                    {selectedChat.name}
                  </h3>

                  <p>
                    {selectedChat.profession ||
                      "Your connection"}
                  </p>

                  <span>
                    You are now connected.
                    Start your conversation.
                  </span>

                </div>

                <div className="messages-list">

                  {messages.length ===
                  0 ? (

                    <div className="no-messages">

                      <p>
                        No messages yet
                      </p>

                      <span>
                        Say hello 👋
                      </span>

                    </div>

                  ) : (

                    messages.map(
                      (msg) => {

                        const senderId =
                          String(
                            msg.sender?._id ||
                              msg.sender
                          );

                        const mine =
                          senderId ===
                          String(
                            myId
                          );

                        return (
                          <div
                            key={
                              msg._id
                            }
                            className={`message-row ${
                              mine
                                ? "my-message"
                                : "other-message"
                            }`}
                          >

                            <div className="message-bubble">

                              <p>
                                {
                                  msg.message
                                }
                              </p>

                              <span>
                                {msg.createdAt
                                  ? new Date(
                                      msg.createdAt
                                    ).toLocaleTimeString(
                                      [],
                                      {
                                        hour:
                                          "2-digit",
                                        minute:
                                          "2-digit",
                                      }
                                    )
                                  : ""}
                              </span>

                            </div>

                          </div>
                        );
                      }
                    )

                  )}

                </div>

              </div>

              {/* ================= INPUT ================= */}

              <div className="message-input-area">

                <button
                  className="emoji-button"
                  onClick={() =>
                    setMessage(
                      (prev) =>
                        prev + " ❤️"
                    )
                  }
                >
                  ☺
                </button>

                <input
                  type="text"
                  placeholder="Write a message..."
                  value={message}
                  onChange={(e) =>
                    setMessage(
                      e.target.value
                    )
                  }
                  onKeyDown={
                    handleKeyDown
                  }
                />

                <button
                  className="send-button"
                  onClick={
                    sendMessage
                  }
                >
                  ➤
                </button>

              </div>

            </>

          )}

        </section>

      </section>

    </main>
  );
};

export default Chat;