import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // Anta at du allerede har konfigurert Firebase
import { collection, getDocs } from 'firebase/firestore';
import tabletennis from './resources/tabletennis.jpeg';

function Leaderboard() {
  const [spillere, setSpillere] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      const querySnapshot = await getDocs(collection(db, 'spiller'));
      const playersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Sortere spillerne etter antall seire i synkende rekkefølge
      const sortedPlayers = playersList.sort((a, b) => b.matchesWon - a.matchesWon);
      setSpillere(sortedPlayers);
    };

    fetchPlayers();
  }, []);

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
    flexDirection: 'column', // Gjør det enkelt å plassere innhold vertikalt
    justifyContent: 'flex-start', // Start listen fra toppen
    alignItems: 'center',
    color: 'white',
    paddingTop: '50px', // Legg til litt padding på toppen
  };

  return (
    <div style={backgroundImageStyle}>
      <h1>Leaderboard</h1>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {spillere.map(spiller => (
          <li key={spiller.id} style={{ marginBottom: '10px' }}>
            <h2>{spiller.name}</h2>
            <p>Seire: {spiller.matchesWon}</p>
            <p>Tap: {spiller.matchesLost}</p>
            <p>Total Poengsum: {spiller.totalPoints || 0}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Leaderboard;