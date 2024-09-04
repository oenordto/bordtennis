import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, doc, updateDoc, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

function UpdateScore() {
  const [spillere, setSpillere] = useState([]);
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [score1, setScore1] = useState('');
  const [score2, setScore2] = useState('');

  useEffect(() => {
    const fetchPlayers = async () => {
      const querySnapshot = await getDocs(collection(db, 'spiller'));
      const playersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSpillere(playersList);
    };

    fetchPlayers();
  }, []);

  const handleUpdateScore = async () => {
    if (!player1 || !player2 || player1 === player2) {
      alert('Vennligst velg to forskjellige spillere');
      return;
    }

    const player1Obj = spillere.find(spiller => spiller.id === player1);
    const player2Obj = spillere.find(spiller => spiller.id === player2);

    if (!score1 || !score2 || isNaN(score1) || isNaN(score2)) {
      alert('Vennligst skriv inn gyldige poengsummer');
      return;
    }
    if (Math.abs(score1-score2) < 2) {
      alert('Man må vinne med to poeng.');
      return;
    }
    if (score1 < 11 && score2 < 11) {
      alert('Man må ha 11 poeng for å vinne.');
      return;
    }

    const score1Int = parseInt(score1);
    const score2Int = parseInt(score2);

    let winner = null;
    let loser = null;

    if (score1Int > score2Int) {
      winner = player1Obj;
      loser = player2Obj;
    } else if (score2Int > score1Int) {
      winner = player2Obj;
      loser = player1Obj;
    } else {
      alert('Kampen endte uavgjort, ingen vinner registrert.');
      return;
    }

    try {
      // Oppdater vinnerens dokument
      const winnerRef = doc(collection(db, 'spiller'), winner.id);
      await updateDoc(winnerRef, {
        matchesWon: winner.matchesWon + 1,
        totalPoints: (winner.totalPoints || 0) + score1Int,
        lastPlayed: serverTimestamp()
      });

      // Oppdater taperens dokument
      const loserRef = doc(collection(db, 'spiller'), loser.id);
      await updateDoc(loserRef, {
        matchesLost: loser.matchesLost + 1,
        totalPoints: (loser.totalPoints || 0) + score2Int,
        lastPlayed: serverTimestamp()
      });

      // Lagre kampdetaljer i "kamper" samlingen
      await addDoc(collection(db, 'kamper'), {
        player1: player1Obj.name,
        player2: player2Obj.name,
        score1: score1Int,
        score2: score2Int,
        winner: winner.name,
        timestamp: serverTimestamp()
      });

      alert(`Kampen er registrert. Vinner: ${winner.name}`);
    } catch (error) {
      console.error('Feil ved oppdatering av score:', error);
    }
  };

  return (
    <div>
      <h1>Registrer ny match</h1>
      <div>
        <label>
          Velg Spiller 1:
          <select value={player1} onChange={e => setPlayer1(e.target.value)}>
            <option value="">Velg spiller</option>
            {spillere.map(spiller => (
              <option key={spiller.id} value={spiller.id}>
                {spiller.name}
              </option>
            ))}
          </select>
        </label>
        <input
          type="number"
          placeholder="Poeng"
          value={score1}
          onChange={e => setScore1(e.target.value)}
        />
      </div>

      <div>
        <label>
          Velg Spiller 2:
          <select value={player2} onChange={e => setPlayer2(e.target.value)}>
            <option value="">Velg spiller</option>
            {spillere.map(spiller => (
              <option key={spiller.id} value={spiller.id}>
                {spiller.name}
              </option>
            ))}
          </select>
        </label>
        <input
          type="number"
          placeholder="Poeng"
          value={score2}
          onChange={e => setScore2(e.target.value)}
        />
      </div>

      <button onClick={handleUpdateScore}>Lagre Resultat</button>
    </div>
  );
}

export default UpdateScore;
