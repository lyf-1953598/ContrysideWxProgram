// pages/lotteryRecord/lotteryRecord.js
wx.cloud.init()
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageType: '志愿活动记录',
    List: [],
    list: [],
    lotteryList: [],
    pastlotteryList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options);
    console.log(options.openID);
    //#region 
    // wx.cloud.callFunction({
    //   name: "getMyLottery",
    //   data: {
    //     openID: app.globalData.openid
    //   },
    //   success: (res1) => {
    //     console.log("请求云函数成功", res1)
    //     for (var i = 0; i < res1.result.list.length; i++) {
    //       console.log(res1.result.list[i])
    //       var s_time = Date.parse(new Date())
    //       var e_time = Date.parse(new Date(res1.result.list[i].lottery_detail[0].end_time))
    //       var usedTime = e_time - s_time
    //       wx.cloud.callFunction({
    //         name: "lotteryDetail",
    //         data: {
    //           lottery_id: res1.result.list[i].lottery_id
    //         },
    //         success: (res2) => {
    //           console.log("请求云函数成功", res2)
    //           if (usedTime > 0) {
    //             that.data.lotteryList.push(res2.result.list[0])
    //           } else {
    //             that.data.pastlotteryList.push(res2.result.list[0])
    //           }
    //           this.setData({
    //             lotteryList: that.data.lotteryList,
    //             pastlotteryList: that.data.pastlotteryList
    //           })
    //         }
    //       })
    //     }

    //     //  let lotteryList=this.data.lotteryList

    //     // console.log(a.length)
    //     //console.log(this.data.lotteryList)
    //     //console.log(this.data.pastlotteryList)
    //     // this.getlotterylist()
    //   },
    //   fail(res) {
    //     console.log("请求云函数失败", res)
    //   }
    // })
    //#endregion
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