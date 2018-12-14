// pages/wallet/index.js
const app = getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wallet:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.loadWallet();
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
  loadWallet: function() {
    app.apiUtil.request("MINI-C51",{}, function(res) {
      that.setData({wallet: res.obj});
    })
  }
})