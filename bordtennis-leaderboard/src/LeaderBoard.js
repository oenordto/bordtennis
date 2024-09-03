import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import tabletennis from './resources/tabletennis.jpeg';
import AddPlayer from './AddPlayer';
import UpdateScore from './UpdateScore';
import PopUp from './PopUp'

function Leaderboard() {
  const [spillere, setSpillere] = useState([]);
  const [showUpdateScore, setShowUpdateScore] = useState(false);

  useEffect(() => {
    const fetchPlayers = async () => {
      const querySnapshot = await getDocs(collection(db, 'spiller'));
      const playersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Sort players by number of wins in descending order
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
    zIndex: -1,
  };

  const contentStyle = {
    maxHeight: '90vh',
    overflowY: 'auto',
    width: '100%',
    paddingTop: '50px',
    paddingBottom: '50px',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 1,
    backdropFilter: 'blur(8px)',
  };

  const addPlayerStyle = {
    position: 'fixed',
    top: '20px', // Adjust as needed for vertical positioning
    right: '20px', // Adjust as needed for horizontal positioning
    zIndex: 2, // Ensure it stays above other content
  };

  const headerStyle = {
    fontSize: '3rem',
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
    marginBottom: '30px',
  };

  const listStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    listStyleType: 'none',
    padding: 0,
    width: '80%',
    margin: 'auto',
    marginTop: '30px',
  };

  const listItemStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.3s, box-shadow 0.3s',
  };

  const listItemHoverStyle = {
    transform: 'scale(1.05)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
  };

  const toggleUpdateScore = () => {
    setShowUpdateScore(prevState => !prevState);
  };

  return (
    <>
      <div style={backgroundImageStyle}>
        <div style={contentStyle}>
          <h1 style={headerStyle}>Leaderboard</h1>
          {/* <PopUp spillere={spillere}/> */}
          <div style={addPlayerStyle}>
            <AddPlayer />
          </div>
          
          <button onClick={toggleUpdateScore} style={{ marginBottom: '20px' }}>
            {showUpdateScore ? 'Skjul Registrer ny match' : 'Registrer ny match'}
          </button>

          {showUpdateScore && <UpdateScore />}

          <ul style={listStyle}>
            {spillere.map(spiller => (
              <li 
                key={spiller.id} 
                style={listItemStyle}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = listItemHoverStyle.transform;
                  e.currentTarget.style.boxShadow = listItemHoverStyle.boxShadow;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = listItemStyle.boxShadow;
                }}
              >
                <h2>{spiller.name}</h2>
                <p>Seire: {spiller.matchesWon}</p>
                <p>Tap: {spiller.matchesLost}</p>
                <p>Total Poengsum: {spiller.totalPoints || 0}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Leaderboard;
