import React from 'react';
import { useNavigate } from 'react-router';
import { Cookies } from 'react-cookie';

export default function SignIn() {
  const cookies = new Cookies();

  const navigate = useNavigate();
  const signIn = () => {
    cookies.set('userEmail', 'xyz@naver.com');
    cookies.set(
      'userImg',
      'https://cdn.psnews.co.kr/news/photo/202109/2001159_41516_5333.jpg'
    );
    cookies.set('userName', 'hello');
    navigate('/lobby');
  };
  return (
    <>
      <button onClick={signIn} style={{ height: '20px' }}></button>
    </>
  );
}
