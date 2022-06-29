// pages/winningRecord/winningRecord.js
import requestCloud from '../../utils/request'
wx.cloud.init()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageType: '抽奖记录',
    lotteryList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userProfile')
    console.log(userInfo)
    if (userInfo) { //获取成功则更新到页面
      this.setData({
        userInfo
      })
      //更新用户数据
      this.updateData(userInfo.openID)
    }
  },
  async updateData(openID) {
    //获取参加中奖记录
    let resMWR = await requestCloud("getMyWinRec", {
      openID:app.globalData.openid
    })
    let show=[];
    console.log(show)
    for (var i = 0; i < resMWR.list.length; i++) {
     
      wx.cloud.callFunction({
        name: "lotteryDetail",
        data: {
          lottery_id: resMWR.list[i].lottery_id
        },
        success: (res2) => {
          console.log("请求云函数成功", res2)
          var s_time = Date.parse(new Date())
          var e_time = Date.parse(new Date(res2.result.list[0].end_time))
          var usedTime = e_time - s_time
          console.log(usedTime)
          if (usedTime < 0) {
            console.log("a")
            show.push(resMWR.list[i])}
          this.setData({
            lotteryList: show,
          })
        }
      })
    }
    // let lotteryList = resMWR.list
    console.log('show', show)
    // this.setData({
    //   lotteryList
    // })
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})