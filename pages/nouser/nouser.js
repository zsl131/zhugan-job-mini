var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const user = app.storage.getLoginUser(function() {
      app.normalUtil.redirectToHome();
    })
  },
  getUserInfo: res => {
    //res.detail.userInfo
    console.log(res)
    wx.login({
      success: data => {
        console.log(data);
        const deviceInfo = wx.getSystemInfoSync();
        console.log(deviceInfo);
        //提交到服务端获取和解析用户信息
        app.apiUtil.request("WX_LOGIN", { code: data.code, pwd: res.detail.encryptedData, iv: res.detail.iv, brand: deviceInfo.brand, model: deviceInfo.model}, response => {
         console.log(response)
          if(response.account) {
            app.storage.setLoginUser(response.account); 
            app.normalUtil.redirectToHome();
          }
        })
      }
    })
  }
})