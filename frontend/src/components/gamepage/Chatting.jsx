import { Box, Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { socket } from '../../utils/socket';
import { useSelector } from 'react-redux';
import '../styles/Chatting.css';
import Message from './Message';
import MafiaText from './MafiaText';
import GlobalStyle from '../common/GlobalStyle';
import ChattingInput from './ChattingInput';
import DMText from './DMText';

export default function Chatting() {
  const [only, setOnly] = useState(true);
  const [isDM, setIsDM] = useState(false);
  const { timeStatus, gameStatus } = useSelector((state) => state.status);
  const { userList } = useSelector((state) => state.room);
  const { messages } = useSelector((state) => state.message);
  const changeToDM = () => setIsDM(!isDM);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    socket.on('timerChange', ({ ms }) => {
      setTimer(ms);
    });
  }, []);

  useEffect(() => {
    userList.filter((e) => e !== '').length > 1
      ? setOnly(false)
      : setOnly(true);
  }, [userList]);

  return (
    <>
      <GlobalStyle />
      <Box
        sx={{
          width: '800px',
          backgroundColor: '#8B7F70',
          borderRadius: '10px',
          minHeight: 976,
          maxHeight: 976,
          overflowY: 'auto',
          fontFamily: 'MaplestoryOTFBold',
          zIndex: 10000,
        }}
      >
        {gameStatus === 'wait' && timer === 0 ? null : (
          <Box
            sx={{
              display: 'flex',
              position: 'sticky',
              top: 0,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'red',
              height: '50px',
              fontSize: '30px',
            }}
          >
            현재 {timer / 1000}초 남았습니다.
          </Box>
        )}

        <Box>
          {messages.map((message) => (
            <Message
              key={message.id}
              msg={message.msg}
              type={message.type}
              fromId={message.fromId}
              toId={message.toId}
            />
          ))}
        </Box>
        <Box
          sx={{
            position: 'sticky',
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {timeStatus !== 'night' && (
            <Button
              onClick={changeToDM}
              sx={{ fontFamily: 'MaplestoryOTFBold' }}
              disabled={only}
            >
              {isDM ? 'quitDM' : 'sendDM'}
            </Button>
          )}

          {isDM ? <DMText userList={userList} /> : <ChattingInput />}
          <MafiaText />
        </Box>
      </Box>
    </>
  );
}
