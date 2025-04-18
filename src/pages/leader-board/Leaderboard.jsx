import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { Link } from 'react-router-dom';
import './Leaderboard.css'; // optional for styling

export default function Leaderboard() {
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const response = await axios.get(
          '/auth/users?sort=desc-totalWins&limit=10'
        );
        setTopUsers(response.data.data); // adjust if structure is different
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopUsers();
  }, []);

  return (
    <div className="leaderboard-wrapper">
      <div className="leaderboard-header">
        <h2>Top 10 Users</h2>
        <Link to="/session" className="back-link">
          ← Back to Dashboard
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ol className="leaderboard-list">
          {topUsers.map((user, index) => (
            <li key={user.username} className="leaderboard-item">
              <span className="rank">#{index + 1}</span>
              <span className="username">{user.username}</span>
              <span className="wins">{user.totalWins} Wins</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
