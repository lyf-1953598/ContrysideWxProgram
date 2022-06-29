// pages/certificateCard/certificateCard.js
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // canvasWidth:500,
    // canvasHeight:700
    voluteerName: "张三",
    voluteerTime: 0,
    pictWidth: 0,
    pictHeight: 0,
    imgUrl: ""
  },

  // 保存图片到相册
  savePhoto: function () {
    let that = this
    // let imgs = that.data.imgs

    //#region 
    // if (imgs[index].isDownLoad) {
    //   // 如果已经下载过 提示用户
    //   wx.showToast({
    //     title: '你已经下载过该图片',
    //     icon: 'none'
    //   })
    //   return
    // } else {
    //   // 提示用户正在合成，否则用户可能有不当操作或者以为手机卡死
    //   wx.showLoading({
    //     title: '合成中......',
    //     mask: true})
//#endregion
    // 创建画布对象
    const ctx = wx.createCanvasContext("certificateCanvas", that)
    // 获取图片信息，要按照原图来绘制，否则图片会变形 
    wx.getImageInfo({
      src: '../../images/cerBackground.png',
      success: function (res) {
        // 根据 图片的大小 绘制底图 的大小
        // console.log(" 绘制底图 的图片信息》》》", res)
        // res.width/window.innerWidth*100  指的是图片换算成
        let percent = res.width/res.height
        let tempW = wx.getSystemInfoSync().windowWidth
        let tempH = tempW/percent
        let imgW = tempW
        let imgH = tempH
        //  let imgW = res.width * 0.15
        // let imgH = res.height * 0.15
        let imgPath = res.path
        that.data.pictWidth = imgW
        that.data.pictHeight = imgH
        that.setData({
          canvasHeight: imgH,
          canvasWidth: imgW
        })
        // 绘制底图 用原图的宽高比绘制
        ctx.drawImage(imgPath, 0, 0, imgW, imgH)

        //获取个人信息及个人时长

  
        // ctx.setFontSize(20)
        ctx.font = 'normal bold 20px 楷体'
        ctx.fillText(that.data.voluteerName, imgW / 2 - 10, imgH / 2 - 18);
        // ctx.fillText(that.data.voluteerName, 480, 500)//用户昵称
        ctx.font = 'normal bold 18px 楷体'
        ctx.fillText(that.data.voluteerTime+"小时", imgW * 0.45, imgH * 0.62);
        //时间
        ctx.font = 'normal 10px 楷体'
        ctx.fillText(util.formatTimeFore(new Date()), imgW * 0.65, imgH * 0.74);

        ctx.draw(true)
      }
    })
  },


  returnToMine(){
    wx.navigateBack({
      delta: 1,
    })
  },
  generateCanvasBackgroundImg() {
    //背景图片
    let that = this
    wx.canvasToTempFilePath({

      canvasId: 'certificateCanvas',
      success(res) {
        that.data.imgUrl = res.tempFilePath
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function () {
            wx.showToast({
              title: "图片已保存至相册！",
              duration: 2000
            })
          },
          fail: error => {
            wx.showToast({
              title: "保存图片失败",
              icon:"error",
              duration: 2000
            })
            if (error.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || error.errMsg === "saveImageToPhotosAlbum:fail auth deny" || error.errMsg === "saveImageToPhotosAlbum:fail authorize no response") {
              // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
              wx.showModal({
                title: '提示',
                content: '需要您授权保存相册',
                showCancel: false,
                success: modalSuccess => {
                  wx.openSetting({
                    success(settingdata) {
                      if (settingdata.authSetting['scope.writePhotosAlbum']) {
                        wx.showModal({
                          title: '提示',
                          content: '获取权限成功',
                          showCancel: false,
                        })
                      } else {
                        wx.showModal({
                          title: '提示',
                          content: '获取权限失败，将无法保存到相册哦~',
                          showCancel: false,
                        })
                      }
                    },
                  })
                }
              })
            }

          }
        })
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this
    // http://47.97.99.93:8080/user/getInfo?userId=oln6h4lnZLCd56x_c_FpXsAgcpNA
    wx.request({
      url: 'http://47.97.99.93:8080/user/getInfo',
      method: 'GET',
      data: {
        userId: options.openID
      },
      success: function (res) {
        that.setData({
          voluteerTime: res.data.data.info.voluntaryAllhour,
          voluteerName:res.data.data.info.name
        });
        that.savePhoto()
      },
      fail: function () {
        console.log("调用接口失败");
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // wx.getSystemInfo({
    //   success: (result) => {
    //     myWidth = res.window
    //   },
    // })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // this.generateCanvasBackgroundImg()
    // this.savePhoto()
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