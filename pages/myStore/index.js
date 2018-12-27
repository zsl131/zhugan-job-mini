// pages/resumeStore/index.js
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const app = getApp();
let that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.globalData.baseUrl,
    tabs: ["收藏的简历", "收藏的招聘"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    resumeData:[], //收藏的简历
    recruitData:[], //收藏的招聘
    resumePage: 0,
    recruitPage: 0,
    resumeReload: true,
    recruitReload: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    that.loadStore();
  },

  loadStore: function() {
    const index = that.data.activeIndex;
    //console.log(index)
    if(index==0) { //简历
      const flag = that.data.resumeReload;
      if(flag) {
        app.apiUtil.request("MINI-C48", { page: that.data.resumePage}, function (res) {
          // console.log(res);
          that.storageStore(index, res.data);
        })
      } else {
        wx.showToast({
          title: '没有更多数据了',
          icon: "none"
        });
      }
    } else if(index==1) { //招聘

    }
  },

  storageStore: function(activeIndex, data) {
    if(activeIndex==0) { //简历
      if(data && data.length>0) {
        //const page = that.data.resumePage;
       // const data= that.data.resumeData;
        let newData = that.data.resumeData;
        data.forEach((item) => {
          item.age = app.util.getAge(item.identity);
          item.name = item.name.substring(0, 1) + (item.sex == '1' ? "先生" : "女士"); 
          newData.push(item);
        });
        that.setData({ resumeData: newData, resumePage: that.data.resumePage + 1 });
      } else {
        that.setData({ resumeReload: false});
      }
    } else if(activeIndex == 1) { //招聘
      if (data && data.length > 0) {
        //const page = that.data.resumePage;
        // const data= that.data.resumeData;
        let newData = that.data.recruitData;
        data.forEach((item) => {
          item.age = app.util.getAge(item.identity);
          item.name = item.name.substring(0, 1) + (item.sex == '1' ? "先生" : "女士");
          newData.push(item);
        });
        that.setData({ recruitData: newData, recruitPage: that.data.recruitPage + 1 });
      } else {
        that.setData({ resumeReload: false });
      }
    }
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
  onReachBottom: function () {
    //console.log("-------bottom-----------");
    that.loadStore();
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  onRemoveStore: function(e) { //取消收藏
    //console.log(e)
    const target = e.currentTarget.dataset;
    const id = target.id;
    const type = target.type;
    const name = target.name;

    wx.showModal({
      title: '系统提示',
      content: '确定取消对['+name+']的收藏吗？',
      success: (r) => {
        //console.log(res)
        if(r.confirm) {
          if(type=='resume') { //简历
            app.apiUtil.request("MINI-C49", { id: id }, function (res) {
              //console.log(id)
              let arr = that.data.resumeData;
              arr.splice(arr.findIndex(item => item.id == id), 1);
              //console.log(arr);
              that.setData({ resumeData: arr});
              wx.showToast({
                title: res.message,
                icon: "none"
              })
            });
          } else if(type=='recruit') { //招聘

          }
        }
      }
    })
  },
})