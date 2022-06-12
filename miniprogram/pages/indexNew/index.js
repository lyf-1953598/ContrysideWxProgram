// pages/indexNew/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openID:'',
    ifLogin:false,
    userInfo:null,
    activityName:'请先登录！',
    currentActivityID:'',
    canApply:0,
    applyLabel:'申请成为主办方',
    taskList:[]
  },
  toCurrent: function (e) {
    if(this.data.currentActivityID==''){
      console.log('无法跳转')
    }
    else{
      wx.navigateTo({
        url: '/pages/currentActivity/currentActivity',
      })
    }
    
  },
  toDetail(e){
    var index = e.currentTarget.dataset.index
    var activityId=this.data.taskList[index].assignmentId
    wx.navigateTo({
      url: '/pages/currentActivity/currentActivity?activityId='+activityId,
    })
    console.log(activityId)
  },
  toApply: function (e) {
    console.log(this.data.canApply)
    if(this.data.canApply==0){
      console.log(this.data.canApply)
      wx.navigateTo({
        url: '/pages/apply/apply',
      })
    }
    else if(this.data.canApply==1){
      console.log(this.canApply);
    }
    else if(this.data.canApply==2){
      wx.navigateTo({
        url: '/pages/setUpActivity/setUpActivity',
      })
    }
    
  },
  toMoreActivity:function(e){
    wx.navigateTo({
      url: '/pages/moreActivity/moreActivity',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this
    console.log(this.data.activityName)
    var StorageUserInfo = wx.getStorageSync('userProfile')
    if(StorageUserInfo == ''){
      console.log("null")
    }
    else{
      this.data.userInfo=StorageUserInfo
      console.log(this.data.userInfo)
      var openID = wx.getStorageSync('openID')
      this.data.openID=openID
      console.log(openID)
      wx.request({
        url: 'http://localhost:8080/task/getVolunteersTask',
        method:'GET',
        data:{
        userId:openID
      },
        success:(res)=> {
          var activityList=res.data.data.list
          if(activityList.length==0){        
            that.setData({
              activityName:'还未报名活动哦，快去参加志愿活动吧！'
            })
          }
          else{
            that.setData({
              activityName:activityList[0].title,
              currentActivityID:activityList[0].assignment_id
            })
            wx.setStorage({
              key:'currentActivityID',
              data:this.currentActivityID
            })
          }
      },
        fail:function(res){
          console.log("接口调取失败！");
      }
    })
    }
    wx.request({
      url: 'http://localhost:8080/user/getAuthorizationStatus',
      method:'GET',
      data:{
      userId:openID
    },
      success:(res)=> {
        if(res.data.data.info=='可申请'){
          console.log(this.data.canApply)
          this.setData({
            canApply:0,
          })
        }
        else if(res.data.data.info=='申请中'){
          console.log(this.data.canApply)
          this.setData({
            canApply:1,
            applyLabel:'正在等待审批'
          })
        }
        else if(res.data.data.info=='组织者'){
          console.log(this.data.canApply)
          this.setData({
            canApply:2,
            applyLabel:'发布活动'
          })
        }
    },
      fail:function(res){
        console.log("接口调取失败！");
    }
  })
  wx.request({
    url: 'http://localhost:8080/task/getHomepageTask',
    method:'GET',
    data:{
      pagenum:0
    },
    success:(res)=> {
      console.log(res.data)
      this.setData({
        taskList:res.data.data.list
      })
      console.log(this.data.taskList)
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