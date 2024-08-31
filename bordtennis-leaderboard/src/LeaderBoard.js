import UpdateScore from './UpdateScore';
import React, { useState } from 'react';
function Leaderboard() {
  const [spillerData, setSpillerData] = useState({
    // ... initial data for spillere
  });

  const handleUpdateScore = (spillerId, result) => {
    const spiller = spillerData.find(s => s.id === spillerId);
    setSpillerData(prevData => prevData.map(s => s.id === spillerId ? { ...s, matchesWon: spiller.matchesWon + (result === 'win' ? 1 : 0), matchesLost: spiller.matchesLost + (result === 'lose' ? 1 : 0) } : s));
  };

  return (
    <div>
      {/* ... resten av Leaderboard-komponenten */}
      <UpdateScore
        spiller="spiller1"
        setKamperVunnet={(newValue) => handleUpdateScore('spiller1', 'win', newValue)}
        setKamperTapt={(newValue) => handleUpdateScore('spiller1', 'lose', newValue)}
      />
    </div>
  );
}
export default Leaderboard;
