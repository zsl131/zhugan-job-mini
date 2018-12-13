// pages/production/index.js
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const app = getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["个人虚拟币", "单位虚拟币"],
    activeIndex: 1,
    sliderOffset: 0,
    sliderLeft: 0,
    data:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    const target = options.target;
    if(target=="company") {
      that.setData({activeIndex: 1});
    } else {
      that.setData({activeIndex: 0});
    }
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    that.loadProduction();
  },
  tabClick: function (e) {
    //console.log(e);
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    that.loadProduction();
  },

  getTargetUser: function() { //获取适用对象名称
    const activeIndex = that.data.activeIndex;
    const res = activeIndex==0?"personal":"company";
    return res;
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
    const target = that.getTargetUser();
    app.apiUtil.request("MINI-C61", {target: target}, function(res) {
      //console.log(res);
      that.setData({data: res.data});
    })
  }
})