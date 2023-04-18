import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '../utils/socket';
import {
  setJobList,
  getUserList,
  setFinalListId,
  addKilledUser,
  setMafiaPickId,
  resetRoomState,
} from '../store/modules/room';
import { addMessage } from '../store/modules/message';
import {
  setGameStatus,
  setTimeStatus,
  setMyStatus,
  resetStatusState,
} from '../store/modules/status';
import { setUsersInfo } from '../store/modules/userInfo';

const videoConstraints = {
  height: 200,
  width: 200,
};

const useSocket = () => {
  const dispatch = useDispatch();
  const { userList } = useSelector((state) => state.room);

  const { state: roomID } = useLocation();

  useEffect(() => {
    // 채팅방 입장
    // socket.emit('join room', roomID);

    // socket.on('noticeLB', (data) => {
    //   lobbyChatBox.current.insertAdjacentHTML(
    //     'beforeend',
    //     `<div class='chatNotice'>${data.msg}</div>`
    //   );
    // })

    // Realtime User Notice
    socket.on('notice', (data) => {
      const outMessgae = '님이 방을 나갔습니다.';
      if (data.msg.includes(outMessgae)) {
        const outUser = data.msg.replace(outMessgae, '');
        dispatch(
          getUserList(data.roomToUser.filter((user) => user !== outUser))
        );
        dispatch(setUsersInfo(data.socketToEmail, data.emailToSocket));
      } else {
        dispatch(
          getUserList(data.roomToUser, data.socketToEmail, data.emailToSocket)
        );
        dispatch(setUsersInfo(data.socketToEmail, data.emailToSocket));
      }
      dispatch(addMessage(data.msg, 'chatNotice'));
    });

    // 게임 중 서버 메세지
    socket.on('gameNotice', ({ msg, dayNight, killed }) => {
      console.log(killed);
      if (killed) {
        dispatch(addKilledUser(killed));
      }

      if (killed === socket.id) {
        dispatch(setMyStatus('dead'));
      }

      // dayNight - day/night/false 확인
      if (!dayNight) {
        dispatch(addMessage(msg, 'gameNotice'));
        return;
      }

      if (dayNight.includes('day')) {
        dispatch(addMessage(msg, 'gameNotice_Day'));
        dispatch(setTimeStatus(dayNight));
        return;
      }

      if (dayNight === 'night') {
        dispatch(addMessage(msg, 'gameNotice_Night'));
        dispatch(setTimeStatus(dayNight));
      }
    });

    socket.on('votedResult', ({ id }) => {
      console.log('투표결과', id);
      dispatch(setFinalListId(id));
    });

    // 낮 - 찬반 투표 결과 전송
    // socket.emit('finalVote', {
    //   from_id: socket.id,
    //   to_id: finalist,
    //   voted: 'true/false',
    // });

    // MyChat과 다른 Chat 구별하여 수신
    socket.on('getChat', (data) => {
      if (data.from_id === socket.id) {
        dispatch(addMessage(data.msg, 'MyChatBox'));
      } else {
        dispatch(addMessage(data.msg, 'ServerChat', data.from_id));
      }
    });

    // 보낸 DM과 받은 DM 구별하여 수신
    socket.on('getDM', (data) => {
      if (data.from_id === socket.id) {
        dispatch(addMessage(data.msg, 'MyDM', undefined, data.to_id));
      } else {
        dispatch(addMessage(data.msg, 'DirectChat', data.from_id));
      }
    });

    socket.on('mafiaPick', (data) => {
      dispatch(setMafiaPickId(data));
    });

    socket.on('gameEnd', () => {
      dispatch(resetRoomState());
      dispatch(resetStatusState());
    });
  }, [dispatch, roomID]);

  useEffect(() => {
    // gameStart시, jobList, myJob update
    socket.on('gameStart', (data) => {
      const job = data.jobList[userList.indexOf(socket.id)];
      dispatch(setGameStatus('playing'));
      dispatch(setJobList(data.jobList, job));
    });
  }, [userList, dispatch]);

  return {};
};

export default useSocket;
