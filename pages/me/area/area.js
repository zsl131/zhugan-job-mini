// pages/me/area/area.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: [],
    curPersonal: {},
    checkedCode: '',
    checkedName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData();
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

  loadData: function() {
    const that = this;
    app.apiUtil.request("MINI-C31", {}, function(res) {
      //console.log(res)
      that.setData({data: res.data});
      that.initData();
    })
  },
  initData: function() {
    const that = this;
    app.personalUtil.getCurrentPersonal(false, function (res) {
      //console.log(res);
      that.setData({ curPersonal: res});
      that.setDataChecked(res.areaCode);
    })
  },
  onClick: function(e) {
    //console.log(e)
    const code = e.target.dataset.objCode;
    const name = e.target.dataset.objName;
    this.setDataChecked(code);
    this.setData({ checkedCode: code, checkedName: name});
  },
  setDataChecked: function(code) {
    const that = this;
    if(code) {
      let newData = [];
      this.data.data.forEach((item)=> {
        item.checked = false; //先全部取消选择
        if(item.countyCode==code) {
          item.checked = true;
          that.setData({checkedCode: item.countyCode, checkedName: item.countyName})
        }
        newData.push(item);
      });
      this.setData({data:newData});
    }
  },
  onInputName: function(e) { //筛选
    //console.log(e)
    const name = e.detail.value;
    let newData = [];
    if(name) {
      this.data.data.forEach((item) => {
        item.hide = true; //先全部取消选择
        if (item.countyName.indexOf(name) >= 0) {
          item.hide = false;
        }
        newData.push(item);
      });
    } else {
      this.data.data.forEach((item) => {
        item.hide = false; 
        newData.push(item);
      });
    }
    
    this.setData({ data: newData });
  },
  onSave: function() {
    const code = this.data.checkedCode;
    const name = this.data.checkedName;
    //console.log(code, name);
    if(code && name) {
      app.apiUtil.request("MINI-C32",{code: code, name: name}, function(res) {
        wx.showToast({
          title: res.message
        })
      });
    } else {
      wx.showToast({
        title: '请先选择区域',
        icon: 'none'
      })
    }
  }

})