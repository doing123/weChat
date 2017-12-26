// pages/movies/more-movie/more-movie.js
var util = require("../../../utils/utils.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigateTitle: '',
    movies: '',
    requestUrl: '',
    totalCount: 0,
    isEmpty: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var category = options.category;
    this.setData({
      navigateTitle: category
    });

    var dataUrl = '';
    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.doubanBase +
          "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase +
          "/v2/movie/coming_soon";
        break;
      case "豆瓣Top250":
        dataUrl = app.globalData.doubanBase +
          "/v2/movie/top250";
        break;
    }

    this.setData({
      requestUrl: dataUrl
    });
    util.http(dataUrl, this.processDoubanData);
  },

  //滚动到底部更多
  onReachBottom: function (options) {
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanData);

    //加载更多提示
    wx.showNavigationBarLoading();
  },

  //TODO:scroll-view  下拉刷新不可用
  //下拉刷新
  onPullDownRefresh: function () {
    var refreshUrl = this.data.requestUrl + "?start=0&count=20";
    this.setData({
      movies: {},
      isEmpty: true
    })
    util.http(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },

  processDoubanData: function (moviesDouban) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + '...';
      }

      movies.push({
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverrageUrl: subject.images.large,
        movieId: subject.id
      });
    }

    var totalMovies;
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    } else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }

    this.setData({
      totalCount: this.data.totalCount + 20,
      movies: totalMovies
    });
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  onReady: function (options) {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,
    });
  },

  //跳转到电影详情页面
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId
    });
  }
});