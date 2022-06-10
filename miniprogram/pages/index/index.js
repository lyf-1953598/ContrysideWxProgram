// pages/mine/mine.js
let regeneratorRuntime = require("../../utils/runtime");

Page({

  /**
   * 页面的初始数据
   */

  data: {
    lotteryInfo: [],
    lotteryInfoTemp:[],
    id_list: [],
    p_list: [],
    lotteryInfoTest: [],
    tempList: [],
    isParticipated: false,
    participatL: [],
    tempTime: [],
    openid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      lotteryInfo: [],
      LotteryInfoTest: [],
      tempList: [],
    })
    this.initPage()
  },

  //跳转到个人中心
  toMine() {
    wx.switchTab({
      url: '/pages/mine/mine',
    })
  },

  //跳转到抽奖详情
  toDetails: async function (event) {

    var index = event.target.id
    var lotteryID = this.data.lotteryInfo[index].lottery_id
    try {
      await this.getOpenId()
      await this.getParticipate(lotteryID)
      await this.Jump(lotteryID)
    } catch (err) {
      console.log('错误', err)
    }
  },

  //初始化页面数据
  async initPage() {
    await this.getOpenId()
    await this.getShow()
    this.getImage()
  },

  //获取图片数据
  getImage() {
    let lotteryInfo = this.data.lotteryInfo
    for (let item of lotteryInfo) {
      item.cover = 'https://6472-draw-a-lottery-0gptvzfw661e55d1-1306744117.tcb.qcloud.la/' + item.lottery_id + '/prize_0.jpg'
    }
    this.setData({
      lotteryInfo
    })
  },

  //获取该用户的抽奖活动信息
  getParticipate(lotteryID) {
    wx.cloud.callFunction({
      name: 'getMyLottery',
      env: 'draw-a-lottery-0gptvzfw661e55d1',
      data: {
        openID: this.data.openid,
      },
      success: res => {
        for (let i = 0; i < res.result.list.length; i++) {
          if (res.result.list[i].lottery_id == lotteryID) {
            this.setData({
              isParticipated: true
            })
          }
          // if (!this.data.isParticipated) {
          //   wx.navigateTo({
          //     url: '/pages/lotteryDetails/lotteryDetails?mid=' + lotteryID
          //   })
          // } else {
          //   wx.navigateTo({
          //     url: '/pages/resultDetails/resultDetails?mid=' + lotteryID
          //   })
          // }
        }
      },
      fail(err) {},
    })
    return new Promise(resolve => {
      let time = parseInt(1000 * Math.random())
      setTimeout(() => {
        resolve()
      }, time)
    })
  },

  Jump(lotteryID) {
    if (!this.data.isParticipated) {
      console.log('跳转咯',lotteryID)
      wx.navigateTo({
        url: '/pages/lotteryDetails/lotteryDetails?mid=' + lotteryID
      })
    } else {
      console.log('跳转咯',lotteryID)
      wx.navigateTo({
        url: '/pages/resultDetails/resultDetails?mid=' + lotteryID
      })
    }

    return new Promise(resolve => {
      let time = parseInt(1000 * Math.random())
      setTimeout(() => {
        resolve()
      }, time)
    })
  },

  //获取用户的openid
  getOpenId() {
    return new Promise(resolve => {
      wx.cloud.callFunction({
        name: 'getopenID',
        env: 'draw-a-lottery-0gptvzfw661e55d1',
        success: res => {
          this.setData({
            openid: res.result.openid
          })
          resolve()
        },
      })
    })
  },

  async getShow() {
    this.setData({
      lotteryInfo:[],
      lotteryInfoTemp:[],
      tempTime: [],
      id_list: [],
      p_list: []
    })
    try {
      await this.getLottery()
      for (let i = 0; i < this.data.id_list.length; i++) {
        await this.getPrize(i)
      }
      await this.fiflter()
    } catch (err) {
      console.log('错误', err)
    }

  },

  getLottery() {
    const that = this
    return new Promise(resolve => {
      wx.cloud.callFunction({
        name: 'showLottery',
        env: 'draw-a-lottery-0gptvzfw661e55d1',
        success: res => {
          //将返回的数据转化成ShowList格式
          //len = res.result.data.length
          for (let i = 0; i < res.result.data.length; i++) {

            //时间转化
            var s_time = Date.parse(new Date())
            var e_time = Date.parse(new Date(res.result.data[i].end_time))
            var usedTime = e_time - s_time
            var days = parseInt(usedTime / (24 * 3600 * 1000))
            var leave1 = usedTime % (24 * 3600 * 1000)
            var hours = parseInt(leave1 / (3600 * 1000))


            let tempT = that.data.tempTime
            tempT.push({
              day: days,
              hour: hours
            })
            that.setData({
              tempT
            })

            //记录抽奖id
            let id_list = that.data.id_list
            let l_id = res.result.data[i]._id
            id_list.push(l_id)
            that.setData({
              id_list
            })
            resolve()
          }
        },
        fail: err => {
          console.log(err)
        }
      })
    })
  },

  getPrize(i) {
    const that = this
    wx.cloud.callFunction({
      name: 'getPrize',
      env: 'draw-a-lottery-0gptvzfw661e55d1',
      data: {
        lottery_id: that.data.id_list[i]
      },
      success: res => {
        let p_tri = []
        for (let j = 0; j < res.result.data.length; j++) {
          p_tri.push({
            num: res.result.data[j].count,
            prize: res.result.data[j].type + ':' + res.result.data[j].name,
          })
        }
        if (that.data.tempTime[i].hour >= 0) {
          let show = that.data.lotteryInfoTemp
          show.push({
            prizeList: p_tri,
            remainningTime: that.data.tempTime[i],
            lottery_id: that.data.id_list[i]
          })
          that.setData({
            lotteryInfoTemp: show
          })
          //在这里进行setData
        }
      },
      fail: err => {
        console.log(err)
      }
    })

    return new Promise(resolve => {
      let time = parseInt(1000 * Math.random())
      setTimeout(() => {
        resolve()
      }, time)
    })
  },

  fiflter()
  {
    const that = this
    let show = that.data.lotteryInfo
    let sign = []
    wx.cloud.callFunction({
      name:"getMyLottery",
      data:{
        openID:that.data.openid
      },
      success:res=>{
        for(let i =0;i<that.data.lotteryInfoTemp.length;i++)
        {
          let isOk = false
          for(let j =0;j<res.result.list.length;j++)
          {
            if(that.data.lotteryInfoTemp[i].lottery_id==res.result.list[j].lottery_id){
              isOk=true
            }
          }
          if(!isOk)
          {
            show.push(that.data.lotteryInfoTemp[i])
          }
        }
        that.setData({
          lotteryInfo:show
        })
      }
    })
    return new Promise(resolve => {
      let time = parseInt(1000 * Math.random())
      setTimeout(() => {
        resolve()
      }, time)
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
    //this.getShow()
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
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })

    
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
    wx.showShareMenu({
      menus: ['shareAppMessage', 'shareTimeline'],
      withShareTicket: true
    })
    
    if (res.from === 'button') {
      console.log(res.target, res)
    }
    return {
        title: '两只羊喜剧抽奖平台',
        path: '',
        imageUrl: 'https://6472-draw-a-lottery-0gptvzfw661e55d1-1306744117.tcb.qcloud.la/logo.jpg?sign=29e4f18ad2a1058e31faefeed43cce4b&t=1628662027',
    
    }
  },
  //用户点击右上角分享朋友圈
  onShareTimeline: function () {
    return {
      title: '测试小程序分享标题',
      query: {
        key: value
      },
      //默认使用小程序logo
      imageUrl: '',
    }
  }
})