import { Box } from '@mui/material';
import React from 'react';
import GlobalStyle from '../../components/common/GlobalStyle';
import Rules from '../../components/main/Rules';
import '../../components/styles/main.css';

export default function Main() {
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_REST_API_KEY}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=code&scope=openid,profile_image,account_email,profile_nickname`;

  const kakaoLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  const naverApiUrl =
    'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' +
    '27NfAweZlVIdEWFecF3p' +
    '&redirect_uri=' +
    'http://localhost:3000/naver' +
    '&state=' +
    '1234';

  const naverLogin = () => {
    window.location.href = naverApiUrl;
  };

  return (
    <>
      <GlobalStyle />
      <Box
        sx={{
          backgroundColor: '#2B1D23',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '800px',
            }}
          >
            <Box mr={5}>
              <img
                src="./images/main.png"
                alt="img"
                style={{ width: '400px' }}
              />
              <Box
                sx={{
                  width: '390px',
                  height: '60px',
                  backgroundColor: '#F4DF6F',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: '10px',
                  cursor: 'pointer',
                }}
                onClick={kakaoLogin}
              >
                <img
                  src="./images/kakao.png"
                  alt="img"
                  style={{ width: '47px' }}
                />
                카카오 로그인
              </Box>

              <Box
                sx={{
                  width: '390px',
                  height: '60px',
                  backgroundColor: '#79C250',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                onClick={naverLogin}
              >
                <img
                  src="./images/naver.png"
                  alt="img"
                  style={{ width: '37px' }}
                />
                네이버 로그인
              </Box>
            </Box>
            <Rules />
          </Box>
        </Box>
      </Box>
    </>
  );
}