import { useState } from "react";

const notifications = [
  {
    id: 1,
    type: "interest",
    icon: "♡",
    title: "Ananya Sharma sent you an interest",
    description: "She is interested in your profile.",
    time: "10 min ago",
    unread: true,
    image: "https://i.pravatar.cc/100?img=47",
  },
  {
    id: 2,
    type: "message",
    icon: "💬",
    title: "Kavya Patel sent you a message",
    description: "Hi, nice to connect with you!",
    time: "2 hours ago",
    unread: true,
    image: "https://i.pravatar.cc/100?img=49",
  },
  {
    id: 3,
    type: "match",
    icon: "✦",
    title: "You have a new match",
    description: "You and Riya Verma are now connected.",
    time: "5 hours ago",
    unread: false,
    image: "https://i.pravatar.cc/100?img=44",
  },
  {
    id: 4,
    type: "accepted",
    icon: "✓",
    title: "Riya Verma accepted your interest",
    description: "You are now connected with Riya.",
    time: "Yesterday",
    unread: false,
    image: "https://i.pravatar.cc/100?img=44",
  },
  {
    id: 5,
    type: "profile",
    icon: "◉",
    title: "Someone viewed your profile",
    description: "A new person recently viewed your profile.",
    time: "Yesterday",
    unread: false,
    image: null,
  },
  {
    id: 6,
    type: "interest",
    icon: "♡",
    title: "Meera Joshi sent you an interest",
    description: "She is interested in getting to know you.",
    time: "2 days ago",
    unread: false,
    image: "https://i.pravatar.cc/100?img=25",
  },
];

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [data, setData] = useState(notifications);

  const unreadCount = data.filter((item) => item.unread).length;

  const markAllRead = () => {
    setData(
      data.map((item) => ({
        ...item,
        unread: false,
      }))
    );
  };

  const markRead = (id) => {
    setData(
      data.map((item) =>
        item.id === id
          ? { ...item, unread: false }
          : item
      )
    );
  };

  const filteredNotifications =
    activeTab === "unread"
      ? data.filter((item) => item.unread)
      : data;

  return (
    <main className="notifications-page">

      {/* HEADER */}
      <section className="notification-header">

        <div>
          <p>STAY CONNECTED</p>

          <h1>
            Notifications <span>&</span> Updates
          </h1>

          <h4>
            Stay updated with your interests, matches
            and conversations.
          </h4>
        </div>

        <button
          className="mark-all-btn"
          onClick={markAllRead}
        >
          ✓ Mark all as read
        </button>

      </section>


      {/* SUMMARY */}
      <section className="notification-summary">

        <div className="summary-card">
          <div className="summary-icon">♡</div>

          <div>
            <strong>{unreadCount}</strong>
            <p>Unread Notifications</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">✦</div>

          <div>
            <strong>4</strong>
            <p>New Connections</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">◉</div>

          <div>
            <strong>8</strong>
            <p>Profile Activities</p>
          </div>
        </div>

      </section>


      {/* TABS */}
      <section className="notification-content">

        <div className="notification-tabs">

          <button
            className={activeTab === "all" ? "active-tab" : ""}
            onClick={() => setActiveTab("all")}
          >
            All
            <span>{data.length}</span>
          </button>

          <button
            className={activeTab === "unread" ? "active-tab" : ""}
            onClick={() => setActiveTab("unread")}
          >
            Unread
            <span>{unreadCount}</span>
          </button>

        </div>


        {/* TODAY */}
        <div className="notification-section">

          <div className="section-title">
            <span>TODAY</span>
          </div>

          {filteredNotifications
            .filter(
              (notification) =>
                notification.time.includes("min") ||
                notification.time.includes("hour")
            )
            .map((notification) => (

              <div
                key={notification.id}
                className={`notification-card ${
                  notification.unread
                    ? "unread-notification"
                    : ""
                }`}
                onClick={() =>
                  markRead(notification.id)
                }
              >

                {notification.image ? (
                  <div className="notification-profile">
                    <img
                      src={notification.image}
                      alt=""
                    />

                    <span className={`notification-type ${notification.type}`}>
                      {notification.icon}
                    </span>
                  </div>
                ) : (
                  <div className={`notification-icon ${notification.type}`}>
                    {notification.icon}
                  </div>
                )}

                <div className="notification-info">

                  <h3>{notification.title}</h3>

                  <p>{notification.description}</p>

                </div>

                <div className="notification-time">
                  {notification.unread && (
                    <span className="unread-dot"></span>
                  )}

                  <span>{notification.time}</span>
                </div>

              </div>
            ))}

        </div>


        {/* EARLIER */}
        <div className="notification-section">

          <div className="section-title">
            <span>EARLIER</span>
          </div>

          {filteredNotifications
            .filter(
              (notification) =>
                notification.time.includes("Yesterday") ||
                notification.time.includes("days")
            )
            .map((notification) => (

              <div
                key={notification.id}
                className={`notification-card ${
                  notification.unread
                    ? "unread-notification"
                    : ""
                }`}
                onClick={() =>
                  markRead(notification.id)
                }
              >

                {notification.image ? (
                  <div className="notification-profile">

                    <img
                      src={notification.image}
                      alt=""
                    />

                    <span className={`notification-type ${notification.type}`}>
                      {notification.icon}
                    </span>

                  </div>
                ) : (
                  <div className={`notification-icon ${notification.type}`}>
                    {notification.icon}
                  </div>
                )}

                <div className="notification-info">

                  <h3>{notification.title}</h3>

                  <p>{notification.description}</p>

                </div>

                <div className="notification-time">

                  {notification.unread && (
                    <span className="unread-dot"></span>
                  )}

                  <span>{notification.time}</span>

                </div>

              </div>
            ))}

        </div>


        {/* EMPTY STATE */}
        {filteredNotifications.length === 0 && (

          <div className="notification-empty">

            <div>✓</div>

            <h2>You're all caught up</h2>

            <p>
              You don't have any unread notifications.
            </p>

          </div>

        )}

      </section>

    </main>
  );
};

export default Notifications;
