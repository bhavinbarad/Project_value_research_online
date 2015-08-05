var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var url = 'https://www.valueresearchonline.com/stocks/shareholding_pattern.asp?code='


exports.parse = function (html) {
  var parsedResult = [];
  // TODO: Parse and set values accordingly

  var $ = cheerio.load(html);
  // console.log(parsedResult);
  var SharesholdersInfo;
  var pattern_table = $('div.pull-left.sectionMainHead.margin_top15px').next().find('table');

  pattern_table.each(function() {

    $(this).find('tr').each(function() {
      var parsedObjects = {
        c_name : "",
        sh_name : "",
        category : "",
        percentage : [],
        date : ""
      };
      var Sharesholders = [];
      var self = this;
      self.thejson = [];
      SharesholdersInfo = $(this).not('th').text();
      Sharesholders  = SharesholdersInfo.split('\r\n');
      var month = ['June_15', 'March_15', 'Dec_14', 'Sep_14', 'June_14'];
      var data = {};
      $(this).each(function(index, value){
        var k, v = [];

        for(var i=0,j=4; i<month.length,j<Sharesholders.length-1; i++,j++) {
          k = month[i];
          v[i] = Sharesholders[j].trim();
          data[k] = v[i];
        }
        self.thejson.push(data);
      });
      parsedObjects.c_name= $('h1.stock-tittle').text();
      parsedObjects.sh_name = Sharesholders[1].trim();
      parsedObjects.category = Sharesholders[3].trim();
      parsedObjects.percentage = self.thejson;
      parsedObjects.date = new Date();
      parsedResult.push(parsedObjects);
    })

  });
  parsedResult.shift();
  return parsedResult;
};

exports.fetchFromUrl = function (url, code, callback) {
  var self = this;
  request(url+'+'+code, function (error, response, html) {
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


