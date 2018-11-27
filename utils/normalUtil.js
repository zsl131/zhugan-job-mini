module.exports = {
  redirectToHome: ()=> {
    // wx.switchTab({
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  redirectToNoUser: () => {
    wx.reLaunch({
      url: '/pages/nouser/nouser',
      // complete: res=> {
      //   //console.log(res)
      // }
    })
  },
  redirectToMsgSucc: (msg, mainUrl, urlType) => {
    wx.navigateTo({
      url: '/pages/public/msg_succ?message='+msg+"&mainUrl="+mainUrl+"&urlType="+urlType
    })
  },
  redirectToMsgFail:(msg, mainUrl, urlType,mainBtnText,secondUrl,secondUrlType,secondBtnText) => {
    wx.navigateTo({
      url: '/pages/public/fail/msg_fail?message='+msg+'&mainUrl='+mainUrl+'&urlType='+urlType+"&mainBtnText="+mainBtnText+"&secondUrl="+secondUrl+"&secondUrlType="+secondUrlType+"&secondBtnText="+secondBtnText
    })
  }
}