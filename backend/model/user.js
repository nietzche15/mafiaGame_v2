const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  // 이메일
  email: {
    type: String,
    required: true,
    unique: true,
  },
  // 닉네임
  nickname: {
    type: String,
    required: true,
    unique: true,
  },
  // 프로필
  profileImg: {
    type: String,
    required: true,
    default: 'default img',
  },
  // 마피아 플레이 횟수
  mafiaPlayCount: {
    type: Number,
    required: true,
    default: 0,
  },
  // 마피아 이긴 횟수
  mafiaWinCount: {
    type: Number,
    required: true,
    default: 0,
  },
  // 마피아 투표 횟수
  voteMafiaCount: {
    type: Number,
    required: true,
    default: 0,
  },
  // 총 투표 횟수
  totalCount: {
    type: Number,
    required: true,
    default: 0,
  },
  // 준비 여부
  isReady: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const User = model('user', UserSchema);
module.exports = User;
