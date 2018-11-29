// pages/me/information/modify.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    takePhoto: false,
    // takeFront: false, //上传身份证正面
    onTakePhoto: false, //上传身份证
    showCanvas: false, //是否显示画布
    onProcess: false, //照片处理
    idCardSrc: '/images/img/idcard-1.jpg',
    idCardSrc2: "/images/img/idcard-2.jpg", //示例图
    idCardHand: '/images/img/idcard-hand.jpg',
    frontPic:'', //身份证正面
    backPic:'', //身份证背面
    handPic: '', //手持身份证
    photoBg: '', //当前背景图
    canvas1: '', //画布1
    canvas2: '', //画布2
    photoBgList: ['/images/img/bg-card-front.png', '/images/img/bg-card-back.png'], //背景图
    curPhoto:'', //拍照事件
    photoMsg: '', //拍照说明
    idCardError: false, //未识别身份证时
    cardInfo:{}, //身份证信息
    sexName:'点击选择',
    sex:'',
    sexObj:[{name:'男', key: '1'}, {name:'女', key: '2'}],
    submitErrorMsg: '', //提交出错信息
    canEdit: false, //是否可编辑，如果是审核中或审核通过都不可编辑
    status: '', //状态
    applyObj: {}
  },

  //显示的时候检测有无Personal
  onShow: function () {
    app.personalUtil.getCurrentPersonal(false, function (p) {
      //console.log(p);
      if (!p || p.checkPhone != '1') {
        app.normalUtil.redirectToMsgFail("请先绑定手机号码，再认证个人身份信息", "/pages/me/phone/bind", "", "立即绑定", "/pages/me/index", "tabBar", "返回个人中心");
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadApply();
  },
  loadApply:function(e) {
    const baseUrl = app.globalData.baseUrl;
    const that = this;
    app.apiUtil.request("MINI-C12",{},function(res) {
      const obj = res.obj;
      if(obj) {
        that.setData({
          idCardSrc: baseUrl + obj.frontPic,
          idCardSrc2: baseUrl + obj.backPic,
          idCardHand: baseUrl + obj.handPic,
          sex: obj.sex,
          sexName: obj.sex == "1" ? "男" : "女",
          status: obj.status,
          applyObj: obj,
          cardInfo: {
            name: obj.name,
            cardNo: obj.identity,
            address: obj.address
          }
        });
        if(obj.status=='0' || obj.status == '1') {
          that.setCanEdit(false);
        } else {that.setCanEdit(true);}
      } else {
        that.setCanEdit(true)
      }
    });
  },
  setCanEdit: function(flag) {
    this.setData({ canEdit: flag});
  },
  generateRandomId:function(flag) {
    const id = parseInt(9999999 * Math.random());
    //console.log(id)
    if(flag=="1") {
      this.setData({ canvas1: "id-"+id});
    } else {
      this.setData({ canvas2: "id-" + id });
    }
  },
  bindSexChange: function(e) {
    let obj = this.data.sexObj[e.detail.value];
    //console.log(obj)
    this.setData({sexName: obj.name, sex: obj.key});
  },
  onSubmitApply:function(e) {
    //console.log(e)
    const obj = e.detail.value;
    const thisData = this.data;
    if(!thisData.frontPic) {
      this.setSubmitError("请上传身份证正面");
    } else if(!thisData.backPic) {
      this.setSubmitError("请上传身份证背面");
    } else if(!thisData.handPic) {
      this.setSubmitError("请上传手持身份证图片");
    } else if(!obj.name) {
      this.setSubmitError("姓名不能为空");
    } else if(!obj.identity) {
      this.setSubmitError("身份证号不能为空");
    } else if (!thisData.sex) {
      this.setSubmitError("请选择性别");
    } else if(!obj.address) {
      this.setSubmitError("家庭住址不能为空");
    } else {
      obj.frontPic = thisData.frontPic;
      obj.backPic = thisData.backPic;
      obj.handPic = thisData.handPic;
      obj.sex = thisData.sex;
      obj.formid = e.detail.formId;
      //console.log(obj); //TODO 需要提交到服务端
      app.apiUtil.request("MINI-C11", obj, function(res) {
        app.normalUtil.redirectToMsgSucc("您的认证信息已成功提交，请等待工作人员的审核！", "/pages/me/index", "tabBar")
      });
    }
  },
  onTakePhoto: function(e) { //打开拍照
    //console.log(e);
    const photoType = e.currentTarget.dataset.photoType;
    if(photoType=='front') { //身份证正面
      this.setData({ onTakePhoto: true, curPhoto: 'takeFront', photoMsg: '请将身份证正面对准框中', photoBg: this.data.photoBgList[0] });
      this.generateRandomId("1");
    } else if(photoType == 'back') { //身份证背面
      this.setData({ onTakePhoto: true, curPhoto: 'takeBack', photoMsg: '请将身份证背面对准框中', photoBg: this.data.photoBgList[1] });
      this.generateRandomId("2");
    } else if(photoType=='hand') { //手持
      this.setData({ onTakePhoto: true, curPhoto: 'takeHand', photoMsg: '', photoBg: '' })
    } else { //其他
      this.setData({ takePhoto: true})
    }
  },
  closePhoto: function(e) { //关闭拍照
    //console.log(e);
    //const target = e.currentTarget.dataset.target;
    this.setData({ onTakePhoto: false });
  },
  takePhotoFun: function(photoType, e) {
    var that = this;
    const isFront = photoType=='front'; //是否上传正面
    // console.log(e);
    that.setData({ onProcess: true });
    const ctx = wx.createCameraContext();
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        //that.setData({ idCardSrc: res.tempImagePath, onTakePhoto: false });
        const device = wx.getSystemInfoSync();
        if (isFront) { that.setData({ showCanvas: true });}
        else { that.setData({ showCanvas2: true });}
        const canvasId = isFront ? that.data.canvas1 :that.data.canvas2;
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
              const formData = isFront?"idCard":"idCardBack"; //
              if (isFront) {
                that.setData({ idCardSrc: res.tempFilePath, onTakePhoto: false, showCanvas: false, showCanvas2: false, onProcess: false });
              } else {
                that.setData({ idCardSrc2: res.tempFilePath, onTakePhoto: false, showCanvas: false, showCanvas2: false, onProcess: false });
              }
              wx.uploadFile({
                url: app.config.UPLOAD_FILE,
                filePath: res.tempFilePath,
                formData: {
                  "formData": formData
                },
                name: 'files',
                success: (result) => {
                  const data = JSON.parse(result.data);
                  if (isFront) {
                    that.setData({frontPic: data.data[0]})
                    if (data && data.extra && data.extra.cardNo) { //不为空才设置
                      that.setData({ cardInfo: data.extra, idCardError: false,sex:data.extra.sex=='男'?"1":"2",sexName:data.extra.sex });
                    } else {
                      that.setData({ idCardError: true});
                    }
                  } else {
                    that.setData({ backPic: data.data[0] })
                  }
                  // console.log(result) 
                }
              })
            }
          })
        }, 500)

      }
    })
  }, 
  takeFront: function(e) {
    this.takePhotoFun("front",e);
  },
  takeBack: function(e) {
    this.takePhotoFun("back", e);
  },
  takeHand: function(e) {
    var that = this;
    // console.log(e);
    that.setData({ onProcess: true });
    const ctx = wx.createCameraContext();
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        that.setData({ idCardHand: res.tempImagePath, onTakePhoto: false, showCanvas: false, showCanvas2: false, onProcess: false });
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
  setSubmitError: function(msg) {
    this.setData({ submitErrorMsg: msg});
  },
  cancelPhoto: function() {
    this.setData({takePhoto: false});
  }

})