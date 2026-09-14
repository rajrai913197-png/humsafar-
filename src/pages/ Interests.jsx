import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Interests = () => {
  const [activeTab, setActiveTab] = useState("received");
  const [received, setReceived] = useState([]);
  const [matches, setMatches] = useState([]);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  let userId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.userId;
    } catch (error) {
      console.log("Invalid token",error);
    }
  }

  const getReceivedInterests = () => {
    if (!userId) return;

    axios
      .get(`http://localhost:3300/receivedInterests/${userId}`)
      .then((res) => {
        console.log("Received:", res.data);
        setReceived(res.data.interests);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getConnections = () => {
    if (!userId) return;

    axios
      .get(`http://localhost:3300/myConnections/${userId}`)
      .then((res) => {
        console.log("Connections:", res.data);
        setMatches(res.data.connections);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getReceivedInterests();
    getConnections();
  }, [userId]);

  const handleAccept = (interestId) => {
    axios
      .put(`http://localhost:3300/acceptInterest/${interestId}`)
      .then((res) => {
        console.log(res.data);

        setReceived((prev) =>
          prev.filter((item) => item._id !== interestId)
        );

        getConnections();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleReject = (interestId) => {
    axios
      .put(`http://localhost:3300/rejectInterest/${interestId}`)
      .then((res) => {
        console.log(res.data);

        setReceived((prev) =>
          prev.filter((item) => item._id !== interestId)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const viewProfile = (id) => {
    navigate(`/profiledetail/${id}`);
  };

  const openChat = (id) => {
    navigate(`/messages/${id}`);
  };

  return (
    <>
      <main className="interests-page">

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


        <section className="interest-stats">

          <div
            className={`stat-card ${
              activeTab === "received" ? "active-stat" : ""
            }`}
            onClick={() => setActiveTab("received")}
          >
            <span className="stat-icon">♡</span>

            <div>
              <strong>{received.length}</strong>
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
              <strong>0</strong>
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
              <strong>{matches.length}</strong>
              <p>Mutual Matches</p>
            </div>
          </div>

        </section>


        <section className="interest-content">

          {activeTab === "received" && (
            <>
              <div className="content-heading">

                <div>
                  <p>PEOPLE INTERESTED IN YOU</p>
                  <h2>Received Interests</h2>
                </div>

                <span>
                  {received.length} requests
                </span>

              </div>


              <div className="interest-list">

                {received.length === 0 ? (

                  <div className="empty-interest">
                    <h3>No pending interests</h3>
                    <p>
                      You don't have any new interest requests right now.
                    </p>
                  </div>

                ) : (

                  received.map((item) => {

                    const person = item.sender;

                    return (
                      <div
                        className="interest-card"
                        key={item._id}
                      >

                        <img
                          src={
                            person?.image
                              ? `http://localhost:3300/upload/${person.image}`
                              : "https://i.pravatar.cc/500?img=47"
                          }
                          alt={person?.name}
                        />


                        <div className="interest-info">

                          <div className="interest-name">

                            <h3>
                              {person?.name},{" "}
                              {person?.age || ""}
                            </h3>

                          </div>


                          <p className="person-profession">
                            {person?.profession ||
                              "Profession not added"}
                          </p>


                          <p className="person-location">
                            ♧ &nbsp;
                            {person?.city ||
                              "Location not added"}
                          </p>

                        </div>


                        <div className="interest-actions">

                          <button
                            className="view-btn"
                            onClick={() =>
                              viewProfile(person?._id)
                            }
                          >
                            View Profile
                          </button>


                          <button
                            className="accept-btn"
                            onClick={() =>
                              handleAccept(item._id)
                            }
                          >
                            Accept
                          </button>


                          <button
                            className="decline-btn"
                            onClick={() =>
                              handleReject(item._id)
                            }
                          >
                            Decline
                          </button>

                        </div>

                      </div>
                    );
                  })

                )}

              </div>
            </>
          )}


          {activeTab === "sent" && (
            <>
              <div className="content-heading">

                <div>
                  <p>PEOPLE YOU'VE SHOWN INTEREST IN</p>
                  <h2>Sent Interests</h2>
                </div>

                <span>0 requests</span>

              </div>


              <div className="interest-list">

                <div className="empty-interest">
                  <h3>Sent Interests</h3>
                  <p>
                    Your sent interest requests will appear here.
                  </p>
                </div>

              </div>
            </>
          )}


          {activeTab === "matches" && (
            <>
              <div className="content-heading">

                <div>
                  <p>MUTUAL CONNECTIONS</p>
                  <h2>Your Matches</h2>
                </div>

                <span>
                  {matches.length} matches
                </span>

              </div>


              <div className="matches-grid">

                {matches.length === 0 ? (

                  <div className="empty-interest">
                    <h3>No matches yet</h3>
                    <p>
                      Accepted interests will appear here.
                    </p>
                  </div>

                ) : (

                  matches.map((person) => (

                    <div
                      className="match-interest-card"
                      key={person._id}
                    >

                      <div className="match-photo">

                        <img
                          src={
                            person.image
                              ? `http://localhost:3300/upload/${person.image}`
                              : "https://i.pravatar.cc/500?img=25"
                          }
                          alt={person.name}
                        />

                        <span>✦ Match</span>

                      </div>


                      <div className="match-info">

                        <h3>
                          {person.name},{" "}
                          {person.age || ""}
                        </h3>


                        <p>
                          {person.profession ||
                            "Profession not added"}
                        </p>


                        <small>
                          ♧ &nbsp;
                          {person.city ||
                            "Location not added"}
                        </small>


                        <div className="match-actions">

                          <button
                            className="view-btn"
                            onClick={() =>
                              viewProfile(person._id)
                            }
                          >
                            View Profile
                          </button>


                          <button
                            className="message-btn"
                            onClick={() =>
                              openChat(person._id)
                            }
                          >
                            Message
                          </button>

                        </div>

                      </div>

                    </div>

                  ))

                )}

              </div>
            </>
          )}

        </section>

      </main>
    </>
  );
};

export default Interests;