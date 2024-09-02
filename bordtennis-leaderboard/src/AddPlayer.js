import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc } from "firebase/firestore";

function AddPlayer() {
  const [playerName, setPlayerName] = useState('');
  const [firestoreInitialized, setFirestoreInitialized] = useState(false);
  const db = getFirestore(); // Initialize Firestore

  useEffect(() => {
    setFirestoreInitialized(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = prompt('Enter player name');
    setPlayerName(name);

    if (firestoreInitialized && name) {
      try {
        await addDoc(collection(db, 'spiller'), {
          name: name,
          matchesWon: 0,
          matchesLost: 0,
        });
        setPlayerName('');
        console.log('Spiller lagt til');
      } catch (error) {
        console.error('Feil ved opprettelse av spiller:', error);
      }
    } else {
      console.warn('Firestore not initialized yet!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* <input 
        type="text" 
        value={playerName} 
        onChange={(e) => setPlayerName(e.target.value)} 
        placeholder="Enter player name" 
        required 
      /> */}
      <button type="submit">Legg til ny spiller</button>
    </form>
  );
}

export default AddPlayer;