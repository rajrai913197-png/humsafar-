import { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";

const VoiceCall = ({ user, socket, onClose }) => {

  const [callStatus, setCallStatus] =
    useState("Calling...");

  const [muted, setMuted] =
    useState(false);

  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteAudioRef = useRef(null);

  // ICE candidates jo remote description se pehle aa jaye
  const pendingIceCandidatesRef =
    useRef([]);

  const token =
    localStorage.getItem("token");

  let decoded = null;

  if (token) {
    try {
      decoded = jwtDecode(token);
    } catch (error) {
      console.log("TOKEN ERROR:", error);
    }
  }

  const myId = decoded?.userId;
  const receiverId = user?._id;

  // =====================================
  // BACKEND URL
  // =====================================

  const API =
    "https://sapta-vachan-backend.onrender.com";

  // =====================================
  // IMAGE
  // =====================================

  const getImage = (person) => {

    if (!person?.image) {
      return "https://i.pravatar.cc/150";
    }

    if (person.image.startsWith("http")) {
      return person.image;
    }

    return `${API}/upload/${person.image}`;
  };

  // =====================================
  // CREATE PEER
  // =====================================

  const createPeer = () => {

    console.log("🔵 CREATING PEER");

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
    // ICE CANDIDATE
    // =================================

    peer.onicecandidate = (event) => {

      if (
        event.candidate &&
        socket &&
        socket.connected
      ) {

        console.log(
          "🧊 SENDING ICE TO:",
          receiverId
        );

        socket.emit(
          "ice-candidate",
          {
            receiverId:
              String(receiverId),

            candidate:
              event.candidate,
          }
        );
      }
    };

    // =================================
    // REMOTE AUDIO
    // =================================

    peer.ontrack = (event) => {

      console.log(
        "🎤 REMOTE AUDIO RECEIVED"
      );

      const remoteStream =
        event.streams[0];

      if (!remoteStream) {
        return;
      }

      if (remoteAudioRef.current) {

        remoteAudioRef.current.srcObject =
          remoteStream;

        remoteAudioRef.current
          .play()
          .then(() => {

            console.log(
              "🔊 REMOTE AUDIO PLAYING"
            );

          })
          .catch((error) => {

            console.log(
              "🔊 AUDIO PLAY ERROR:",
              error
            );

          });
      }
    };

    // =================================
    // CONNECTION STATE
    // =================================

    peer.onconnectionstatechange = () => {

      console.log(
        "🌐 WEBRTC STATE:",
        peer.connectionState
      );

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
          "failed" ||
        peer.connectionState ===
          "disconnected"
      ) {

        console.log(
          "❌ WEBRTC CONNECTION LOST"
        );
      }
    };

    return peer;
  };

  // =====================================
  // START CALL
  // =====================================

  const startCall = async () => {

    try {

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

      if (!receiverId) {

        console.log(
          "❌ RECEIVER ID NOT FOUND"
        );

        return;
      }

      setCallStatus(
        "Connecting..."
      );

      console.log(
        "📞 STARTING VOICE CALL"
      );

      console.log(
        "MY ID:",
        myId
      );

      console.log(
        "RECEIVER ID:",
        receiverId
      );

      // =================================
      // MICROPHONE
      // =================================

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });

      localStreamRef.current =
        stream;

      console.log(
        "🎤 MICROPHONE READY"
      );

      // =================================
      // PEER
      // =================================

      const peer =
        createPeer();

      // =================================
      // ADD AUDIO TRACK
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
      // CREATE OFFER
      // =================================

      const offer =
        await peer.createOffer();

      await peer.setLocalDescription(
        offer
      );

      console.log(
        "📨 OFFER CREATED"
      );

      // =================================
      // SEND CALL
      // =================================

      socket.emit(
        "call-user",
        {
          receiverId:
            String(receiverId),

          callerName:
            decoded?.name ||
            "User",

          callerImage:
            decoded?.image ||
            "",

          callType:
            "voice",

          offer:
            peer.localDescription,
        }
      );

      console.log(
        "📞 CALL SENT"
      );

      setCallStatus(
        "Calling..."
      );

    } catch (error) {

      console.log(
        "❌ MICROPHONE ERROR:",
        error
      );

      if (
        error.name ===
        "NotAllowedError"
      ) {

        setCallStatus(
          "Microphone permission denied"
        );

      } else {

        setCallStatus(
          "Unable to start call"
        );
      }
    }
  };

  // =====================================
  // ADD PENDING ICE
  // =====================================

  const addPendingIceCandidates =
    async () => {

      if (
        !peerRef.current ||
        !peerRef.current.remoteDescription
      ) {
        return;
      }

      console.log(
        "🧊 ADDING BUFFERED ICE:",
        pendingIceCandidatesRef.current.length
      );

      for (
        const candidate
        of pendingIceCandidatesRef.current
      ) {

        try {

          await peerRef.current
            .addIceCandidate(
              new RTCIceCandidate(
                candidate
              )
            );

        } catch (error) {

          console.log(
            "❌ BUFFERED ICE ERROR:",
            error
          );
        }
      }

      pendingIceCandidatesRef.current =
        [];
    };

  // =====================================
  // CLEANUP
  // =====================================

  const cleanup = () => {

    console.log(
      "🧹 CLEANING VOICE CALL"
    );

    // Stop microphone

    if (
      localStreamRef.current
    ) {

      localStreamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      localStreamRef.current =
        null;
    }

    // Close WebRTC

    if (peerRef.current) {

      peerRef.current.close();

      peerRef.current =
        null;
    }

    pendingIceCandidatesRef.current =
      [];

    setMuted(false);
  };

  // =====================================
  // SOCKET EVENTS
  // =====================================

  useEffect(() => {

    if (!socket) {

      console.log(
        "❌ VOICE CALL SOCKET MISSING"
      );

      return;
    }

    console.log(
      "📞 VOICE CALL USING CHAT SOCKET"
    );

    // =================================
    // CALL ACCEPTED
    // =================================

    const handleCallAccepted =
      async (data) => {

        try {

          console.log(
            "✅ CALL ACCEPTED:",
            data
          );

          if (
            !peerRef.current
          ) {

            console.log(
              "❌ PEER NOT FOUND"
            );

            return;
          }

          if (
            !data?.answer
          ) {

            console.log(
              "❌ ANSWER NOT FOUND"
            );

            return;
          }

          // Set remote answer

          await peerRef.current
            .setRemoteDescription(
              new RTCSessionDescription(
                data.answer
              )
            );

          console.log(
            "✅ REMOTE ANSWER SET"
          );

          // Add buffered ICE

          await addPendingIceCandidates();

          setCallStatus(
            "Connected"
          );

        } catch (error) {

          console.log(
            "❌ ANSWER ERROR:",
            error
          );

          setCallStatus(
            "Unable to connect"
          );
        }
      };

    // =================================
    // ICE RECEIVED
    // =================================

    const handleIceCandidate =
      async (data) => {

        try {

          if (
            !data?.candidate
          ) {
            return;
          }

          if (
            !peerRef.current
          ) {

            console.log(
              "🧊 PEER NOT READY"
            );

            return;
          }

          // Remote description available

          if (
            peerRef.current
              .remoteDescription
              ?.type
          ) {

            await peerRef.current
              .addIceCandidate(
                new RTCIceCandidate(
                  data.candidate
                )
              );

            console.log(
              "✅ ICE CANDIDATE ADDED"
            );

          } else {

            // Buffer ICE

            console.log(
              "🧊 BUFFERING ICE"
            );

            pendingIceCandidatesRef.current
              .push(
                data.candidate
              );
          }

        } catch (error) {

          console.log(
            "❌ ICE ERROR:",
            error
          );
        }
      };

    // =================================
    // CALL REJECTED
    // =================================

    const handleCallRejected =
      () => {

        console.log(
          "❌ CALL REJECTED"
        );

        setCallStatus(
          "Call rejected"
        );

        setTimeout(() => {

          cleanup();

          onClose();

        }, 1500);
      };

    // =================================
    // CALL ENDED
    // =================================

    const handleCallEnded =
      () => {

        console.log(
          "📴 CALL ENDED BY OTHER USER"
        );

        setCallStatus(
          "Call ended"
        );

        setTimeout(() => {

          cleanup();

          onClose();

        }, 500);
      };

    // =================================
    // REGISTER EVENTS
    // =================================

    socket.on(
      "call-accepted",
      handleCallAccepted
    );

    socket.on(
      "ice-candidate",
      handleIceCandidate
    );

    socket.on(
      "call-rejected",
      handleCallRejected
    );

    socket.on(
      "call-ended",
      handleCallEnded
    );

    // =================================
    // START CALL
    // =================================

    if (socket.connected) {

      startCall();

    } else {

      console.log(
        "⏳ WAITING FOR SOCKET..."
      );

      socket.once(
        "connect",
        startCall
      );
    }

    // =================================
    // CLEANUP SOCKET LISTENERS
    // =================================

    return () => {

      socket.off(
        "call-accepted",
        handleCallAccepted
      );

      socket.off(
        "ice-candidate",
        handleIceCandidate
      );

      socket.off(
        "call-rejected",
        handleCallRejected
      );

      socket.off(
        "call-ended",
        handleCallEnded
      );

      socket.off(
        "connect",
        startCall
      );
    };

  }, [socket, receiverId]);

  // =====================================
  // MUTE
  // =====================================

  const toggleMute = () => {

    if (
      !localStreamRef.current
    ) {
      return;
    }

    const audioTrack =
      localStreamRef.current
        .getAudioTracks()[0];

    if (!audioTrack) {
      return;
    }

    audioTrack.enabled =
      !audioTrack.enabled;

    setMuted(
      !audioTrack.enabled
    );

    console.log(
      audioTrack.enabled
        ? "🎤 UNMUTED"
        : "🔇 MUTED"
    );
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
            String(receiverId),
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

    <div className="call-component">

      {/* REMOTE AUDIO */}

      <audio
        ref={remoteAudioRef}
        autoPlay
      />

      {/* USER */}

      <div className="call-profile">

        <div className="voice-call-image">

          <img
            src={getImage(user)}
            alt={
              user?.name ||
              "User"
            }
          />

          <span className="voice-online-dot"></span>

        </div>

        <h2>
          {user?.name ||
            "User"}
        </h2>

        <p>
          {callStatus}
        </p>

      </div>

      {/* ACTIONS */}

      <div className="call-actions">

        {/* MUTE */}

        <button
          className="call-control"
          onClick={
            toggleMute
          }
          title={
            muted
              ? "Unmute"
              : "Mute"
          }
        >

          {muted
            ? "🔇"
            : "🎤"}

        </button>

        {/* END */}

        <button
          className="end-call"
          onClick={
            endCall
          }
          title="End Call"
        >

          📞

        </button>

      </div>

    </div>
  );
};

export default VoiceCall;