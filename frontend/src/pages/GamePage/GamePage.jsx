import { Box } from '@mui/material';
import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GlobalStyle from '../../components/common/GlobalStyle';
import { socket } from '../../utils/socket';
import useSocket from '../../hooks/useSocket';
import useStream from '../../hooks/useStream';
import Chatting from '../../components/gamepage/Chatting';
import ProfileCard from '../../components/gamepage/ProfileCard';
import ButtonGroup from '../../components/gamepage/ButtonGroup';
import MafiaCard from '../../components/gamepage/JobCard/MafiaCard';
import Citizencard from '../../components/gamepage/JobCard/Citizencard';

export default function GamePage() {
  useSocket();
  const { peerList, stream } = useStream();
  const { gameStatus } = useSelector((state) => state.status);
  const { userList, myJob } = useSelector((state) => state.room);
  const [showMafiaCard, setShowMafiaCard] = useState(false);
  const [showCitizencardCard, setShowCitizencardCard] = useState(false);

  useEffect(() => {
    socket.on('room full', () => {
      navigate('/lobby');
      alert('This rooom is not available');
    });
  }, []);

  useEffect(() => {
    if (myJob === 'mafia') {
      setShowMafiaCard(true);
    }
  }, [myJob]);

  useEffect(() => {
    if (myJob === 'citizen') {
      setShowCitizencardCard(true);
    }
  }, [myJob]);

  const onCloseCard = useCallback(() => {
    setShowMafiaCard(false);
  }, []);

  const onCloseCitizencardCard = useCallback(() => {
    console.log('클릭');
    setShowCitizencardCard(false);
  }, []);

  return (
    <>
      <GlobalStyle />
      <Box sx={{ backgroundColor: '#2B1D23', p: 2 }}>
        <Box xs={12}>{gameStatus !== 'playing' && <ButtonGroup />}</Box>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box mr={2}>
            {userList.map((user, index) =>
              index <= 3 ? (
                <Box ml={2} mb={2} key={index}>
                  <ProfileCard
                    userId={user}
                    peerList={peerList}
                    stream={stream}
                  />
                </Box>
              ) : null
            )}
          </Box>
          <Box>
            <Chatting />
            {showMafiaCard ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <MafiaCard onClose={onCloseCard} />
              </Box>
            ) : null}

            {showCitizencardCard ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Citizencard onClose={onCloseCitizencardCard} />
              </Box>
            ) : null}
          </Box>
          <Box>
            <Box mr={2}>
              {userList.map((user, index) =>
                index > 3 ? (
                  <Box ml={2} mb={2} key={index}>
                    <ProfileCard
                      userId={user}
                      peerList={peerList}
                      stream={stream}
                    />
                  </Box>
                ) : null
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
