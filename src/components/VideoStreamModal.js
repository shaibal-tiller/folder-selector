// src/components/VideoStreamModal.js
import React, { useEffect, useState, useRef } from 'react';
import '../styles/customModal.css';

const VideoStreamModal = ({ isOpen, onClose }) => {
  const [videoStream, setVideoStream] = useState(null);
  const videoRef = useRef(null);
  const webSocketUrl = process.env.REACT_APP_WEBSOCKET_URL;

  useEffect(() => {
    let socket;
    if (isOpen && webSocketUrl) {
      socket = new WebSocket(webSocketUrl);
      socket.binaryType = 'arraybuffer';

      socket.onmessage = (event) => {
        const blob = new Blob([event.data], { type: 'video/mp4' });
        const url = URL.createObjectURL(blob);
        setVideoStream(url);
      };

      socket.onerror = (error) => {
        console.error('WebSocket Error:', error);
      };

      socket.onclose = () => {
        console.log('WebSocket Closed');
      };
    }

    return () => {
      if (socket) {
        socket.close();
      }
      if (videoStream) {
        URL.revokeObjectURL(videoStream);
      }
    };
  }, [isOpen, webSocketUrl, videoStream]);

  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.src = videoStream;
    }
  }, [videoStream]);

  if (!isOpen) return null;

  return (
    <div className="custom-modal-overlay" onClick={onClose}>
      <div className="custom-modal-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="custom-close-button">Close</button>
        <video ref={videoRef} controls autoPlay />
      </div>
    </div>
  );
};

export default VideoStreamModal;
