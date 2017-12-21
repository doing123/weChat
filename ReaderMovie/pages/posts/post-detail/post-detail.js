
var textContents = require('../../../data/posts-data.js');

Page({
  data:{
    isPlayingMusic:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var postId = options.id;
    var textDetail = textContents.textContent[postId];
    // console.log(textDetail);
    this.setData({
      detail: textDetail,
      currentPostId: postId
    });

    // wx.setStorageSync('key', 'test');

    //读取缓存状态：是否收藏
    var postsCollected = wx.getStorageSync('postsCollected');
    if (postsCollected) {
      var postCollected = postsCollected[postId];
      this.setData({
        collected: postCollected
      });
    } else {
      postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('postsCollected', postsCollected);
    }
  },

  //绑定收藏事件
  onCollectionTap: function (event) {
    this.getPostsCollectedSync();
    // this.getPostsCollectedAsync(); // 异步
  },

  //异步获取收藏的值并设置
  getPostsCollectedAsync: function () {
    var that = this;
    wx.getStorage({
      key: 'postsCollected',
      success: function (res) {
        var postsCollected = res.data;
        var postCollected = postsCollected[that.data.currentPostId];

        //收藏切换
        postCollected = !postCollected;
        postsCollected[that.data.currentPostId] = postCollected;

        // this.showModal(postsCollected, postCollected);
        that.showToast(postsCollected, postCollected);
      }
    });
  },

  //同步获取收藏的值并设置
  getPostsCollectedSync: function () {
    var postsCollected = wx.getStorageSync('postsCollected');
    var postCollected = postsCollected[this.data.currentPostId];

    //收藏切换
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;
    // this.showModal(postsCollected, postCollected);
    this.showToast(postsCollected, postCollected);
  },


  showModal: function (postsCollected, postCollected) {
    var that = this;
    wx.showModal({
      title: '收藏',
      content: postCollected ? '收藏该文章？' : '取消收藏该文章？',
      showCancel: 'true',
      cancelText: '取消',
      cancelColor: '#333',
      confirmText: '确认',
      confirmColor: '#405f88',
      success: function (res) {
        if (res.confirm) {
          //更新文章是否收藏的缓存值
          wx.setStorageSync('postsCollected', postsCollected);
          //更新数值绑定的变量，从而实现图片的切换
          that.setData({
            collected: postCollected
          });
        }
      }
    });
  },

  showToast: function (postsCollected, postCollected) {
    //更新文章是否收藏的缓存值
    wx.setStorageSync('postsCollected', postsCollected);
    //更新数值绑定的变量，从而实现图片的切换
    this.setData({
      collected: postCollected
    });
    wx.showToast({
      title: postCollected ? '收藏成功' : '取消成功',
      duration: 2000,
      icon: 'success',
      success: function () {
        // console.log('ss');
      }
    });
  },

  onShareTap: function (event) {
    var itemList = [
      "分享到微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: '#405f80',
      success: function (res) {
        //res.cancel
        //res.tapIndex 数组元素的序号，从0开始
        wx.showModal({
          title: '用户' + itemList[res.tapIndex],
          content: '用户是否取消？现在无法实现分享功能'
        });
      },
      fail: function (res) {
        wx.showModal({
          title: '确认取消',
          content: res.errMsg
        });
      }
    })
  },

  //音乐播放切换
  onMusicTap: function (event) {
    var currentPostId = this.data.currentPostId;
    var music = textContents.textContent[currentPostId].music;
    var isPlayingMusic = this.data.isPlayingMusic;
    if (isPlayingMusic){
      //暂停
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic:false
      });
    } else{
      wx.playBackgroundAudio({
        dataUrl: music.url,
        title: music.title,
        coverImgUrl: music.coverImg
      });
      this.setData({
        isPlayingMusic: true
      });
    }
  }

});