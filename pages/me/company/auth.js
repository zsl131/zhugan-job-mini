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
    frontPic:'',
    companyPic:'',
    actionItems: ["从相机拍摄", "从相册选择"],
    takePhoto: false,
    onTakePhoto: false,
    showCanvas: false, //是否显示画布
    canvas1: '', //画布1
    onProcess: false, //照片处理
    licenseInfo: {}, //营业执照信息
    licenseError: false,
    photoMsg:'',
    applyObj:{},
    submitErrorMsg: '',
  },

  //显示的时候检测有无Personal
  onShow: function() {
    app.personalUtil.getCurrentPersonal(false, function (p) {
      //console.log(p);
      if (!p || p.checkIdcard != '1') {
        app.normalUtil.redirectToMsgFail("请先认证个人身份信息，再认证单位信息", "/pages/me/information/modify", "", "立即认证", "/pages/me/index", "tabBar", "返回个人中心");
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadApply();
  },
  loadApply: function (e) {
    const baseUrl = app.globalData.baseUrl;
    const that = this;

    app.apiUtil.request("MINI-C22", {}, function (res) {
      const obj = res.obj;
      console.log(obj)
      if (obj) {
        that.setData({
          idCardSrc: baseUrl + obj.frontPic,
          licensePic: baseUrl + obj.licensePic,
          status: obj.status,
          applyObj: obj,
          licenseInfo: {
            companyName: obj.companyName,
            boss: obj.bossName,
            companyCode: obj.companyNo,
            address: obj.companyAddress
          }
        });
        if (obj.status == '0' || obj.status == '1') {
          that.setCanEdit(false);
        } else { that.setCanEdit(true); }
      } else {
        that.setCanEdit(true)
      }
    });
  },
  setCanEdit: function (flag) {
    this.setData({ canEdit: flag });
  },
  //显示操作菜单
  showActionSheet: function(e) {
    const that = this;
    const photoType = e.currentTarget.dataset.photoType;
    //console.log(photoType);
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
        //console.log(res);
        that.setData({ onTakePhoto: false, showCanvas: false, showCanvas2: false, onProcess: true });
        if(photoType=='idcard') {
          that.setData({ idCardSrc: res.tempFilePaths[0]});
          that.uploadImg(res.tempFilePaths[0], "idcardnocheck")
        } else if(photoType=='license') {
          that.setData({ licensePic: res.tempFilePaths[0] });
          that.uploadImg(res.tempFilePaths[0], "license")
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
              console.log(res)
              that.setData({ idCardSrc: res.tempFilePath, onTakePhoto: false, showCanvas: false, onProcess: false });
              that.uploadImg(res.tempFilePath, "idcardnocheck");
            }
          })
        }, 500)

      }
    })
  },
  closePhoto: function (e) { //关闭拍照
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
        that.setData({ licensePic: res.tempImagePath, onTakePhoto: false, showCanvas: false });
        that.uploadImg(res.tempImagePath, "license");
      }
    })
  },
  uploadImg: function(path, formData) {
    const that = this;
    wx.uploadFile({
      url: app.config.UPLOAD_FILE,
      filePath: path,
      formData: {
        "formData": formData
      },
      name: 'files',
      success: (result) => {
        const data = JSON.parse(result.data);
        console.log(data)
        that.setData({ onProcess: false});
        if (formData=='license') { //如果是营业执照
          that.setData({ companyPic: data.data[0] })
          if (data && data.extra && data.extra.companyCode && data.extra.companyCode!='无') { //不为空才设置
            that.setData({ licenseInfo: data.extra, licenseError: false });
          } else {
            that.setData({ licenseError: true });
          }
        } else {
          that.setData({ frontPic: data.data[0] })
        }
        // console.log(result) 
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
  onSubmitApply: function(e) {
    const obj = e.detail.value;
    console.log(obj)
    const thisData = this.data;
    if (!thisData.idCardSrc) {
      this.setSubmitError("请上传法人身份证正面");
    } else if (!thisData.licensePic) {
      this.setSubmitError("请上传营业执照");
    } else if (!obj.companyName) {
      this.setSubmitError("单位名称不能为空");
    } else if (!obj.companyNo) {
      this.setSubmitError("信用代码不能为空");
    } else if (!obj.bossName) {
      this.setSubmitError("法人姓名不能为空");
    } else if (!obj.companyAddress) {
      this.setSubmitError("单位地址不能为空");
    } else {
      obj.frontPic = thisData.frontPic;
      obj.licensePic = thisData.companyPic;
      obj.formid = e.detail.formId;
      //console.log(obj); //TODO 需要提交到服务端
      app.apiUtil.request("MINI-C21", obj, function (res) {
        app.normalUtil.redirectToMsgSucc("您的认证信息已成功提交，请等待工作人员的审核！", "/pages/me/index", "tabBar")
      });
    }
  },
  setSubmitError: function (msg) {
    this.setData({ submitErrorMsg: msg });
  },
})