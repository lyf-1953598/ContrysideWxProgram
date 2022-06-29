// pages/help/help.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showIndex: -1,
    helpData: [{
      question: '怎么参与志愿者活动？',
      answer: '进入小程序首页即可浏览正在进行中的志愿者活动，也可通过筛选查找指定活动。'
    }, {
      question: '怎么生成自己的志愿者证书？',
      answer: '在个人中心处浏览“志愿者证书”，并保存在自己的手机上即可。'
    }, {
      question: '如何把证书的名字改成真实姓名？',
      answer: '在个人中心处浏览“个人信息”，点击信息弹出窗口对名字进行修改。'
    }, {
      question: '志愿时长和志愿等级的关系？',
      answer: '志愿时长积累到一定程度时，志愿等级就会提升。'
    }, {
      question: '信誉分数和信誉等级的关系？',
      answer: '每一位最初注册的志愿者都有80分初始的信誉分数，被他人举报或记录不良的活动记录就会扣分，保持良好的志愿活动记录就可以提升分数。'
    },
    {
      question: '信誉分数会有什么影响？',
      answer: '信誉分数过低将对其能够参加的志愿活动作出限制，甚至禁止参加任何志愿活动。'
    }, {
      question: '参加的志愿活动如何签到？',
      answer: '请联系志愿活动策划者或主办方，在志愿活动进行完毕后分发签到码，并在首页签到。'
    },
    {
      question: '如何举报不良行为？',
      answer: '在出现不良行为的志愿活动中选择要举报的志愿者，写明投诉理由后静待管理员审核完毕。若情况属实，则举报成功，扣除被举报人信誉分数并存留不良记录。'
    },
    {
      question: '进入页面没有信息怎么办？',
      answer: '请现在个人信息页面点击“同步个人资料信息”，方可获取自己的页面信息'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //展开折叠问题
  flod(event) {
    //console.log(event);
    if (event.currentTarget.id != this.data.showIndex) {
      this.setData({
        showIndex: event.currentTarget.id
      })
    } else {
      this.setData({
        showIndex: -1
      })
    }
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

  }
})