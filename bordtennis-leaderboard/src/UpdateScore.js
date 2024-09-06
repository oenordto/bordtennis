import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // sørg for at Firebase er riktig konfigurert
import { collection, doc, updateDoc, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

function UpdateScore() {
  const [spillere, setSpillere] = useState([]);
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [score1, setScore1] = useState('');
  const [score2, setScore2] = useState('');

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'spiller'));
        const playersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSpillere(playersList);
      } catch (error) {
        console.error('Feil ved henting av spillere:', error);
      }
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

    const score1Int = parseInt(score1);
    const score2Int = parseInt(score2);

    if (Math.abs(score1Int - score2Int) < 2) {
      alert('Man må vinne med to poeng.');
      return;
    }

    if (score1Int < 11 && score2Int < 11) {
      alert('En spiller må ha minst 11 poeng for å vinne.');
      return;
    }

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
        matchesWon: (winner.matchesWon || 0) + 1,
        totalPoints: (winner.totalPoints || 0) + score1Int,
        lastPlayed: serverTimestamp(),
      });

      // Oppdater taperens dokument
      const loserRef = doc(collection(db, 'spiller'), loser.id);
      await updateDoc(loserRef, {
        matchesLost: (loser.matchesLost || 0) + 1,
        totalPoints: (loser.totalPoints || 0) + score2Int,
        lastPlayed: serverTimestamp(),
      });

      // Lagre kampdetaljer i "kamper" samlingen
      await addDoc(collection(db, 'kamper'), {
        player1: player1Obj.name,
        player2: player2Obj.name,
        score1: score1Int,
        score2: score2Int,
        winner: winner.name,
        timestamp: serverTimestamp(),
      });

      alert(`Kampen er registrert. Vinner: ${winner.name}`);
    } catch (error) {
      console.error('Feil ved oppdatering av score:', error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formGroup}>
        <label style={styles.label}>
          Velg Spiller 1:
          <select style={styles.select} value={player1} onChange={e => setPlayer1(e.target.value)}>
            <option value="">Velg spiller</option>
            {spillere.map(spiller => (
              <option key={spiller.id} value={spiller.id}>
                {spiller.name}
              </option>
            ))}
          </select>
        </label>
        <input
          style={styles.input}
          type="number"
          placeholder="Poeng"
          value={score1}
          onChange={e => setScore1(e.target.value)}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          Velg Spiller 2:
          <select style={styles.select} value={player2} onChange={e => setPlayer2(e.target.value)}>
            <option value="">Velg spiller</option>
            {spillere.map(spiller => (
              <option key={spiller.id} value={spiller.id}>
                {spiller.name}
              </option>
            ))}
          </select>
        </label>
        <input
          style={styles.input}
          type="number"
          placeholder="Poeng"
          value={score2}
          onChange={e => setScore2(e.target.value)}
        />
      </div>

      <button style={styles.button} onClick={handleUpdateScore}>
        Lagre Resultat
      </button>
    </div>
  );
}

// CSS in JS for styling
const styles = {
  container: {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontSize: '16px',
    color: '#333',
  },
  select: {
    width: '100%',
    padding: '8px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  input: {
    width: '100%',
    padding: '8px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginTop: '10px',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007BFF',
    color: '#fff',
    fontSize: '16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default UpdateScore;
