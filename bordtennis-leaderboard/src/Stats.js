import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Box, Typography, MenuItem, Select, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Stats() {
  const [lastMatches, setLastMatches] = useState([]);
  const [spillere, setSpillere] = useState([]);
  const [comparePlayer1, setComparePlayer1] = useState('');
  const [comparePlayer2, setComparePlayer2] = useState('');

  useEffect(() => {
    const fetchMatches = async () => {
      const matchesQuery = query(collection(db, 'kamper'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(matchesQuery);
      const matches = querySnapshot.docs.map(doc => doc.data());
      console.log("Fetched matches:", matches);  // Debugging output
      setLastMatches(matches);
    };

    const fetchPlayers = async () => {
      const querySnapshot = await getDocs(collection(db, 'spiller'));
      const playersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Fetched players:", playersList);  // Debugging output
      setSpillere(playersList);
    };

    fetchMatches();
    fetchPlayers();
  }, []);

  const handleCompareChange1 = (event) => {
    setComparePlayer1(event.target.value);
  };

  const handleCompareChange2 = (event) => {
    setComparePlayer2(event.target.value);
  };

  const filteredMatches = lastMatches.filter(match => 
    (match.winner === comparePlayer1 && match.loser === comparePlayer2) ||
    (match.winner === comparePlayer2 && match.loser === comparePlayer1)
  );

  console.log("Filtered matches:", filteredMatches);  // Debugging output

  const player1Wins = filteredMatches.filter(match => match.winner === comparePlayer1).length;
  const player2Wins = filteredMatches.filter(match => match.winner === comparePlayer2).length;

  console.log("Player 1 wins:", player1Wins);  // Debugging output
  console.log("Player 2 wins:", player2Wins);  // Debugging output

  const data = [
    {
      name: spillere.find(spiller => spiller.id === comparePlayer1)?.name || 'Spiller 1',
      Seire: player1Wins,
    },
    {
      name: spillere.find(spiller => spiller.id === comparePlayer2)?.name || 'Spiller 2',
      Seire: player2Wins,
    },
  ];

  console.log("Chart data:", data);  // Debugging output

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Stats
      </Typography>

      <Box mb={4}>
        <Typography variant="h5" gutterBottom>
          Sammenlign spillere
        </Typography>
        <FormControl fullWidth variant="outlined" sx={{ marginBottom: '10px' }}>
          <InputLabel>Velg Spiller 1</InputLabel>
          <Select value={comparePlayer1} onChange={handleCompareChange1} label="Velg Spiller 1">
            {spillere.map(spiller => (
              <MenuItem key={spiller.id} value={spiller.id}>
                {spiller.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth variant="outlined">
          <InputLabel>Velg Spiller 2</InputLabel>
          <Select value={comparePlayer2} onChange={handleCompareChange2} label="Velg Spiller 2">
            {spillere.map(spiller => (
              <MenuItem key={spiller.id} value={spiller.id}>
                {spiller.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {comparePlayer1 && comparePlayer2 && (
          <>
            <Box mt={4}>
              <Typography variant="h6" gutterBottom>
                Kamper mellom {spillere.find(spiller => spiller.id === comparePlayer1)?.name} og {spillere.find(spiller => spiller.id === comparePlayer2)?.name}
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Vinner</TableCell>
                      <TableCell>Tap</TableCell>
                      <TableCell>Dato</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredMatches.length > 0 ? (
                      filteredMatches.map((match, index) => (
                        <TableRow key={index}>
                          <TableCell>{spillere.find(spiller => spiller.id === match.winner)?.name}</TableCell>
                          <TableCell>{spillere.find(spiller => spiller.id === match.loser)?.name}</TableCell>
                          <TableCell>{new Date(match.timestamp.seconds * 1000).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3}>Ingen kamper funnet mellom disse spillerne.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box mt={4}>
              <Typography variant="h6" gutterBottom>
                Grafisk Oversikt
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Seire" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

export default Stats;