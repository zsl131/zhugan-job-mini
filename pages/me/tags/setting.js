// pages/me/tags/setting.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:[],
    selectedIds:[], //已经选择的标签ID
    selectedText:[] //已经选择的标签
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData();
  },
  rebuildData: function() {
    const data = this.data.data;
    const selectedIds = this.data.selectedIds;
    let newData = [];
    data.forEach((item)=> {
      item.selected = selectedIds.includes(item.id);
      newData.push(item);
    })
    //console.log(newData);
    this.setData({data: newData});
  },

  setPersonalData: function(personal) {
    const tags = personal.tags;
    const tagsIds = personal.tagsIds;
    let ids=[], texts=[];
    if(tagsIds) {
      tags.split(",").forEach((item)=>{if(item && item!='') {texts.push(item);}});
      tagsIds.split(",").forEach(item => { if (item && item != '') return ids.push(parseInt(item))});
    }
    //console.log(ids, texts)
    this.setData({ selectedIds: ids, selectedText: texts});
  },

  loadData: function() {
    const that = this;
    app.apiUtil.request("MINI-CT01",{}, function(res) {
      //console.log(res);
      that.setData({data: res.data});
      that.setPersonalData(res.personal)
      that.rebuildData();
    })
  },

  onClickTag: function(e) {
    const obj = e.currentTarget.dataset;
    const objId = obj.objId;
    const objText = obj.objText;
    this.generateData(objId, objText);
  },

  generateData: function(objId, objText) {
    let selectedIds = this.data.selectedIds;
    let selectedText = this.data.selectedText;
    if (selectedIds.includes(objId)) {
      selectedIds.splice(selectedIds.findIndex(item => item === objId), 1);
      selectedText.splice(selectedText.findIndex(item => item === objText), 1);
    } else {
      if (selectedIds.length >= 4) {
        wx.showToast({
          title: '最多只能设置4个标签',
          icon: 'none'
        })
      } else {
        selectedIds.push(objId);
        selectedText.push(objText);
      }
    }
    this.rebuildData();
  },

  onSave: function() {
    const selectedIds = this.data.selectedIds;
    const selectedText = this.data.selectedText;

    let ids = "";
    let texts = "";
    selectedIds.forEach(item=>{ids += item+","});
    selectedText.forEach(item => { texts += item + "," });
    //console.log(ids, texts)
    app.apiUtil.request("MINI-CT02", { tags: texts, tagsIds: ids}, function(res) {
      wx.showToast({
        title: res.message
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

})