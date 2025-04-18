import React, { useState } from 'react';
import './Session.css';

import Result from './Result';
import JoinSession from './JoinSession';
import ActiveSession from './ActiveSession';

export default function Session() {
  const [mode, setMode] = useState('join-session');
  const [session, setSession] = useState(null);
  const [correctNumber, setCorrectNumber] = useState(null);
  const [totalPlayers, setTotalPlayers] = useState(null);
  const [totalWins, setTotalWins] = useState(null);
  const [winners, setWinners] = useState([]);

  const modes = {
    'join-session': (
      <JoinSession setMode={setMode} setActiveSession={setSession} />
    ),
    'active-session': (
      <ActiveSession
        session={session}
        setSession={setSession}
        setMode={setMode}
        setCorrectNumber={setCorrectNumber}
        setTotalPlayers={setTotalPlayers}
        setTotalWins={setTotalWins}
        setWinners={setWinners}
      />
    ),
    result: (
      <Result
        correctNumber={correctNumber}
        totalPlayers={totalPlayers}
        totalWins={totalWins}
        winners={winners}
        session={session}
        setMode={setMode}
        setActiveSession={setSession}
      />
    ),
  };

  return <div>{modes[mode]}</div>;
}
