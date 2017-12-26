var util = require("../../utils/utils.js");
var app = getApp();
Page({
  data: {
    inTheaters: {}, // 避免页面绑定初始化报错
    comingSoon: {},
    top250: {},
    searchResult: {},
    containerShow: true,
    searchPanelShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var inTheatersUrl = app.globalData.doubanBase +
      "/v2/movie/in_theaters" + "?start=0&count=3";
    var comingSoonUrl = app.globalData.doubanBase +
      "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250Url = app.globalData.doubanBase +
      "/v2/movie/top250" + "?start=0&count=3";

    this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
    this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
    this.getMovieListData(top250Url, "top250", "豆瓣Top250");
  },

  onMoreTap: function (event) {
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movie/more-movie?category=' + category
    });
  },

  //跳转到电影详情页面
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + movieId
    });
  },

  getMovieListData: function (url, settedKey, categoryTitle) {
    var that = this;
    wx.request({
      url: url,
      data: {},
      method: 'GET',
      header: {
        // "Content-Type": "application/json" //400
        "Content-Type": "application/xml"
      },
      success: function (res) {
        that.processDoubanData(res.data, settedKey, categoryTitle);
      },
      fail: function () { // 小程序内部错误
        console.log('failed');
      }
    });
  },

  //关闭搜索
  onCancelImgTap: function () {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      // searchResult:{}
    });
  },

  //获取焦点
  onBindFocus: function (options) {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    });
  },

  onBindChange: function (event) {
    var text = event.detail.value;
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
    this.getMovieListData(searchUrl, 'searchResult', '');
  },

  //处理请求回来的数据
  processDoubanData: function (moviesDouban, settedKey, categoryTitle) {
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

    var readyData = {};
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    };
    this.setData(readyData);
  }

});