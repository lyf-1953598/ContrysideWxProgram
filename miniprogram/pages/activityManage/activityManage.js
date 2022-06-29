// pages/activityManage/activityManage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentList: [],
    pastTaskList: [],
    taskList:[],
    navbar: ['未开始', '进行中', '已结束'],
    currentTab: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this
    wx.request({
      url: 'https://cs.realloved.cn:8080/task/getMyTaskDetails',
      method:'GET',
      data:{
        // organizerId:"odWjH4qlWkZ0hNwaVRSexGVd-0Dc"
      organizerId:options.openID
    },
      success:(res)=> {
        // that.setData({
        //   taskList:res.data.data.list
        // })
        var curTime = Date.parse(new Date());
        for (var i = 0; i < res.data.data.list.length; i++) {
          var startTime = Date.parse(res.data.data.list[i].startTime)
          var endTime = Date.parse(res.data.data.list[i].endTime)
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

  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
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