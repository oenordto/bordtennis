import React, { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import PropTypes from 'prop-types';

export default function DropDown({ navn, spillere = [] }) { // Set default value for spillere
  const [selectedValue, setSelectedValue] = useState('');

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="dropdown-select-label">{navn}</InputLabel>
      <Select
        labelId="dropdown-select-label"
        id="dropdown-select"
        value={selectedValue}
        label={navn}
        onChange={handleChange}
      >
        
        {spillere.map((spiller) => (
          <MenuItem key={spiller.value} value={spiller.value}>
            {spiller.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

// Define the expected prop types
DropDown.propTypes = {
  navn: PropTypes.string.isRequired, // Label for the dropdown
  spillere: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      navn: PropTypes.string.isRequired, // Updated to match the prop name
    })
  ),
};
