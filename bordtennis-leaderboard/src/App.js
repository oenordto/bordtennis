import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Leaderboard from './LeaderBoard';
import UpdateScore from './UpdateScore';
import AddPlayer from './AddPlayer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Leaderboard />} />
        <Route path="/update-score" element={<UpdateScore />} />
        <Route path="/add-player" element={<AddPlayer />} />
      </Routes>
    </Router>
  );
}

export default App;