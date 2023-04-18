import { Box } from '@mui/material';
import React from 'react';

export default function Citizencard({ onClose }) {
  return (
    <Box sx={{ position: 'absolute', top: 140 }}>
      <img src="./images/citizencard.png" alt="mafiacard" onClick={onClose} />
    </Box>
  );
}
