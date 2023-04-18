import React, { useEffect, useRef, useState } from 'react';
import '../../components/styles/lobby.css';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
// import Modal from '@mui/material/Modal';
import { Cookies } from 'react-cookie';
import LobbyChat from '../../components/lobby/LobbyChat';
import GameRoom from '../../components/lobby/GameRoom';
import { getRoomID } from '../../store/modules/room';
import { socket } from '../../utils/socket';
import { asyncRoomList } from '../../store/modules/roomlist';
import GlobalStyle from '../../components/common/GlobalStyle';
import { getMyInfo } from '../../store/modules/userInfo';
// import useSocket from '../../hooks/useSocket';

export default function Lobby() {
  // useSocket();
  const [socketID, setSocketID] = useState(socket.id);
  const cookies = new Cookies();
  const roomInput = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [locked, setLocked] = useState(false);
  const [alertPW, setAlertPw] = useState(false);
  // const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setAlertPw(false);
  };
  const roomName = useRef();
  const roomPW = useRef();
  let userEmail = cookies.get('id1');
  let userImg = cookies.get('id2');
  let userName = cookies.get('id3');
  console.log('socket', socket.id);

  console.log('userInfo: ', userEmail, userImg, userName);

  useEffect(() => {
    dispatch(asyncRoomList());

    socket.emit('setUserInfo', {
      from_id: socket.id,
      user_email: userEmail,
      user_img: userImg,
      user_name: userName,
    });
    console.log('socket.id', socket.id);
    dispatch(getMyInfo(userEmail, userName));
  }, []);

  socket.on('allRooms', () => {
    dispatch(asyncRoomList());
  });
  useEffect(() => {
    console.log(socket.id, '------------------------------------------');
  }, [socket.id]);

  let roomID;

  const clickJoinBtn = () => {
    // console.log('roomInput.current.value: ', roomInput.current.value);
    /* eslint-disable */
    roomInput.current.value === ''
      ? alert('Please enter a room name')
      : ((roomID = roomInput.current.value),
        dispatch(getRoomID({ roomID: roomID })),
        navigate('/gamepage', { state: roomID, replace: true }));
  };
  const createRoom = () => {
    setOpen(true);
  };

  const handleSubmit = () => {
    console.log('roomPW.current', roomPW.current);
    console.log('roomPW.current?.value', roomPW.current?.value);
    locked && roomPW.current.value === ''
      ? setAlertPw(true)
      : (setOpen(false),
        setAlertPw(false),
        socket.emit('newRoomInfo', {
          room_name: roomName.current.value,
          room_locked: locked,
          room_PW: roomPW.current?.value || false,
          room_owner: socket.id,
        }));
    // console.log('open', open);
  };

  const radioChange = (e) => {
    e.target.value === 'Yes' ? setLocked(true) : setLocked(false);
  };

  const enterSubmitUnlocked = (e) => {
    console.log('enterSubmitUnlocked');
    if (e.key === 'Enter') handleSubmit();
  };

  const enterSubmitLocked = (e) => {
    console.log('enterSubmitLocked');
    if (e.key === 'Enter') handleSubmit();
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <GlobalStyle />
      <div className="lobby">
        <div className="left">
          <div className="room">
            <div className="roomstate">
              <Button
                variant="contained"
                color="secondary"
                sx={{ mr: 2, mb: 2, fontFamily: 'MaplestoryOTFBold' }}
              >
                전체
              </Button>
              <Button
                variant="contained"
                color="secondary"
                sx={{ mr: 2, mb: 2, fontFamily: 'MaplestoryOTFBold' }}
              >
                공개
              </Button>
              <Button
                variant="contained"
                color="secondary"
                sx={{ mr: 2, mb: 2, fontFamily: 'MaplestoryOTFBold' }}
              >
                비밀
              </Button>
            </div>

            {/* <div className="gameroom">
            <div className="gamelist">
              <span className="gamenumber">1</span>
              <span className="gametitle">용산 마피아</span>
              <span className="gamestate">
                <img
                  style={{ width: '19px', position: 'relative', top: '3px' }}
                  src="./images/lock.png"
                />
              </span>
              <span className="gameNoP">1/7</span>
            </div>
          </div> */}
          <div style={{overflowY:'scroll',height:'400px'}}>
            <GameRoom />
          </div>
            

            <div className="right">
              <Button
                onClick={createRoom}
                variant="contained"
                color="primary"
                sx={{
                  width: '100px',
                  m: 0,
                  '* .Mui_disabled': { background: '#E38989' },
                  fontFamily: 'MaplestoryOTFBold',
                }}
              >
                방 생성
              </Button>
              <Dialog open={open} onClose={handleClose}>
                <DialogTitle sx={{ fontSize: '15px' }}>
                  Room Information
                </DialogTitle>
                <DialogContent>
                  {/* <DialogContentText>
                  직접 방을 만들고 친구를 초대해보세요
                </DialogContentText> */}
                  <TextField
                    inputRef={roomName}
                    autoFocus
                    required
                    label="Room Name"
                    variant="outlined"
                    size="small"
                    margin="dense"
                  />
                  <br />
                  <FormControl sx={{ margin: '10px 0 10px 0' }}>
                    <FormLabel sx={{ fontSize: '15px' }}>Private ?</FormLabel>
                    <RadioGroup row onChange={radioChange}>
                      <FormControlLabel
                        value="Yes"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        autoFocus
                        value="No"
                        control={<Radio />}
                        label="No"
                        onKeyDown={enterSubmitUnlocked}
                      />
                    </RadioGroup>
                  </FormControl>
                  <br />
                  {locked && (
                    <TextField
                      inputRef={roomPW}
                      label={alertPW ? 'Enter Password' : 'Password'}
                      variant="outlined"
                      size="small"
                      margin="dense"
                      onKeyDown={enterSubmitLocked}
                    />
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button onClick={handleSubmit}>Submit</Button>
                </DialogActions>
              </Dialog>
              <br />
              <br />
              <Button
                variant="contained"
                color="primary"
                sx={{
                  width: '100px',
                  m: 0,
                  '* .Mui_disabled': { background: '#E38989' },
                }}
              >
                <Link
                  to="/mypage"
                  style={{ textDecoration: 'none', color: 'white' }}
                >
                  마이 페이지
                </Link>
              </Button>
              <div>
                <input
                  ref={roomInput}
                  id="roomName"
                  type="text"
                  placeholder="Enter Room Number"
                />
                <button id="join" onClick={clickJoinBtn}>
                  Join
                </button>
              </div>
            </div>
          </div>
          <div className="chatlist">
            <LobbyChat />
          </div>
        </div>
      </div>
    </>
  );
}
