// pages/production/buy.js
const app = getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    pro:{},
    personal:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData(options);
    that.loadProduction();
    that.loadPersonal();
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
  loadProduction: function() {
    const id = that.data.id;
    app.apiUtil.request("MINI-C62", {id: id}, function(res) {
      //console.log(res);
      that.setData({pro: res.obj});
    })
  },
  loadPersonal: function() {
    app.personalUtil.getCurrentPersonal(false, function(obj) {
      // console.log(obj)
      that.setData({personal: obj});
    });
  },
  onBuy: function() {
    const pro = that.data.pro;
    if(pro.price<=0) {
      app.apiUtil.request("MINI-C63", {id: that.data.id}, function(res) {
        app.normalUtil.redirectToMsgSucc("购买成功", "/pages/production/index", "");
      });
    } else {
      //需要付费
      console.log("-")
    }
  }
})