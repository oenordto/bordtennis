import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Leaderboard from './LeaderBoard';
import Stats from './Stats';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Leaderboard />} />
        <Route path="/Stats" element={<Stats />} />
      </Routes>
    </Router>
  );
}

export default App;