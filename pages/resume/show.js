// pages/resume/show.js
const app = getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    baseUrl: app.globalData.baseUrl,
    personal: {},
    age: '-',
    name:'',
    workNames: '',
    resume: {},
    store:{},
    status: "",
    statusName: '',
    updateTime: '',
    hasViewPhone: false, //是否已经查看过电话，防止重复扣费
    hasViewVideo: false, //是否已经查看过视频，防止重复扣费
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
    that = this;
    const id = options.id?options.id:1;
    // const id = options.id;
    that.setData({id: id});
    that.loadResume();
  },
  onStore: function() {
    const store = that.data.store;
    let msg ;
    app.apiUtil.request("MINI-C47", {id: that.data.id}, function(res) {
      //console.log(res);
      if(store) {
        msg = "取消收藏成功";
        that.setData({ store: null });
      } else {
        msg = "收藏成功";
        that.setData({ store: res.store });
      }
      wx.showToast({
        title: msg,
        icon: 'none'
      })
    })
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  loadResume: function() {
    const id = that.data.id;
    app.apiUtil.request("MINI-C45", {id:id}, function(res) {
      //console.log(res)
      that.setData({ resume: res.obj, personal: res.personal, age: app.util.getAge(res.personal.identity), workNames: app.util.removeFirstComma(res.obj.workNames, ","), name: res.personal.name.substring(0,1) + (res.personal.sex =="1"?"先生":"女士"), store: res.store});
      that.generateTime(res.obj.updateLong);
      that.recordShow(); //记录显示
    });
  },
  generateTime: function (longTime) {
    const str = app.util.buildTime(longTime);
    //console.log(str)
    that.setData({ updateTime: str });
  },
  recordShow: function() { //记录显示信息
    app.apiUtil.request("MINI-C46", {id: that.data.id}, function(res) {})
  },
  onViewPhone: function(e) { //查看手机号码
    //console.log(e)
    const phone = e.currentTarget.dataset.phone;
    //console.log(phone);
    that.checkAuth("phone", phone);
  },
  onViewVideo: function(e) { //查看视频
    const url = e.currentTarget.dataset.url;
    //console.log(url)
    that.checkAuth("video", url);
  },
  //检测权限，type: phone、video
  checkAuth: function(type, value) { 
    if(type=="phone") {
      if(that.data.hasViewPhone) {
        that.showPhone(value); //拨打电话
        return;
      }
    }
    if(type=="video") {
      if(that.data.hasViewVideo) {
        that.showVideo(value); //显示视频
        return;
      }
    }
    app.walletUtil.loadWallet(function (res) {
      //console.log(res);
      const viewCount = res.companyViewCount; //可查看个人简历次数
      //console.log(viewCount)
      if (viewCount <= 0) {
        wx.showModal({
          title: '系统提示',
          content: '查看点数不足，是否现在充值？',
          success: function (e) {
            //console.log(e);
            if(e.confirm) {
              //TODO 
              wx.navigateTo({
                url: '/pages/production/index',
              })
            }
          }
        })
      } else {
        if(type=="phone") {
          that.showPhone(value);
          that.setData({ hasViewPhone: true });
          //isCharge, amount, level, objType, objCode, objName
          app.walletUtil.recordWalletDetail("0", 1, "company", "companyViewCount", value, that.data.resume.name);
        } else if(type=='video') {
          that.showVideo(value);
          that.setData({ hasViewVideo: true });
          //isCharge, amount, level, objType, objCode, objName
          app.walletUtil.recordWalletDetail("0", 1, "company", "companyViewCount", value, that.data.resume.name);
        }
      }
    })
  },
  showVideo: function(url) { //显示视频
    that.setData({hasViewVideo: true});
  },
  showPhone: function(phone) { //拨打电话
  //console.log(that.)
    wx.showModal({
      title: '系统提示',
      content: that.data.resume.name+'的手机号码是：'+phone+"，是否立即拨打？",
      success: function(e) {
        if(e.confirm) {
          wx.makePhoneCall({
            phoneNumber: phone,
          })
        }
      }
    })
  }
})