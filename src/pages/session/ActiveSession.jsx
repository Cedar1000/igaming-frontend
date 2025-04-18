import React, { useContext, useEffect, useRef, useState } from 'react';
import './ActiveSession.css';
import getTimeDifferenceInSeconds from '../../utils/getDifferenceInSeconds';
import { io } from 'socket.io-client';
import { AuthContext } from '../../context/AuthContext';

export default function ActiveSession({
  session,
  setSession,
  setMode,
  setCorrectNumber,
  setTotalPlayers,
  setTotalWins,
  setWinners,
}) {
  const { user } = useContext(AuthContext);
  const [timeLeft, setTimeLeft] = useState(60);
  const [number, setNumber] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(process.env.REACT_APP_BASE_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to socket.io server (active session)');
    });

    socket.on('number-picked', (data) => {
      setIsLoading(false);
      setSession(data.session);
    });

    socket.on('user-joined', (data) => {
      setSession(data.session);
    });

    socket.on('new-session', (data) => {
      console.log('Session has ended', data);
      setCorrectNumber(data.result);
      setTotalPlayers(data.totalPlayers);
      setTotalWins(data.winners.length);
      setWinners(data.winners);
      setSession(data.newSession);
      setMode('result');
    });

    return () => {
      socket.disconnect();
      console.log('Socket disconnected (active session)');
    };
  }, []);

  useEffect(() => {
    const endTime = new Date(session.endTime).getTime();
    const now = new Date().getTime();

    const differenceInSeconds = getTimeDifferenceInSeconds(
      new Date(endTime),
      new Date(now)
    );

    setTimeLeft(differenceInSeconds);

    if (differenceInSeconds <= 0) {
      setTimeLeft(0);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session.endTime]);

  const handleNumberChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1 && value <= 10) {
      setNumber(value);
    } else if (e.target.value === '') {
      setNumber('');
    }
  };

  const handleSubmit = () => {
    setIsLoading(true);
    if (!number || !socketRef.current) return;

    socketRef.current.emit('number-pick', {
      userId: user.id,
      sessionId: session.id,
      number,
    });

    console.log(`User ${user.username} submitted number:`, number);
  };

  return (
    <div className="session-wrapper">
      <div className="countdown-timer">Time Left: {timeLeft}s</div>

      <div className="session-content">
        <h2>Pick a number from 1 - 10</h2>

        <input
          type="number"
          value={number}
          onChange={handleNumberChange}
          min="1"
          max="10"
          className="number-input"
        />

        <button className="join-button" onClick={handleSubmit}>
          {isLoading ? 'Loading...' : 'Submit'}
        </button>

        <p className="joined-info">
          {session.playerCount} joined, {session.responseCount} responded
        </p>

        <p className="user-info">
          Logged in as: <strong>{user?.username}</strong>
        </p>
      </div>
    </div>
  );
}
