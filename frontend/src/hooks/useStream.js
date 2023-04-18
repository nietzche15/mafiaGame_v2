import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getUserList, setSocketId } from '../store/modules/room';
import Peer from 'simple-peer';
import { socket } from '../utils/socket';

function getNewPeer(stream, initiator = false) {
  const peer = new Peer({
    initiator,
    config: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' },
      ],
    },
    trickle: false,
    stream,
  });
  return peer;
}

function createPeer(userToSignal, callerID, stream) {
  const peer = getNewPeer(stream, true);
  peer.on('signal', (signal) => {
    socket.emit('sending signal', {
      userToSignal,
      callerID,
      signal,
    });
  });
  console.log(peer);
  return peer;
}

function addNewPeer(incomingSignal, callerID, stream) {
  const peer = getNewPeer(stream);
  peer.on('signal', (signal) => {
    socket.emit('returning signal', { signal, callerID });
  });
  peer.signal(incomingSignal);
  return peer;
}

const videoConstraints = {
  height: 200,
  width: 200,
};

const useStream = () => {
  const dispatch = useDispatch();
  const [stream, setStream] = useState();
  const [peerList, setPeerList] = useState([]);
  const { myEmail } = useSelector((state) => state.userInfo);
  const { state: roomID } = useLocation();

  useEffect(() => {
    (async () => {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
        audio: true,
      });
      setStream(newStream);
      socket.emit('join room', { roomID, myEmail });
      dispatch(setSocketId(socket.id));
    })();
  }, [dispatch, roomID, myEmail]);

  useEffect(() => {
    if (!stream) return;
    /** 첫 입장 */
    socket.on('all users', (users) => {
      dispatch(getUserList([...users, socket.id]));
      setPeerList(
        users.map((user) => ({
          userId: user,
          peer: createPeer(user, socket.id, stream),
        }))
      );
    });

    socket.on('user joined', ({ signal, callerID }) => {
      setPeerList((prev) => [
        ...prev,
        { userId: callerID, peer: addNewPeer(signal, callerID, stream) },
      ]);
    });
  }, [dispatch, stream]);

  useEffect(() => {
    socket.on('receiving returned signal', (payload) => {
      const item = peerList.find((p) => p.userId === payload.id);
      item.peer.signal(payload.signal);
    });
    return () => {
      socket.removeListener('receiving returned signal');
    };
  }, [peerList]);

  return {
    peerList,
    stream,
  };
};

export default useStream;
