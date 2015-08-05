var request = require('request');
var cheerio = require('cheerio');

exports.parse = function (html){

  var parsedResult = {};
  // TODO: Parse and set values accordingly
  var $ = cheerio.load(html);

  var parsedResult = {
      c_name: $('h1.stock-tittle').text(),
      sector: $('a.color_gray').first().text(),
      industry: $('a.color_gray').last().text()
    }

      var NSE_full = $('div.panel-collapse.collapse.in tr td.bold').first().text();
      var NSE_tag = NSE_full.split(',');
      var NSE1= NSE_tag[0].split(' ');

      var BSE_full = $('div.panel-collapse.collapse.in tr td.bold').last().text();
      var BSE_tag = BSE_full.split(',');
      var BSE1 = BSE_tag[0].split(' ');

      var date = new Date();
      parsedResult.date = date;
      if(NSE1[0] === "NSE"){
        var Nse_price = $('div#collapseDetails tr td.align_right').first().text();
        parsedResult.NSE_price = Nse_price;
      }
      if(BSE1[0] === "BSE"){
          var Bse_price = $('div#collapseDetails tr:nth-child(2) td.align_right').first().text();
          parsedResult.BSE_price = Bse_price;
      }
      if(NSE1[0] === "BSE"){
        var Bse_price = $('div#collapseDetails tr td.align_right').first().text();
        parsedResult.BSE_price = Bse_price;
      }
      if(BSE1[0] === "NSE"){
          var Nse_price = $('div#collapseDetails tr:nth-child(2) td.align_right').first().text();
          parsedResult.NSE_price = Nse_price;
      }

      var NSE_code_temp= $('div.sectionHead.margin_top tr td.border_top_gray').last().text();
      trimmed_code= NSE_code_temp.trim();
      var NSE_code = trimmed_code.split(':');
      parsedResult.NSE_code = NSE_code[1];

      var BSE_code_temp = $('div.sectionHead.margin_top tr').last().prev().children().last().text();
      BSE_code_temp = BSE_code_temp.split(':');
      BSE_code = BSE_code_temp[1].trim();
      parsedResult.BSE_code = BSE_code;

      var p_b_row= $('div.sectionHead.margin_top tr td.border_top_gray').first().next().text();
      var p_b = p_b_row.split(':');
      p_b = p_b[1].trim();
      parsedResult.p_b = p_b;

      var ttm_temp = $('div.sectionHead.margin_top tr').last().children().first().text();
      ttm_temp = ttm_temp.split(':');
      ttm_temp = ttm_temp[1].trim();
      ttm_temp = ttm_temp.split(' ');
      ttm_eps = ttm_temp[1];
      parsedResult.ttm_eps = ttm_eps;

      var face_value_temp = $('div.sectionHead.margin_top tr').last().children().last().text();
      face_value_temp = face_value_temp.split(':');
      face_value_temp = face_value_temp[1].trim();
      face_value_temp = face_value_temp.split(' ');
      face_value = face_value_temp[1];
      parsedResult.face_value = face_value;

      var book_value_temp = $('div.sectionHead.margin_top tr td').last().prev().text();
      book_value_temp = book_value_temp.split(':');
      book_value_temp = book_value_temp[1].trim();
      book_value_temp = book_value_temp.split(' ');
      book_value = book_value_temp[1];
      parsedResult.book_value = book_value;

      var dividend_yield_temp = $('div.sectionHead.margin_top tr').last().prev().children().last().prev().text();
      dividend_yield_temp = dividend_yield_temp.split(':');
      dividend_yield = dividend_yield_temp[1].trim();
      parsedResult.dividend_yield = dividend_yield;

      var check = $('div.pull-left.sectionHead p span').text();
      check = check.split(':')
      check.pop();

      var c_add= $('div.pull-left.sectionHead p span.bold').first().text();

      if(c_add === 'Address:'){
      var c_add_temp = $('div.pull-left.sectionHead p').first().next().text();
      if(c_add_temp){
            c_full_add = c_add_temp.split('|');
            if(c_full_add){
            c_address = c_full_add[0].split(':');
            c_address = c_address[1].trim();
            parsedResult.c_address = c_address;

                  if(c_full_add[1] != undefined){
                  c_phone = c_full_add[1].split(':');
                  c_phone = c_phone[1].trim();
                  parsedResult.c_phone = c_phone;

                  if(c_full_add[2] != undefined){
                  c_fax = c_full_add[2].split(':');
                  c_fax = c_fax[1].trim();
                  parsedResult.c_fax = c_fax;
                  }
              }
            }
          }
        }


      if(check[1] === 'Email'){
      var c_email = $('div.pull-left.sectionHead p').first().next().next().text();
      c_email = c_email.split(':');
      c_email = c_email[1].trim();
      parsedResult.c_email = c_email;
      }
      if(check[1] === 'Website'){
      var c_website = $('div.pull-left.sectionHead p').first().next().next().text();
      c_website = c_website.split(':');
      c_website = c_website[1].trim();
      parsedResult.c_website = c_website;
      }

      if(check[2] === 'Website'){
          var c_website = $('div.pull-left.sectionHead p').first().next().next().next().text();
          c_website = c_website.split(':');
          c_website = c_website[1].trim();
          parsedResult.c_website = c_website;
      }

      var rt_name_temp = $('div.pull-left.sectionHead p.bold').last().text();
      rt_name_temp = rt_name_temp.split(':');
      rt_name = rt_name_temp[1].trim();
      parsedResult.rt_name = rt_name;

      var rt_add_temp = $('div.divider').next().next().text();
      if(rt_add_temp){
            rt_full_add = rt_add_temp.split('|');
            if(rt_full_add){
            rt_address = rt_full_add[0].split(':');
            rt_address = rt_address[1].trim();
            parsedResult.rt_address = rt_address;

                if(rt_full_add[1] != undefined){
                  rt_phone = rt_full_add[1].split(':');
                  rt_phone = rt_phone[1].trim();
                  parsedResult.rt_phone = rt_phone;

                if(rt_full_add[2] != undefined){
                  rt_fax = rt_full_add[2].split(':');
                  rt_fax = rt_fax[1].trim();
                  parsedResult.rt_fax = rt_fax;
                }
              }
            }
          }

      if(check[4] === 'Email'){
      var rt_email = $('div.pull-left.sectionHead p').last().prev().next().text();
      rt_email = rt_email.split(':');
      rt_email = rt_email[1].trim();
      parsedResult.rt_email = rt_email;
      }
      if(check[4] === 'Website'){
      var rt_website = $('div.pull-left.sectionHead p').last().prev().next().text();
      rt_website = rt_website.split(':');
      rt_website = rt_website[1].trim();
      parsedResult.rt_website = rt_website;
      }

          if(check[5] === 'Website'){
              var rt_website = $('div.pull-left.sectionHead p').last().text();
              rt_website = rt_website.split(':');
              rt_website = rt_website[1].trim();
              parsedResult.rt_website = rt_website;
          }

          return parsedResult;
}

exports.fetchFromUrl = function (url,code, callback) {
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
    }
    else {
      callback(new Error('Unknown HTTP Error ' + response.statusCode));
    }
  })
};

exports.fetchFromFile = function (path, callback) {
  fs.readFile(path, function (error, html) {
    if (error) {
      return callback(error);
    }
    // Parse and return result
    var parsedResult;

    try {
      parsedResult = parse(html);
    } catch (error) {
      return callback(error);
    }

    callback(null, parsedResult);
  });
};

