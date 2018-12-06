var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var app = getApp();
Page({
  data: {
    baseUrl: app.globalData.baseUrl,
    tabs: ["基础信息", "锦囊"],
    activeIndex: 1,
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
  setStatus: function() {
    const that = this;
    const status = this.data.personal.workStatus;
    //console.log(status)
    wx.showModal({
      title: '操作提示',
      content: '是否设置工作状态为：'+(status=='1'?"待业中":"在职中")+"？",
      success: function(res) {
        if(res.confirm) {
          app.apiUtil.request("MINI-C04", {status:(status=="1"?"2":"1")}, function (res) {
            wx.showToast({
              title: res.message,
            })
            let p = that.data.personal;
            p.workStatus = (status == "1" ? "2" : "1");
            that.setData({personal : p});
          });
        }
      },complete: function() {}
    })
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
      //console.log(res)
      that.setData({account: res.account, personal: res.personal});
      app.storage.setLoginUser(res.account); //存缓存
      app.personalUtil.setCurrentPersonal(res.personal);
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