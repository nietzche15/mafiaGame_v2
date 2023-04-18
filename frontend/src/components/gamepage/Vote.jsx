import React, { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useSelector } from 'react-redux';
import { socket } from '../../utils/socket';

export default function Vote() {
  const { gameStatus, timeStatus, myStatus } = useSelector(
    (state) => state.status
  );
  const { userList, mySocketId, killedUserList } = useSelector(
    (state) => state.room
  );
  const [select, setSelect] = useState('');

  // // 밤 - 마피아 지목 내용 전송
  // socket.emit('mafiaVoted', {
  //   from_id: socket.id,
  //   killed_id: '@@@',
  // });

  //
  // socket.emit('peopleVoted', {
  //   from_id: socket.id,
  //   killed_id: '@@@',
  // });

  const handleChange = (event) => {
    setSelect(event.target.value);

    // 낮 - 사람들 투표 결과 전송
    socket.emit('peopleVoted', {
      from_id: mySocketId,
      killed_id: event.target.value,
    });
  };

  if (
    gameStatus === 'wait' ||
    timeStatus === 'night' ||
    myStatus === 'dead' ||
    timeStatus === 'dayDiscussion' ||
    timeStatus === 'dayFinal'
  )
    return null;

  return (
    <Box sx={{ minWidth: 15 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">투표</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          onChange={handleChange}
          value={select}
        >
          {userList.map((user) =>
            user && !killedUserList.includes(user) ? (
              <MenuItem value={user} key={user}>
                {user}
              </MenuItem>
            ) : null
          )}
        </Select>
      </FormControl>
    </Box>
  );
}
