// pages/mine/mine.js
wx.cloud.init()
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      nickName: '未授权',
      avatarUrl: '/static/images/mine/logout.png',
      openID: ''
    },
    
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isAdmin:0,
    joinNum: 0,
    winNum: 0,
    volunteerTime:"0+",
    volunteerGrade:0,
    creditGrade:0,
    creditPoint:0,
    volunteerCount:0,
    creditCount:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    //尝试从cookie获取用户信息
    var userInfo = wx.getStorageSync('userProfile')
    // console.log(userInfo)
    wx.getStorage({
      key:'openID',
      success (res) {
        console.log(res);
        userInfo.openID = res.data
        that.setData({
          userInfo})
          //如果表中已经存在唯一openID不应该再反复存储
        if (userInfo) { //获取成功则更新到页面
        wx.request({
          url: 'http://localhost:8080/user/getInfo',
          method:'GET',
          data:{
          userId:userInfo.openID
        },
          success:(res)=> {
            console.log(res);
            that.setData({
              userInfo,
              volunteerTime:res.data.data.info.voluntaryAllhour,
              creditGrade:res.data.data.info.voluntaryLevel,
          })
        },
          fail:function(res){
            console.log("接口调取失败！");
        }
      })
     
      // console.log(userInfo);
      //更新用户数据
      // this.updateData(userInfo.openID)
     
    }
      }
    }
    )
  
    

  },

  //获取用户信息
 async getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
     wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        let userInfo = res.userInfo
        let updateInfo = this.data.userInfo
        console.log(updateInfo);
        updateInfo.avatarUrl = userInfo.avatarUrl
        updateInfo.nickName = userInfo.nickName
        this.setData({
          // userInfo,
          hasUserInfo: true
        })
        console.log(this.data.userInfo);
        wx.login({
          success:  (res)=> {
            // console.log(res);
            let code = res.code
            wx.request({
              url: `https://api.weixin.qq.com/sns/jscode2session?` +
                `appid=wx09dd702f9906ed15&secret=321a8586a876a2c88c158ddf932780e1&js_code=${code}&grant_type=authorization_code`,
              success:  (res)=> {
                // console.log(res);
                userInfo.openID = res.data.openid
                this.data.userInfo.openID = res.data.openid
                updateInfo.openID = res.data.openid
                console.log(userInfo.openID);
                wx.request({
                  url: 'http://localhost:8080/user/login',
                  method: 'POST',
                  data: {
                    avatar: userInfo.avatarUrl,
                    name: userInfo.nickName,
                    userId: userInfo.openID
                  },
                  success:  (res)=>  {
                    console.log(res)
                    if (res.data.data.msg == "登陆成功") {
                      console.log("登录成功！")
                    }
                    wx.request({
                      url: 'http://localhost:8080/user/getInfo',
                      method: 'GET',
                      data: {
                        userId: userInfo.openID
                      },
                      success:  (res)=> {
                        // console.log(this);
                        this.setData({
                          volunteerTime:res.data.data.info.voluntaryAllhour,
                          creditGrade:res.data.data.info.voluntaryLevel,
                          userInfo:updateInfo                  
                        })
                        wx.setStorage({
                          key:'openID',
                          data:this.data.userInfo.openID
                        })
                     
                      },
                      fail: function (res) {
                        console.log("接口调取失败！")
                      }
                    })
                  },
                  fail: function (res) {
                    console.log(res);
                    console.log("接口调取失败！")
                  }
                })
              }
            })
          }
        })
           
        //将用户信息存储到cookie，避免重复向用户获取授权
        console.log(userInfo);
        console.log(this.data.userInfo);
        wx.setStorageSync('userProfile', userInfo)
    //#region 
    // })
    //调用完成后查看发送后端添加账户！id缺失！wx版本调整！想办法修正！
    // var getUserProfilePromise = new Promise((resolve,reject)=>{
    //   // console.log(this);
    //   wx.getUserProfile({
    //     desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    //     success: (res) => {
    //       let userInfo = res.userInfo
    //       this.setData({
    //         userInfo,
    //         hasUserInfo: true,
    //       })
    //     }
          
    //   })
    // })
    // .then(()=>{
    //   return new Promise((resolve,reject)=>{
    //     // console.log(this);
    //     wx.login({
    //       success:  (res)=> {
    //         // console.log(res);
    //         let code = res.code
    //         wx.request({
    //             url: `https://api.weixin.qq.com/sns/jscode2session?` +
    //               `appid=wx09dd702f9906ed15&secret=321a8586a876a2c88c158ddf932780e1&js_code=${code}&grant_type=authorization_code`,
    //             success:  (res) => {
    //               // console.log(res);
    //               this.data.userInfo.openID = res.data.openid
    //               // console.log(this.data.userInfo);
    //               wx.request({
    //                 url: 'http://localhost:8080/user/login',
    //                 method: 'POST',
    //                 data: {
    //                   avatar: this.data.userInfo.avatarUrl,
    //                   name: this.data.userInfo.nickName,
    //                   userId: this.data.userInfo.openID
    //                 },
    //                 success: (res)=> {
    //                   console.log(res)
    //                   if (res.data.data.msg == "登陆成功") {
    //                     console.log("登录成功！")
    //                   }
    //                 },
    //                 fail: (res)=> {
    //                   console.log("接口调取失败！")
    //                 }
    //               })
    //         }})
    //   }})
    //   })
    // }).then(()=>{
    //   return new Promise((reslove,reject)=>{
    //   wx.request({
    //     url: 'http://localhost:8080/user/getInfo',
    //     method: 'GET',
    //     data: {
    //       userId: this.data.userInfo.openID
    //     },
    //     success:  (res)=> {
    //       console.log(res)
    //       console.log("在这里更新")
    //     },
    //     fail: function (res) {
    //       console.log("接口调取失败！")
    //     }
    //   })
    // })
    // })
    // getUserProfilePromise
    // var wxLoginPromise = new Promise((resolve,reject)=>{
    //   // console.log(this);
    //   wx.login({
    //     success:  (res)=> {
    //       // console.log(res);
    //       let code = res.code
    //       wx.request({
    //           url: `https://api.weixin.qq.com/sns/jscode2session?` +
    //             `appid=wx09dd702f9906ed15&secret=321a8586a876a2c88c158ddf932780e1&js_code=${code}&grant_type=authorization_code`,
    //           success:  (res) => {
    //             // console.log(res);
    //             this.data.userInfo.openID = res.data.openid
    //             // console.log(this.data.userInfo);
    //             wx.request({
    //               url: 'http://localhost:8080/user/login',
    //               method: 'POST',
    //               data: {
    //                 avatar: this.data.userInfo.avatarUrl,
    //                 name: this.data.userInfo.nickName,
    //                 userId: this.data.userInfo.openID
    //               },
    //               success: (res)=> {
    //                 console.log(res)
    //                 if (res.data.data.msg == "登陆成功") {
    //                   console.log("登录成功！")
    //                 }
    //               },
    //               fail: (res)=> {
    //                 console.log("接口调取失败！")
    //               }
    //             })
    //       }})
    // }})
    // })
    // var updateData = new Promise((reslove,reject)=>{
    //   wx.request({
    //     url: 'http://localhost:8080/user/getInfo',
    //     method: 'GET',
    //     data: {
    //       userId: this.data.userInfo.openID
    //     },
    //     success:  (res)=> {
    //       console.log(res)
    //       console.log("在这里更新")
    //     },
    //     fail: function (res) {
    //       console.log("接口调取失败！")
    //     }
    //   })
    // })
    // getUserProfilePromise
    // .then(wxLoginPromise)
    // .then(getLoginInfoPromise)
    // .then(updateData)
    // getUserProfilePromise.then(()=>{
    //   return wxLoginPromise
    // }).then(()=>{
    //   return updateData})
    //#endregion
      }})
  },

  //更新用户数据
  updateData(openID) {
    //有大用的函数，要根据openID拿回来其他内容
    //获取志愿时长和信用等级
    console.log("获取志愿时长和信用等级");
    // console.log(userInfo.openID);
    console.log(openID);
    wx.request({
      url: 'http://localhost:8080/user/getInfo',
      method:'GET',
      data:{
        userId:openID
      },
      success:function(res){
        console.log(res);
        
      },
      fail:function(res){
        console.log("接口调取失败！");
      }
    })
   //#region 
    // //获取参加抽奖次数
    // let resJoin = await requestCloud("getMyLottery", {
    //   openID
    // })
    // let joinNum = resJoin.list.length
    // console.log('joinNum', joinNum)

    // //获取中奖次数
    // let resWin = await requestCloud("getWinner", {
    //   openID
    // })
    // let winNum = resWin.data.length
    // console.log('winNum', winNum)
    // //存储数据
    // this.setData({
    //   joinNum,
    //   winNum
    // })
    //#endregion
  },

//#region 跳转
  //跳转到志愿活动记录
  toRecord() {
    console.log(this.data.userInfo.openID);
    wx.navigateTo({
      url: '/pages/taskRecord/taskRecord?openID='+this.data.userInfo.openID,
    })
  },
  
 
  //跳转到参与抽奖记录
  toWinning() {
    wx.navigateTo({
      url: '/pages/winningRecord/winningRecord',
    })
  },
  toCertificate(){
    wx.navigateTo({
      url: '/pages/certificateCard/certificateCard?openID='+this.data.userInfo.openID,
    })
  },
  toUserInfo(){
    console.log(this.data.userInfo);
    wx.navigateTo({
      url: '/pages/userInfo/userInfo?openID='+this.data.userInfo.openID,
    })
  },
  //跳转到常见问题
  toHelp() {
    wx.navigateTo({
      url: '/pages/help/help',
    })
  },

//#endregion




//#region 
  //跳转到联系我们
  toContact() {
    wx.navigateTo({
      url: '/pages/contact/contact',
    })
  },

  //跳转到抽奖管理
  toManagement() {
    wx.navigateTo({
      // url: '/pages/management/management',
      url:'/pages/activityManage/activityManage'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    wx.getStorage({
      key:'openID',
      success (res) {
        console.log(res);
        if(res.data){
          var openId = res.data
          wx.request({
            url: 'http://localhost:8080/user/getAuthorizationStatus',
            method:'GET',
            data:{
            userId:openId
          },
            success:(res)=> {
              console.log(res);
              if(res.data.data.info=="组织者"){
                that.setData({
                  isAdmin:1
                })

                wx.setStorage({
                  key:'isAdmin',
                  data:1
                })
              }else{
                wx.setStorage({
                  key:'isAdmin',
                  data:0
                })
              }

             console.log(that.data); 
          },
            fail:function(res){
              console.log("接口调取失败！");
          }
        })
        }}
    }
    )
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
    return {
        title: '有你有我，振兴乡村',
        path: '',
        imageUrl: '',
    
    }
  }
  //#endregion
})