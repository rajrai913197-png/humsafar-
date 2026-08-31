import { useState } from "react";
const received = [
  {
    id: 1,
    name: "Ananya Sharma",
    age: 26,
    profession: "Software Engineer",
    location: "Bhopal, Madhya Pradesh",
    image: "https://i.pravatar.cc/500?img=47",
    verified: true,
  },
  {
    id: 2,
    name: "Riya Verma",
    age: 25,
    profession: "Architect",
    location: "Indore, Madhya Pradesh",
    image: "https://i.pravatar.cc/500?img=44",
    verified: true,
  },
  {
    id: 3,
    name: "Kavya Patel",
    age: 27,
    profession: "Doctor",
    location: "Mumbai, Maharashtra",
    image: "https://i.pravatar.cc/500?img=49",
    verified: true,
  },
];

const sent = [
  {
    id: 4,
    name: "Sneha Mehta",
    age: 24,
    profession: "Marketing Manager",
    location: "Delhi, India",
    image: "https://i.pravatar.cc/500?img=45",
    status: "Pending",
  },
  {
    id: 5,
    name: "Pooja Singh",
    age: 28,
    profession: "HR Manager",
    location: "Pune, Maharashtra",
    image: "https://i.pravatar.cc/500?img=32",
    status: "Accepted",
  },
];

const matches = [
  {
    id: 6,
    name: "Meera Joshi",
    age: 26,
    profession: "Teacher",
    location: "Jaipur, Rajasthan",
    image: "https://i.pravatar.cc/500?img=25",
  },
  {
    id: 7,
    name: "Priya Kapoor",
    age: 27,
    profession: "Product Manager",
    location: "Mumbai, Maharashtra",
    image: "https://i.pravatar.cc/500?img=48",
  },
];

const Interests = () => {
  const [activeTab, setActiveTab] = useState("received");

  return (
    <>
    <main className="interests-page">

      {/* HEADER */}
      <section className="interests-header">
        <p>YOUR CONNECTIONS</p>

        <h1>
          Interests & <span>Matches</span>
        </h1>

        <h4>
          Manage the people who have shown interest in
          connecting with you.
        </h4>
      </section>


      {/* STATS */}
      <section className="interest-stats">

        <div
          className={`stat-card ${
            activeTab === "received" ? "active-stat" : ""
          }`}
          onClick={() => setActiveTab("received")}
        >
          <span className="stat-icon">♡</span>
          <div>
            <strong>12</strong>
            <p>Received Interests</p>
          </div>
        </div>


        <div
          className={`stat-card ${
            activeTab === "sent" ? "active-stat" : ""
          }`}
          onClick={() => setActiveTab("sent")}
        >
          <span className="stat-icon">↑</span>
          <div>
            <strong>8</strong>
            <p>Sent Interests</p>
          </div>
        </div>


        <div
          className={`stat-card ${
            activeTab === "matches" ? "active-stat" : ""
          }`}
          onClick={() => setActiveTab("matches")}
        >
          <span className="stat-icon">✦</span>
          <div>
            <strong>4</strong>
            <p>Mutual Matches</p>
          </div>
        </div>

      </section>


      {/* CONTENT */}
      <section className="interest-content">

        {/* RECEIVED */}
        {activeTab === "received" && (
          <>
            <div className="content-heading">
              <div>
                <p>PEOPLE INTERESTED IN YOU</p>
                <h2>Received Interests</h2>
              </div>

              <span>12 requests</span>
            </div>

            <div className="interest-list">

              {received.map((person) => (
                <div className="interest-card" key={person.id}>

                  <img
                    src={person.image}
                    alt={person.name}
                  />

                  <div className="interest-info">

                    <div className="interest-name">
                      <h3>
                        {person.name}, {person.age}
                      </h3>

                      {person.verified && (
                        <span className="verified-small">
                          ✓ Verified
                        </span>
                      )}
                    </div>

                    <p className="person-profession">
                      {person.profession}
                    </p>

                    <p className="person-location">
                      ♧ &nbsp;{person.location}
                    </p>

                  </div>

                  <div className="interest-actions">
                    <button className="view-btn">
                      View Profile
                    </button>

                    <button className="accept-btn">
                      Accept
                    </button>

                    <button className="decline-btn">
                      Decline
                    </button>
                  </div>

                </div>
              ))}

            </div>
          </>
        )}


        {/* SENT */}
        {activeTab === "sent" && (
          <>
            <div className="content-heading">
              <div>
                <p>PEOPLE YOU'VE SHOWN INTEREST IN</p>
                <h2>Sent Interests</h2>
              </div>

              <span>8 requests</span>
            </div>

            <div className="interest-list">

              {sent.map((person) => (
                <div className="interest-card" key={person.id}>

                  <img
                    src={person.image}
                    alt={person.name}
                  />

                  <div className="interest-info">

                    <div className="interest-name">
                      <h3>
                        {person.name}, {person.age}
                      </h3>
                    </div>

                    <p className="person-profession">
                      {person.profession}
                    </p>

                    <p className="person-location">
                      ♧ &nbsp;{person.location}
                    </p>

                  </div>

                  <div className="interest-actions">

                    <span
                      className={`status ${person.status.toLowerCase()}`}
                    >
                      {person.status}
                    </span>

                    <button className="view-btn">
                      View Profile
                    </button>

                  </div>

                </div>
              ))}

            </div>
          </>
        )}


        {/* MATCHES */}
        {activeTab === "matches" && (
          <>
            <div className="content-heading">
              <div>
                <p>MUTUAL CONNECTIONS</p>
                <h2>Your Matches</h2>
              </div>

              <span>4 matches</span>
            </div>

            <div className="matches-grid">

              {matches.map((person) => (
                <div className="match-interest-card" key={person.id}>

                  <div className="match-photo">

                    <img
                      src={person.image}
                      alt={person.name}
                    />

                    <span>✦ Match</span>

                  </div>

                  <div className="match-info">

                    <h3>
                      {person.name}, {person.age}
                    </h3>

                    <p>{person.profession}</p>

                    <small>
                      ♧ &nbsp;{person.location}
                    </small>

                    <div className="match-actions">

                      <button className="view-btn">
                        View Profile
                      </button>

                      <button className="message-btn">
                        Message
                      </button>

                    </div>

                  </div>

                </div>
              ))}

            </div>
          </>
        )}

      </section>

    </main>
    </>
  );
};

export default Interests;
