module.exports = (server) => {
  const io = require('socket.io')(server, {
    cors: {
      origin: '*',
      credentials: true,
    },
  });

  let cnt = 2;
  const getJobList = require('./jobList');

  let checkReady = {};
  var roomList = {
    0: {
      roomID: 0,
      roomName: '☆*: .｡. o(≧▽≦)o .｡.:*☆ 마놀ㄱ',
      roomLocked: false,
      roomPW: false,
      roomOwner: 'admin',
    },
    1: {
      roomID: 1,
      roomName: '▧▧▧▶▷용강중 2-3◁◀▨▨▨ →→ㅂㅂ 방학식 §§',
      roomLocked: true,
      roomPW: 1234,
      roomOwner: 'admin',
    },
    2: {
      roomID: 2,
      roomName: '༼ つ ◕_◕ ༽つ 해보자 해보자 후회하지 말고 💪💪',
      roomLocked: true,
      roomPW: 1234,
      roomOwner: 'admin',
    },
  };

  const emailToSocket = {}; // email - {userID : socket.id, userName: nickName }
  const socketToEmail = {}; // socket.id - email
  // const friendList = {};
  const roomToUser = {}; // roomID - [user1(socekt.id) , user2(socekt.id), user3(socekt.id), ...]
  const userToRoom = {}; // socket.id - roomID

  /**
   * 방별 타이머 상태
   * [key : roomId] : Timer
   * Timer : {
   *   ms: 설정시간(밀리세컨드)
   *   type : 타이머 타입()
   * }
   */
  const roomTimer = {};

  const timerList = require('./timerList');

  const peopleVotedList = {};
  const finalVoteList = {};
  const userJobList = {};
  const mafiaVoteList = {};

  io.on('connection', (socket) => {
    console.log('User Connected', socket.id);

    //----------------------------------------------// Lobby Page

    socket.on('setUserInfo', async (data) => {
      emailToSocket[data.user_email] = await {
        userID: data.from_id,
        userName: data.user_name,
      };
      // console.log('data', data);
      socketToEmail[data.from_id] = await data.user_email;

      // let userData = { userID: data.from_id, userName: data.user_name };

      // const setUserInfo = async (userData) => {
      //   let result = await redis.hmset(data.user_email, userData);
      //   console.log('result', result);
      // };
      // setUserInfo(userData);

      // console.log('emailToSocket: ', emailToSocket[data.user_email]);
      // console.log('userID: ', emailToSocket[data.user_email].userID);
      // console.log('userName: ', emailToSocket[data.user_email]?.userName);
      // console.log('userImg: ', data.user_img);
      // console.log('socketToEmail: ', socketToEmail[data.from_id]);

      io.emit('noticeLB', {
        //   msg: `${data.user_name}님이 입장했습니다.`,
        emailToSocket: emailToSocket,
        socketToEmail: socketToEmail,
      });
    });
    // Lobby에 보일 방 목록 전송
    io.emit('allRooms', {
      roomList: roomList,
    });
    // console.log('roomList:', roomList);

    // 새로 만든 방 정보 목록에 추가
    // 추가된 방 목록 Lobby로 전송
    // 방 roomID 는 cnt로 autoIncrement
    socket.on('newRoomInfo', (data) => {
      cnt++;
      // let roomID = cnt;
      roomList[cnt] = {
        roomID: cnt,
        roomName: data.room_name,
        roomLocked: data.room_locked,
        roomPW: data.room_PW,
        roomOwner: data.room_owner,
      };

      console.log('roomList[cnt]:', roomList[cnt]);
      io.emit('allRooms', {
        roomList: roomList,
      });
    });

    socket.on('sendLBChat', (data) => {
      emailToSocket[data.user_email] = {
        userName: data.user_name,
        userID: data.from_id,
        // userEmail: data.user_email,
      };
      socketToEmail[data.from_id] = data.user_email;
      let from_email = socketToEmail[data.from_id];
      let from_name = emailToSocket[data.user_email]?.userName;
      // console.log('data', data);
      // console.log('from_email:', from_email);
      // console.log('from_name:', from_name);
      io.emit('getLBChat', {
        from_id: data.from_id,
        from_name: data.user_name,
        msg: data.msg,
      });
    });

    // // User의 chat 수신 - 전체 전송
    // socket.on('sendChat', (data) => {
    //   io.to(data.from_id).emit('getLBChat', {
    //     from_id: data.from_id,
    //     msg: data.msg,
    //   });
    // });

    //----------------------------------------------// GamePage
    // 방 입장
    // 같은 방 입장한 회원 구분 roomID - socket.id
    socket.on('join room', ({ roomID, myEmail }) => {
      let rooms = io.sockets.adapter.rooms;
      let room = rooms.get(roomID);
      let myName = emailToSocket[myEmail]
        ? emailToSocket[myEmail]?.userName
        : false;

      console.log('joinInfo: ', roomID, myEmail);
      // 게임페이지에서 userInfo UPDATE
      socketToEmail[socket.id] = myEmail;
      emailToSocket[myEmail]
        ? (emailToSocket[myEmail].userID = socket.id)
        : false;

      // console.log('emailToSocket jr: ', emailToSocket);
      // console.log('socketToEmail jr: ', socketToEmail);

      if (room?.size > 7) {
        socket.emit('room full');
        return;
      } else {
        room?.size !== undefined
          ? roomToUser[roomID].push(socket.id)
          : ((roomToUser[roomID] = [socket.id]), (checkReady[roomID] = 0));
        socket.join(roomID);
        userToRoom[socket.id] = roomID;
        // console.log('usersInfo: ', roomToUser[roomID]);

        const usersInThisRoom = roomToUser[roomID].filter(
          (id) => id !== socket.id
        );
        console.log('usersInThisRoom', usersInThisRoom);
        socket.emit('all users', usersInThisRoom);

        // emailToSocket[data.user_email] = {
        //   userID: data.user_id,
        //   userName: data.user_name,
        // };
        // socketToEmail[data.user_id] = data.user_email;

        io.to(roomID).emit('notice', {
          msg: `${socket.id}님이 입장했습니다.`,
          roomToUser: roomToUser[roomID], // socketid arr
          socketToEmail: socketToEmail,
          emailToSocket: emailToSocket,
        });
        // User 입장 시 개인 welcome msg
        socket.emit('getDM', {
          from_id: 'admin',
          to_id: socket.id,
          msg: `Hello, ${socket.id}`,
        });
      }

      console.log('rooms :', rooms);
      console.log('room :', room);
      console.log('userToRoom:', userToRoom);
      console.log('roomToUser:', roomToUser);
    });

    socket.on('sending signal', (payload) => {
      // console.log('----------------sending signal');
      io.to(payload.userToSignal).emit('user joined', {
        signal: payload.signal,
        callerID: payload.callerID,
      });
    });

    socket.on('returning signal', (payload) => {
      // console.log('----------------returning signal');

      io.to(payload.callerID).emit('receiving returned signal', {
        signal: payload.signal,
        id: socket.id,
      });
    });

    // 방 나가기 클릭시,
    socket.on('exitRoom', async (data) => {
      let roomID = userToRoom[data.from_id];
      let myName = emailToSocket[socketToEmail[data.from_id]]?.userName;
      emailToSocket[socketToEmail[data.from_id]]
        ? (emailToSocket[socketToEmail[data.from_id]].userID = '')
        : false;
      // let userlistinRoom = await io.in(roomID).fetchSockets();
      // console.log('userlistinRoom:', userlistinRoom);

      roomToUser[roomID]?.length > 1
        ? (roomToUser[roomID] = roomToUser[roomID].filter(
            (e) => e !== data.from_id
          ))
        : delete roomToUser[data.from_id];

      delete socketToEmail[socket.id];

      io.to(roomID).emit('notice', {
        msg: `${myName}님이 방을 나갔습니다.`,
        roomToUser: roomToUser[roomID] || false,
        socketToEmail: socketToEmail,
        emailToSocket: emailToSocket,
      });

      socket.leave(roomID);
      delete userToRoom[data.from_id];
    });

    // User의 chat 수신 - 전체 전송
    socket.on('sendChat', (data) => {
      io.to(userToRoom[data.from_id]).emit('getChat', {
        from_id: data.from_id,
        msg: data.msg,
      });
    });

    // DM 수신 후 전송 (보낸 user, 받는 user both)
    socket.on('sendDM', (data) => {
      io.to(`${data.to_id}`).to(`${data.from_id}`).emit('getDM', {
        from_id: data.from_id,
        to_id: data.to_id,
        msg: data.msg,
      });
    });

    socket.emit('sendJoinMessage', socket.id);

    // 게임 시작 전,
    // 방장 빼고 전원 ready 누르면 방장 gamestart 버튼 disabled=false
    // gamestart 버튼 클릭
    // 게임 시작 : setIsGame(true)
    socket.on('gameReady', (data) => {
      let roomID = userToRoom[data.from_id];
      let readyCnt = roomToUser[roomID]?.length - 1; // 방장 빼고 전부 ready

      finalVoteList[roomID] = {};
      peopleVotedList[roomID] = {};
      userJobList[roomID] = {};

      checkReady[roomID] === readyCnt - 1
        ? io.to(roomToUser[roomID][0]).emit('readyComplete')
        : checkReady[roomID] > 0
        ? (checkReady[roomID] += 1)
        : ((checkReady[roomID] = 1),
          io.to(roomID).emit('gameNotice', {
            dayNight: false,
            msg: 'Player들이 Ready 중 입니다.',
            killed: false,
          }));
      console.log('readyOrNot: ', checkReady[roomID], readyCnt);
    });

    socket.on('finalVote', ({ from_id, agree }) => {
      const roomID = userToRoom[from_id];
      finalVoteList[roomID] ||= {};
      finalVoteList[roomID][from_id] = agree;
      let agreeCount = 0;
      let disagreeCount = 0;

      Object.keys(finalVoteList[roomID]).forEach((key) => {
        if (finalVoteList[roomID][key]) {
          agreeCount += 1;
        } else {
          disagreeCount += 1;
        }
      });

      io.to(roomID).emit('gameNotice', {
        msg: `찬성 : ${agreeCount}표, 반대 : ${disagreeCount}표`,
      });
    });

    const checkGameEnd = (id) => {
      const target = userJobList[id];

      console.log(target);

      let mafiaCount = 0;
      let citizenCount = 0;

      target.forEach((user) => {
        if (user.status === 'alive') {
          if (user.job === 'mafia') {
            mafiaCount += 1;
          } else {
            citizenCount += 1;
          }
        }
      });

      if (mafiaCount === 0) {
        io.to(id).emit('gameNotice', {
          msg: '마피아가 죽었으므로, 시민이 승리했습니다',
        });
        return true;
      }

      if (mafiaCount >= citizenCount) {
        io.to(id).emit('gameNotice', {
          msg: '마피아가 승리했습니다',
        });
        return true;
      }
      return false;
    };

    const clearGameData = (id) => {
      io.to(id).emit('gameEnd', true);

      console.log(`방 ${id} 게임 끝`);
      delete roomTimer[id];
      delete checkReady[id];
      delete mafiaVoteList[id];
      delete peopleVotedList[id];
      delete finalVoteList[id];
    };

    const getKilledUser = (id) => {
      if (!peopleVotedList[id]) {
        return undefined;
      }

      const votedCountList = Object.keys(peopleVotedList[id])
        .map((user) => ({
          id: user,
          count: peopleVotedList[id][user].length,
        }))
        .sort((a, b) => b.count - a.count);

      if (!votedCountList[1]) {
        return votedCountList[0]?.id;
      }

      if (votedCountList[0].count === votedCountList[1].count) {
        return undefined;
      }
      return votedCountList[0].id;
    };

    const setTimer = (id, index) => {
      roomTimer[id] = { ...timerList[index] };
    };

    const startTimer = (id) => {
      console.log(`타이머 시작. 방 번호 ${id}`);
      let targetIndex = 0;
      let isNoticeSended = false;

      const interval = setInterval(() => {
        if (!roomTimer[id]) {
          isNoticeSended = false;
          setTimer(id, 0);
        }

        if (roomTimer[id].ms <= 0) {
          isNoticeSended = false;
          targetIndex += 1;
          if (targetIndex > timerList.length - 1) {
            targetIndex = 0;
          }
          setTimer(id, targetIndex);
        }

        if (!isNoticeSended) {
          isNoticeSended = true;

          switch (roomTimer[id].type) {
            case 'dayDiscussion': {
              io.to(id).emit('gameNotice', {
                dayNight: roomTimer[id].type,
                msg: roomTimer[id].noticeMessage,
                killed: mafiaVoteList[id],
              });

              const userIndex = userJobList[id].findIndex(
                (user) => user.userId === mafiaVoteList[id]
              );

              if (userIndex >= 0) {
                userJobList[id][userIndex].status = 'dead';
              }

              mafiaVoteList[id] = undefined;

              if (checkGameEnd(id)) {
                clearGameData(id);
                clearInterval(interval);
                targetIndex = 0;
                return;
              }
              break;
            }
            case 'dayFinal': {
              io.to(id).emit('votedResult', { id: getKilledUser(id) });
              io.to(id).emit('gameNotice', {
                dayNight: roomTimer[id].type,
                msg: roomTimer[id].noticeMessage,
              });
              break;
            }
            case 'night': {
              let agreeCount = 0;
              let disagreeCount = 0;

              Object.keys(finalVoteList[id]).forEach((key) => {
                if (finalVoteList[id][key]) {
                  agreeCount += 1;
                } else {
                  disagreeCount += 1;
                }
              });

              const killedUser =
                agreeCount > disagreeCount && getKilledUser(id);

              io.to(id).emit('gameNotice', {
                dayNight: roomTimer[id].type,
                msg: roomTimer[id].noticeMessage,
                killed: killedUser,
              });

              const userIndex = userJobList[id].findIndex(
                (user) => user.userId === killedUser
              );

              if (userIndex >= 0) {
                userJobList[id][userIndex].status = 'dead';
              }

              finalVoteList[id] = {};
              peopleVotedList[id] = {};

              if (checkGameEnd(id)) {
                clearGameData(id);
                clearInterval(interval);
                targetIndex = 0;

                return;
              }
              break;
            }
            default: {
              io.to(id).emit('gameNotice', {
                dayNight: roomTimer[id].type,
                msg: roomTimer[id].noticeMessage,
              });
              break;
            }
          }
        }

        roomTimer[id].ms -= 1000;
        io.to(id).emit('timerChange', roomTimer[id]);
      }, 1000);
    };

    // ------------------------------------------------------[1] 게임 시작
    // 방장이 gameStart 누름
    socket.on('gameStart', ({ from_id, userList }) => {
      const roomID = userToRoom[from_id];
      const jobList = getJobList();

      io.to(roomID).emit('gameStart', { jobList });

      const userJob = [];
      userList.forEach((user, index) => {
        if (user) {
          userJob.push({ userId: user, job: jobList[index], status: 'alive' });
        }
      });
      userJobList[roomID] = userJob;

      startTimer(roomID);
      checkReady[roomID] = {};
    });

    // ------------------------------------------------------[2] 밤
    // 밤 - mafia가 고름
    socket.on('mafiaVoted', ({ from_id, killed_id }) => {
      const roomID = userToRoom[from_id];
      io.to(roomID).emit('mafiaPick', killed_id);
      mafiaVoteList[roomID] = killed_id;
    });

    // ------------------------------------------------------[3] 낮
    // 낮 - 죽일 사람 투표
    socket.on('peopleVoted', (data) => {
      let roomID = userToRoom[data.from_id];
      let killedid = data.killed_id;

      peopleVotedList[roomID] ||= {};

      if (peopleVotedList[roomID][killedid]) {
        peopleVotedList[roomID][killedid].push(data.from_id);
      } else {
        peopleVotedList[roomID] = {
          ...peopleVotedList[roomID],
          [killedid]: [data.from_id],
        };
      }

      let votedMessage = '';

      Object.keys(peopleVotedList[roomID]).forEach((user) => {
        votedMessage += `[ ${user} ] : ${peopleVotedList[roomID][user].length} 표 `;
      });

      io.to(roomID).emit('gameNotice', { msg: votedMessage });
    });

    // ------------------------------------------------------[4] 게임 종료
    // 게임 종료
    socket.on('gameEnd', (data) => {
      let roomID = userToRoom[data.from_id];
      delete checkReady[roomID];
      delete mafiaVoteList[roomID];
      delete peopleVotedList[roomID];
      delete finalVoteList[roomID];
    });

    socket.on('disconnect', () => {
      let roomID = userToRoom[socket.id];
      let myEmail = socketToEmail[socket.id];
      let myName = emailToSocket[myEmail]?.userName;
      emailToSocket[myEmail] ? (emailToSocket[myEmail].userID = '') : false;
      delete socketToEmail[socket.id];
      // console.log('emailToSocket: ', emailToSocket);
      // console.log('socketToEmail: ', socketToEmail);
      checkReady[roomID] -= 1;

      roomToUser[roomID]?.length > 1
        ? (roomToUser[roomID] = roomToUser[roomID].filter(
            (e) => e !== socket.id
          ))
        : delete roomToUser[socket.id];

      io.to(roomID).emit('notice', {
        msg: `${myName}님이 방을 나갔습니다.`,
        roomToUser: roomToUser[roomID] || false,
        socketToEmail: socketToEmail,
        emailToSocket: emailToSocket,
      });

      console.log(`User Disconnected : ${socket.id}(${myName})`);
      // console.log('check:', userToRoom[socket.id]?.slice(0, -2));
      socket.leave(roomID);
      delete userToRoom[socket.id];
    });
  });
};
