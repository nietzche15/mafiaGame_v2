import { Box, Button, TextField } from '@mui/material';
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { socket } from '../../utils/socket';
import GlobalStyle from '../common/GlobalStyle';

export default function ChattingInput() {
  const { timeStatus, myStatus } = useSelector((state) => state.status);
  const { finalistId, mySocketId } = useSelector((state) => state.room);
  const [value, setValue] = useState('');
  const handleChange = (event) => setValue(event.target.value);
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('chat input: ', value);
    socket.emit('sendChat', {
      from_id: socket.id,
      msg: value,
    });
    setValue('');
  };

  if (timeStatus === 'dayFinal' && finalistId !== mySocketId) return null;
  if (timeStatus === 'night') return null;
  if (myStatus === 'dead') return null;

  const onClickYes = () => {
    socket.emit('finalVote', { from_id: mySocketId, agree: true });
  };

  const onClickNo = () => {
    socket.emit('finalVote', { from_id: mySocketId, agree: false });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        backgroundColor: 'white',
        justifyContent: 'center',
        width: '800px',
      }}
      component="form"
      onSubmit={handleSubmit}
    >
      {timeStatus === 'dayFinalVote' ? (
        <>
          <Button
            variant="contained"
            color="primary"
            sx={{ m: 1 }}
            onClick={onClickYes}
          >
            찬성
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ m: 1 }}
            onClick={onClickNo}
          >
            반대
          </Button>
        </>
      ) : null}

      <TextField
        value={value}
        id="outlined-basic"
        label=""
        variant="outlined"
        sx={{ width: '100%', fontFamily: 'MaplestoryOTFBold' }}
        onChange={handleChange}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{
          height: '100%',
          alignItems: 'center',
          fontFamily: 'MaplestoryOTFBold',
          position: 'absolute',
          right: 0,
        }}
      >
        전송
      </Button>
    </Box>
  );
}
