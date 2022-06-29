// pages/indexNew/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userID:'',
    ifLogin:false,
    userInfo:null,
    activityName:'请先登录！',
    currentActivityID:'',
    canApply:0,
    applyLabel:'申请成为主办方',
    taskList:[],
    code:''
  },
  codeGetValue(e){
    this.setData({
      code:e.detail.value
    })
    console.log(this.data.code)
  },
  signIn:function(e){
    console.log(this.data.userID)
    console.log(this.data.code)
    wx.request({
      url: 'http://47.97.99.93:8080/task/signInWithCode',
      method:'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data:{
        userId:this.data.userID,
        signinCode:this.data.code
    },
      success:(res)=> {
        wx.showToast({
          title: res.data.msg,
          icon:'none',
          duration:1500
        })
        
    },
      fail:function(res){
        console.log("接口调取失败！");
    }
  })
  },
  toCurrent: function (e) {
    if(this.data.currentActivityID==''){
      console.log('无法跳转')
    }
    else{
      wx.navigateTo({
        url: '/pages/currentActivity/currentActivity?activityId='+this.data.currentActivityID+"&isCurrent=1",
      })
    }
    
  },
  toDetail(e){
    var index = e.currentTarget.dataset.index
    var activityId=this.data.taskList[index].assignmentId
    wx.navigateTo({
      url: '/pages/currentActivity/currentActivity?activityId='+activityId+"&isCurrent=0",
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
      this.setData({
        userID:openID
      })
      console.log(openID)
      wx.request({
        url: 'http://47.97.99.93:8080/task/getVolunteersTask',
        method:'GET',
        data:{
        userId:openID
      },
        success:(res)=> {
          var activityList=res.data.data.list
          if(activityList.length==0){  
            console.log("没有志愿活动")      
            that.setData({
              activityName:'还未报名活动哦，快去参加志愿活动吧!'
            })
          }
          else{
            that.setData({
              currentActivityID:activityList[0].assignmentId
            })
            console.log(this.data.currentActivityID)
            wx.setStorage({
              key:'currentActivityID',
              data:this.currentActivityID
            })
            wx.request({
              url: 'http://47.97.99.93:8080/task/getOneTask',
              method:'GET',
              data:{
                assignmentId:this.data.currentActivityID
              },
              success:(res)=> {
                console.log(res.data.data.info.title)
                this.setData({
                  activityName:res.data.data.info.title
                })
              },
              fail:(res)=>{

              }
            })
          }
      },
        fail:function(res){
          console.log("接口调取失败！");
      }
    })
    }
    wx.request({
      url: 'http://47.97.99.93:8080/user/getAuthorizationStatus',
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
          this.setData({
            canApply:2,
            applyLabel:'发布活动'
          })
          console.log(this.data.canApply)
        }
    },
      fail:function(res){
        console.log("接口调取失败！");
    }
  })
  wx.request({
    url: 'http://47.97.99.93:8080/task/getHomepageTask',
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