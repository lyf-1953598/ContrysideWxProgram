// pages/participants/participants.js
import requestCloud from '../../utils/request'
let time = -1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    prize_name: '',
    winNum: 6,
    winnerInfo: [], //中奖者列表
    participants: [], //参与者列表
    resultList: [],
    prize_id: '',
    lottery_id: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
    let prizeInfo = JSON.parse(options.prizeInfo)
    this.setData({
      title: prizeInfo.prize,
      prize_name: prizeInfo.prize_name,
      winNum: prizeInfo.num,
      prize_id: prizeInfo.prize_id,
      lottery_id: options.lotteryID
    })
    //console.log('prizeInfo:', prizeInfo)
    this.initPage()
  },

  //初始化页面
  async initPage() {
    let participants = await requestCloud('searchUser', {
      lottery_id: this.data.lottery_id,
      keyword: ''
    })
    for (let i = 0; i < participants.length; i++) {
      participants[i].chosen = false
    }
    this.setData({
      participants,
      resultList: participants
    })
    //console.log(participants)
    this.showWinner()
  },

  //显示中奖人列表
  async showWinner() {
    let resW = await requestCloud("getAllWinner", {
      lottery_id: this.data.lottery_id
    })
    let prize_id = this.data.prize_id
    let winnerList = resW.list[0].lottery_winner
    let winnerInfo = []
    let participants = this.data.participants

    for (let i = 0; i < winnerList.length; i++) {
      if (prize_id == winnerList[i].prize_id) {
        participants.map((item) => {
          if (item.openID == winnerList[i].openID) {
            item.chosen = true
            winnerInfo.push(item)
          }
        })
      }
    }
    this.setData({
      winnerInfo,
      participants
    })
    //console.log("winnersInfo:", this.data.winnerInfo)
  },

  //选择一个参与者
  chooseWinner(event) {
    let index = event.currentTarget.id
    let participants = this.data.participants
    let winnerInfo = this.data.winnerInfo
    let resultList = this.data.resultList

    if (participants[index].chosen) {
      winnerInfo.splice(winnerInfo.indexOf(participants[index]), 1)
    } else {
      if (winnerInfo.length >= this.data.winNum) {
        wx.showToast({
          title: '中奖者名单已满',
          icon: 'none',
          duration: 2000,
          success: () => {
            return;
          }
        })
        return;
      }
      winnerInfo.push(participants[index])
    }
    participants[index].chosen = !participants[index].chosen
    this.setData({
      winnerInfo,
      participants
    })
    this.changeResult('')
  },

  //删除一个中奖者
  delWinner(event) {
    let index = event.currentTarget.id
    let participants = this.data.participants
    let winnerInfo = this.data.winnerInfo
    participants.map((item) => {
      if (item.openID == this.data.winnerInfo[index].openID) {
        item.chosen = false
        //console.log('del:', index, item)
      }
    })
    winnerInfo.splice(index, 1)
    this.setData({
      participants,
      winnerInfo
    })
    this.changeResult('')
  },

  //搜索框内容改变回调
  handleSearchInput(event) {
    //防抖
    clearTimeout(time);
    time = setTimeout(() => {
      this.changeResult(event.detail.value.trim())
    }, 600)
  },

  //改变搜索结果
  changeResult(content) {
    //进行搜索
    let resultList = []
    this.data.participants.map((item) => {
      if (item.nickName.indexOf(content) + 1) {
        resultList.push(item)
      }
    })
    this.setData({
      resultList
    })
    //console.log('resultList', resultList)
  },

  //确认名单
  async confirmWinners() {
    if (this.data.winnerInfo.length < this.data.winNum) {
      wx.showToast({
        title: '中奖者名单未填满',
        icon: 'none',
        duration: 2000,
        success: () => {
          return;
        }
      })
    } else {
      await requestCloud('addWinner', {
        lottery_id: this.data.lottery_id,
        prize_name: this.data.prize_name,
        userList: this.data.winnerInfo
      })
      console.log({
        lottery_id: this.data.lottery_id,
        prize_name: this.data.prize_name,
        userList: this.data.winnerInfo
      })
      wx.navigateBack({
        delta: 1,
      })
    }
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