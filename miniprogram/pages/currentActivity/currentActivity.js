// pages/currentActivity/currentActivity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityID:'',
    activityName:'',
    activityCode:'',
    activityAddress:'',
    activityStartTime:'',
    activityEndTime:'',
    activityNumber:'',
    activityType:'',
    activityDescription:'',

  },
  tolotteryDetails:function(e){
    wx.navigateTo({
      url: '/pages/lotteryDetails/lotteryDetails',
    })
  },
  signUp:function(e){
    wx.request({
      url: 'http://localhost:8080/task/signUp',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        // 'Content-Type': 'application/json'
      },
      data:{
        assignmentId:this.data.activityID,
        userId:wx.getStorageSync('openID')
      },
      success:  (res)=>  {
        console.log(res.data)
      },
      fail: function (res) {
        console.log(res.data)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    this.setData({
      activityID:options.activityId
    })
    wx.request({
      url: 'http://localhost:8080/task/getOneTask',
      method:'GET',
      data:{
        assignmentId:this.data.activityID
    },
      success:(res)=> {
        console.log(res.data.data)
        this.setData({
          activityName:res.data.data.info.title,
          activityCode:res.data.data.info.signinCode,
          activityAddress:res.data.data.info.place,
          activityStartTime:res.data.data.info.startTime,
          activityEndTime:res.data.data.info.endTime,
          activityNumber:res.data.data.info.number,
          activityType:res.data.data.info.type,
          activityDescription:res.data.data.info.description,
        })
    },
      fail:function(res){
        console.log("接口调取失败！");
    }
  })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})