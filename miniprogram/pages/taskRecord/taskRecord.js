// pages/lotteryRecord/lotteryRecord.js
wx.cloud.init()
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageType: '志愿活动记录',
    list: [],
    currentList: [],
    pastTaskList: [],
    taskList:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options);
    console.log(options.openID);
    wx.request({
      url: 'http://localhost:8080/task/getVolunteersTaskDeatails',
      method:'GET',
      data:{
      userId:options.openID
      // userId:'odWjH4qlWkZ0hNwaVRSexGVd-0Dc'
    },
      success:(res)=> {
        console.log(res);
        // that.setData({
        //   taskList:res.data.data.list
        // })
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
       console.log(that.data.currentList)
    },
      fail:function(res){
        console.log("接口调取失败！");
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})