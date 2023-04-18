import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [user_email, setUserMail] = useState();

  const getProfile = async () => {
    try {
      // Kakao SDK API를 이용해 사용자 정보 획득
      let data = await window.Kakao.API.request({
        url: '/v2/user/me',
      });
      // 사용자 정보 변수에 저장
      setUserMail(data.account_email);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getProfile();
  }, []);
  return (
    <div>
      <h2>{user_email}</h2>
    </div>
  );
};
export default Profile;
