import React, { useEffect } from 'react';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import socket from '../../utils/socket';

export default function Kakao() {
  const cookies = new Cookies();
  // const cookies = Cookies();

  useEffect(async () => {
    const code = new URL(window.location.href).searchParams.get('code');
    const grantType = 'authorization_code';
    const clientId = 'ec651559127139e56f9dc2e455e69667';
    const redirect = 'http://localhost:3000/kakao';
    const res = await axios.post(
      `https://kauth.kakao.com/oauth/token?grant_type=${grantType}&client_id=${process.env.REACT_APP_REST_API_KEY}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&code=${code}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    const res2 = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${res.data.access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });
    // console.log(res2.data.kakao_account.email)
    // console.log(res2.data.properties.profile_image)
    console.log(res2);
    cookies.set('userEmail', res2.data.kakao_account.email);
    cookies.set('userImg', res2.data.properties.profile_image);
    cookies.set('userName', res2.data.properties.nickname);

    location.href = 'http://localhost:3002/lobby';
  }, []);

  return <div>.</div>;
}
