function convertToStarsArray(stars) {
  var num = stars.toString().substring(0, 1);
  var array = [];
  for (var i = 0; i <= 5; i++) {
    if (i <= num) {
      array.push(1);
    } else {
      array.push(0);
    }
  }
  return array;
}

function http(url, callBack, method) {
  var that = this;
  wx.request({
    url: url,
    data: {},
    method: method || 'GET',
    header: {
      // "Content-Type": "application/json" //400
      "Content-Type": "application/xml"
    },
    success: function (res) {
      callBack(res.data);
    },
    fail: function () { // 小程序内部错误
      console.log('failed');
    }
  });
}

module.exports = {
  convertToStarsArray: convertToStarsArray,
  http: http
}