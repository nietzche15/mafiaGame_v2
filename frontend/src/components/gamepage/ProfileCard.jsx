import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Checkbox, Typography } from '@mui/material';
import { socket } from '../../utils/socket';
import JobMemo from './JobMemo';
import Vote from './Vote';

// import Vote from "./Vote";
// import Target from "./Target";

export default function ProfileCard({ userId, peerList, stream }) {
  const videoRef = useRef();
  const { timeStatus } = useSelector((state) => state.status);
  const { mySocketId, myJob, killedUserList, mafiaPickId } = useSelector(
    (state) => state.room
  );

  const [noVideo, setNoVideo] = useState(true);

  const onClickKill = () => {
    if (myJob === 'mafia' && timeStatus === 'night') {
      socket.emit('mafiaVoted', { killed_id: userId, from_id: mySocketId });
    }
  };

  useEffect(() => {
    if (mySocketId === userId) {
      videoRef.current.srcObject = stream;
      return;
    }

    const target = peerList.find((peer) => peer.userId === userId)?.peer;

    if (target) {
      target.on('stream', (peerStream) => {
        console.log(peerStream);
        videoRef.current.srcObject = peerStream;
      });
    }
    setNoVideo(Boolean(target));
  }, [userId, stream, mySocketId, peerList]);

  console.log(killedUserList);

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: '#8B7F70',
        borderRadius: '10px',
        display: 'flex',
        justifyContent: 'center',
        width: 465,
      }}
      onClick={onClickKill}
    >
      <Box>
        <Box
          sx={{
            mt: 1,
            width: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#D9D9D9',
            borderRadius: '10px',
            height: '50px',
            mr: 2,
          }}
        >
          <Typography variant="h7" component="div">
            {userId}
          </Typography>
        </Box>
        <Box
          sx={{
            width: '200px',
            backgroundColor: '#D9D9D9',
            mt: 1,
            borderRadius: '10px',
          }}
        >
          <JobMemo name={userId} />
        </Box>
        <Box
          sx={{
            width: '200px',
            backgroundColor: '#D9D9D9',
            mt: 1,
            borderRadius: '10px',
          }}
        >
          {userId === mySocketId ? <Vote /> : null}
        </Box>
      </Box>

      <Box
        sx={{
          width: '200px',
          height: '200px',
          backgroundColor: '#E4D9C6',
          borderRadius: '10px',
        }}
      >
        {killedUserList.includes(userId) ? (
          <Box
            sx={{
              position: 'absolute',
              width: '200px',
              height: '200px',
              backgroundColor: '#171717',
              borderRadius: '10px',
            }}
          >
            <img
              src="./images/killimg.png"
              alt="killimg"
              style={{
                position: 'absolute',
                width: '200px',
                height: '200px',
                backgroundColor: '#171717',
                borderRadius: '10px',
              }}
            />
          </Box>
        ) : null}

        {userId === mafiaPickId && myJob === 'mafia' ? (
          <Box
            sx={{
              position: 'absolute',
              width: '200px',
              height: '200px',
              borderRadius: '10px',
            }}
          >
            <img
              src="./images/killimg.png"
              alt="killimg"
              style={{
                position: 'absolute',
                width: '200px',
                height: '200px',
              }}
            />
          </Box>
        ) : null}

        <video
          style={{
            width: '200px',
            height: '200px',
            borderRadius: '10px',
            // display: noVideo ? 'none' : 'block',
          }}
          ref={videoRef}
          autoPlay
        />
        {/* {noVideo && (
          <img
            src="./images/mafiaImg.png"
            alt="mafiaImg"
            style={{ width: '200px', height: '200px' }}
          />
        )} */}
      </Box>
    </Box>
  );
}
