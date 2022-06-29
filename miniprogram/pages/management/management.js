// const {
//   get
// } = require("management")
/*import {
  rejects
} from 'assert'*/
//const regeneratorRuntime = require('../../utils/runtime')
// pages/management/management.js
Page({
  /**
   * 页面的初始数据
   */
  data: {

    //从主页复制过来的，不知道有没有错
    lotteryInfo: [],
    id_list: [],
    p_list: [],
    lotteryInfoTest: [],
    tempList: [],
    tempTime: [],
    selectNav: 0,
    ongoingLottery: [],
    closingLottery: [],
    tempLottery: [],
    showList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   * 从数据库中获取抽奖信息后显示到页面中
   */
  onLoad: function (options) {
    this.setData({
      tempTime: [],
      id_list: [],
      ongoingLottery: [],
      closingLottery: [],
      p_list: []
    })
    this.initData(0)
  },

  //点击进行中标签
  async selectOngoing() {
    this.initData(0)
  },

  //点击已结束标签
  async selectClosing() {
    this.initData(1)
    this.clearLottery()
  },

  //初始化数据
  async initData(nav) {
    this.setData({
      showList: [],
      selectNav: nav
    })
    await this.getShow()
    this.getImage()
  },

  //跳转到抽奖编辑
  toEditLottery: function (event) {
    let index = event.target.id
    let Lottery_id = this.data.showList[index].lottery_id
    let ok = false
    wx.navigateTo({
      url: '/pages/manageLotteryDetails/manageLotteryDetails?mid=' + Lottery_id,
    })
  },

  //跳转到发布抽奖
  // toReleaseLottery() {
  //   let ok = true
  //   wx.navigateTo({
  //     url: '/pages/editInfo/editInfo',
  //   })
  // },

  //跳转到查看结果
  toResult() {
    wx.navigateTo({
      url: '/pages/resultDetails/resultDetails',
    })
  },

  //获取图片数据
  getImage() {
    let showList = this.data.showList
    for (let item of showList) {
      item.cover = 'https://6472-draw-a-lottery-0gptvzfw661e55d1-1306744117.tcb.qcloud.la/' + item.lottery_id + '/prize_0.jpg'
    }
    this.setData({
      showList
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


  async getShow() {
    //清空暂存内容
    this.setData({
      tempTime: [],
      id_list: [],
      ongoingLottery: [],
      closingLottery: [],
    })
    try {
      await this.getVolunteerActivity()
      for (let i = 0; i < this.data.id_list.length; i++) {
        await this.selectPrize(i)
      }
      await this.setShow()
      //wx.onShow()
    } catch (err) {
      console.log('错误', err)
    }


    return new Promise(resolve => {
      let time = parseInt(1000 * Math.random())
      setTimeout(() => {
        resolve()
      }, time)
    })
  },

  getVolunteerActivity() {
    return new Promise(resolve => {
      const that = this
      wx.request({
        url: 'http://47.97.99.93:8080/task/getMyTaskDetails',
        method:'GET',
        data:{
        // userId:options.openID
        organizerId:'odWjH4qlWkZ0hNwaVRSexGVd-0Dc'
      },
        success:(res)=> {
          console.log(res);
          var curTime = Date.parse(new Date());
          for (var i = 0; i < res.data.data.list.length; i++) {
            var startTime = Date.parse(res.data.data.list[i].startTime)
            var endTime = Date.parse(res.data.data.list[i].endTime)
            console.log(curTime);
            console.log(startTime);
            console.log(endTime);
            if(curTime>endTime){
              that.data.pastTaskList.push(res.data.data.list[i]);
              continue;
            }
            if(curTime<startTime){
              that.data.taskList.push(res.data.data.list[i]);
              continue;
            }
            if(curTime>=startTime&&curTime<=endTime){
              that.data.currentList.push(res.data.data.list[i]);
              continue;
            }
          }
         that.setData({
          currentList: that.data.currentList,
          pastTaskList:that.data.pastTaskList,
          taskList:that.data.taskList
         })
      },
        fail:function(res){
          console.log("接口调取失败！");
      }
    })
      // wx.cloud.callFunction({
      //   name: 'showLottery',
      //   env: 'draw-a-lottery-0gptvzfw661e55d1',
      //   success: res => {
      //     //将返回的数据转化成ShowList格式
      //     //len = res.result.data.length
      //     for (let i = 0; i < res.result.data.length; i++) {


      //       //时间转化
      //       var s_time = Date.parse(new Date())
      //       var e_time = Date.parse(new Date(res.result.data[i].end_time))
      //       var usedTime = e_time - s_time
      //       var days = parseInt(usedTime / (24 * 3600 * 1000))
      //       var leave1 = usedTime % (24 * 3600 * 1000)
      //       var hours = parseInt(leave1 / (3600 * 1000))


      //       let tempT = that.data.tempTime
      //       tempT.push({
      //         day: days,
      //         hour: hours
      //       })
      //       that.setData({
      //         tempT
      //       })

      //       if(days<=-7)
      //       { 
      //         this.clearLottery(res.result.data[i]._id)
      //       }
      //       //记录抽奖id
      //       else{
      //       let id = that.data.id_list
      //       let l_id = res.result.data[i]._id
      //       id.push(l_id)
      //       that.setData({
      //         id
      //       })
      //     }
      //     }
      //     resolve()
      //   },
      //   fail: err => {
      //     console.log(err)
      //     // rejects()
      //   }
      // })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  selectPrize(i) {
    var mlen = 0
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

        let show = []
        if (that.data.tempTime[i].hour < 0||that.data.tempTime[i].day<0) {
          show = that.data.closingLottery
        } else {
          show = that.data.ongoingLottery
        }

        show.push({
          prizeList: p_tri,
          remainningTime: that.data.tempTime[i],
          lottery_id: that.data.id_list[i]
        })
        that.setData({
          show
        })
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

  setShow() {

    if (this.data.selectNav == 0) {
      this.ongoingSet()
    } else {
      this.closingSet()
    }
    return new Promise(resolve => {
      let time = parseInt(1000 * Math.random())
      setTimeout(() => {
        resolve()
      }, time)
    })
  },

  ongoingSet() {
    this.setData({
      showList: this.data.ongoingLottery
    })
  },

  closingSet() {
    this.setData({
      showList: this.data.closingLottery
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  clearLottery(id){
    console.log('删除前的数据',id)
        wx.cloud.callFunction({
          name:'deleteLotteryInfo',
          data:{
            lottery_id:id
          },success:res=>{

          }
        })
      
  }
})