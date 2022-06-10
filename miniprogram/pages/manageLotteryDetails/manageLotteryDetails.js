// pages/manageLotteryDetails/manageLotteryDetails.js
import requestCloud from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [],
    prizeList: [],
    winnerList: [],
    winnerInfo: [],
    lotteryTime: '',
    lotteryIntro: '',
    imageList: [],
    partNum: 0,
    participants: [],
    lottery_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let mid = options.mid
    this.setData({
      lottery_id: mid
    })
    console.log(mid)
    //console.log(options)

    this.initPage()
  },

  //初始化页面数据
  async initPage() {
    //Part1:获取奖品信息    
    let prize = await requestCloud('getPrize', {
      lottery_id: this.data.lottery_id
    })
    let prizeList = []
    for (let i = 0; i < prize.data.length; i++) {
      prizeList.push({
        prize_id: prize.data[i].prize_id,
        prize: prize.data[i].type + ':' + prize.data[i].name,
        num: prize.data[i].count
      })
    }

    this.setData({
      prizeList
    })
    console.log(this.data.prizeList)

    //Part2：获取开奖时间/获取抽奖的说明
    let curLottery = await requestCloud('getCurrentLottery', {
      lottery_id: this.data.lottery_id
    })
    this.setData({
      lotteryTime: curLottery.data[0].end_time + ' 自动开奖',
      lotteryIntro: curLottery.data[0].descrip
    })

    //Part3:获取参与抽奖的人数
    let lotteryNum = await requestCloud('getLotteryNum', {
      lottery_id: this.data.lottery_id
    })
    this.setData({
      partNum: lotteryNum.total
    })

    //Part4:获取图片数据
    this.getImage()

    //Part5:获取中奖者信息
    this.showWinner()

    //Part6:获取参与者信息
    this.showPart()
  },

  //获取图片数据
  getImage() {
    let prizeList = this.data.prizeList
    let bannerList = []
    let imageList = []
    let index = 1
    for (index = 0; index < prizeList.length; index++) {
      bannerList[index] = 'https://6472-draw-a-lottery-0gptvzfw661e55d1-1306744117.tcb.qcloud.la/' + this.data.lottery_id + '/prize_' + index + '.jpg'
    }
    for (index = 0; index < 3; index++) {
      imageList[index] = 'https://6472-draw-a-lottery-0gptvzfw661e55d1-1306744117.tcb.qcloud.la/' + this.data.lottery_id + '/intro_' + index + '.jpg'
    }
    this.setData({
      bannerList,
      imageList
    })
    //console.log(bannerList)
  },

  //显示中奖人列表
  async showWinner() {
    let resW = await requestCloud("getAllWinner", {
      lottery_id: this.data.lottery_id
    })
    let prizeList = this.data.prizeList
    let winnerList = resW.list[0].lottery_winner
    let winnerInfo = new Array(prizeList.length)
    for (let i = 0; i < winnerInfo.length; i++) {
      winnerInfo[i] = new Array()
    }
    //console.log(winnerInfo)

    for (let i = 0; i < winnerList.length; i++) {
      let pIndex = -1
      prizeList.map((item, index) => {
        if (item.prize_id == winnerList[i].prize_id)
          pIndex = index
      })
      let resT = await requestCloud("getInformation", {
        openID: winnerList[i].openID
      })
      winnerInfo[pIndex].push(resT.data[0])
    }
    this.setData({
      winnerInfo,
      winnerList
    })
    //console.log("winnersInfo", this.data.winnerInfo)
  },

  //显示参与者列表
  async showPart() {
    let participants = await requestCloud('searchUser', {
      lottery_id: this.data.lottery_id,
      keyword: ''
    })
    let partNum = participants.length
    if (partNum > 8) {
      participants.splice(0, 8)
    }
    this.setData({
      participants,
      partNum
    })
  },

  //编辑抽奖信息
  editInfo() {
    wx.navigateTo({
      url: '../editInfo/editInfo?mid=' + this.data.lottery_id,
    })
  },

  //设置中奖者
  setWinners(event) {
    wx.navigateTo({
      url: '../participants/participants?prizeInfo=' + JSON.stringify(this.data.prizeList[event.currentTarget.id]) + '&lotteryID=' + this.data.lottery_id,
    })
  },

  //关闭抽奖
  delLottery() {
    const that = this
    console.log(that.data.lottery_id)
    wx.showModal({
      title: '提示',
      content: '此操作将永久删除此抽奖，且不可恢复，是否继续',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.cloud.callFunction({
            name:'deleteLotteryInfo',
            data:{
              lottery_id:that.data.lottery_id
            },
            success:res=>{
              console.log(res)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
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

  }
})