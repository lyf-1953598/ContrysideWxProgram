// app.js
wx.cloud.init()
import requestCloud from '/utils/request'
import './envList'
App({
  onLaunch() {
    wx.cloud.init({
      env:'realsad-5gf3okr86e531451',
      // realsad-5gf3okr86e531451
      //draw-a-lottery-0gptvzfw661e55d1
    })
    this.globalData = {

    }
    /**
     * 打开小程序的时候首先获得用户openid
     */
    this.getOpenID()
  },
  //requestCloud是异步请求，另定义async方法
  async getOpenID() {
    let result = await requestCloud('getopenID')
    this.globalData.openid = result.openid
    //console.log(this.globalData.openid)
  }
  // globalData: {
  //   userInfo: null
  // }
})