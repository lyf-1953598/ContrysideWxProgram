// pages/messageDetail/messagesDetail.js

var util = require('../../utils/util'); //参数是util.js所在的路径，参照自个儿的

var recorderManager = wx.getRecorderManager()
const audioCtx = wx.createInnerAudioContext()

//开始录音回调
recorderManager.onStart(() => {
  console.log('开始录音')
})
//暂停录音回调
recorderManager.onPause(() => {
  console.log('录音暂停')
})
//停止录音回调
recorderManager.onStop((res) => {
  console.log('录音停止', res)
  console.log('录音保存路径' + res.tempFilePath)
})

audioCtx.onPlay(()=>{
  console.log('开始播放')
})

Page({

  /**
   * 页面的初始数据
   */
  data: {
    srcI:'',
    toView:'',
    height:0,
    userId:'',
    openID:'',
    currenTime:'',
    actionSheetHidden: true,   //作为开关控制弹窗是否从底部弹出
    actionSheetHidden1: true,   //作为开关控制弹窗是否从底部弹出
    name:"狼月锋",
    avatar:"",
    myavatar:"../../static/images/lottery/avatar.jpg",
    inputVal:'',
    recordContent:[
      ]
  },

  choosePicture:function(){
    var that = this
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
        that.setData({
          srcI:res.tempFiles[0].tempFilePath
        })
        that.uploadFile()
      }
    })
  },
async uploadFile(){
  var that = this
  wx.uploadFile({
    url: 'http://localhost:8080/message/uploadImage', 
    filePath: that.data.srcI,                  //要传的图片路径
    name: 'file',                                //获取图片二进制文件的key
    formData: {                                  //其他需要携带的参数
      // 'user': 'test'
    },
    success (res){
      console.log(res.data)
      //do something
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
  listenerButton1: function() {
    this.setData({
      actionSheetHidden1: !this.data.actionSheetHidden1
    });
  },
  listenerActionSheet:function() {
    this.setData({
     actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  listenerActionSheet1:function() {
    this.setData({
     actionSheetHidden1: !this.data.actionSheetHidden1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
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
          recordContent:list,
          toView: 'msg-' + (that.data.recordContent.length - 1),

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


  bindKeyInput: function(e) {
    this.setData({
      inputVal:e.detail.value
    }) 
  },  

  sendButton(){   
     var that = this
     console.log(that.data.userId)
     console.log(that.data.openID)
    console.log(that.data.inputVal)
    if(that.data.inputVal===null)
    {
      wx.showToast({
        title: '不能发送空消息',
        icon: 'error',
        duration: 2000
      })      
      return;
    }
    
  wx.request({
    url: 'http://localhost:8080/message/sendMessage',
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data: {
      fromId: that.data.openID,
      targetId: that.data.userId,
      content: that.data.inputVal,
      type: 'text'
    },
    success: function (res) {
      console.log(res.data);
      var currenTime= util.formatTime(new Date());
      
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    // this.setData({
    //   currenTime: currenTime
    // });

      var list = that.data.recordContent
          var obj = {id:"1",contactText:that.data.inputVal,time:currenTime}
          list.push(obj)
      that.setData({
        recordContent:list,
        toView: 'msg-' + (that.data.recordContent.length - 1),
        inputVal : ''
      })


      
    },
    fail: function () {
      console.log("调用接口失败");
    }
  })
  },

  //开始录音
  record: function () {
    recorderManager.start()
  },
  //暂停
  pause: function () {
    recorderManager.pause()
  },
  //停止
  stop: function () {
    recorderManager.stop()
  },
//回放
playback:function(){
  audioCtx.src=tempFilePath
  audioCtx.play()
}
})