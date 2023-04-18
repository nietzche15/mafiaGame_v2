import { Box, Button, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { socket } from '../../utils/socket';

export default function MafiaText() {
  const { state: roomID } = useLocation();
  const { timeStatus } = useSelector((state) => state.status);
  const { jobList, myJob, userList } = useSelector((state) => state.room);
  const onlyMafia = userList.length <= 5; // userList.length <=5 면 mafia 한 명(true)
  const DMInput = useRef();

  const handleSubmit = () => {
    socket.emit('sendDM', {
      roomID,
      from_id: socket.id,
      to_id:
        userList.filter(
          (e, i) => e !== socket.id && jobList[i] === 'mafia'
        )[0] || socket.id,
      msg: DMInput.current.value,
    });
  };
  const enterSubmit = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  if (myJob !== 'mafia' || timeStatus !== 'night') {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        backgroundColor: 'white',
        justifyContent: 'center',
        width: '900px',
      }}
    >
      <TextField
        // value={value}
        id="outlined-basic"
        label=""
        inputRef={DMInput}
        variant="outlined"
        sx={{ width: '100%' }}
        // onChange={handleChange}
        onKeyDown={enterSubmit}
        disabled={onlyMafia}
        placeholder={
          onlyMafia
            ? 'CHOOSE ONE TO KILL'
            : 'ONLY MAFIA can send a message during the NIGHT'
        }
      />
      <Button
        variant="contained"
        sx={{ backgroundColor: '#940404' }}
        onClick={handleSubmit}
      >
        전송
      </Button>
    </Box>
  );
}
