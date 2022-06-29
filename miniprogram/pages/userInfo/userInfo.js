Page({

  /**
   * 页面的初始数据
   */
  data: {
    // onPullDownRefresh: function () {
    //   wx.stopPullDownRefresh()
    // },
    myinfo: null,
    userInfo: {
      openID: ''
    },
    firstInfo:null

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var info = wx.getStorageSync('userProfile')
    console.log(info);
    this.setData({
      firstInfo:info
    })
    var that = this
    // console.log(this);
    // console.log(options);
    // https://cs.realloved.cn:8080/user/getInfo?userId=oln6h4lnZLCd56x_c_FpXsAgcpNA
    wx.request({
      url: 'https://cs.realloved.cn:8080/user/getInfo',
      method: 'GET',
      data: {
        userId: options.openID
      },
      success: function (res) {
        // console.log(res.data.data.info);
        var value = res.data.data.info
        if(res.data.data.info.sex == 0){
          value.sex = '男'
        }else{
          value.sex = '女'
        }
        that.setData({
          myinfo: value,
          userInfo:options.openID
        });
        // console.log(that.data.myinfo);
      },
      fail: function () {
        console.log("调用接口失败");
      }
    })
    // var stu = wx.getStorageSync('student');
    // console.log(this.data.myinfo);

  },



  exit: function (e) {
    wx.showModal({
      title: '提示',
      content: '是否确认退出',
      success: function (res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          wx.removeStorageSync('userProfile');
          wx.removeStorage({
            key: 'openID',
          })
          //页面跳转
          wx.redirectTo({
            url: '../mine/mine',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  editName: function (e) {
    var that = this
    var value = this.data.myinfo
    // console.log(that.data.userInfo);
    wx.showModal({
      title: '修改名称',
      // content: '该名称将与您的志愿证书提名相同',
      editable: true,
      placeholderText: '请输入您的新名称',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          // console.log(res);
          // console.log(res.content);
          if (res.content != that.data.myinfo.name) {
            value.name = res.content
            wx.request({
              url: 'https://cs.realloved.cn:8080/user/updateUserName',
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                // 'Content-Type': 'application/json'
              },
              data :{
                userId: that.data.userInfo,
                userNewName : res.content
              },
              success(res){
                if(res.data.code==200){
                  wx.showToast({
                    title: '修改成功！',
                    icon: 'success',
                    duration: 2000
                  })
                }
                // console.log(value);
                // console.log(that.data);
                that.setData({
                  myinfo: value
                })
              },
              fail(res){
                console.log(res);
              }
            })
          } else {
            wx.showToast({
              title: '用户名没有改变',
              icon: 'error',
              duration: 2000
            })
          }

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
      fail(res) {
        // console.log(res);
        console.log("失败！");
      }
    })
  },


  editAge: function (e) {
    var that = this
    var value = this.data.myinfo
    wx.showModal({
      title: '修改年龄',
      // content: '该名称将与您的志愿证书提名相同',
      editable: true,
      placeholderText: '请更新您的年龄',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          // console.log(res);
          // console.log(res.content);
          if (!(/(^[0-9]*$)/.test(res.content))){
            wx.showToast({
              title: '输入有误',
              icon: 'error',
              duration: 2000
            })
            return
          }

          if (res.content != that.data.myinfo.age) {
            value.age = res.content
            wx.request({
              url: 'https://cs.realloved.cn:8080/user/updateUserAge',
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                // 'Content-Type': 'application/json'
              },
              data :{
                userId:  that.data.userInfo,
                userNewAge : res.content
              },
              success(res){
                if(res.data.code==200){
                  wx.showToast({
                    title: '修改成功！',
                    icon: 'success',
                    duration: 2000
                  })
                }
                // console.log(value);
                // console.log(that.data);
                that.setData({
                  myinfo: value
                })
              },
              fail(res){
                console.log(res);
              }
            })
          } else {
            wx.showToast({
              title: '年龄前后相同！',
              icon: 'error',
              duration: 2000
            })
          }

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
      fail(res) {
        // console.log(res);
        console.log("失败！");
      }
    })
  },
  editSex: function (e) {
    var that = this
    var value = this.data.myinfo
    wx.showModal({
      title: '修改性别',
      editable: true,
      placeholderText: '请输入您的性别',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          // console.log(res);
          // console.log(res.content);
          if(res.content!="男"&&res.content!="女"){
            wx.showToast({
              title: '输入有误',
              icon: 'error',
              duration: 2000
            })
            return
          }
          if (res.content != that.data.myinfo.sex) {
            value.sex = res.content
            wx.request({
              url: 'https://cs.realloved.cn:8080/user/updateUserSex',
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                // 'Content-Type': 'application/json'
              },
              data :{
                userId:  that.data.userInfo,
                userNewSex : res.content
              },
              success(res){
                if(res.data.code==200){
                  wx.showToast({
                    title: '修改成功！',
                    icon: 'success',
                    duration: 2000
                  })
                }
                // console.log(value);
                // console.log(that.data);
                that.setData({
                  myinfo: value
                })
              },
              fail(res){
                console.log(res);
              }
            })
          } else {
            wx.showToast({
              title: '用户性别无改变',
              icon: 'error',
              duration: 2000
            })
          }

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
      fail(res) {
        console.log(res);
        console.log("失败！");
      }
    })
  },
  editTel: function (e) {
    var that = this
    var value = this.data.myinfo
    wx.showModal({
      title: '修改您的电话',
      // content: '该名称将与您的志愿证书提名相同',
      editable: true,
      placeholderText: '请输入您的新名称',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          // console.log(res);
          // console.log(res.content);
          if (!(/(^[0-9]*$)/.test(res.content))||parseInt(res.content.length)!=11){
            wx.showToast({
              title: '输入有误',
              icon: 'error',
              duration: 2000
            })
            return
          }

          if (res.content != that.data.myinfo.phone) {
            value.phone = res.content
            wx.request({
              url: 'https://cs.realloved.cn:8080/user/updateUserPhone',
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                // 'Content-Type': 'application/json'
              },
              data :{
                userId:  that.data.userInfo,
                userNewPhone : res.content
              },
              success(res){
                if(res.data.code==200){
                  wx.showToast({
                    title: '修改成功！',
                    icon: 'success',
                    duration: 2000
                  })
                }
                // console.log(value);
                // console.log(that.data);
                that.setData({
                  myinfo: value
                })
              },
              fail(res){
                console.log(res);
              }
            })
          } else {
            wx.showToast({
              title: '联系方式无改变',
              icon: 'error',
              duration: 2000
            })
          }

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
      fail(res) {
        // console.log(res);
        console.log("失败！");
      }
    })
  }

})