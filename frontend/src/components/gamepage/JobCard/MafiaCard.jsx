import { Box } from '@mui/material';
import React from 'react';

export default function MafiaCard({ onClose }) {
  return (
    <Box sx={{ position: 'absolute', top: 140 }}>
      <img src="./images/mafiacard.png" alt="mafiacard" onClick={onClose} />
    </Box>
  );
}
