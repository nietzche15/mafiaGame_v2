import { Box, Button, MenuItem, Select, TextField } from '@mui/material';
import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { socket } from '../../utils/socket';

export default function DMText() {
  const { timeStatus, myStatus } = useSelector((state) => state.status);
  const { userList } = useSelector((state) => state.room);
  const { emailToSocket, socketToEmail } = useSelector(
    (state) => state.userInfo
  );

  const { state: roomID } = useLocation();

  const DMInput = useRef();
  const selectDM = useRef();

  const showUserList = () => {
    console.log('userList in DM: ', userList);

    return userList
      .filter((e) => e !== socket.id)
      .map((el, idx) => (
        <MenuItem key={idx} value={el}>
          {emailToSocket[socketToEmail[el]]?.userName}
        </MenuItem>
      ));
  };

  const handleSubmit = () => {
    // socket.emit('join', value);
    console.log('selectDM:', selectDM.current.value);
    socket.emit('sendDM', {
      roomID,
      from_id: socket.id,
      to_id: selectDM.current.value,
      msg: DMInput.current.value,
    });
  };

  const enterSubmit = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  if (timeStatus === 'night') return null;
  if (myStatus === 'dead') return null;

  return (
    <Box
      sx={{
        display: 'flex',
        backgroundColor: 'white',
        justifyContent: 'center',
        width: '900px',
      }}
    >
      <Select label="DM" inputRef={selectDM}>
        {showUserList()}
      </Select>
      <TextField
        // value={value}
        id="outlined-basic"
        label=""
        inputRef={DMInput}
        variant="outlined"
        sx={{ width: '100%' }}
        // onChange={handleChange}
        onKeyDown={enterSubmit}
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        전송
      </Button>
    </Box>
  );
}
