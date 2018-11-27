// pages/public/fail/msg_fail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message: "操作成功！",
    urlType: '',
    mainUrl: '',
    mainBtnText: '嗯，知道了', 
    secondUrl: '', 
    secondUrlType: '', 
    secondBtnText: '返回',
    year: '',
    appName: app.globalData.appName
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
    let newOpt = {};
    for (var o in options) {
      const val = options[o];
      if (typeof val != 'undefined' && val !='undefined') {
        newOpt[o] = options[o]
      }
    }
    //console.log("new::", newOpt)
    this.setData(newOpt);
    this.buildYear();
  },
  buildYear: function (e) {
    const myDate = new Date();
    const year = myDate.getFullYear();
    const yearStr = year + "-" + (year + 2);
    //console.log(yearStr)
    this.setData({ year: yearStr });
  },
  secondOpt: function(e) {
    const data = this.data;
    //console.log(data)
    if (!data.secondUrl || data.secondUrl == 'undefined') {
      wx.navigateBack({
        delta: 1
      })
    } else {
      if (data.secondUrlType == "tabbar" || data.secondUrlType == "tabBar" || data.secondUrlType == 'tab' || data.secondUrlType == 'bar') {
        wx.switchTab({
          url: data.secondUrl,
        })
      } else {
        wx.navigateTo({
          url: data.secondUrl,
        })
      }

    }
  },
  mainOpt: function (e) {
    //console.log(e)
    const data = this.data;
    //console.log(data)
    if (!data.mainUrl || data.mainUrl == 'undefined') {
      wx.navigateBack({
        delta: 1
      })
    } else {
      if (data.urlType == "tabbar" || data.urlType == "tabBar" || data.urlType == 'tab' || data.urlType == 'bar') {
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