// pages/resume/update.js
const app = getApp();
let that ;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:[], //工作类型列表
    personal: {},
    resume: {},
    curCount: 0,
    maxCount: 200,
    remark:'',
    remarkError: false,
    workCount: 2, //最多可选择工作岗位的个数
    showWorks: false,
    selectedWorks:[],
    selectedWorkIds:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.initData();
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
  initData: function() {
    app.personalUtil.getCurrentPersonal(false, function (res) {
      that.setData({ personal: res })
    })
    
    app.apiUtil.request("MINI-WT01",{}, function(res) {
      that.setData({data: res.data});
      app.apiUtil.request("MINI-C41", {}, function (res) {
        const obj = res.obj;
        let ids = [], names = [];
        obj.workIds.split(",").forEach((item) => { if (item) { ids.push(parseInt(item)) } });
        obj.workNames.split(",").forEach((item) => { if (item) { names.push(item) } });
        //console.log(ids)
        that.setData({ resume: obj, remark: obj.remark, curCount: obj.remark.length, selectedWorks: names, selectedWorkIds: ids });
        that.rebuildData();
      })
    })
  },
  onInputRemark: function(e) {
    let val = e.detail.value;
    const maxCount = that.data.maxCount;
    let curCount = val.length;
    val = val.substring(0, maxCount);
    if(curCount>=maxCount) {
      that.setData({ remarkError: true});
      curCount = maxCount;
    } else {
      that.setData({ remarkError: false});
    }
    that.setData({ remark: val, curCount: curCount})
    //console.log(e);
  },
  setWorkShow: function(e) {
    //console.log(e)
    const show = e.target.dataset.show;
    that.setData({ showWorks: show=='1'})
  },
  onClick: function(e) {
    // console.log(e)
    const len = that.data.workCount;
    const objId = e.target.dataset.objId;
    const objName = e.target.dataset.objName;
    const selectedIds = that.data.selectedWorkIds;
    const selectedNames = that.data.selectedWorks;
    if (selectedIds.includes(objId)) {
      selectedIds.splice(selectedIds.findIndex(item => item === objId), 1);
      selectedNames.splice(selectedNames.findIndex(item => item === objName), 1);
    } else {
      if (selectedIds.length >= len) {
        wx.showToast({
          title: '最多只能设置' + len + '个岗位',
          icon: 'none'
        })
      } else {
        selectedIds.push(objId);selectedNames.push(objName)
      }
    }
    that.setData({selectedWorkIds: selectedIds, selectedWorks:selectedNames});
    //console.log(that.data);
    that.rebuildData();
  },
  rebuildData: function () {
    const data = this.data.data;
    const selectedIds = this.data.selectedWorkIds;
    //console.log(selectedIds, data)
    let newData = [];
    data.forEach((item) => {
      item.selected = selectedIds.includes(item.id);
      newData.push(item);
    })
    //console.log(newData);
    this.setData({ data: newData });
  },
  onSubmit: function() {
    const selectedIds = that.data.selectedWorkIds;
    const selectedNames = that.data.selectedWorks;
    const remark = that.data.remark;
    //console.log(remark)
    if(selectedIds.length<=0) {
      wx.showToast({
        title: '请先选择岗位',
        icon: 'none'
      })
    } else if(!remark) {
      wx.showToast({
        title: '请输入个人说明',
        icon: 'none'
      })
    } else {
      let ids = ',', names=',';
      selectedIds.forEach((item)=>{ids+=(item+",");})
      selectedNames.forEach((item) => { names += (item + ","); })
      //console.log(ids, names);
      app.apiUtil.request("MINI-C42",{workIds: ids, workNames: names, remark: remark, status: "2"}, function(res) {
        wx.showToast({
          title: res.message,
        });
        wx.navigateBack({})
      })
    }
  }
})