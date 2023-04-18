import React from 'react';

const Message = ({ type, msg, fromId, toId }) => {
  if (type === 'DirectChat') {
    return (
      <div className="DirectChat">
        {fromId} : {msg}
      </div>
    );
  }
  if (type === 'MyDM') {
    return (
      <div className="MyChatBox">
        <div className="MyDM">
          DM to {toId} : {msg}
        </div>
      </div>
    );
  }
  if (type === 'ServerChat') {
    return (
      <>
        <div className="NickName">{fromId}</div>
        <div className="ServerChat">{msg}</div>
      </>
    );
  }
  if (type === 'MyChatBox') {
    return (
      <div className="MyChatBox">
        <div>ME</div>
        <div className="MyChat">{msg}</div>
      </div>
    );
  }

  return <div className={type}>{msg}</div>;
};

export default Message;
