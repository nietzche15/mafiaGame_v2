import React, { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export default function JobMemo() {
  const [job, setJob] = React.useState('');

  const handleChange = (event) => {
    setJob(event.target.value);
  };
  return (
    <Box sx={{ width: '200px' }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">직업메모</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={job}
          onChange={handleChange}
        >
          <MenuItem value={10}>시민</MenuItem>
          <MenuItem value={20}>마피아</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
