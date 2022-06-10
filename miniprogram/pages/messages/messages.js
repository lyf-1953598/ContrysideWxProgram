// pages/messages/messages.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageList:[
      {
        name:"系统通知",
        avatar:'../../static/images/notice.png',
        content:'你被举报了！！！',
        time:'2020-05-16 12:00'
      },
      {
        name:"狼月锋",
        avatar:'../../static/images/lottery/avatar.jpg',
        content:'你好你好你好你好',
        time:'2020-05-16 12:00'
      },
      {
        name:"狼月锋",
        avatar:'../../static/images/lottery/avatar.jpg',
        content:'你好qqqq你好你好你好',
        time:'2020-05-16 13:00'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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