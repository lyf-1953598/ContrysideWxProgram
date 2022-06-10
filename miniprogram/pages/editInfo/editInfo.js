// pages/editInfo/editInfo.js
import requestCloud from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prizeList: [{
      image: '/static/images/lotteryEdit/prize.jpeg',
      name: '',
      num: '',
    }],
    lotteryIntro: {
      textDescrip: '',
      imgNum: 0,
      imageList: []
    },
    character: ['一', '二', '三', '四', '五', '六', '七', '八', '九'],
    new: true, //为true表示该页面为新发布的活动，否则表示修改已发布活动的信息
    multiArray: [],
    multiIndex: [0, 0, 0],
    lotteryTime: '',
    isDone: false,
    lottery_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initPicker()
    let mid = options.mid
    let isNew = !options.mid
    //console.log(options)
    this.setData({
      lottery_id: mid,
      new: isNew
    })
    if (mid) {
      this.initPage()
    }
  },

  //初始化页面数据
  async initPage() {
    //Part1:获取奖品信息    
    let prize = await requestCloud('getPrize', {
      lottery_id: this.data.lottery_id
    })
    let prizeList = []
    for (let i = 0; i < prize.data.length; i++) {
      prizeList.push({
        image: 'https://6472-draw-a-lottery-0gptvzfw661e55d1-1306744117.tcb.qcloud.la/' + this.data.lottery_id + '/prize_' + i + '.jpg',
        name: prize.data[i].name,
        num: prize.data[i].count
      })
    }
    //console.log(this.data.prizeList1)
    //console.log(this.data.prizeList)
    this.setData({
      prizeList
    })
    //console.log(this.data.prizeList)

    //Part2：获取开奖时间/获取抽奖的说明
    let curLottery = await requestCloud('getCurrentLottery', {
      lottery_id: this.data.lottery_id
    })
    //console.log(curLottery)
    let imageList = []
    for (let i = 0; i < curLottery.data[0].imgNum; i++) {
      imageList.push('https://6472-draw-a-lottery-0gptvzfw661e55d1-1306744117.tcb.qcloud.la/' + this.data.lottery_id + '/intro_' + i + '.jpg')
    }
    this.setData({
      lotteryTime: curLottery.data[0].end_time,
      lotteryIntro: {
        textDescrip: curLottery.data[0].descrip,
        imgNum: curLottery.data[0].imgNum,
        imageList: imageList
      }
    })
    //console.log("imageList",imageList,this.data.lotteryIntro.imageList)
  },

  //添加新的奖项
  addPrize() {
    let prizeList = this.data.prizeList;
    prizeList.push({
      image: '/static/images/lotteryEdit/prize.jpeg',
      name: '',
      num: ''
    });
    this.setData({
      prizeList
    })
  },

  //删除奖项
  delPrize(event) {
    let prizeList = this.data.prizeList
    prizeList.splice(event.currentTarget.id, 1)
    //console.log(event.currentTarget.id)
    this.setData({
      prizeList
    })
  },

  //输入奖项名字
  inputName(event) {
    let prizeList = this.data.prizeList
    prizeList[event.currentTarget.id].name = event.detail.value
    this.setData({
      prizeList
    })
    //console.log(this.data.prizeList)
  },

  //输入奖项数量
  inputNum(event) {
    let prizeList = this.data.prizeList
    prizeList[event.currentTarget.id].num = event.detail.value
    this.setData({
      prizeList
    })
    //console.log(this.data.prizeList)
  },

  //设置奖项图片
  setPrizeImg(event) {
    let prizeList = this.data.prizeList
    wx.chooseImage({
      count: 1,
      success: (res) => {
        prizeList[event.currentTarget.id].image = res.tempFilePaths[0]
        this.setData({
          prizeList
        })
      }
    })
  },

  //存储抽奖说明
  storageDescrip(event) {
    let lotteryIntro = this.data.lotteryIntro
    lotteryIntro.textDescrip = event.detail.value
    this.setData({
      lotteryIntro
    })
  },

  //设置说明图片
  setIntroImg() {
    let lotteryIntro = this.data.lotteryIntro
    wx.chooseImage({
      count: 3 - lotteryIntro.imageList.length,
      success: (res) => {
        res.tempFilePaths.map((item) => {
          lotteryIntro.imageList.push(item)
        })
        this.setData({
          lotteryIntro
        })
        //console.log(res.tempFilePaths,lotteryIntro)
      }
    })
  },

  //删除说明图片
  delIntroImg(event) {
    let lotteryIntro = this.data.lotteryIntro
    lotteryIntro.imageList.splice(event.currentTarget.id, 1)
    //console.log(event.currentTarget.id)
    this.setData({
      lotteryIntro
    })
  },

  //初始化时间选择器数据
  initPicker() {
    let date = new Date();

    let monthDay = ['今天'];
    let hours = [];
    let minute = [];

    //获取当前的时分数据
    this.currentHours = date.getHours();
    this.currentMinute = date.getMinutes();

    // 初始化日期
    for (let i = 1; i <= 28; i++) {
      let dateTemp = new Date(date);
      dateTemp.setDate(date.getDate() + i);
      let md = (dateTemp.getMonth() + 1) + "-" + dateTemp.getDate();
      monthDay.push(md);
    }

    // 初始化时
    for (let i = 0; i < 24; i++) {
      hours.push(i);
    }

    // 初始化分
    for (let i = 0; i < 60; i += 10) {
      minute.push(i);
    }

    let multiArray = this.data.multiArray
    let multiIndex = this.data.multiIndex
    multiArray[0] = monthDay;
    multiArray[1] = hours;
    multiArray[2] = minute;
    multiIndex[0] = 1;
    multiIndex[1] = this.currentHours + (this.currentMinute / 10 >= 5) ? 2 : 1;
    multiIndex[2] = (this.currentMinute / 10 >= 5) ? 0 : (parseInt(this.currentMinute / 10) + 1);

    this.setData({
      multiIndex,
      multiArray
    });
    //console.log(this.data.multiArray)
  },

  //确认选择日期
  pickerChange() {
    let multiArray = this.data.multiArray
    let multiIndex = this.data.multiIndex

    let date = new Date()
    let dateTemp = new Date(date)
    dateTemp.setDate(date.getDate() + multiIndex[0]);

    let lotteryTime = dateTemp.getFullYear() + '/' + (dateTemp.getMonth() + 1) + "/" + dateTemp.getDate() + ' ' + multiArray[1][multiIndex[1]] + ':' + multiArray[2][multiIndex[2]] + ((multiArray[2][multiIndex[2]] == 0) ? '0' : '');
    this.setData({
      lotteryTime
    })
    //console.log(lotteryTime)
  },

  //当切换日期/小时的时候动态调整可选的时间
  pickerColumnChange(event) {
    //console.log(event)
    let date = new Date();

    let that = this;

    let hours = [];
    let minute = [];

    //获取当前的时分数据
    this.currentHours = date.getHours();
    this.currentMinute = date.getMinutes();

    let multiArray = this.data.multiArray
    let multiIndex = this.data.multiIndex
    //把选择的对应值赋值给 multiIndex
    multiIndex[event.detail.column] = event.detail.value;

    if (event.detail.column === 0) { //如果是第1列改变，即日期改变
      //如果第一列滚动到第一行，即日期选中今天
      if (event.detail.value === 0) {
        that.loadDataFromNow(hours, minute);
      } else {
        that.loadData(hours, minute);
      }
      multiIndex[1] = 0;
      multiIndex[2] = 0;

    } else if (event.detail.column === 1) { // 如果是第2列改变，即小时改变

      // 如果第一列为今天
      if (multiIndex[0] === 0) {
        if (event.detail.value === 0) {
          that.loadDataFromNow(hours, minute);
        } else {
          that.loadHoursFromNow(hours, minute);
        }
        // 第一列不为今天
      } else {
        that.loadData(hours, minute);
      }
      multiIndex[2] = 0;

    } else { // 如果是第3列改变，即分改变
      // 如果第一列为'今天'
      if (multiIndex[0] === 0) {
        // 如果第一列为 '今天'并且第二列为当前时间
        if (multiIndex[1] === 0) {
          that.loadDataFromNow(hours, minute);
        } else {
          that.loadHoursFromNow(hours, minute);
        }
      } else {
        that.loadData(hours, minute);
      }
    }
    multiArray[1] = hours;
    multiArray[2] = minute;
    this.setData({
      multiIndex,
      multiArray
    });
  },

  //从当前时间开始加载小时、分
  loadDataFromNow(hours, minute) {
    //对分进行分段，每10分钟一段
    let minuteIndex = (parseInt(this.currentMinute / 10) + 1) * 10;

    if (minuteIndex == 60) { //进位
      //加载小时数据
      for (let i = this.currentHours + 1; i < 24; i++) {
        hours.push(i);
      }
      //加载分数据
      for (let i = 0; i < 60; i += 10) {
        minute.push(i);
      }
    } else {
      //加载小时数据
      for (let i = this.currentHours; i < 24; i++) {
        hours.push(i);
      }
      //加载分数据
      for (let i = minuteIndex; i < 60; i += 10) {
        minute.push(i);
      }
    }
  },

  //正常加载24小时的数据
  loadData(hours, minute) {
    //加载小时数据
    for (let i = 0; i < 24; i++) {
      hours.push(i);
    }
    //加载分数据
    for (let i = 0; i < 60; i += 10) {
      minute.push(i);
    }
  },

  //从当前时间开始加载小时，分全部加载
  loadHoursFromNow(hours, minute) {
    //对分进行分段，每10分钟一段
    let minuteIndex = (parseInt(this.currentMinute / 10) + 1) * 10;

    if (minuteIndex == 60) { //进位
      //加载小时数据
      for (let i = this.currentHours + 1; i < 24; i++) {
        hours.push(i);
      }
    } else {
      //加载小时数据
      for (let i = this.currentHours; i < 24; i++) {
        hours.push(i);
      }
    }
    //加载分数据
    for (let i = 0; i < 60; i += 10) {
      minute.push(i);
    }
  },

  //发布抽奖活动
  async releaseLottery() {
    const that = this
    //验证奖项设置是否全部非空
    let index = 0
    let isOk = true


    console.log('可以发布')


    for (let item of this.data.prizeList) {
      if (!item.name || !item.num) {
        isOk = false
        wx.showToast({
          title: ('请先完成填写： ' + ((this.data.prizeList.length > 1) ? (this.data.character[index] + '等奖') : '奖品') + '信息'),
          icon: 'none',
          duration: 2000,
          success: () => {
            return;
          }
        })
      }
      index++
    }
    if (!this.data.lotteryIntro.textDescrip) {
      isOk = false
      wx.showToast({
        title: '请先完成填写：抽奖说明',
        icon: 'none',
        duration: 2000,
        success: () => {
          return;
        }
      })
    }
    if (!this.data.lotteryTime) {
      isOk = false
      wx.showToast({
        title: '请先选择一个开奖日期',
        icon: 'none',
        duration: 2000,
        success: () => {
          return;
        }
      })
    }


    //整理需要传入的数据
    if (isOk) {
      var s_time = String(new Date())
      var e_time = this.data.lotteryTime
      var text = this.data.lotteryIntro.textDescrip
      var imgNum = this.data.lotteryIntro.imageList.length

      //console.log(text)
      //先存储抽奖信息

      await this.chooseOp(this.data.new, e_time, s_time, text, imgNum)
      //console.log(this.data.lottery_id)
      if (this.data.lottery_id) {
        await this.addImage()
      }
      await this.Jump()
    }
  },

  async chooseOp(op, e_time, s_time, text, imgNum) {
    //console.log('操作的值', op)


    /*switch(this.data.new){
      case true:
        console.log('好耶成功了',op)
        this.setLottery(e_time,s_time,text)
    
      case false:
        console.log('我要看看怎么回事',op)
        this.updateLottery(e_time,s_time,text)
      
    }*/
    if (op) {
      await this.setLottery(e_time, s_time, text, imgNum)
      console.log('发布新的抽奖')
    } else {
      await this.updateLottery(e_time, s_time, text, imgNum)
      console.log('修改抽奖')
    }
  },

  setLottery(e_time, s_time, text, imgNum) {
    return new Promise(resolve => {
      const that = this
      wx.cloud.callFunction({
        name: 'addLottery',
        data: {
          end_time: e_time,
          start_time: s_time,
          descrip: text,
          imgNum: imgNum
        },
        success: res => {
          //console.log('抽奖ID',res.result._id)
          //将奖品信息存入数据库中
          this.setData({
            lottery_id: res.result._id
          })
          wx.cloud.callFunction({
            name: 'addPrize',
            data: {
              prizeList: this.data.prizeList,
              lottery_id: res.result._id
            },
            success: res => {
              console.log('奖品信息', res)
              that.setData({
                isDone: res.result.success
              })
              resolve()
            }
          })
        }

      })
    })
  },

  updateLottery(e_time, s_time, text, imgNum) {
    //console.log('只是看看值传进来没有')
    const that = this
    /*console.log({
      end_time: e_time,
      start_time: s_time,
      descrip: text,
      lottery_id: this.data.lottery_id,
      imgNum: imgNum
    })*/
    wx.cloud.callFunction({
      name: 'updateLotteryInfo',
      data: {
        end_time: e_time,
        start_time: s_time,
        descrip: text,
        lottery_id: this.data.lottery_id,
        imgNum: imgNum
      },
      success: res => {
        //console.log('抽奖ID',res.result._id)
        console.log(this.data.lotteryIntro.imageList.length)
        //将奖品信息存入数据库中
        wx.cloud.callFunction({
          name: 'updatePrize',
          data: {
            prizeList: this.data.prizeList,
            lottery_id: this.data.lottery_id
          },
          success: res => {
            console.log('奖品信息', res)
            that.setData({
              isDone: res.result.success
            })
          }
        })
      }
    })

    //添加图片信息
    this.addImage()

    return new Promise(resolve => {
      let time = parseInt(1000 * Math.random())
      setTimeout(() => {
        resolve()
      }, time)
    })
  },

  Jump() {
    /*wx.redirectTo({
      url: '/pages/management/management',
    })*/
    wx.navigateBack({
      delta: 1,
    })
  },

  //向云端添加图片
  addImage() {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < this.data.prizeList.length; i++) {
        //console.log(this.data.lottery_id + '/prize_' + i + '.jpg', this.data.prizeList[i].image)
        wx.cloud.uploadFile({
          cloudPath: this.data.lottery_id + '/prize_' + i + '.jpg',
          filePath: this.data.prizeList[i].image, // 文件路径
          success: res => {
            // get resource ID
            //console.log('upload success', res.fileID)
          },
          fail: err => {
            //console.log('upload failure', res.fileID)
          }
        })
      }
      for (let i = 0; i < this.data.lotteryIntro.imageList.length; i++) {
        //console.log(this.data.lotteryIntro.imageList[i], this.data.lottery_id + '/intro_' + i + '.jpg')
        wx.cloud.uploadFile({
          cloudPath: this.data.lottery_id + '/intro_' + i + '.jpg',
          filePath: this.data.lotteryIntro.imageList[i], // 文件路径
          success: res => {
            // get resource ID
            //console.log('upload success', res.fileID)
          },
          fail: err => {
            //console.log('upload failure', res.fileID)
          }
        })
      }
      let fileList = []
      for (let i = this.data.lotteryIntro.imageList.length; i < 3; i++) {
        fileList.push('cloud://draw-a-lottery-0gptvzfw661e55d1.6472-draw-a-lottery-0gptvzfw661e55d1-1306744117/' + this.data.lottery_id + '/intro_' + i + '.jpg')
      }

      wx.cloud.deleteFile({
        fileList,
        success: res => {
          // handle success
          //console.log('delete success', res.fileList)
          resolve()
        },
        fail: err => {
          // handle error
          //console.log('delete failure', err)
          reject()
        }
      })
    })
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