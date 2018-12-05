var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var app = getApp();
Page({
  data: {
    baseUrl: app.globalData.baseUrl,
    tabs: ["个人信息", "作为人才", "作为用人单位"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    src:'',
    account:{}, //
    personal: {}, //
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  onShow: function() {
    this.loadInfo();
  },
  checkAuth: function(e) {
    console.log(e);
    const type = e.currentTarget.dataset.type;
    const auth = e.currentTarget.dataset.auth;
    if(type=='phone') {
      if(auth=='0') {
        wx.navigateTo({
          url: '/pages/me/phone/bind', //跳转到手机绑定页面
        })
      } else {
        wx.showToast({
          title: '已绑定手机号码',
          icon:"none"
        })
      }
      
    } else if(type=='personal') {
      wx.navigateTo({
        url: '/pages/me/information/modify', //跳转到个人认证
      })
    } else if(type == 'company') {
      wx.navigateTo({
        url: '/pages/me/company/auth', //跳转到个人认证
      })
    }
  },
  loadInfo: function(e) {
    const that = this;
    app.apiUtil.request("MINI-C02",{}, function(res) {
      console.log(res)
      that.setData({account: res.account, personal: res.personal});
      app.storage.setLoginUser(res.account); //存缓存
    });
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  uploadHeadimg: function(e) {
    wx.navigateTo({
      url: '/pages/me/headimg/upload',
    })
  }
 
});