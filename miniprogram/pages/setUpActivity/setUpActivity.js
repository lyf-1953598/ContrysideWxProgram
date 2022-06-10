// pages/setUpActivity/setUpActivity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prizeList: [{
      image: '/static/images/lotteryEdit/prize.jpeg',
      name: '',
      num: '',
    }],
    lotteryIntro: {
      textDescrip: '',
      imgNum: 0,
      imageList: []
    },
    character: ['一', '二', '三', '四', '五', '六', '七', '八', '九'],
    new: true, //为true表示该页面为新发布的活动，否则表示修改已发布活动的信息
    multiArray: [],
    multiIndex: [0, 0, 0],
    lotteryTime: '',
    isDone: false,
    lottery_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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