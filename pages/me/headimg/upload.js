// pages/me/headimg/upload.js
import WeCropper from '../../../we-cropper/we-cropper.js'

const device = wx.getSystemInfoSync() // 获取设备信息
const width = device.windowWidth // 示例为一个与屏幕等宽的正方形裁剪框
const height = device.windowHeight
const imageW = parseInt(width / 95) * 95 * 0.8;
const imageH = parseInt(height / 120) * 120 * 0.8;
// console.log(width, imageW, height, imageH)
const app = getApp();
let openid = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cropperOpt: {
      id: 'cropper',
      width,  // 画布宽度
      height, // 画布高度
      scale: 2.5, // 最大缩放倍数
      zoom: 8, // 缩放系数
      cut: {
        x: (width - imageW) / 2, // 裁剪框x轴起点
        y: (height - imageH) / 2, // 裁剪框y轴期起点
        width: imageW, // 裁剪框宽度
        height: imageH // 裁剪框高度
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initCropper();
    this.uploadTap();
    const loginUser = JSON.parse(app.storage.getLoginUser());
    //console.log("=======", loginUser.openid)
    openid = loginUser.openid;
  },

  initCropper: function() {
    const { cropperOpt } = this.data

    // 若同一个页面只有一个裁剪容器，在其它Page方法中可通过this.wecropper访问实例
    new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
        //console.log(`wecropper is ready for work!`)
      })
      .on('beforeImageLoad', (ctx) => {
        //console.log(`before picture loaded, i can do something`)
        //console.log(`current canvas context: ${ctx}`)
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        //console.log(`picture loaded`)
        //console.log(`current canvas context: ${ctx}`)
        wx.hideToast()
      })

    // 若同一个页面由多个裁剪容器，需要主动做如下处理

    this.A = new weCropper(cropperOptA)
    this.B = new weCropper(cropperOptB)
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
  touchStart(e) {
    this.wecropper.touchStart(e)
  },
  touchMove(e) {
    this.wecropper.touchMove(e)
  },
  touchEnd(e) {
    this.wecropper.touchEnd(e)
  },
  uploadTap() {
    const self = this

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0]
        self.wecropper.pushOrign(src)
      },
      fail(res) {
        wx.navigateBack()
      }
    })
  },
  getCropperImage() {
    this.wecropper.getCropperImage((src) => {
      //console.log(src)
      if (src) {
        // wx.previewImage({
        //   current: '', // 当前显示图片的http链接
        //   urls: [src] // 需要预览的图片http链接列表
        // });
        wx.uploadFile({
          url: app.config.UPLOAD_FILE,
          filePath: src,
          formData: {
            "formData": "headimg",
            "openid": openid
          },
          name: 'files',
          success: (result) => {
            const data = JSON.parse(result.data);
            //console.log(data)
            wx.switchTab({
              url: '/pages/me/index',
            })
            // console.log(result) 
          }
        })
      } else {
        console.log('获取图片地址失败，请稍后重试')
      }
    })
  }
  
})