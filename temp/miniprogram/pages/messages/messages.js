// pages/messages/messages.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openID:'',
    list1:[],
    messageList:[
      {
        withName:"系统通知",
        withAvatar:'../../static/images/notice.png',
        messageContent:'你被举报了！！！',
        sendTime:'2020-05-16 12:00',
        withId:'oln6h4lnZLCd56x_c_FpXsAgcpNA'
      }

    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.getopenID()
  },
async getopenID(){
  var that = this
  wx.getStorage({
    key:'openID',
    success (res) {
      // console.log(res);
      that.data.openID = res.data
      that.setData({
        openID:res.data});
        // console.log(that.data.openID)
       that.getChatList()

      }
    })
},

async getChatList(){
  var that = this
  wx.request({
    url: 'http://47.97.99.93:8080/message/getchatList?',
    method: 'GET',
    data: {
      myId: that.data.openID
    },
    success: function (res) {
      // console.log(res.data.chatDetailList);
      that.setData({
        messageList : res.data.chatDetailList
      });
      // console.log(that.data.messageList);
    },
    fail: function () {
      console.log("调用接口失败");
    }
  })
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

  },

  toDetail(event) {
    // console.log(event.currentTarget.dataset.id);
    wx.navigateTo({
      url: '/pages/messageDetail/messagesDetail?userId='+event.currentTarget.dataset.id+'&openID='+this.data.openID+'&withAvatar='+event.currentTarget.dataset.avatar+'&withName='+event.currentTarget.dataset.name,
    })
  }

  
})

