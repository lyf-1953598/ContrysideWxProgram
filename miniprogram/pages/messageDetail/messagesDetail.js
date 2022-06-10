// pages/messageDetail/messagesDetail.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    toView:'',
    height:0,
    actionSheetHidden: true,   //作为开关控制弹窗是否从底部弹出
    name:"狼月锋",
    avatar:"../../static/images/lottery/avatar.jpg",
    inputValue:'',
    recordContent:[
      {
        id:1,
        contactText:'nihao2222222222'
      },
      {
        id:2,
        contactText:'哈哈哈'
      },
      {
        id:1,
        contactText:'nihao'
      },
      {
        id:1,
        contactText:'nihao'
      },
      {
        id:1,
        contactText:'nihao'
      },
      {
        id:1,
        contactText:'nihao'
      },
      {
        id:1,
        contactText:'噢噢噢噢噢噢噢噢哦哦哦哦哦哦噢噢噢噢噢噢噢噢哦哦哦哦哦哦哦哦哦噢噢噢噢哦哦哦噢噢噢噢哦哦哦哦哦哦哦哦哦'
      },
      {
        id:2,
        contactText:'噢噢噢噢噢噢噢噢哦哦哦哦哦哦噢噢噢噢噢噢噢噢哦哦哦哦哦哦哦哦哦噢噢噢噢哦哦哦噢噢噢噢哦哦哦哦哦哦哦哦哦'
      },]
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

    // console.log(this.data.recordContent)

    this.setData({
      toView: 'msg-' + (this.data.recordContent.length - 1)
    })
    // console.log(this.data.toView)


    // let res = wx.getSystemInfoSync() ///微信api方法
    // let titleH;
    // if (res && res['system']) {
    //     // 判断是否是安卓操作系统 （标题栏苹果为44px,安卓为48px）
    //   if (res['system'].indexOf('Android') > 0) {
    //     titleH = 48
    //   } else {
    //     titleH = 44
    //   }
    //   var height = titleH + res['statusBarHeight'];
    //   console.log(height, 'height');
    //   this.setData({
    //     height: height
    //   })
    // }

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