// pages/lotteryDetails/lotteryDetails.js
import requestCloud from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [],
    prizeList: [],
    imageList: [],
    partNum: 18,
    participants: [],
    lottery_id: '',
    prizeListTemp: [],
    curLotteryEndTime: '',
    curLotteryDescrip: '',
    ispart: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.mid = options.mid
    this.setData({
      lottery_id: that.mid
    })
    console.log(this.data.lottery_id)
    //console.log(options)

   
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
        prize: prize.data[i].type + ':' + prize.data[i].name,
        num: prize.data[i].count
      })
    }
    //console.log(this.data.prizeList1)
    //console.log(this.data.prizeList)
    this.setData({
      prizeList
    })
    //console.log(this.data.prizeList)

    //Part2：获取开奖时间/获取抽奖的说明
    let curLottery = await requestCloud('getCurrentLottery', {
      lottery_id: this.data.lottery_id
    })
    this.setData({
      curLotteryEndTime: curLottery.data[0].end_time + ' 自动开奖',
      curLotteryDescrip: curLottery.data[0].descrip
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

    //Part5:获取参与者信息
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
    //添加页面初始化数据的形成
    //在页面加载同时完成对于参与人数的计算，同样需要lottery_id
    wx.cloud.callFunction({
      name: 'isParticipatedLottery',
      data: {
        lottery_id: this.data.lottery_id
      }
    }).then(res => {
      console.log(res)
      this.setData({
        ispart: res.result
      })
    })
    .catch(console.error)
    console.log(this.data.ispart)
   
    this.initPage()
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res.target, res)
    }
    return {
      title: '快来参与抽奖啦！',
      path: '',
      imageUrl: '',
    }
  },

  joinLottery() {
    //2021-8-9 lyf 添加是否已经参与抽奖的判断，并根据判断，弹出提示框
    if (this.data.ispart === 1) {
      wx.showToast({
        title: '已参与过抽奖！',
        icon: 'none'
      })
      return
    } else {
      wx.cloud.callFunction({
          //云函数名称：
          name: 'attendLottery',
          //传给云函数的参数
          data: {
            //通过路由传参成功
            lottery_id: this.data.lottery_id,
          }
        }).then(res => {
          console.log(res.result)
          wx.showToast({
            title: '参与成功！',
            icon: 'success'
          })
          this.onReady()
        })
        .catch(console.error)
      //添加数据记录
    }
  },

  onShare() {
    //
  }
})