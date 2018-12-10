// pages/me/edu/edu.js
const app = getApp();
let that ;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:[],
    curPersonal: {},
    checkedId: '',
    checkedName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.loadData();
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
  loadData: function () {
    const that = this;
    app.apiUtil.request("MINI-DE01", {}, function (res) {
      //console.log(res)
      that.setData({ data: res.data });
      that.initData();
    })
  },
  initData: function () {
    const that = this;
    app.personalUtil.getCurrentPersonal(false, function (res) {
      //console.log(res);
      that.setData({ curPersonal: res });
      that.setDataChecked(res.eduId);
    })
  },
  onClick: function (e) {
    //console.log(e)
    const code = e.target.dataset.objCode;
    const name = e.target.dataset.objName;
    this.setDataChecked(code);
    this.setData({ checkedId: code, checkedName: name });
  },
  setDataChecked: function (code) {
    const that = this;
    if (code) {
      let newData = [];
      this.data.data.forEach((item) => {
        item.checked = false; //先全部取消选择
        if (item.id == code) {
          item.checked = true;
          that.setData({ checkedId: item.id, checkedName: item.name })
        }
        newData.push(item);
      });
      this.setData({ data: newData });
    }
  },
  onSave: function () {
    const code = this.data.checkedId;
    const name = this.data.checkedName;
    //console.log(code, name);
    if (code && name) {
      app.apiUtil.request("MINI-DE02", { eduId: code, eduName: name }, function (res) {
        wx.showToast({
          title: res.message,
          success: function() {
            wx.navigateBack()
          }
        })
      });
    } else {
      wx.showToast({
        title: '请先选择学历名称',
        icon: 'none'
      })
    }
  }
})