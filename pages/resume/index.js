// pages/resume/index.js
const app = getApp();
let that ;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    personal:{},
    resume: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.loadPersonal();
    that.loadResume();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  loadResume: function() {
    app.apiUtil.request("MINI-C41",{}, function(res) {
      //console.log(res);
      that.setData({resume: res.obj});
    })
  },
  loadPersonal: function() {
    app.personalUtil.getCurrentPersonal(false, function(res) {
      that.setData({personal:res})
      //console.log(res);
    })
  }
})