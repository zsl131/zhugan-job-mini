const apiUtil = require('./apiUtil.js')
const CUR_PERSONAL_NAME = "current-personal-";

const setCurrentPersonal = (personal) => {
  wx.setStorage({
    key: CUR_PERSONAL_NAME,
    data: JSON.stringify(personal),
  })
}

/**
 * 获取当前的Personal对象
 * @params remote 是否直接获取远程true：直接从服务端获取，false：先检测缓存，失败时再从服务端获取
 */
const getCurrentPersonal = (remote, sucFn) => {
  if(remote) {
    getCurrentPersonalRemote(sucFn)
  } else {
    wx.getStorage({
      key: CUR_PERSONAL_NAME,
      success: function(e) {sucFn(JSON.parse(e.data))},
      fail: function (e) { getCurrentPersonalRemote(sucFn)}
    })
  }
}

const getCurrentPersonalRemote =(sucFn) => {
  apiUtil.request("MINI-C02", {}, function(res) {
    //console.log(res);
    if(res) {
      wx.setStorage({
        key: CUR_PERSONAL_NAME,
        data: JSON.stringify(res.personal),
      })
      sucFn(res.personal);
    }
  });
}

module.exports = {
  getCurrentPersonal: getCurrentPersonal,
  setCurrentPersonal: setCurrentPersonal,
}