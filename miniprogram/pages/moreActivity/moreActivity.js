// pages/moreActivity/moreActivity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activities:[],
    keyword:''
  },
  toDetail(e){
    var activityid = e.currentTarget.dataset.activityid
    // console.log(activityid)
    wx.navigateTo({
      url: '/pages/currentActivity/currentActivity?activityId='+activityid,
    })
  },
  search:function(e){
    wx.request({
      url: 'https://cs.realloved.cn:8080/task/getTaskByKeyword',
      method:'GET',
      data:{
        keyword:this.data.keyword
      },
      success:(res)=> {
        // console.log(res.data.data.list)
        this.setData({
          activities:res.data.data.list
        })
    },
      fail:function(res){
        console.log("接口调取失败！");
    }
  })
  },
  keyWordGetValue(e){
    this.setData({
      keyword:e.detail.value
    })
    // console.log(this.data.keyword)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.request({
      url: 'https://cs.realloved.cn:8080/task/getAllTask',
      method:'GET',
      success:(res)=> {
        // console.log(res.data.data.list)
        this.setData({
          activities:res.data.data.list
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