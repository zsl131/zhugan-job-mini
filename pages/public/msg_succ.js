// pages/public/msg_succ.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message: "操作成功！",
    urlType: '',
    mainUrl: '',
    year: '',
    appName: app.globalData.appName
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData(options);
    this.buildYear();
  },
  buildYear: function(e) {
    const myDate = new Date();
    const year = myDate.getFullYear();
    const yearStr = year + "-" + (year+2);
    //console.log(yearStr)
    this.setData({year: yearStr});
  },
  mainOpt: function(e) {
    //console.log(e)
    const data = this.data;
    //console.log(data)
    if (!data.mainUrl || data.mainUrl =='undefined') {
      wx.navigateBack({
        delta: 1
      })
    } else {
      if(data.urlType == "tabbar" || data.urlType == "tabBar" || data.urlType == 'tab' || data.urlType == 'bar') {
        wx.switchTab({
          url: data.mainUrl,
        })
      } else {
        wx.navigateTo({
          //"pages/me/index"
          url: data.mainUrl,
        })
      }
      
    }
  }
})