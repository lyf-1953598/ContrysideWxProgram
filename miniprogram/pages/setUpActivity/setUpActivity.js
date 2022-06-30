var dateTimePicker = require('../../utils/dataTimePicker.js')//引入外部的js工具类
const mydate=new Date();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    code:'',
    address:'',
    number:null,
    type:'',
    desc:'',
    activityArr: [
      { id: 1, label: '交通' },
      { id: 2, label: '服务' },
      { id: 3, label: '教育' },
      { id: 4, label: '疫情' },
      { id: 5, label: '环境' },
      { id: 6, label: '敬老' },
      { id: 7, label: '医疗' },
    ],
    setIndex:-1,
    srcI:'',
    dateTimeArray: null,
    endDateTimeArray:null,
    endDateTime:null,
      dateTime: null,
      startYear: 2015,
      endYear: 2050,
      currentTime:mydate.getFullYear()+'-'+mydate.getMonth()+'-'+mydate.getDate()+' '+mydate.getHours()+':'+mydate.getMinutes()+':'+mydate.getSeconds(),
      endCurrentTime:mydate.getFullYear()+'-'+mydate.getMonth()+'-'+mydate.getDate()+' '+mydate.getHours()+':'+mydate.getMinutes()+':'+mydate.getSeconds(),
  },
  setIntroImg:function(){
    var that = this
    wx.chooseMedia({
      count: 9,
      mediaType: ['image','video'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        // console.log(res)
        // console.log(res.tempFiles[0].tempFilePath)
        // console.log(res.tempFiles[0].size)
        that.setData({
          srcI:res.tempFiles[0].tempFilePath
        })
      }
    })
  },
  async uploadFile(userID){
    var that = this
    wx.uploadFile({
      url: 'https://cs.realloved.cn:8080/task/createTask', 
      filePath: that.data.srcI,                  //要传的图片路径
      name: 'file',                  //获取图片二进制文件的key
      formData: {
          'description': this.data.desc,
          'startStr': this.data.currentTime,
          'endStr':this.data.endCurrentTime,
          'number':this.data.number,
          'place':this.data.address,
          'signinCode':this.data.code,
          'title':this.data.name,
          'type':this.data.activityArr[this.data.setIndex].label,
          'organizer_id':userID,                //其他需要携带的参数
      },
      success (res){
        // console.log(res.data)
        //do something
        wx.showToast({
          title: '发布成功',
          icon:'success',
          duration:1500
        }).then(
          wx.switchTab({
            url: '/pages/indexNew/index',
          })
        )
        

      }
    })
  },
  addressGetValue(e){
    this.setData({
      address:e.detail.value
    })
    // console.log(this.data.address)
  },
  nameGetValue(e){
    this.setData({
      name:e.detail.value
    })
    // console.log(this.data.name)
  },
  codeGetValue(e){
    this.setData({
      code:e.detail.value
    })
    // console.log(this.data.code)
  },
  numberGetValue(e){
    this.setData({
      number:e.detail.value
    })
    // console.log(this.data.number)
  },
  descGetValue(e){
    this.setData({
      desc:e.detail.value
    })
    // console.log(this.data.desc)
  },
  bindPickerChange(e) {
    // console.log("e",e);
    this.setData({
      setIndex: parseInt(e.detail.value)
    })
  },
  commit:function(e){
    var userId=wx.getStorageSync('openID')
    if(this.data.name==''){
      wx.showToast({
        title: '请填写活动名称',
        icon:'error',
        duration:1500
      })
      return false
    }
    else if(this.data.code==''){
      wx.showToast({
        title: '请填写签到码',
        icon:'error',
        duration:1500
      })
      return false
    }
    else if(this.data.address==''){
      wx.showToast({
        title: '请填写活动地点',
        icon:'error',
        duration:1500
      })
      return false
    }
    else if(this.data.number==null){
      wx.showToast({
        title: '请填写参与人数',
        icon:'error',
        duration:1500
      })
      return false
    }
    else if(this.data.setIndex==-1){
      wx.showToast({
        title: '请选择活动类型',
        icon:'error',
        duration:1500
      })
      return false
    }
    else if(this.data.desc==''){
      wx.showToast({
        title: '请填写活动描述',
        icon:'error',
        duration:1500
      })
      return false
    }
    else if(this.data.srcI==''){
      wx.showToast({
        title: '请上传图片',
        icon:'error',
        duration:1500
      })
      return false
    }
    else{
      this.uploadFile(userId)
    }
    // console.log(this.data.name)
    // console.log(this.data.code)
    // console.log(this.data.address)
    // console.log(this.data.currentTime)
    // console.log(this.data.endCurrentTime)
    // console.log(typeof(this.data.number))
    // console.log(this.data.activityArr[this.data.setIndex].label)
    // console.log(this.data.desc)

    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  pickerTap: function (e) {
    // console.log("pickerTap")
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear, this.data.currentTime);
    this.setData({
       dateTimeArray: obj.dateTimeArray,
       dateTime: obj.dateTime,
       endDateTimeArray:obj.dateTimeArray,
       endDateTime: obj.dateTime,
    });
 }, 
 changeDateTime(e) {
    var dateTimeArray=this.data.dateTimeArray,dateTime=e.detail.value;
    this.setData({
       // dateTime: e.detail.value,
       currentTime: dateTimeArray[0][dateTime[0]] + '-' + dateTimeArray[2][dateTime[2]] + '-' + dateTimeArray[4][dateTime[4]] + ' ' + dateTimeArray[6][dateTime[6]] + ':' + dateTimeArray[8][dateTime[8]]+':'+dateTimeArray[10][dateTime[10]]
    });
 },
 changeEndDateTime(e) {
  var endDateTimeArray=this.data.endDateTimeArray,dateTime=e.detail.value;
  this.setData({
     // dateTime: e.detail.value,
     endCurrentTime: endDateTimeArray[0][dateTime[0]] + '-' + endDateTimeArray[2][dateTime[2]] + '-' + endDateTimeArray[4][dateTime[4]] + ' ' + endDateTimeArray[6][dateTime[6]] + ':' + endDateTimeArray[8][dateTime[8]]+':'+endDateTimeArray[10][dateTime[10]]
  });
},
 changeDateTimeColumn(e) {
    var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;
    arr[e.detail.column] = e.detail.value;
    dateArr[4] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[2][arr[2]]);
    this.setData({
       dateTimeArray: dateArr,
       dateTime: arr
    });
 },
 changeEndDateTimeColumn(e) {
    var arr = this.data.endDateTime, dateArr = this.data.endDateTimeArray;
    arr[e.detail.column] = e.detail.value;
    dateArr[4] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[2][arr[2]]);
    this.setData({
      endDateTimeArray: dateArr,
      endDateTime: arr
    });
 },
  onLoad(options) {
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear, this.data.currentTime);
      // console.log(obj.dateTimeArray)
      this.setData({
         dateTimeArray: obj.dateTimeArray,
         dateTime: obj.dateTime
      });
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