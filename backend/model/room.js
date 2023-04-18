const { Schema, model } = require("mongoose");

const RoomSchema = new Schema({
  _id: Number,

  // 방 제목
  roomTitle: {
    type: String,
    required: true,
  },
  // 게임 진행 중 여부
  roomStatus: {
    type: Boolean,
    default: false,
  },
  // 비밀방 여부
  private: {
    type: Boolean,
    required: false,
    default: null,
  },
  // 비밀번호
  roomPassword: {
    type: Number,
    required: false,
    default: null,
  },
  // 방장
  roomCaptain: {
    type: String,
    required: false,
    default: null,
  },
  // 마피아
  mafiaUser: {
    type: String,
    required: false,
    default: null,
  },
  // 방 번호
  currentCount: {
    type: Number,
    default: 0,
  },
});

const Room = model("room", RoomSchema);

module.exports = Room;
