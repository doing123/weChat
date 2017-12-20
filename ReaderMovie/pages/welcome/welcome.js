Page({
  onTap: function (event) {
    //页面重定向：关闭当前页面，跳转到应用内的某个页面
    wx.redirectTo({
      url: '../posts/post',
      success: function (res) {

      },
      fail: function () {

      },
      complete: function () {

      }
    });

    //tab切换
    // wx.switchTab({
    //   url: "../posts/post"
    // });

    //最多层级5级：父子关系
    // wx.navigateTo({
    //   url: '../posts/post'
    // });

  }
});