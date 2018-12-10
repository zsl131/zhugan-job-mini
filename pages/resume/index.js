// pages/resume/index.js
const app = getApp();
let that ;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.baseUrl,
    personal:{},
    age:'-',
    workNames: '',
    resume: {},
    status: "",
    statusName: '',
    updateTime:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    //that.loadPersonal();
    
    //console.log(app.util.getAge("532127198902080028"))
    //console.log(app.util.removeFirstComma(",abcd,efgh", ","))
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
    that.loadResume();
  },
  loadResume: function() {
    app.apiUtil.request("MINI-C41",{}, function(res) {
      //console.log(res);
      that.setData({ resume: res.obj, personal: res.personal, age: app.util.getAge(res.personal.identity), workNames: app.util.removeFirstComma(res.obj.workNames, ",")});
      that.generateStatus(res.obj.status);
      that.generateTime(res.obj.updateLong);
    })
  },
  generateTime: function(longTime) {
    const str = app.util.buildTime(longTime);
    //console.log(str)
    that.setData({ updateTime: str});
  },
  generateStatus: function(status) {
    if(status == '0') {
      that.setStatus(status, "不显示");
    } else if(status == '1') {
      that.setStatus(status, "正常显示");
    } else if(status == '2') {
      that.setStatus(status, "审核中");
    } else if(status == '3') {
      that.setStatus(status, "被驳回");
    }
  },
  setStatus: function(status, statusName) {
    that.setData({status: status, statusName: statusName});
  },
  modifyStatus: function() {
    const status = that.data.status;
    if (status != '0' && status != '1') return;
    const name = status =="1"?"不显示":"显示";
    wx.showModal({
      title: '操作提示',
      content: '确定将简历设置为【'+name+'】吗？',
      success: function(e) {
        //console.log(e)
        if(e.confirm) {
          app.apiUtil.request("MINI-C43", {status: status=="1"?"0":"1"}, function(res) {
            wx.showToast({
              title: res.message,
            });
            that.loadResume(); //设置后刷新数据
          })
        }
      }
    })
  },
})