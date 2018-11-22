// pages/me/phone/bind.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canGetCode: false,
    canSubmit: false,
    canInputCode: false,
    phone:'',
    codeBtnText: '获取验证码',
    intervalId: 0,
    errMsg:'',
    code:'', //服务端返回的验证码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onInputPhone: function(e) {
    const val = e.detail.value;
    this.setData({phone: val, canGetCode: this.checkPhone(val)})
  },
  onBindPhone: function(e) {
    //app.normalUtil.redirectToMsgSucc("测试信息", "/pages/me/index", "tabbar")
    console.log(e);
    const code = e.detail.value.code;
    if(this.data.code == code) {
      console.log("绑定成功");
      app.apiUtil.request("MINI-C03", {phone: this.data.phone}, function(res) {
        app.normalUtil.redirectToMsgSucc("手机号码绑定成功", "/pages/me/index", "tabbar")
      });
    } else {
      this.setData({errMsg: "验证码错误"});
    }
  },
  onGetCode: function(e) {
    const that = this;
    if(that.data.intervalId!=0) {return;} //防止重复点击
    const data = that.data;
    const phone = data.phone;
    if(that.checkPhone(phone)) {
      that.setCodeBtnText();
    } else {
      that.showError();
    }
  },
  setCodeBtnText: function() {
    const that = this;
    let flag = 10;
    that.setData({ codeBtnText: (flag--) + "s后重获" });
    const id = setInterval(function () {
      that.setData({ codeBtnText: (flag--) + "s后重获" });
      if (flag <= -1) {
        clearInterval(that.data.intervalId);
        that.setData({ codeBtnText: "重获验证码", intervalId: 0 })
      }
    }, 1000);
    that.setData({ intervalId: id });
    that.sendCode();
  },
  sendCode: function() {
    const that = this;
    app.apiUtil.request("MINI-S01", {phone: this.data.phone}, function(res) {
      console.log(res)
      if(res.flag=='0') {
        that.setData({errMsg: res.message});
      } else {
        that.setData({ canInputCode: true, code: res.code});
        wx.showToast({
          title: res.message,
          icon: "none"
        })
      }
    })
  },
  inputCode: function(e) {
    console.log(e);
    const that = this;
    const code = e.detail.value;
    if(code.length==4) {
      that.setData({canSubmit: true});
    } else {
      that.setData({ canSubmit: false });
    }
  },
  checkPhone: function(phone) {
    if (!(/^1[234567890]\d{9}$/.test(phone))) {
      return false;
    } else {return true;}
  },
  showError:function(e) {
    wx.showToast({
      title: '请输入正确的手机号码',
      icon: 'none'
    })
  }
})