const apiUtil = require('./apiUtil.js')
const loadWallet = (suc) => {
  apiUtil.request("MINI-C51", {}, function(res) {
    suc(res.obj);
  })
}

/** 
 * 记录账户详情
 */
const recordWalletDetail = (isCharge, amount, level, objType, objCode, objName)=> {
  apiUtil.request("MINI-C52", {amount: amount, isCharge: isCharge, level:level, objType: objType, objName: objName, objCode: objCode}, function(res) {
    //console.log(res)
  })
}

module.exports = {
  loadWallet: loadWallet,
  recordWalletDetail: recordWalletDetail,
}
