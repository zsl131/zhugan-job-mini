var apiUtil = require('./apiUtil.js')
const LOGIN_USER_NAME = "loginUser";

const getLoginUser =()=> {
  return wx.getStorageSync(LOGIN_USER_NAME);
}

const setLoginUser = (loginUser) => {
  loginUser = JSON.stringify(loginUser);
  wx.setStorageSync(LOGIN_USER_NAME, loginUser);
}

module.exports = {
  setLoginUser: setLoginUser,
  getLoginUser: getLoginUser
}