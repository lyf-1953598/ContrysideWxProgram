/* 封装云函数请求 */

export default (name, data = {}) => {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name,
      data,
      success: (res) => {
        //console.log('请求云函数成功:' + name, res)
        resolve(res.result)
      },
      fail(err) {
        //console.log('请求云函数失败:' + name, err)
        reject(err)
      }
    })
  })
}