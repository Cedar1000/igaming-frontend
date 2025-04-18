// App.tsx or App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';

import Login from './pages/login/Login';
import SignUp from './pages/signup/Signup';
import Session from './pages/session/Session';
import Leaderboard from './pages/leader-board/Leaderboard';

import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          {/* <Route path="/home" element={<Home />} /> */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/session" element={<Session />} />
          <Route path="/leaderboard" element={<Leaderboard />} />

          {/* fallback 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
