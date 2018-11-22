//app.js
const storage = require("./utils/loginUserUtil.js")
var apiUtil = require('./utils/apiUtil.js')
const config = require("./utils/config.js");
const normalUtil = require("./utils/normalUtil.js");
App({
  onLaunch: function () {
    try {
      const loginUser = storage.getLoginUser();
      //console.log("---------", loginUser)
      if (loginUser == null || loginUser == "") {
        normalUtil.redirectToNoUser();
      }
    } catch (e) {
      //console.log(e)
      normalUtil.redirectToNoUser();
    }
  },
  globalData: {
    //qqmapKey: 'XXQBZ-SQZKF-SKLJT-NJGNK-AUV5J-KMBUD'
    baseUrl: config.BASE_URL,
    appName: config.APP_NAME,
  },
  apiUtil: apiUtil,
  config: config,
  normalUtil: normalUtil,
  storage: storage,
})