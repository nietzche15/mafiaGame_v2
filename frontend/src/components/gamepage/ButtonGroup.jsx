import { Box, Button } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { socket } from '../../utils/socket';
import GlobalStyle from '../common/GlobalStyle';

export default function ButtonGroup() {
  const [isReady, setIsReady] = useState(false);
  const [isCaptain, setIsCaptain] = useState(false);
  const exitBtn = useRef();
  const readyBtn = useRef();
  // const startBtn = useRef();
  const userList = useSelector((state) => state.room.userList);

  // userList의 첫번째 socket.id 가 captain, userList 바뀔때마다 update
  const navigate = useNavigate();

  useEffect(() => {
    if (userList.indexOf(socket.id) === 0) {
      setIsCaptain(true);
    } else {
      setIsCaptain(false);
    }
    if (!isCaptain && userList.length >= 4) {
      setIsReady(false);
    } else {
      setIsReady(true);
    }
  }, [userList]);

  const gameReady = () => {
    setIsReady(true);
    if (isCaptain) {
      socket.emit('gameStart', {
        from_id: socket.id,
        userList,
      });
    } else {
      socket.emit('gameReady', {
        from_id: socket.id,
      });
    }
  };

  // const gameStart = () => {
  //   socket.emit('gameStart', {
  //     from_id: socket.id,
  //   });
  // };

  socket.on('readyComplete', () => {
    setIsReady(false);
  });

  return (
    <>
      <GlobalStyle />
      <Box sx={{ p: 1, textAlign: 'right' }}>
        {/* {isCaptain ? (
        <Button
          ref={startBtn}
          variant="contained"
          sx={{ m: 1, backgroundColor: '#940404' }}
          onClick={gameStart}
          disabled={isReady ? true : false}
        >
          'Game START'
        </Button>
      ) : ( */}
        <Button
          ref={readyBtn}
          variant="contained"
          color="primary"
          sx={{
            m: 1,
            fontFamily: 'MaplestoryOTFBold',
            '* .Mui_disabled': {
              background: '#E38989',
              fontFamily: 'MaplestoryOTFBold',
            },
          }}
          onClick={gameReady}
          disabled={isReady}
        >
          {isCaptain ? 'Game START' : 'READY'}
        </Button>
        {/* )} */}
        <Button
          ref={exitBtn}
          variant="contained"
          color="secondary"
          sx={{ m: 1, fontFamily: 'MaplestoryOTFBold', fontWeight: 'bolder' }}
          onClick={() => {
            navigate('/lobby');
            socket.emit('exitRoom', {
              from_id: socket.id,
            });
          }}
        >
          나가기
        </Button>
      </Box>
    </>
  );
}
