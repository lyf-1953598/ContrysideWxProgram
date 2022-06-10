// pages/apply/apply.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      name:'',
      address:'',
      reason:'',
      userID:''
  },
  commit:function(e){
    console.log(this.data.name)
    console.log(this.data.address)
    console.log(this.data.reason)
    wx.request({
      url: 'http://localhost:8080/user/apply',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        // 'Content-Type': 'application/json'
      },
      data:{
        address: this.data.address,
        organizationName: this.data.name,
        reason: this.data.reason,
        userId:this.data.userID,
      },
      success:  (res)=>  {
        console.log(res.data)
      },
      fail: function (res) {
        console.log(res.data)
      }
    })
  },
  addressGetValue(e){
    this.setData({
      name:e.detail.value
    })
  },
  nameGetValue(e){
    this.setData({
      address:e.detail.value
    })
  },
  reasonGetValue(e){
    this.setData({
      reason:e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.data.userID=wx.getStorageSync('openID')
    console.log(this.data.userID)
    
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