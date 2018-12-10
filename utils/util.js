const getAge = (identity) => {
  if(!identity) {return "-";}
  else {
    //获取年龄
    var myDate = new Date();
    var month = myDate.getMonth() + 1;
    var day = myDate.getDate();
    var age = myDate.getFullYear() - identity.substring(6, 10) - 1;
    if (identity.substring(10, 12) < month || identity.substring(10, 12) == month && identity.substring(12, 14) <= day) {
      age++;
    }
    return age +" 岁";
  }
}
/** 去除第一个标点字号comma */
const removeFirstComma = (str, comma) => {
  if (str.startsWith(comma)) {
    return str.substring(str.indexOf(comma)+comma.length, str.length);
  }
  return str;
}
//生成时间，如：10分钟前..
const buildTime = (longTime) => {
  const myDate = new Date();
  //TODO 
  const s = parseInt((myDate.getTime() - longTime)/1000);
  //console.log(myDate.getTime());
  //console.log(longTime, s)
  // if(s<60) {return s+"秒";}
  // else if(s>=60 && s<60*3) {return ""}
  let showStr = '';
  if (s < 60) { showStr = "刚刚"; } //20秒内
  else if (60 <= s && s < (60 * 60)) { showStr = parseInt((s / 60) + "", 10) + "分钟前"; }
  else if (60 * 60 <= s && s < 60 * 60 * 24) { showStr = parseInt((s / (60 * 60)) + "", 10) + "小时前"; }
  else if (60 * 60 * 24 <= s && s < 60 * 60 * 24 * 12) { showStr = parseInt((s / (60 * 60 * 24)) + "", 10) + "天前"; }
  else {
    let d = new Date(longTime);
    //getFullYear获取的就是当前系统本地的年
    let year = d.getFullYear();

    //由于js的月份是从0开始的,所以月份加上1
    let month = d.getMonth() + 1;

    //返回的是一个月中的某一天1-31
    let myDate = d.getDate();
    showStr = year + "-" + month + "-" + myDate;
  }
  return showStr;
}
module.exports = {
  getAge: getAge,
  removeFirstComma: removeFirstComma,
  buildTime: buildTime,
}
