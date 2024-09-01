import UpdateScore from './UpdateScore';
import React, { useState } from 'react';
import tabletennis from './resources/tabletennis.jpeg';

function Leaderboard() {
  const [spillerData, setSpillerData] = useState({
    // ... initial data for spillere
  });

  const handleUpdateScore = (spillerId, result) => {
    const spiller = spillerData.find(s => s.id === spillerId);
    setSpillerData(prevData => 
      prevData.map(s => 
        s.id === spillerId 
          ? { 
              ...s, 
              matchesWon: spiller.matchesWon + (result === 'win' ? 1 : 0), 
              matchesLost: spiller.matchesLost + (result === 'lose' ? 1 : 0) 
            } 
          : s
      )
    );
  };

  const backgroundImageStyle = {
    backgroundImage: `url(${tabletennis})`,
    backgroundSize: 'cover',          
    backgroundPosition: 'center',     
    backgroundRepeat: 'no-repeat',    
    height: '100vh',                  
    width: '100vw',                
    position: 'fixed',               
    top: 0,
    left: 0,
    display: 'flex',                 
    justifyContent: 'center',        
    alignItems: 'center', 
    color: 'white',
  };

  return (
    <div style={backgroundImageStyle}>
      <UpdateScore
        spiller="spiller1"
        setKamperVunnet={(newValue) => handleUpdateScore('spiller1', 'win', newValue)}
        setKamperTapt={(newValue) => handleUpdateScore('spiller1', 'lose', newValue)}
      />
    </div>
  );
}

export default Leaderboard;
