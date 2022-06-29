// pages/messageDetail/messagesDetail.js

var util = require('../../utils/util'); //参数是util.js所在的路径，参照自个儿的

var recorderManager = wx.getRecorderManager()
const audioCtx = wx.createInnerAudioContext()
var tempFilePath = ''
var duration = ''


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
  tempFilePath = res.tempFilePath
  duration = res.duration

})

audioCtx.onPlay(()=>{
  console.log('开始播放')
})

Page({

  /**
   * 页面的初始数据
   */
  data: {
    picPath:'',
    files:'',
    tempFilePath:'',
    duration:'',
    recordText:'点击开始录音',
    // recordText1:'点击回放录音',
    btnimg:'../../static/images/messagesDetail/mic-line.png',
    status:'ready',
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
  chooseFile() {
    var that = this
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        var file = 'voucherData.matterapply_file'
        const tempFilePaths = res.tempFiles
        that.setData({
          files: tempFilePaths[0]
        })
        // console.log(that.data.files)
      }
    })
  },
  async uploadFile1(){
    var that = this
    wx.uploadFile({
      url: 'http://47.97.99.93:8080/message/uploadFile', 
      filePath: files.path,                  //要传的图片路径
      name: 'file',                  //获取图片二进制文件的key
      formData: {
        'fromId' : that.data.openID,
        'targetId' :  that.data.userId                //其他需要携带的参数
        // 'user': 'test'
      },
      success (res){
        // console.log(res.data)
        //do something
      }
    })
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
        // console.log(res)
        // console.log(res.tempFiles[0].tempFilePath)
        // console.log(res.tempFiles[0].size)
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
    url: 'http://47.97.99.93:8080/message/uploadImage', 
    filePath: that.data.srcI,                  //要传的图片路径
    name: 'file',                  //获取图片二进制文件的key
    formData: {
      'fromId' : that.data.openID,
      'targetId' :  that.data.userId                //其他需要携带的参数
      // 'user': 'test'
    },
    success (res){
      // console.log(res.data)
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
  async setd(){
    var that = this
    var list = that.data.recordContent
    // list = Array.from(that.data.recordContent)
    // console.log(list)
    // var l = [{id:1,name:"xx"},{id:3,name:"lyf"},{id:2,name:"chj"}]
    // var l1 = l.sort(function(a,b){
    //   console.log(a.id)
    //   return a.id - b.id
    // })
    // console.log(l1)
    var list1 = list.sort(function(a,b){
      // console.log(a.msgId)
      return a.msgId - b.msgId
    })
    // console.log(that.data.recordContent.length)
    // console.log(list1)
    that.setData({
      recordContent:list1,
      toView: 'msg-' + (list.length - 1)
  })
  // console.log( that.data.recordContent)
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
    // this.setd()


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
    // console.log(that.data.userId)
    // console.log(that.data.openID)
   await wx.request({
      url: 'http://47.97.99.93:8080/message/getmessageList?',
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
        // console.log(that.data.messageList);
        var list = that.data.recordContent
       
        for(var i = 0;i<that.data.messageList.length;i++)
        {
          if(that.data.messageList[i].fromId == that.data.openID)
          {
            if(that.data.messageList[i].type=='text')
            {
              var obj = {id:"1",msgId:that.data.messageList[i].msgId,contactText:that.data.messageList[i].content,time:that.data.messageList[i].sendTime,type:'text'}
              list.push(obj)
              that.setData({
                recordContent:list
              })
            }
            else if(that.data.messageList[i].type=='image')
            {
              // that.getPic(that.data.messageList[i].content);
              // var obj = {id:"1",contactText:that.data.picPath,time:that.data.messageList[i].sendTime,type:'image'}
              that.getPic(that.data.messageList[i].content,i).then(
                res=>{
                  // console.log(res);
                  var index = res.index
                  var path = res.picPath
                  var obj = {id:"1",msgId:that.data.messageList[index].msgId,contactText:path,time:that.data.messageList[index].sendTime,type:'image'}
                  // console.log(obj);
                  list.push(obj)
                  // console.log(list);
                  that.setData({
                    recordContent:list
                  })
                }
              )
            }
            else if(that.data.messageList[i].type=='record')
            {
              var obj = {id:"1",msgId:that.data.messageList[i].msgId,contactText:that.data.messageList[i].content,time:that.data.messageList[i].sendTime,type:'record'}
              list.push(obj)
              that.setData({
                recordContent:list
              })
            }
          }
          else if(that.data.messageList[i].fromId == that.data.userId)
          {
            if(that.data.messageList[i].type=='text')
            {
              var obj = {id:"2",msgId:that.data.messageList[i].msgId,contactText:that.data.messageList[i].content,time:that.data.messageList[i].sendTime,type:'text'}
              list.push(obj)
              that.setData({
                recordContent:list
              })
            }
            else if(that.data.messageList[i].type=='image')
            {
              that.getPic(that.data.messageList[i].content,i).then(
                res=>{
                  // console.log(res);
                  var index = res.index
                  var path = res.picPath
                  var obj = {id:"2",msgId:that.data.messageList[index].msgId,contactText:path,time:that.data.messageList[index].sendTime,type:'image'}
                  // console.log(obj);
                  list.push(obj)
                  // console.log(list);
                  that.setData({
                    recordContent:list
                  })
                }
              )
            }
            else if(that.data.messageList[i].type=='record')
            {
              var obj = {id:"2",msgId:that.data.messageList[i].msgId,contactText:that.data.messageList[i].content,time:that.data.messageList[i].sendTime,type:'record'}
              list.push(obj)
              that.setData({
                recordContent:list
              })
            }
          }
        }
        
        //  console.log(that.data.recordContent)
         var list1 = list.sort(function(a,b){
          // console.log(a.msgId)
          return a.msgId - b.msgId
        })
        that.setData({
          recordContent:list1,
          toView: 'msg-' + (that.data.recordContent.length - 1),

        })
        // console.log(that.data.recordContent.length)
      },
      fail: function () {
        console.log("调用接口失败");
      }
    })
  
  },
  
  async getPic(filename,i){
    var that = this
    return new Promise(function (resolve, reject) {
      wx.downloadFile({
        url: 'http://47.97.99.93:8080/message/download/'+filename, 
        // header: {
        //   'Content-Type': 'multipart/form-data',
        // },
        success (res) {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          // console.log(res)
          that.setData({
            picPath : res.tempFilePath
          })
          var trans = {picPath:res.tempFilePath,index:i};
          resolve(trans)
          // if (res.statusCode === 200) {
          //   wx.playVoice({
          //     filePath: res.tempFilePath
          //   })
          // }
        }
      })
    })
  
    // wx.request({
    //   url: 'http://47.97.99.93:8080/message/download/38.jpg',
    //   method: 'POST',
    //   data: {
    //     fileName:'38.jpg'
    //   },
    //   success (res){
    //     console.log(res.data)
    //   }
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

  },


  bindKeyInput: function(e) {
    this.setData({
      inputVal:e.detail.value
    }) 
  },  

  sendButton(){   
     var that = this
    //  console.log(that.data.userId)
    //  console.log(that.data.openID)
    // console.log(that.data.inputVal)
    if(that.data.inputVal==='')
    {
      wx.showToast({
        title: '不能发送空消息',
        icon: 'error',
        duration: 2000
      })      
      return;
    }
    
  wx.request({
    url: 'http://47.97.99.93:8080/message/sendMessage',
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
      // console.log(res.data);
      var currenTime= util.formatTime(new Date());
      
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    // this.setData({
    //   currenTime: currenTime
    // });

      var list = that.data.recordContent
          var obj = {id:"1",msgId:'',contactText:that.data.inputVal,time:currenTime,type:'text'}
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

  recordManage1(){
    this.playback()
  },
  recordManage(){
    if(this.data.status === 'ready')
    {
      this.record()
    }
    else if(this.data.status === 'recording')
    {
      this.stop()
    }
    else if(this.data.status === 'stop'){
      //发送
      var that = this
      wx.uploadFile({
        url: 'http://47.97.99.93:8080/message/uploadRecord', 
        filePath: tempFilePath,                  //要传的图片路径
        name: 'file',                  //获取图片二进制文件的key
        formData: {
          'fromId' : that.data.openID,
          'targetId' :  that.data.userId                //其他需要携带的参数
          // 'user': 'test'
        },
        success (res){
          var currenTime= util.formatTime(new Date());
          // console.log(res.data)
          var list = that.data.recordContent
          var obj = {id:"1",msgId:'',contactText:'语音消息',time:currenTime,type:'record'}
          list.push(obj)
      that.setData({
        recordContent:list,
        toView: 'msg-' + (that.data.recordContent.length - 1),
        inputVal : '',
        actionSheetHidden:true,
        actionSheetHidden1:true
      })
          //do something
        }
      })

    }
    
  },

  //开始录音
  record: function () {
    recorderManager.start()
    this.setData({
      status : 'recording',
      btnimg:'../../static/images/messagesDetail/stop-fill.png',
      recordText:'点击停止录音'
    })
  },
  //暂停
  pause: function () {
    recorderManager.pause()
    this.setData({
      status : 'pause'
    })
  },
  //停止
  stop: function () {
    recorderManager.stop()
    this.setData({
      status : 'stop',
      btnimg:'../../static/images/messagesDetail/send-plane-fill.png',
      recordText:'点击发送',
      
    })
  },
//回放
playback:function(){
  audioCtx.src=tempFilePath
  audioCtx.play()
}
})