import {
  useEffect,
  useRef,
  useState,
} from "react";

const IncomingCall = ({
  call,
  socket,
  onClose,
}) => {
  const [status, setStatus] =
    useState("Incoming Call");

  const peerRef = useRef(null);

  const localStreamRef =
    useRef(null);

  const localVideoRef =
    useRef(null);

  const remoteVideoRef =
    useRef(null);

  const remoteAudioRef =
    useRef(null);

  const pendingIceCandidatesRef =
    useRef([]);

  // =====================================
  // BACKEND URL
  // =====================================

  const API =
    "https://sapta-vachan-backend.onrender.com";

  // =====================================
  // CALL TYPE
  // =====================================

  const isVideoCall =
    call?.callType === "video";

  // =====================================
  // IMAGE
  // =====================================

  const getImage = () => {
    if (!call?.callerImage) {
      return "https://i.pravatar.cc/150";
    }

    if (
      call.callerImage.startsWith("http")
    ) {
      return call.callerImage;
    }

    return `${API}/upload/${call.callerImage}`;
  };

  // =====================================
  // ADD PENDING ICE
  // =====================================

  const addPendingIceCandidates = () => {
    if (
      !peerRef.current ||
      !peerRef.current.remoteDescription
    ) {
      return Promise.resolve();
    }

    const candidates =
      pendingIceCandidatesRef.current;

    console.log(
      "🧊 ADDING BUFFERED ICE:",
      candidates.length
    );

    let promise = Promise.resolve();

    candidates.forEach((candidate) => {
      promise = promise
        .then(() => {
          if (!peerRef.current) {
            return;
          }

          return peerRef.current
            .addIceCandidate(
              new RTCIceCandidate(
                candidate
              )
            );
        })
        .then(() => {
          console.log(
            "✅ BUFFERED ICE ADDED"
          );
        })
        .catch((error) => {
          console.log(
            "❌ BUFFERED ICE ERROR:",
            error
          );
        });
    });

    pendingIceCandidatesRef.current =
      [];

    return promise;
  };

  // =====================================
  // CLEANUP
  // =====================================

  const cleanup = () => {
    console.log(
      "🧹 CLEANING INCOMING CALL"
    );

    // Stop microphone/camera
    if (localStreamRef.current) {
      localStreamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      localStreamRef.current = null;
    }

    // Close peer
    if (peerRef.current) {
      peerRef.current.close();

      peerRef.current = null;
    }

    // Clear local video
    if (localVideoRef.current) {
      localVideoRef.current.srcObject =
        null;
    }

    // Clear remote video
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject =
        null;
    }

    // Clear remote audio
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject =
        null;
    }

    pendingIceCandidatesRef.current =
      [];
  };

  // =====================================
  // ICE LISTENER
  // =====================================

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleIceCandidate =
      (data) => {
        if (!data?.candidate) {
          return;
        }

        console.log(
          "🧊 INCOMING ICE RECEIVED"
        );

        // Peer not created yet
        if (!peerRef.current) {
          console.log(
            "🧊 PEER NOT READY - BUFFERING"
          );

          pendingIceCandidatesRef.current.push(
            data.candidate
          );

          return;
        }

        // Remote description already set
        if (
          peerRef.current
            .remoteDescription
            ?.type
        ) {
          peerRef.current
            .addIceCandidate(
              new RTCIceCandidate(
                data.candidate
              )
            )
            .then(() => {
              console.log(
                "✅ INCOMING ICE ADDED"
              );
            })
            .catch((error) => {
              console.log(
                "❌ ICE ERROR:",
                error
              );
            });
        } else {
          console.log(
            "🧊 REMOTE DESCRIPTION NOT READY"
          );

          pendingIceCandidatesRef.current.push(
            data.candidate
          );
        }
      };

    socket.on(
      "ice-candidate",
      handleIceCandidate
    );

    return () => {
      socket.off(
        "ice-candidate",
        handleIceCandidate
      );
    };
  }, [socket]);

  // =====================================
  // ACCEPT CALL
  // =====================================

  const acceptCall = () => {
    if (!socket) {
      console.log(
        "❌ SOCKET NOT AVAILABLE"
      );

      return;
    }

    if (!socket.connected) {
      console.log(
        "❌ SOCKET NOT CONNECTED"
      );

      return;
    }

    if (!call?.offer) {
      console.log(
        "❌ OFFER NOT FOUND"
      );

      return;
    }

    setStatus(
      "Connecting..."
    );

    console.log(
      "================================"
    );

    console.log(
      "📞 ACCEPTING CALL"
    );

    console.log(
      "📞 CALL TYPE:",
      call.callType
    );

    console.log(
      "================================"
    );

    // =====================================
    // MEDIA
    // =====================================

    navigator.mediaDevices
      .getUserMedia({
        audio: true,

        // Voice = false
        // Video = true
        video: isVideoCall,
      })

      .then((stream) => {
        console.log(
          "🎙️ MICROPHONE CONNECTED"
        );

        if (isVideoCall) {
          console.log(
            "📹 CAMERA CONNECTED"
          );
        } else {
          console.log(
            "📞 VOICE CALL - CAMERA OFF"
          );
        }

        localStreamRef.current =
          stream;

        // =================================
        // LOCAL VIDEO
        // =================================

        if (
          isVideoCall &&
          localVideoRef.current
        ) {
          localVideoRef.current.srcObject =
            stream;
        }

        // =================================
        // CREATE PEER
        // =================================

        const peer =
          new RTCPeerConnection({
            iceServers: [
              {
                urls:
                  "stun:stun.l.google.com:19302",
              },
            ],
          });

        peerRef.current = peer;

        // =================================
        // ADD TRACKS
        // =================================

        stream
          .getTracks()
          .forEach((track) => {
            peer.addTrack(
              track,
              stream
            );
          });

        // =================================
        // REMOTE TRACK
        // =================================

        peer.ontrack = (event) => {
          console.log(
            "🎧 REMOTE TRACK RECEIVED"
          );

          const remoteStream =
            event.streams[0];

          if (!remoteStream) {
            return;
          }

          // VIDEO
          if (
            isVideoCall &&
            remoteVideoRef.current
          ) {
            remoteVideoRef.current.srcObject =
              remoteStream;

            console.log(
              "📹 REMOTE VIDEO ATTACHED"
            );
          }

          // VOICE
          if (
            !isVideoCall &&
            remoteAudioRef.current
          ) {
            remoteAudioRef.current.srcObject =
              remoteStream;

            console.log(
              "🔊 REMOTE AUDIO ATTACHED"
            );
          }
        };

        // =================================
        // ICE
        // =================================

        peer.onicecandidate =
          (event) => {
            if (
              event.candidate &&
              socket.connected
            ) {
              console.log(
                "🧊 SENDING ICE TO CALLER"
              );

              socket.emit(
                "ice-candidate",
                {
                  receiverId:
                    String(
                      call.callerId
                    ),

                  candidate:
                    event.candidate,
                }
              );
            }
          };

        // =================================
        // CONNECTION STATE
        // =================================

        peer.onconnectionstatechange =
          () => {
            console.log(
              "🌐 WEBRTC:",
              peer.connectionState
            );

            if (
              peer.connectionState ===
              "connected"
            ) {
              setStatus(
                "Connected"
              );
            }

            if (
              peer.connectionState ===
              "connecting"
            ) {
              setStatus(
                "Connecting..."
              );
            }

            if (
              peer.connectionState ===
                "disconnected" ||
              peer.connectionState ===
                "failed"
            ) {
              setStatus(
                "Connection failed"
              );
            }

            if (
              peer.connectionState ===
              "closed"
            ) {
              setStatus(
                "Call ended"
              );
            }
          };

        // =================================
        // SET REMOTE OFFER
        // =================================

        return peer
          .setRemoteDescription(
            new RTCSessionDescription(
              call.offer
            )
          )

          // =================================
          // ADD BUFFERED ICE
          // =================================

          .then(() => {
            console.log(
              "✅ REMOTE OFFER SET"
            );

            return addPendingIceCandidates();
          })

          // =================================
          // CREATE ANSWER
          // =================================

          .then(() => {
            return peer.createAnswer();
          })

          // =================================
          // SET LOCAL ANSWER
          // =================================

          .then((answer) => {
            return peer.setLocalDescription(
              answer
            );
          })

          // =================================
          // SEND ANSWER
          // =================================

          .then(() => {
            socket.emit(
              "call-accepted",
              {
                callerId:
                  String(
                    call.callerId
                  ),

                answer:
                  peer.localDescription,
              }
            );

            console.log(
              "📤 ANSWER SENT"
            );

            setStatus(
              "Connecting..."
            );
          });
      })

      .catch((error) => {
        console.log(
          "❌ ACCEPT CALL ERROR:",
          error
        );

        cleanup();

        if (
          error.name ===
          "NotAllowedError"
        ) {
          setStatus(
            isVideoCall
              ? "Camera/Microphone permission denied"
              : "Microphone permission denied"
          );

          return;
        }

        if (
          error.name ===
          "NotFoundError"
        ) {
          setStatus(
            isVideoCall
              ? "Camera or microphone not found"
              : "Microphone not found"
          );

          return;
        }

        setStatus(
          "Unable to connect call"
        );
      });
  };

  // =====================================
  // REJECT CALL
  // =====================================

  const rejectCall = () => {
    console.log(
      "❌ REJECTING CALL"
    );

    if (
      socket &&
      socket.connected
    ) {
      socket.emit(
        "call-rejected",
        {
          callerId:
            String(
              call.callerId
            ),
        }
      );
    }

    cleanup();

    onClose();
  };

  // =====================================
  // END CALL
  // =====================================

  const endCall = () => {
    console.log(
      "📴 ENDING CALL"
    );

    if (
      socket &&
      socket.connected
    ) {
      socket.emit(
        "call-ended",
        {
          receiverId:
            String(
              call.callerId
            ),
        }
      );
    }

    cleanup();

    onClose();
  };

  // =====================================
  // UI
  // =====================================

  return (
    <div
      className={
        isVideoCall
          ? "incoming-call-popup incoming-video-popup"
          : "incoming-call-popup incoming-voice-popup"
      }
    >

      {/* ================================= */}
      {/* VIDEO CALL */}
      {/* ================================= */}

      {isVideoCall && (
        <div className="incoming-video-area">

          {/* REMOTE VIDEO */}

          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
          />

          {/* CALLER INFO */}

          {status !== "Connected" && (
            <div className="incoming-video-user">

              <img
                src={getImage()}
                alt={
                  call?.callerName ||
                  "User"
                }
              />

              <h2>
                {call?.callerName ||
                  "Someone"}
              </h2>

              <p>
                {status}
              </p>

            </div>
          )}

          {/* LOCAL VIDEO */}

          <div className="incoming-my-video">

            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
            />

          </div>

        </div>
      )}

      {/* ================================= */}
      {/* VOICE CALL */}
      {/* ================================= */}

      {!isVideoCall && (
        <div className="incoming-voice-area">

          <div className="voice-call-icon">
            📞
          </div>

          <img
            className="voice-caller-image"
            src={getImage()}
            alt={
              call?.callerName ||
              "User"
            }
          />

          <h2>
            {call?.callerName ||
              "Someone"}
          </h2>

          <p className="voice-call-status">
            {status}
          </p>

          {/* REMOTE AUDIO */}

          <audio
            ref={remoteAudioRef}
            autoPlay
          />

        </div>
      )}

      {/* ================================= */}
      {/* ACCEPT / REJECT */}
      {/* ================================= */}

      {status ===
        "Incoming Call" && (
        <div className="incoming-popup-actions">

          <button
            className="incoming-reject-btn"
            onClick={rejectCall}
            title="Reject"
          >
            ❌
          </button>

          <button
            className="incoming-accept-btn"
            onClick={acceptCall}
            title={
              isVideoCall
                ? "Accept Video Call"
                : "Accept Voice Call"
            }
          >
            {isVideoCall
              ? "📹"
              : "📞"}
          </button>

        </div>
      )}

      {/* ================================= */}
      {/* END CALL */}
      {/* ================================= */}

      {status === "Connected" && (
        <button
          className="incoming-end-btn"
          onClick={endCall}
          title="End Call"
        >
          ☎️
        </button>
      )}

    </div>
  );
};

export default IncomingCall;