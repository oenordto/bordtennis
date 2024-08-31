import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, doc, updateDoc, getDocs } from 'firebase/firestore';

function UpdateScore({ spiller, setKamperVunnet, setKamperTapt }) {
  const handleUpdate = async (result, playerId, currentWins, currentLosses) => {
    if (result !== 'win' && result !== 'lose') {
      console.error('Ugyldig resultat:', result);
      return;
    }

    try {
      const playerRef = doc(collection(db, "spiller"), playerId);
      await updateDoc(playerRef, {
        matchesWon: currentWins + (result === 'win' ? 1 : 0),
        matchesLost: currentLosses + (result === 'lose' ? 1 : 0),
      });
      console.log('Spillerens score er oppdatert');
    } catch (error) {
      console.error('Feil ved oppdatering av score:', error);
    }
  };

  return (
    <div>
      <h2>{spiller.name}</h2>
      <p>Kamper vunnet: {spiller.matchesWon}</p>
      <p>Kamper tapt: {spiller.matchesLost}</p>
      <button onClick={() => handleUpdate('win', spiller.id, spiller.matchesWon, spiller.matchesLost)}>Vant</button>
      <button onClick={() => handleUpdate('lose', spiller.id, spiller.matchesWon, spiller.matchesLost)}>Tapte</button>
    </div>
  );
}

function PlayerOverview() {
  const [spillere, setSpillere] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      const querySnapshot = await getDocs(collection(db, "spiller"));
      const playersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSpillere(playersList);
    };

    fetchPlayers();
  }, []);

  return (
    <div>
      <h1>Spilleroversikt</h1>
      {spillere.map(spiller => (
        <UpdateScore
          key={spiller.id}
          spiller={spiller}
          setKamperVunnet={() => {}}
          setKamperTapt={() => {}}
        />
      ))}
    </div>
  );
}

export default PlayerOverview;