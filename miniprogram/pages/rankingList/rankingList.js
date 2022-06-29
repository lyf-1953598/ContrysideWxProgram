// pages/rankingList/rankingList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['总榜', '月榜','周榜'],
    index:0,
    ranklist:[

    ]
  },

  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: parseInt(e.detail.value)
    })
    this.onReady()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getList();

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

  },


  async getList(){
    var that = this
    console.log(that.data.index+1)
    wx.request({
      url: 'http://47.97.99.93:8080/rank/getRankList',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: {
        rankType: that.data.index+1,
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          ranklist : res.data.data.rankList
        });
        console.log(that.data.ranklist);
       
      },
      fail: function () {
        console.log("调用接口失败");
      }
    })
  
  },

})