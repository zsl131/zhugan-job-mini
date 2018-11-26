// pages/me/company/auth.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canEdit: true,
    idCardSrc: '/images/img/idcard-1.jpg',
    licensePic: '/images/img/license.jpg',
    actionItems: ["从相机拍摄", "从相册选择"],
    takePhoto: false,
    onTakePhoto: false,
    showCanvas: false, //是否显示画布
    canvas1: '', //画布1
    onProcess: false, //照片处理
    photoMsg:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //显示操作菜单
  showActionSheet: function(e) {
    const that = this;
    const photoType = e.currentTarget.dataset.photoType;
    console.log(photoType);
    wx.showActionSheet({
      itemList: that.data.actionItems,
      success: function(res) {
        console.log(res)
        if (res.tapIndex==0) {
          that.onTakePhotoCamera(photoType);
        } else if (res.tapIndex==1) {
          that.onChooseImg(photoType);
        }
      }
    })
  },
  onChooseImg: function(photoType) {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        console.log(res);
        that.setData({ onTakePhoto: false, showCanvas: false, showCanvas2: false, onProcess: false });
        if(photoType=='idcard') {
          that.setData({idCardSrc: res.tempFilePaths[0]});
        } else if(photoType=='license') {
          that.setData({ licensePic: res.tempFilePaths[0] });
        }
      },
    })
  },
  onTakePhotoCamera: function (photoType) {
    //console.log(e);
    //const photoType = e.currentTarget.dataset.photoType;
    if (photoType == 'license') { //营业执照正面
      this.setData({ onTakePhoto: true, curPhoto: 'takeLicense', photoMsg: '', photoBg: '' });
    } else if (photoType == 'idcard') { //身份证正面
      this.setData({ onTakePhoto: true, curPhoto: 'takeIdcard', photoMsg: '请将身份证正面对准框中', photoBg: '/images/img/bg-card-front.png' });
    }
  },
  takeIdcard: function(e) {
    var that = this;
    this.generateRandomId("1");
    that.setData({ onProcess: true });
    const ctx = wx.createCameraContext();
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        //that.setData({ idCardSrc: res.tempImagePath, onTakePhoto: false });
        const device = wx.getSystemInfoSync();
        that.setData({ showCanvas: true }); 
        const canvasId = that.data.canvas1;
        const ctx_A = wx.createCanvasContext(canvasId);
        ctx_A.drawImage(res.tempImagePath, 0, 0, device.windowWidth, device.windowHeight);//
        ctx_A.draw();
        setTimeout(function () {
          wx.canvasToTempFilePath({//调用方法，开始截取
            x: device.screenWidth * 0.08,
            y: device.screenHeight * 0.26,
            width: device.windowWidth * 0.85,
            height: device.windowHeight * 0.38,
            destWidth: device.windowWidth * 0.85,
            destHeight: device.windowHeight * 0.38,
            canvasId: canvasId,
            success: function (res) {
              that.setData({ idCardSrc: res.tempFilePath, onTakePhoto: false, showCanvas: false, onProcess: false });
            }
          })
        }, 500)

      }
    })
  },
  closePhoto: function (e) { //关闭拍照
    //console.log(e);
    //const target = e.currentTarget.dataset.target;
    this.setData({ onTakePhoto: false });
  },
  takeLicense: function(e)  {
    var that = this;
    // console.log(e);
    that.setData({ onProcess: true });
    const ctx = wx.createCameraContext();
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        that.setData({ licensePic: res.tempImagePath, onTakePhoto: false, showCanvas: false, onProcess: false });
        wx.uploadFile({
          url: app.config.UPLOAD_FILE,
          filePath: res.tempImagePath,
          formData: {
            "formData": ""
          },
          name: 'files',
          success: (result) => {
            const data = JSON.parse(result.data);
            // console.log(result) 
            that.setData({ handPic: data.data[0] })
          }
        })

      }
    })
  },
  generateRandomId: function (flag) {
    const id = parseInt(9999999 * Math.random());
    //console.log(id)
    if (flag == "1") {
      this.setData({ canvas1: "id-" + id });
    } else {
      this.setData({ canvas2: "id-" + id });
    }
  },
})