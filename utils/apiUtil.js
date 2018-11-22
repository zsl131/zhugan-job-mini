// 加载配置文件
const config = require('./config.js');
//import { getLoginUser} from './localStorageUtil.js';
function buildParams(obj) {
  try { //如果没有登陆用户就不传openid和nickname
    const loginUser = JSON.parse(wx.getStorageSync("loginUser"));
    console.log(loginUser)
    obj.openid = loginUser.openid;
    obj.nickname = loginUser.nickname;
    obj.headimg = loginUser.headimg;
  } catch(e) {}
  //console.log(obj)
  let params = "";
  for (var o in obj) {
    //console.log(o)
    params += (params.startsWith("?") ? "&" : "?") + o + "=" + (encodeURI(obj[o]));
  }
  return params;
};

module.exports = {
  request: (serviceName, params, success, fail) => {
    wx.showLoading({
      title: '加载中...',
    })
    //const loginUser = getLoginUser();
    //console.log(loginUser)
    params = buildParams(params);
    // console.log(params);
    wx.request({
      url: config.API_HOST+params,
      method: "GET",
      header: {
        "api-code":serviceName,
        "auth-token": config.AUTH_TOKEN
      },
      success: res => {
        if (res.data.errCode == '0') { if (success && typeof success ==="function") {success(res.data.result);}}
        else {
          if (fail && typeof fail === "function") { fail(res.data.result) } else {
            wx.showModal({
              title: "请求出错",
              content: res.data.reason,
              showCancel: false,
              confirmColor:"#888888"
            })
          }
        }
      }, fail: res => {
        console.log(res)
        if (fail && typeof fail === "function") { fail("网络异常，请检查网络")} else {
          wx.showModal({
            title: '系统提示',
            content: '网络异常，请检查网络',
            showCancel: false
          })
        }
      },complete: res => {
        wx.hideLoading();
      }
    })
  }
}