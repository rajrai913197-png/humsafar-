import {
  useEffect,
  useRef,
  useState,
} from "react";

const VideoCall = ({
  user,
  socket,
  myId,
  onClose,
}) => {
  const localVideoRef =
    useRef(null);

  const remoteVideoRef =
    useRef(null);

  const peerRef =
    useRef(null);

  const localStreamRef =
    useRef(null);

  const pendingIceRef =
    useRef([]);

  const [muted, setMuted] =
    useState(false);

  const [cameraOff, setCameraOff] =
    useState(false);

  const [callStatus, setCallStatus] =
    useState("Starting camera...");

  // =====================================
  // IMAGE
  // =====================================

  const getImage = (person) => {
    if (!person?.image) {
      return "https://i.pravatar.cc/150";
    }

    if (
      person.image.startsWith("http")
    ) {
      return person.image;
    }

    return `http://localhost:3300/upload/${person.image}`;
  };

  // =====================================
  // CLEANUP
  // =====================================

  const cleanupCall = () => {
    console.log("🧹 CLEANING VIDEO CALL");

    if (localStreamRef.current) {
      localStreamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      localStreamRef.current = null;
    }

    if (peerRef.current) {
      peerRef.current.close();

      peerRef.current = null;
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject =
        null;
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject =
        null;
    }

    pendingIceRef.current = [];
  };

  // =====================================
  // CREATE PEER
  // =====================================

  const createPeer = (stream) => {
    console.log(
      "🌐 CREATING VIDEO PEER"
    );

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

    // -------------------------------
    // LOCAL TRACKS
    // -------------------------------

    stream
      .getTracks()
      .forEach((track) => {
        peer.addTrack(
          track,
          stream
        );
      });

    // -------------------------------
    // REMOTE STREAM
    // -------------------------------

    peer.ontrack = (event) => {
      console.log(
        "🎥 REMOTE VIDEO RECEIVED"
      );

      const remoteStream =
        event.streams[0];

      if (
        remoteStream &&
        remoteVideoRef.current
      ) {
        remoteVideoRef.current.srcObject =
          remoteStream;

        remoteVideoRef.current
          .play()
          .catch(() => {});

        setCallStatus(
          "Connected"
        );
      }
    };

    // -------------------------------
    // ICE
    // -------------------------------

    peer.onicecandidate =
      (event) => {
        if (
          event.candidate &&
          socket?.connected &&
          user?._id
        ) {
          console.log(
            "🧊 SENDING ICE"
          );

          socket.emit(
            "ice-candidate",
            {
              receiverId:
                String(user._id),

              candidate:
                event.candidate,
            }
          );
        }
      };

    // -------------------------------
    // CONNECTION STATE
    // -------------------------------

    peer.onconnectionstatechange =
      () => {
        console.log(
          "🌐 CONNECTION:",
          peer.connectionState
        );

        if (
          peer.connectionState ===
          "connecting"
        ) {
          setCallStatus(
            "Connecting..."
          );
        }

        if (
          peer.connectionState ===
          "connected"
        ) {
          setCallStatus(
            "Connected"
          );
        }

        if (
          peer.connectionState ===
          "disconnected"
        ) {
          setCallStatus(
            "Disconnected"
          );
        }

        if (
          peer.connectionState ===
          "failed"
        ) {
          setCallStatus(
            "Connection failed"
          );
        }
      };

    return peer;
  };

  // =====================================
  // START CAMERA + CALL
  // =====================================

  useEffect(() => {
    if (!socket) {
      console.log(
        "❌ SOCKET NOT AVAILABLE"
      );

      return;
    }

    if (!user?._id) {
      console.log(
        "❌ RECEIVER ID NOT FOUND"
      );

      return;
    }

    console.log(
      "📹 STARTING VIDEO CALL"
    );

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })

      .then((stream) => {
        console.log(
          "✅ CAMERA + MIC READY"
        );

        localStreamRef.current =
          stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject =
            stream;

          localVideoRef.current
            .play()
            .catch(() => {});
        }

        const peer =
          createPeer(stream);

        // =================================
        // CREATE OFFER
        // =================================

        return peer
          .createOffer()
          .then((offer) => {
            return peer.setLocalDescription(
              offer
            );
          })

          // =================================
          // SEND CALL
          // =================================

          .then(() => {
            console.log(
              "📤 SENDING VIDEO CALL"
            );

            socket.emit(
              "call-user",
              {
                receiverId:
                  String(user._id),

                callerName:
                  user?.name ||
                  "Someone",

                callerImage:
                  user?.image || "",

                callType:
                  "video",

                offer:
                  peer.localDescription,
              }
            );

            setCallStatus(
              "Calling..."
            );
          });
      })

      .catch((error) => {
        console.log(
          "❌ CAMERA ERROR:",
          error
        );

        if (
          error.name ===
          "NotAllowedError"
        ) {
          setCallStatus(
            "Camera/Microphone permission denied"
          );
        } else if (
          error.name ===
          "NotFoundError"
        ) {
          setCallStatus(
            "Camera or microphone not found"
          );
        } else {
          setCallStatus(
            "Unable to start video call"
          );
        }
      });

    // =====================================
    // COMPONENT CLEANUP
    // =====================================

    return () => {
      cleanupCall();
    };
  }, []);

  // =====================================
  // CALL ACCEPTED
  // =====================================

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleCallAccepted =
      (data) => {
        console.log(
          "✅ VIDEO CALL ACCEPTED"
        );

        if (!data?.answer) {
          console.log(
            "❌ ANSWER NOT FOUND"
          );

          return;
        }

        const peer =
          peerRef.current;

        if (!peer) {
          console.log(
            "❌ PEER NOT FOUND"
          );

          return;
        }

        peer
          .setRemoteDescription(
            new RTCSessionDescription(
              data.answer
            )
          )

          .then(() => {
            console.log(
              "✅ REMOTE ANSWER SET"
            );

            setCallStatus(
              "Connecting..."
            );

            return addPendingIce();
          })

          .catch((error) => {
            console.log(
              "❌ ANSWER ERROR:",
              error
            );
          });
      };

    socket.on(
      "call-accepted",
      handleCallAccepted
    );

    return () => {
      socket.off(
        "call-accepted",
        handleCallAccepted
      );
    };
  }, [socket]);

  // =====================================
  // ICE CANDIDATE
  // =====================================

  const addPendingIce = () => {
    if (
      !peerRef.current ||
      !peerRef.current.remoteDescription
    ) {
      return Promise.resolve();
    }

    const candidates =
      pendingIceRef.current;

    pendingIceRef.current = [];

    let chain =
      Promise.resolve();

    candidates.forEach(
      (candidate) => {
        chain = chain
          .then(() => {
            return peerRef.current
              ?.addIceCandidate(
                new RTCIceCandidate(
                  candidate
                )
              );
          })
          .catch((error) => {
            console.log(
              "❌ BUFFER ICE ERROR:",
              error
            );
          });
      }
    );

    return chain;
  };

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleIceCandidate =
      (data) => {
        if (!data?.candidate) {
          return;
        }

        const peer =
          peerRef.current;

        if (!peer) {
          console.log(
            "🧊 PEER NOT READY - BUFFER ICE"
          );

          pendingIceRef.current.push(
            data.candidate
          );

          return;
        }

        if (
          peer.remoteDescription
            ?.type
        ) {
          peer
            .addIceCandidate(
              new RTCIceCandidate(
                data.candidate
              )
            )

            .then(() => {
              console.log(
                "✅ ICE ADDED"
              );
            })

            .catch((error) => {
              console.log(
                "❌ ICE ERROR:",
                error
              );
            });
        } else {
          pendingIceRef.current.push(
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
  // REMOTE END CALL
  // =====================================

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleCallEnded =
      () => {
        console.log(
          "📴 OTHER USER ENDED CALL"
        );

        cleanupCall();

        onClose();
      };

    socket.on(
      "call-ended",
      handleCallEnded
    );

    return () => {
      socket.off(
        "call-ended",
        handleCallEnded
      );
    };
  }, [socket]);

  // =====================================
  // MUTE
  // =====================================

  const toggleMute = () => {
    const stream =
      localStreamRef.current;

    if (!stream) {
      return;
    }

    const audioTrack =
      stream.getAudioTracks()[0];

    if (!audioTrack) {
      return;
    }

    audioTrack.enabled =
      !audioTrack.enabled;

    setMuted(
      !audioTrack.enabled
    );
  };

  // =====================================
  // CAMERA
  // =====================================

  const toggleCamera = () => {
    const stream =
      localStreamRef.current;

    if (!stream) {
      return;
    }

    const videoTrack =
      stream.getVideoTracks()[0];

    if (!videoTrack) {
      return;
    }

    videoTrack.enabled =
      !videoTrack.enabled;

    setCameraOff(
      !videoTrack.enabled
    );
  };

  // =====================================
  // END CALL
  // =====================================

  const endCall = () => {
    console.log(
      "📴 END VIDEO CALL"
    );

    if (
      socket?.connected &&
      user?._id
    ) {
      socket.emit(
        "call-ended",
        {
          receiverId:
            String(user._id),
        }
      );
    }

    cleanupCall();

    onClose();
  };

  // =====================================
  // UI
  // =====================================

  return (
    <div className="video-call-component">

      {/* REMOTE VIDEO */}

      <div className="remote-video">

        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
        />

        <div className="remote-user">

          <img
            src={getImage(user)}
            alt={
              user?.name || "User"
            }
          />

          <h2>
            {user?.name || "User"}
          </h2>

          <p>
            {callStatus}
          </p>

        </div>

      </div>


      {/* LOCAL VIDEO */}

      <div className="local-video">

        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
        />

      </div>


      {/* STATUS */}

      <div className="call-status">
        {callStatus}
      </div>


      {/* CONTROLS */}

      <div className="call-actions">

        <button
          className={
            `call-control ${
              muted ? "active" : ""
            }`
          }
          onClick={toggleMute}
        >
          {muted
            ? "🔇"
            : "🎤"}
        </button>


        <button
          className={
            `call-control ${
              cameraOff
                ? "active"
                : ""
            }`
          }
          onClick={toggleCamera}
        >
          {cameraOff
            ? "🚫"
            : "📹"}
        </button>


        <button
          className="end-call"
          onClick={endCall}
        >
          ☎️
        </button>

      </div>

    </div>
  );
};

export default VideoCall;