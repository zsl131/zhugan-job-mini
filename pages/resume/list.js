// pages/resume/list.js
const app = getApp();
let that ;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.baseUrl,
    data:[],
    page: 0,
    canLoad: true, //
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
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
    that.loadResumes();
  },

  loadResumes: function() {
    const page = that.data.page;
    //_status:1只显示审核通过的数据
    app.apiUtil.request("MINI-C44", {page: page, "_status":"1"}, function(res) {
      //console.log(res)
      that.rebuildResumes(res.data)
    })
  },

  rebuildResumes: function(data) {
    if(data.length>0) {
      let newData = that.data.data;
      data.forEach((item) => { item.age = app.util.getAge(item.identity); 
      item.name = item.name.substring(0,1) + (item.sex=='1'?"先生":"女士"); newData.push(item) });
      that.setData({ data: newData, page: that.data.page + 1 });
    } else {
      wx.showToast({
        title: '没有更多数据了',
        icon: "none"
      });
      that.setData({canLoad: false});
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //console.log("-------bottom-----------");
    that.loadResumes();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})