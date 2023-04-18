import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
// import useSocket from '../../hooks/useSocket';
import { InfinitySpin } from 'react-loader-spinner';
import { useNavigate } from 'react-router';
import { getRoomID } from '../../store/modules/room';
import GlobalStyle from '../common/GlobalStyle';
// import { asyncRoomList } from '../../store/modules/roomlist';
// import { socket } from '../../utils/socket';

// let addedRoom = [];

export default function GameRoom() {
  const [open, setOpen] = useState(false);
  const [roomID, setRoomID] = useState('');
  const [password, setPassword] = useState('');
  const [cnt, setCnt] = useState(4);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputPW = useRef();
  const myRefs = useRef([]);

  const roomList = useSelector((state) => {
    return state.asyncThunk.data;
  });

  const asyncLoading = useSelector((state) => {
    return state.asyncThunk.loading;
  });

  const enterRoom = (e) => {
    let room_ID = e.currentTarget.getAttribute('value');
    let room_PW = e.currentTarget.getAttribute('password');
    setPassword(room_PW);
    setRoomID(room_ID);
    console.log('roomID,roomPW:', room_ID, room_PW);
    room_PW
      ? setOpen(true)
      : (dispatch(getRoomID({ roomID: roomID })),
        navigate('/gamepage', { state: roomID, replace: true }));
  };

  const handleClose = () => {
    setOpen(false);
    setCnt(4);
  };
  const checkPassword = () => {
    setCnt(cnt - 1);
    password === inputPW.current.value
      ? (setOpen(false),
        dispatch(getRoomID({ roomID: roomID })),
        navigate('/gamepage', { state: roomID, replace: true }),
        setPassword(''),
        setRoomID(''))
      : cnt === 5
      ? (setOpen(false), setCnt(4))
      : (inputPW.current.value = ''),
      inputPW.current.setAttribute('placeholder', `TRY AGAIN(${cnt}/5)`);
  };

  const enterSubmitPW = (e) => {
    if (e.key === 'Enter') checkPassword();
  };

  return (
    <>
      <GlobalStyle />
      <div className="gameroomBox">
        <div className="gameroom">
          <div className="gamelist">
            <span className="gamenumber">0</span>
            <span className="gametitle" value={1234} onClick={enterRoom}>
              용산 마피아
            </span>
            <span className="gamestate">
              <img
                style={{ width: '19px', position: 'relative', top: '3px' }}
                src="./images/lock.png"
              />
            </span>
            <span className="gameNoP">1/7</span>
          </div>
        </div>
        <div>
          {/* {asyncLoading && <InfinitySpin width="100" color=" cornflowerblue" />} */}
          {Object.keys(roomList).map((e, i) => {
            return (
              <div className="gameroom" key={i}>
                <div className="gamelist" key={i}>
                  <span className="gamenumber" key={i}>
                    {i + 1}
                  </span>
                  <span
                    className="gametitle"
                    key={i}
                    value={roomList[e].roomID}
                    password={roomList[e].roomPW || ''}
                    ref={(element) =>
                      (myRefs.current[roomList[e].roomName] = element)
                    }
                    onClick={enterRoom}
                  >
                    {roomList[e].roomName}
                  </span>
                  <span key={i} className="gamestate">
                    {roomList[e].roomLocked && (
                      <img
                        key={i}
                        style={{
                          width: '19px',
                          position: 'relative',
                          top: '3px',
                        }}
                        src="./images/lock.png"
                      />
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <Dialog
          open={open}
          onClose={handleClose}
          style={{ fontFamily: 'MaplestoryOTFBold' }}
        >
          <DialogTitle sx={{ fontSize: '15px' }}>Private Room</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              inputRef={inputPW}
              required
              label="Password"
              variant="outlined"
              size="small"
              margin="dense"
              onKeyDown={enterSubmitPW}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={checkPassword}>Submit</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}
