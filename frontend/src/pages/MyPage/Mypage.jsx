import React, { useEffect, useRef, useState } from 'react';
import '../../components/styles/mypage.css';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import GlobalStyle from '../../components/common/GlobalStyle';

export default function Mypage() {
  const cookies = new Cookies();
  console.log(cookies.get('id1'));
  console.log(cookies.get('id2'));
  console.log(cookies.get('id3'));
  const [email, setEmail] = useState(cookies.get('id1'));
  const [img, setImg] = useState(cookies.get('id2'));
  const [name, setName] = useState(cookies.get('id3'));
  const [open, setOpen] = React.useState(false);
  const [empty, setEmpty] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const inputName = useRef();

  const style2 = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 200,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const API = 'ec651559127139e56f9dc2e455e69667';
  const logout = 'http://localhost:3000';

  function delcookies() {
    cookies.remove('id1');
    cookies.remove('id2');
    cookies.remove('id3');
  }
  function kakaoLogout() {
    window.location.href = `https://kauth.kakao.com/oauth/logout?client_id=${API}&logout_redirect_uri=${logout}`;
    delcookies();
  }

  const handleSubmit = () => {
    let newName = inputName.current?.value;
    newName === ''
      ? setEmpty(true)
      : (cookies.set('id3', newName),
        setName(newName),
        setOpen(false),
        setEmpty(false));
  };

  const enterSubmit = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <>
      <GlobalStyle />
      <div className="mypage">
        <div className="info">
          <table className="table">
            <tr>
              <td style={{ width: '300px', textAlign: 'center' }} rowSpan="3">
                <img
                  alt="ig"
                  style={{ width: '100%', borderRadius: '10px' }}
                  src={
                    img ===
                    'http://k.kakaocdn.net/dn/dpk9l1/btqmGhA2lKL/Oz0wDuJn1YV2DIn92f6DVK/img_640x640.jpg'
                      ? './images/mafiaImg.png'
                      : img
                  }
                />
              </td>
              <td style={{ height: '100px' }}>{email}</td>
            </tr>
            <tr>
              <td style={{ height: '100px' }}>{name}</td>
            </tr>
            <tr>
              <td style={{ height: '100px' }} colSpan="2">
                점수
              </td>
            </tr>
            <tr>
              <td style={{ height: '140px', paddingLeft: '70px' }} colSpan="2">
                승률:
              </td>
            </tr>
            <tr>
              <td colSpan="2"></td>
            </tr>
          </table>
          <div className="mypagebtn">
            <Button
              variant="contained"
              onClick={handleOpen}
              color="primary"
              sx={{
                width: '100px',
                m: 0,
                '* .Mui_disabled': { background: '#E38989' },
                fontFamily: 'MaplestoryOTFBold',
              }}
            >
              닉네임 수정
            </Button>
            <br />
            <br />
            <Button
              variant="contained"
              onClick={() => {
                kakaoLogout();
              }}
              color="primary"
              sx={{
                width: '100px',
                m: 0,
                '* .Mui_disabled': { background: '#E38989' },
                fontFamily: 'MaplestoryOTFBold',
              }}
            >
              로그아웃
            </Button>
            <br />
            <br />
            <Button
              variant="contained"
              color="primary"
              sx={{
                width: '100px',
                m: 0,
                '* .Mui_disabled': { background: '#E38989' },
                fontFamily: 'MaplestoryOTFBold',
              }}
            >
              <Link
                to="/lobby"
                style={{
                  textDecoration: 'none',
                  color: 'white',
                  fontFamily: 'MaplestoryOTFBold',
                }}
              >
                나가기
              </Link>
            </Button>
          </div>
        </div>
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
            inputRef={inputName}
            required
            label={empty ? 'Enter Name' : 'NAME'}
            variant="outlined"
            size="small"
            margin="dense"
            onKeyDown={enterSubmit}
            defaultValue={name}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
