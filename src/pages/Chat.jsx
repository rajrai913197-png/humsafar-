import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useParams } from "react-router-dom";

import IncomingCall from "../components/IncomingCall";
import VoiceCall from "../components/VoiceCall";
import VideoCall from "../components/VideoCall";

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [connections, setConnections] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [mobileChat, setMobileChat] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // CALL STATES
  const [voiceCall, setVoiceCall] = useState(false);
  const [videoCall, setVideoCall] = useState(false);

  // INCOMING CALL
  const [incomingCall, setIncomingCall] = useState(null);

  const socketRef = useRef(null);

  const { userId: receiverId } = useParams();

  const navigate = useNavigate();

  // ==========================================
  // JWT
  // ==========================================

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

  // ==========================================
  // IMAGE
  // ==========================================

  const getImage = (person) => {
    if (!person?.image) {
      return "https://i.pravatar.cc/150";
    }

    if (person.image.startsWith("http")) {
      return person.image;
    }

    return `http://localhost:3300/upload/${person.image}`;
  };

  // ==========================================
  // GET CONNECTIONS
  // ==========================================

  const getConnections = () => {
    if (!myId) {
      console.log("MY ID NOT FOUND");
      return;
    }

    axios
      .get(`http://localhost:3300/myConnections/${myId}`)
      .then((res) => {
        console.log("CONNECTION RESPONSE:", res.data);

        const data = res.data.connections || [];

        setConnections(data);
      })
      .catch((error) => {
        console.log(
          "CONNECTION ERROR:",
          error.response?.data || error.message
        );
      });
  };

  useEffect(() => {
    if (!myId) {
      return;
    }

    getConnections();
  }, [myId]);

  // ==========================================
  // SELECTED CHAT USER
  // ==========================================

  useEffect(() => {
    if (!receiverId) {
      setSelectedChat(null);
      setMessages([]);
      setMobileChat(false);

      setVoiceCall(false);
      setVideoCall(false);

      return;
    }

    axios
      .get(`http://localhost:3300/getUserBy/${receiverId}`)
      .then((res) => {
        console.log("SELECTED USER RESPONSE:", res.data);

        const user =
          res.data.user ||
          res.data.data ||
          res.data;

        setSelectedChat(user);
        setMobileChat(true);

        // New chat open hone par old call close
        setVoiceCall(false);
        setVideoCall(false);
      })
      .catch((error) => {
        console.log(
          "SELECTED USER ERROR:",
          error.response?.data || error.message
        );
      });
  }, [receiverId]);

  // ==========================================
  // GET MESSAGES
  // ==========================================

  useEffect(() => {
    if (!myId || !receiverId) {
      setMessages([]);
      return;
    }

    axios
      .get(
        `http://localhost:3300/messages/${myId}/${receiverId}`
      )
      .then((res) => {
        console.log("MESSAGES RESPONSE:", res.data);

        setMessages(res.data.messages || []);
      })
      .catch((error) => {
        console.log(
          "MESSAGES ERROR:",
          error.response?.data || error.message
        );
      });
  }, [myId, receiverId]);

  // ==========================================
  // SOCKET
  // IMPORTANT:
  // socket sirf myId par depend karega
  // receiverId change hone par socket recreate
  // nahi hoga.
  // ==========================================

  useEffect(() => {
    if (!myId) {
      return;
    }

    console.log("STARTING SOCKET...");

    const socket = io("http://localhost:3300", {
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current = socket;

    // ========================================
    // CONNECT
    // ========================================

    socket.on("connect", () => {
      console.log("================================");
      console.log("SOCKET CONNECTED");
      console.log("SOCKET ID:", socket.id);
      console.log("MY ROOM:", String(myId));
      console.log("================================");

      socket.emit("joinUser", String(myId));
    });

    // ========================================
    // ONLINE USERS
    // ========================================

    socket.on("onlineUsers", (users) => {
      console.log("ONLINE USERS:", users);

      setOnlineUsers(
        (users || []).map((id) => String(id))
      );
    });

    // ========================================
    // RECEIVE MESSAGE
    // ========================================

    socket.on("receiveMessage", (data) => {
      console.log("🔥 MESSAGE RECEIVED:", data);

      if (!data) {
        return;
      }

      const senderId = String(
        data.sender?._id || data.sender
      );

      const receiver = String(
        data.receiver?._id || data.receiver
      );

      const currentUser = String(myId);

      if (
        senderId === String(receiverId) &&
        receiver === currentUser
      ) {
        setMessages((prev) => {
          const alreadyExists = prev.some(
            (msg) =>
              String(msg._id) === String(data._id)
          );

          if (alreadyExists) {
            return prev;
          }

          return [...prev, data];
        });
      }
    });

    // ========================================
    // 📞 INCOMING CALL
    // VOICE + VIDEO BOTH
    // ========================================

    socket.on("incoming-call", (data) => {
      console.log("================================");
      console.log("📞 INCOMING CALL");
      console.log("CALL DATA:", data);
      console.log("CALL TYPE:", data?.callType);
      console.log("CALLER ID:", data?.callerId);
      console.log("================================");

      if (!data) {
        return;
      }

      if (!data.callerId) {
        console.log("CALLER ID MISSING");
        return;
      }

      if (!data.offer) {
        console.log("WEBRTC OFFER MISSING");
        return;
      }

      // IMPORTANT:
      // video par filter nahi lagana.
      // voice + video dono yaha aayenge.

      setIncomingCall(data);

      // Agar hum khud kisi call mein hain
      // to old call close kar do.
      setVoiceCall(false);
      setVideoCall(false);
    });

    // ========================================
    // CALL ACCEPTED
    // Caller side ke liye
    // ========================================

    socket.on("call-accepted", (data) => {
      console.log("================================");
      console.log("✅ CALL ACCEPTED");
      console.log("ANSWER:", data);
      console.log("================================");
    });

    // ========================================
    // CALL REJECTED
    // ========================================

    socket.on("call-rejected", () => {
      console.log("❌ CALL REJECTED");

      setVoiceCall(false);
      setVideoCall(false);
    });

    // ========================================
    // CALL ENDED
    // ========================================

    socket.on("call-ended", () => {
      console.log("📴 CALL ENDED");

      setIncomingCall(null);
      setVoiceCall(false);
      setVideoCall(false);
    });

    // ========================================
    // SOCKET ERROR
    // ========================================

    socket.on("connect_error", (error) => {
      console.log(
        "❌ SOCKET CONNECTION ERROR:",
        error.message
      );
    });

    // ========================================
    // DISCONNECT
    // ========================================

    socket.on("disconnect", (reason) => {
      console.log(
        "SOCKET DISCONNECTED:",
        reason
      );
    });

    // ========================================
    // CLEANUP
    // ========================================

    return () => {
      console.log("CLEANING SOCKET...");

      socket.removeAllListeners();

      socket.disconnect();

      socketRef.current = null;
    };
  }, [myId]);

  // ==========================================
  // SEND MESSAGE
  // ==========================================

  const sendMessage = () => {
    if (!message.trim()) {
      return;
    }

    if (!myId) {
      console.log("MY ID NOT FOUND");
      return;
    }

    if (!receiverId) {
      console.log("RECEIVER ID NOT FOUND");
      return;
    }

    const messageData = {
      sender: String(myId),
      receiver: String(receiverId),
      message: message.trim(),
    };

    axios
      .post(
        "http://localhost:3300/sendMessage",
        messageData
      )
      .then((res) => {
        console.log("MESSAGE SAVED:", res.data);

        const savedMessage = res.data.data;

        if (!savedMessage) {
          return;
        }

        setMessages((prev) => {
          const exists = prev.some(
            (msg) =>
              String(msg._id) ===
              String(savedMessage._id)
          );

          if (exists) {
            return prev;
          }

          return [...prev, savedMessage];
        });

        if (
          socketRef.current &&
          socketRef.current.connected
        ) {
          socketRef.current.emit(
            "sendMessage",
            savedMessage
          );
        }

        setMessage("");
      })
      .catch((error) => {
        console.log(
          "SEND MESSAGE ERROR:",
          error.response?.data ||
            error.message
        );
      });
  };

  // ==========================================
  // ENTER
  // ==========================================

  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ==========================================
  // OPEN CHAT
  // ==========================================

  const openChat = (id) => {
    setVoiceCall(false);
    setVideoCall(false);

    navigate(`/messages/${id}`);
  };

  // ==========================================
  // BACK
  // ==========================================

  const goBack = () => {
    navigate("/messages");

    setMobileChat(false);
    setSelectedChat(null);
    setMessages([]);

    setVoiceCall(false);
    setVideoCall(false);
  };

  // ==========================================
  // PROFILE
  // ==========================================

  const viewProfile = () => {
    if (!receiverId) {
      return;
    }

    navigate(`/profiledetail/${receiverId}`);
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredConnections =
    connections.filter((person) =>
      person?.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

  // ==========================================
  // ONLINE
  // ==========================================

  const isOnline = (id) => {
    return onlineUsers.includes(
      String(id)
    );
  };

  // ==========================================
  // RETURN
  // ==========================================

  return (
    <main className="messages-page">

      {/* ================================= */}
      {/* INCOMING CALL */}
      {/* ================================= */}

      {incomingCall && (
        <IncomingCall
          call={incomingCall}
          socket={socketRef.current}
          onClose={() => {
            setIncomingCall(null);
          }}
        />
      )}

      {/* ================================= */}
      {/* HEADING */}
      {/* ================================= */}

      <section className="messages-heading">
        <div>
          <p>YOUR CONVERSATIONS</p>

          <h1>
            Messages{" "}
            <span>& Connections</span>
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

      {/* ================================= */}
      {/* CHAT CONTAINER */}
      {/* ================================= */}

      <section className="chat-container">

        {/* ================================= */}
        {/* LEFT PANEL */}
        {/* ================================= */}

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
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <div className="conversation-list">

            {filteredConnections.length === 0 ? (
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
                      String(receiverId) ===
                      String(person._id)
                        ? "selected-conversation"
                        : ""
                    }`}
                    onClick={() =>
                      openChat(person._id)
                    }
                  >
                    <div className="conversation-image">

                      <img
                        src={getImage(person)}
                        alt={person.name}
                      />

                      {isOnline(person._id) && (
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

        {/* ================================= */}
        {/* CHAT WINDOW */}
        {/* ================================= */}

        <section className="chat-window">

          {!selectedChat ? (
            <div className="chat-empty-screen">
              <div>💬</div>

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
              {/* ================================= */}
              {/* CHAT HEADER */}
              {/* ================================= */}

              <header className="chat-header">

                <button
                  className="back-button"
                  onClick={goBack}
                >
                  ←
                </button>

                <div className="chat-user-image">

                  <img
                    src={getImage(selectedChat)}
                    alt={selectedChat.name}
                  />

                  {isOnline(
                    selectedChat._id
                  ) && (
                    <span className="chat-online"></span>
                  )}

                </div>

                <div
                  className="chat-user-info"
                  onClick={viewProfile}
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

                {/* ================================= */}
                {/* CALL BUTTONS */}
                {/* ================================= */}

                <div className="chat-call-actions">

                  {/* VOICE CALL */}

                  <button
                    className="call-icon-button"
                    onClick={() => {
                      console.log(
                        "📞 VOICE CALL CLICKED"
                      );

                      setVideoCall(false);
                      setVoiceCall(true);
                    }}
                    title="Voice Call"
                  >
                    📞
                  </button>

                  {/* VIDEO CALL */}

                  <button
                    className="call-icon-button"
                    onClick={() => {
                      console.log(
                        "📹 VIDEO CALL CLICKED"
                      );

                      setVoiceCall(false);
                      setVideoCall(true);
                    }}
                    title="Video Call"
                  >
                    📹
                  </button>

                </div>

                <button
                  className="more-button"
                  onClick={viewProfile}
                >
                  ⋮
                </button>

              </header>

              {/* ================================= */}
              {/* VOICE CALL */}
              {/* ================================= */}

              {voiceCall && (
                <VoiceCall
                  user={selectedChat}
                  socket={socketRef.current}
                  myId={myId}
                  onClose={() => {
                    console.log(
                      "VOICE CALL CLOSED"
                    );

                    setVoiceCall(false);
                  }}
                />
              )}

              {/* ================================= */}
              {/* VIDEO CALL */}
              {/* ================================= */}

              {videoCall && (
                <VideoCall
                  user={selectedChat}
                  socket={socketRef.current}
                  myId={myId}
                  call={{
                    isCaller: true,
                  }}
                  onClose={() => {
                    console.log(
                      "VIDEO CALL CLOSED"
                    );

                    setVideoCall(false);
                  }}
                />
              )}

              {/* ================================= */}
              {/* CHAT BODY */}
              {/* ================================= */}

              <div className="chat-body">

                <div className="date-divider">
                  <span>TODAY</span>
                </div>

                <div className="conversation-start">

                  <div className="small-profile">
                    <img
                      src={getImage(selectedChat)}
                      alt={selectedChat.name}
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

                {/* ================================= */}
                {/* MESSAGES */}
                {/* ================================= */}

                <div className="messages-list">

                  {messages.length === 0 ? (
                    <div className="no-messages">
                      <p>
                        No messages yet
                      </p>

                      <span>
                        Say hello 👋
                      </span>
                    </div>
                  ) : (
                    messages.map((msg) => {

                      const senderId =
                        String(
                          msg.sender?._id ||
                            msg.sender
                        );

                      const mine =
                        senderId ===
                        String(myId);

                      return (
                        <div
                          key={msg._id}
                          className={`message-row ${
                            mine
                              ? "my-message"
                              : "other-message"
                          }`}
                        >
                          <div className="message-bubble">

                            <p>
                              {msg.message}
                            </p>

                            <span>
                              {msg.createdAt
                                ? new Date(
                                    msg.createdAt
                                  ).toLocaleTimeString(
                                    [],
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )
                                : ""}
                            </span>

                          </div>
                        </div>
                      );
                    })
                  )}

                </div>
              </div>

              {/* ================================= */}
              {/* MESSAGE INPUT */}
              {/* ================================= */}

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
                    setMessage(e.target.value)
                  }
                  onKeyDown={handleKeyDown}
                />

                <button
                  className="send-button"
                  onClick={sendMessage}
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