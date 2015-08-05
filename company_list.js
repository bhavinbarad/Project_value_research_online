var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var url = 'https://www.valueresearchonline.com/stocks/StockSelector/default.asp?index=&cap=&sec=&indus=&firstchar='


exports.parse = function (html) {
  var parsedResult = [];
  // TODO: Parse and set values accordingly

  var $ = cheerio.load(html);
  var name = $('.tablesorter tbody').first();

  $(name).find('tr td a').not('.color_gray').each(function() {
    var obj = {};
    name = $(this).first().text();
    var url = $(this).attr('href');
    url = url.split('=');
    code = url[1];
    obj.c_name = name;
    obj.code = code;
    parsedResult.push(obj);
  })
  return parsedResult;
};

exports.fetchFromUrl = function (url, alpha, callback) {
  var self = this;
  request(url+'+'+alpha, function (error, response, html) {
    if (error) {
      return callback(error);
    }
    if (response.statusCode >= 200 && response.statusCode < 400) {
      // Parse and return result
      var parsedResult;

      try {
        parsedResult = self.parse(html);
      } catch (error) {
        return callback(error);
      }

      callback(null, parsedResult);
    } else {
      callback(new Error('Unknown HTTP Error ' + response));
    }
  })
};

exports.fetchFromFile = function (path, callback) {
  var self = this;
  fs.readFile(path, function (error, html) {
    if (error) {
      return callback(error);
    }

    // Parse and return result
    var parsedResult;

    try {
      parsedResult = self.parse(html);
    } catch (error) {
      return callback(error);
    }

    callback(null, parsedResult);
  });
};

