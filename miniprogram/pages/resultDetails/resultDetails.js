// pages/resultDetails/resultDetails.js
wx.cloud.init()
const app = getApp()
import requestCloud from '../../utils/request'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tli: "",
    lottery_id: "",
    bannerList: [],
    prizeList: [],
    lotteryTime: "",
    partNum: "",
    participants: [],
    lotteryResult: '很遗憾！你未中奖',
    lotteryPrize: "",
    winnerList: [],
    winnersInfo: [],
    staticInfo: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.aono(this.data.staticInfo);
    console.log("啊", options.mid)
    let id = options.mid
    this.setData({
      lottery_id: id,
      tli: id
    })
    this.updateData(id)
  },

  //昵称匿名化
  aono(info) {
    for (let listItem of info) {
      for (let item of listItem.winners) {
        if (item.name.length > 2) {
          item.name = item.name.slice(0, 1) + new Array(item.name.length - 1).join('*') + item.name.slice(item.name.length - 1, item.name.length);
        } else if (item.name.length > 1) {
          item.name = item.name.slice(0, 1) + '*';
        }
      }
    }
  },

  async updateData(lid) {
    console.log(lid)
    //获取奖品列表
    let resLD = await requestCloud("lotteryDetail", {
      lottery_id: lid
    })
    let prizeList = resLD.list[0].lottery_prize
    console.log(prizeList)
    let lotteryTime = resLD.list[0].end_time
    let partNum = resLD.list[0].participation

    console.log('prizeList', prizeList)
    //获取获奖名单
    let resW = await requestCloud("getAllWinner", {
      lottery_id: lid
    })
    let winnerList = resW.list[0].lottery_winner

    this.setData({
      prizeList,
      winnerList,
      lotteryTime,
      partNum,

    })
    console.log('winnerList', winnerList)


    //设置提示语
    this.setMes()
    //获取图片
    this.getImage()
    //获取中奖人列表
    this.showWinner()
    //获取参与者列表
    this.showPart()
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
    console.log('participants', this.data.participants)
  },

  //设置中奖与否的提示语  
  setMes() {
    var j = this.data.winnerList.findIndex(function (value, index, arr) {
      return value.openID == app.globalData.openid
    })

    if (j > -1) {
      var pid = this.data.winnerList[j].prize_id
      var k = this.data.prizeList.findIndex(function (value, index, arr) {
        return value.prize_id == pid
      })
      this.setData({
        lotteryResult: "恭喜！你已中奖",
        lotteryPrize: this.data.prizeList[k].name
      })
    }
  },

  //获取图片数据
  getImage() {
    let prizeList = this.data.prizeList
    let bannerList = this.data.bannerList
    let index = 0
    for (let item of prizeList) {
      bannerList[index] = 'https://6472-draw-a-lottery-0gptvzfw661e55d1-1306744117.tcb.qcloud.la/' + this.data.tli + '/prize_' + index + '.jpg'
      index++
    }
    this.setData({
      bannerList
    })
    //console.log(imageList)
  },

  //跳转到联系我们
  toContact() {
    wx.navigateTo({
      url: '/pages/contact/contact',
    })
  },

  //返回首页
  backIndex() {
    wx.reLaunch({
      url: '/pages/index/index',
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