'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//自动进行全局的ES6 Promise的Polyfill
require('es6-promise').polyfill();
var urlencode = require('isomorphic-urlencode');

//如果是在浏览器环境下则直接载入fetch对象

/**
 * @author 王下邀月熊
 * @function Fluent, Super Agent Style Wrapper For Fetch
 * @features Fluent API、Cache Strategy、Timeout Strategy、Retry Strategy
 */

var FluentFetcher = function () {

  /**
   * @function 默认构造函数
   * @param scheme http 或者 https
   * @param host 请求的域名
   * @param encoding 编码方式,常用的为 utf8 或者 gbk
   * @param accept 返回的数据类型 常用的为 text 或者 json
   */
  function FluentFetcher() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref$scheme = _ref.scheme;
    var scheme = _ref$scheme === undefined ? "http" : _ref$scheme;
    var _ref$host = _ref.host;
    var host = _ref$host === undefined ? "api.com" : _ref$host;
    var _ref$encoding = _ref.encoding;
    var encoding = _ref$encoding === undefined ? "utf8" : _ref$encoding;
    var _ref$acceptType = _ref.acceptType;
    var acceptType = _ref$acceptType === undefined ? "json" : _ref$acceptType;

    _classCallCheck(this, FluentFetcher);

    /**
     * @region 请求相关控制
     */
    this.scheme = scheme;

    this.host = host;

    //注意,对于非utf8编码,请输入编码之后的字符串
    this.encoding = encoding;

    //预期接收的数据类型
    this.acceptType = acceptType;

    /**
     * @region 其他初始化值
     */
    //请求路径
    this.path = '';

    //请求参数
    this.params = {};

    //设置请求内容类型 json / x-www-form-urlencoded
    this.contentType = "json";

    //请求的选项设置
    this.option = {
      //默认设置为非CORS请求
    };

    /**
     * @region 辅助参数
     */
    this.mockData = {};
  }

  /**
   * @region 公用方法定义区域
   */

  /**
   * @region 基本请求方法定义
   */

  /**
   * @function 设定本次请求的所有的请求参数,务必在选定方法之前调用
   * @description 先强制设定好全部的请求参数,这样分别在get、post、put、delete中就可以进行参数封装了
   * @param params
   */


  _createClass(FluentFetcher, [{
    key: 'parameter',
    value: function parameter(params) {

      //判断是否已经封装过了请求方法
      if (!params) {
        throw new Error("请设置有效请求参数");
      }

      this.params = params;

      return this;
    }

    //这里输入的path是不会进行编码的,因此不要输入一些动态参数

  }, {
    key: 'get',
    value: function get() {
      var path = arguments.length <= 0 || arguments[0] === undefined ? "/" : arguments[0];


      //封装请求类型
      this._method('get', path);

      //重置body，避免之前使用过post
      this.option.body = null;

      return this;
    }

    /**
     * @function 以POST形式发起请求
     * @param path
     * @param contentType
     * @return {FluentModel}
     */

  }, {
    key: 'post',
    value: function post() {
      var path = arguments.length <= 0 || arguments[0] === undefined ? "/" : arguments[0];
      var contentType = arguments.length <= 1 || arguments[1] === undefined ? "json" : arguments[1];


      this._method('post', path, contentType);

      return this;
    }

    /**
     * @function 以put形式发起请求
     * @param path
     * @param contentType
     * @return {FluentFetcher}
     */

  }, {
    key: 'put',
    value: function put() {
      var path = arguments.length <= 0 || arguments[0] === undefined ? "/" : arguments[0];
      var contentType = arguments.length <= 1 || arguments[1] === undefined ? "json" : arguments[1];


      this._method('put', path, contentType);

      return this;
    }

    /**
     * @function 以delete方法发起请求
     * @param path
     * @param contentType
     * @return {FluentFetcher}
     */

  }, {
    key: 'delete',
    value: function _delete() {
      var path = arguments.length <= 0 || arguments[0] === undefined ? "/" : arguments[0];
      var contentType = arguments.length <= 1 || arguments[1] === undefined ? "json" : arguments[1];


      this._method('delete', path, contentType);

      return this;
    }

    /**
     * @function 请求头设置
     * @key 请求键名
     * @value 请求值名
     */

  }, {
    key: 'header',
    value: function header() {
      var key = arguments.length <= 0 || arguments[0] === undefined ? "Accept" : arguments[0];
      var value = arguments.length <= 1 || arguments[1] === undefined ? "application/json" : arguments[1];


      if (!this.option.headers) {
        this.option.headers = {};
      }

      this.option.headers[key] = value;

      //为了方便链式调用
      return this;
    }

    /**
     * @function 请求路径封装，自动进行编码操作
     * @param segment
     * @return {FluentModel}
     */

  }, {
    key: 'pathSegment',
    value: function pathSegment(_ref2) {
      var _ref2$segment = _ref2.segment;
      var segment = _ref2$segment === undefined ? "" : _ref2$segment;


      if (!!segment) {

        //当segment有意义值时
        this.path = this.path + '/' + this._encode(segment);
      }

      //返回当前对象
      return this;
    }

    /**
     * @function 设置本次请求为CORS
     */

  }, {
    key: 'cors',
    value: function cors() {

      this.option.mode = "cors";

      this.header('Origin', '*');

      return this;
    }
  }, {
    key: 'mock',
    value: function mock() {
      var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];


      this.mockData = data;

      return this;
    }

    /**
     * @region 请求体构造与请求策略构造
     */

  }, {
    key: 'cookie',
    value: function cookie() {

      return this;
    }
  }, {
    key: 'timeout',
    value: function timeout(_ref3) {
      var _ref3$time = _ref3.time;
      var time = _ref3$time === undefined ? 0 : _ref3$time;
    }

    /**
     * @function 仅允许对于GET动作进行缓存
     * @return {FluentModel}
     */

  }, {
    key: 'cache',
    value: function cache(_ref4) {
      var _ref4$cacheControl = _ref4.cacheControl;
      var cacheControl = _ref4$cacheControl === undefined ? "no-cache" : _ref4$cacheControl;
      var _ref4$maxAge = _ref4.maxAge;
      var maxAge = _ref4$maxAge === undefined ? "0" : _ref4$maxAge;


      return this;
    }

    /**
     * @function 失败重试策略
     * @return {FluentModel}
     */

  }, {
    key: 'retry',
    value: function retry() {

      return this;
    }

    /**
     * @function 进行最后的构建工作,一旦调用该函数即不可以再修改之前的配置
     * @return {Promise}
     */

  }, {
    key: 'build',
    value: function build() {

      //构造请求路径
      var packagedPath = this.scheme + '://' + this.host + this.path;

      //封装请求参数字符串，
      var queryString = this._parseParamsToQueryStringOrSetBody();

      //封装好的请求地址
      var url = void 0;

      //在查询字符串有意义的情况下，将其封装到path尾部
      if (!!queryString) {
        url = packagedPath + '?' + queryString;
      } else {
        url = packagedPath;
      }

      //判断是否存在有Mock数据
      if (this._isMock()) {
        return this._buildMock();
      }

      //判断是否为微信环境
      if (this._isWeapp()) {
        return this._buildWeapp(url);
      }

      require('isomorphic-fetch');

      //构建fetch请求
      return fetch(url, this.option).then(this._checkStatus, function (error) {
        throw error;
      }).then(this.acceptType === "json" ? this._parseJSON : this._parseText, function (error) {
        throw error;
      });
    }

    /**
     * @function 判断是否为Weapp
     * @private
     */

  }, {
    key: '_isWeapp',
    value: function _isWeapp() {

      if (typeof wx !== 'undefined') {
        return true;
      } else {
        return false;
      }
    }

    /**
     * @function 如果是Weapp环境下则构建Weapp内建的请求
     * @param url
     * @return {Promise}
     * @private
     */

  }, {
    key: '_buildWeapp',
    value: function _buildWeapp(url) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        wx.request({
          url: url,
          method: _this.option.method,
          data: _this.params,
          header: _this.option.headers,
          success: function success(res) {
            resolve(res.data);
          },
          fail: function fail(err) {
            reject(err);
          }
        });
      });
    }

    /**
     * @function 根据当前路径判断是否需要Mock
     * @param path
     * @private
     */

  }, {
    key: '_isMock',
    value: function _isMock() {

      if (!!this.mockData[this.path]) {
        return true;
      } else {
        return false;
      }
    }

    /**
     * @function 如果是Mock数据则直接返回数据
     * @private
     */

  }, {
    key: '_buildMock',
    value: function _buildMock() {
      var _this2 = this;

      //构造Promise对象
      return new Promise(function (resolve, reject) {

        resolve(_this2.mockData[_this2.path]);
      });
    }

    /**
     * @function 封装请求类型
     * @param method
     * @param path
     * @param contentType
     * @private
     */

  }, {
    key: '_method',
    value: function _method() {
      var method = arguments.length <= 0 || arguments[0] === undefined ? 'get' : arguments[0];
      var path = arguments.length <= 1 || arguments[1] === undefined ? '/' : arguments[1];
      var contentType = arguments.length <= 2 || arguments[2] === undefined ? 'json' : arguments[2];


      //设置请求方式
      this.option.method = method;

      //设置请求数据类型
      this.contentType = contentType;

      //根据不同的ContentType构建不同的请求头
      this.header('Content-Type', 'application/' + contentType);

      //设置请求路径
      this.path = '' + path;
    }

    /**
     * @region 私有方法定义区域
     * @function 将传入的参数解析为请求字符串
     * @param method 请求方法
     * @param contentType 请求类型
     */

  }, {
    key: '_parseParamsToQueryStringOrSetBody',
    value: function _parseParamsToQueryStringOrSetBody() {

      //查询字符串
      var queryString = '';

      //判断当前是否已经设置了请求方法
      if (!this.option.method) {
        throw new Error("请设置请求方法");
      }

      //将请求参数封装到查询参数中
      for (var key in this.params) {
        queryString += key + '=' + this._encode(this.params[key]) + '&';
      }

      //删除最后一个无效的`&`,以避免被误认为SQL Injection
      queryString = queryString.substr(0, queryString.length - 1);

      //判断是否为GET
      if (this.option.method === "get") {

        //如果是GET,则将请求数据添加到URL中,这一步在build函数中进行了
        return queryString;
      } else if (this.contentType === "x-www-form-urlencoded") {

        //根据不同的编码格式设置不同的body内容
        //将构造好的查询字符串添加到body中
        this.option.body = queryString;
      } else {

        //如果是以JSON形式发起请求，则直接构造JSON字符串
        this.option.body = JSON.stringify(this.params);
      }

      return null;
    }

    /**
     * @function 检测返回值的状态
     * @param response
     * @returns {*}
     */

  }, {
    key: '_checkStatus',
    value: function _checkStatus(response) {

      if (response.status >= 200 && response.status < 300 || response.status == 0) {
        return response;
      } else {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
    }

    /**
     * @function 解析返回值中的Response为JSON形式
     * @param response
     * @returns {*}
     */

  }, {
    key: '_parseJSON',
    value: function _parseJSON(response) {

      if (!!response) {

        return response.json();
      } else {

        return {};
      }
    }

    /**
     * @function 解析TEXT性质的返回
     * @param response
     * @returns {*}
     */

  }, {
    key: '_parseText',
    value: function _parseText(response) {

      if (!!response) {

        return response.text();
      } else {

        return "";
      }
    }

    /**
     * @function 对于本次请求进行签名,主要是封装好的请求的URL
     * @private
     */

  }, {
    key: '_signature',
    value: function _signature() {}

    /**
     * @function 利用设置好的编码格式进行编码
     * @param str
     * @private
     */

  }, {
    key: '_encode',
    value: function _encode(str) {

      if (this.encoding === "utf8") {
        return encodeURIComponent(str);
      } else {
        return urlencode(str, this.encoding);
      }
    }
  }]);

  return FluentFetcher;
}();

exports.default = FluentFetcher;
