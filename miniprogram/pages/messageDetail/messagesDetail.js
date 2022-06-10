// pages/messageDetail/messagesDetail.js



Page({

  /**
   * 页面的初始数据
   */
  data: {
    toView:'',
    height:0,
    userId:'',
    openID:'',
    
    actionSheetHidden: true,   //作为开关控制弹窗是否从底部弹出
    name:"狼月锋",
    avatar:"",
    myavatar:"../../static/images/lottery/avatar.jpg",
    inputValue:'',
    recordContent:[
      ]
  },

  choosePicture:function(){
    wx.chooseMedia({
      count: 9,
      mediaType: ['image','video'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        console.log(res)
        console.log(res.tempFiles[0].tempFilePath)
        console.log(res.tempFiles[0].size)
      }
    })
  },

  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  listenerButton: function() {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    });
  },
 
  listenerActionSheet:function() {
    this.setData({
     actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      toView: 'msg-' + (this.data.recordContent.length - 1),
      userId: options.userId,
      openID:options.openID,
      avatar:options.withAvatar,
      name:options.withName

    })
    this.getopenID()
    this.getMessages()


  },
  async getopenID(){
    var that = this
    wx.getStorage({
      key:'openID',
      success (res) {
        console.log(res);
        that.data.openID = res.data
        that.setData({
          openID:res.data});
          // console.log(that.data.openID)
        }
      })
      wx.getStorage({
        key:'userProfile',
        success (res) {
          // console.log(res);
          that.data.amyvatar = res.data.avatarUrl
          that.setData({
            myavatar:res.data.avatarUrl});
            // console.log(that.data.myavatar)
    
          }
        })
  },
  

  async getMessages(){
    var that = this
    console.log(that.data.userId)
    console.log(that.data.openID)
    wx.request({
      url: 'http://localhost:8080/message/getmessageList?',
      method: 'GET',
      data: {
        fromId: that.data.userId,
        toId: that.data.openID,
      },
      success: function (res) {
        // console.log(res.data);
        that.setData({
          messageList : res.data.messageList
        });
        console.log(that.data.messageList);
        var list = that.data.recordContent
        for(var i = 0;i<that.data.messageList.length;i++)
        {
          if(that.data.messageList[i].fromId == that.data.openID)
          {
            var obj = {id:"1",contactText:that.data.messageList[i].content,time:that.data.messageList[i].sendTime}
            list.push(obj)
          }
          else if(that.data.messageList[i].fromId == that.data.userId)
          {
            var obj = {id:"2",contactText:that.data.messageList[i].content,time:that.data.messageList[i].sendTime}
            list.push(obj)
          }
        }
        that.setData({
          recordContent:list
        })
        console.log(that.data.recordContent)
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


 

})