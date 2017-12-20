Page({
  onTap: function (event) {
    wx.switchTab({
      url: "../posts/post"
    });
    // wx.switchTab({
    //   url: '/pages/posts/post',
    // });

    // wx.navigateTo({
    //   url: '../posts/post'
    // });

  }
});