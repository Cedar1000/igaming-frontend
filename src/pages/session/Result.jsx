import React, { useEffect, useState } from 'react';
import './Result.css';
import getTimeDifferenceInSeconds from '../../utils/getDifferenceInSeconds';

export default function Result({
  correctNumber,
  totalPlayers,
  totalWins,
  winners,
  session,
  setMode,
}) {
  const [timeLeft, setTimeLeft] = useState(60);
  const [showRedirectButton, setShowRedirectButton] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    const startTime = new Date(session.startTime).getTime();
    const now = new Date().getTime();

    const differenceInSeconds = getTimeDifferenceInSeconds(
      new Date(startTime),
      new Date(now)
    );

    setTimeLeft(differenceInSeconds);

    if (differenceInSeconds <= 0) {
      setTimeLeft(0);
      setShowRedirectButton(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowRedirectButton(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session?.startTime]);

  const handleRedirect = () => {
    setIsJoining(true);
    setMode('join-session');
  };

  return (
    <div className="result-wrapper">
      <div className="result-header">
        <h2>Session Results</h2>
      </div>

      <div className="result-info">
        <p>
          <strong>Correct Number:</strong> {correctNumber}
        </p>
        <p>
          <strong>Total Players:</strong> {totalPlayers}
        </p>
        <p>
          <strong>Total Wins:</strong> {totalWins}
        </p>
      </div>

      <div className="winners-section">
        <h3>Winners</h3>
        <div className="winners-list">
          {winners.length > 0 ? (
            winners.map((winner) => (
              <div key={winner.id} className="winner-item">
                {winner.user.username}
              </div>
            ))
          ) : (
            <p>No winners in this session.</p>
          )}
        </div>

        {showRedirectButton ? (
          <button className="join-button" onClick={handleRedirect}>
            Start New Session
          </button>
        ) : (
          <p className="new-session-info">new session starts in {timeLeft}s</p>
        )}
      </div>
    </div>
  );
}
