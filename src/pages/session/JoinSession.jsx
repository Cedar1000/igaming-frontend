import React, { useContext, useEffect, useRef, useState } from 'react';
import './Session.css';
import { AuthContext } from '../../context/AuthContext';
import axios from '../../utils/axios';
import getTimeDifferenceInSeconds from '../../utils/getDifferenceInSeconds';
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';

export default function JoinSession({ setMode, setActiveSession }) {
  const { user } = useContext(AuthContext);
  const socketRef = useRef(null);
  const [session, setSession] = useState(null);
  const [showCountdown, setShowCountdown] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const joinSession = async () => {
    const token = localStorage.getItem('token');

    console.log({ user });
    setIsJoining(true); // start loading

    if (socketRef.current) {
      socketRef.current.emit('join-session', {
        token,
        sessionId: session.id,
      });
    }
  };

  useEffect(() => {
    // Connect socket when component mounts
    const socket = io(process.env.REACT_APP_BASE_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to socket.io server');
    });

    socket.on('new-session', (data) => {
      console.log('Session started via socket:', data);
      setSession(data.newSession);
    });

    socket.on('user-joined', (data) => {
      console.log('User joined session:', data);
      setIsJoining(false); // stop loading

      setActiveSession(data.session);

      const token = localStorage.getItem('token');

      console.log(token === data.token);

      if (token === data.token) setMode('active-session');
    });

    return () => {
      socket.disconnect();
      console.log('Socket disconnected');
    };
  }, []);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await axios.get('/session/get-active-session');
        const { data } = response.data;
        console.log({ startTime: new Date(data.startTime), now: new Date() });
        setSession(data);
      } catch (error) {
        console.error('Error fetching active session:', error);
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
    if (!session?.startTime) return;

    let intervalId;
    const startTime = new Date(session.startTime).getTime();
    const now = new Date().getTime();

    if (startTime > now) {
      setShowCountdown(true);
      setShowButton(false);

      const updateTimer = () => {
        const currentTime = new Date().getTime();
        const differenceInSeconds = getTimeDifferenceInSeconds(
          new Date(startTime),
          new Date(currentTime)
        );

        if (differenceInSeconds <= 0) {
          setShowButton(true);
          clearInterval(intervalId);
          setShowCountdown(false);
          setTimeRemaining(0);
          return;
        }
        setTimeRemaining(differenceInSeconds);
      };

      updateTimer();
      intervalId = setInterval(updateTimer, 1000);
    } else {
      setShowCountdown(false);
      setTimeRemaining(0);
      setShowButton(true);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [session]);

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header">
        <span className="leaderboard-link">
          {' '}
          <Link to="/leaderboard">View Top 10 Users</Link>
        </span>
        <span>{user?.username}</span>
      </div>

      <div className="dashboard-content">
        <div className="stats">
          <div className="stat-box">Total Wins: {user?.totalWins ?? 0}</div>
          <div className="stat-box">Total Losses: {user?.totalLosses ?? 0}</div>
        </div>

        {showButton ? (
          <button className="join-button" onClick={() => joinSession()}>
            {isJoining ? 'Joining...' : 'Join'}
          </button>
        ) : null}

        {showCountdown ? (
          <p className="countdown-text">
            New session starts in: {timeRemaining} seconds
          </p>
        ) : null}
      </div>
    </div>
  );
}
