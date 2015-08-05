var http = require ('http');
var assert = require('assert');
var print = require('./printer');
var mongoose = require ("mongoose");
var details = require('./company_details');
var share_details = require('./shareholding_details');
var async = require('async');
var code;
var company_list11 = require('./company_list');
var url1 = 'https://www.valueresearchonline.com/stocks/StockSelector/default.asp?index=&cap=&sec=&indus=&firstchar=';
var curl = 'https://www.valueresearchonline.com/stocks/snapshot.asp?code=';
var surl = 'https://www.valueresearchonline.com/stocks/shareholding_pattern.asp?code=';

var company_list_schema = new mongoose.Schema({
    company_name : String,
    company_code : Number
});
var company_list = mongoose.model('Company_list_collection', company_list_schema);
var company_details_schema = new mongoose.Schema({

            Company_name : String,
            Sector : String,
            Industry : String,
            _Date :  Date,
            BSE_Price : String,
            NSE_Price :String,
            BSE_Code : String,
            NSE_Code : String,
            TTM_EPS : String ,
            p_b : String,
            Dividend_Yield : String,
            Book_Value : String,
            Face_Value : String,
            C_Address : String,
            C_Email : String,
            C_Phone : String,
            C_Fax : String ,
            C_Website : String,
            Rt_Name : String,
            Rt_Address : String,
            Rt_Email : String ,
            Rt_Phone : String,
            Rt_Fax : String ,
            Rt_Website : String

});
var shareholder_details_schema = new mongoose.Schema({

            company_name : String,
            shareholder_name : String,
            category : String,
            percentage : [{
                June_15 :String,
                March_15 : String,
                Dec_14 : String,
                Sep_14 : String,
                June_14 : String
              }],
            date : Date
});

shareholder_list = mongoose.model('shareholdersDetails_collection', shareholder_details_schema);

var company_list1 = mongoose.model('Company_fullDetails_collection', company_details_schema);

var insert_companyList = function(alpha){
    var uristring ='mongodb://localhost:27017/Value_Research_Online';
    var company_list_array;
    var db = mongoose.connection;
    mongoose.connect(uristring);
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback () {

        list(company_list_array,alpha,function(error, docs){
          setTimeout(function(){print_list(alpha)}, 1000);
        });

    });

    var list = function(company_list_array,alpha, callback){

        company_list11.fetchFromUrl(url1,alpha, function (error, company_list_array) {
            if(error) {
              return callback(error);
            }
                  async.each(company_list_array , function (company_list_array , callback) {
                  save_company_list(company_list_array );
                  callback();
                  });
          callback(null,"success");
        });

      var save_company_list = function (company_List_array){
          company_list.find({ 'company_code': company_List_array .code}, function (err, doc){
              var company = new company_list ({
                    company_name: company_List_array .c_name,
                    company_code: company_List_array .code
              });
              var upsertData = company.toObject();
              delete upsertData._id;
                company_list.update({'company_code': company_List_array .code}, upsertData, {upsert: true}, function(err,doc){
                });
          });
      };
    }
}
//jay
  var print_list = function(alpha){
          company_list.find({'company_name': new RegExp('^'+alpha, "i")}, function (err, docs) {
          print.company(docs);
      });
    }

    var print_company = function(com_name){
          company_list1.find({ 'Company_name': com_name}, function(err, doc){
          if(err) throw err;
          else{
            print.table(doc);
          }
        });
    }

     var print_share = function(com_name){
          shareholder_list.find({ 'company_name': com_name}, function(err, doc){
          if(err) throw err;
          else{
            print.shareHolders(doc);
          }
        });
    }

var insert_company = function(com_name){
    var company_details;
    var uristring ='mongodb://localhost:27017/Value_Research_Online';
    var db = mongoose.connection;
    mongoose.connect(uristring);
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback () {

        company_list.find({ 'company_name': com_name}, function(err, doc){
        if(err) throw err;
        else{
              code = doc[0].company_code;
              i_company(company_details,code,com_name,function(error,fly){
              //console.log("Data is Inserted");
              });
        }
      })
        var com1 = com_name.split(' Ltd');
        com_name = com1[0].trim();
        setTimeout(function(){print_company(com_name);}, 5000);
    });

    var i_company  = function(company_details,code,com_name, callback){

          details.fetchFromUrl(curl,code, function (error, company_details) {
              if(error) {
                return callback(error);
              }

                save_companyDetails_list(company_details);
                callback(null,"success");
          });

    var save_companyDetails_list = function (company_details ){
          company_list1.find({ 'Company_name': company_details['c_name']}, function (err, doc){
              var company = new company_list1 ({
              Company_name : company_details['c_name']|| 'NA',
              Sector: company_details['sector']|| 'NA',
              Industry : company_details['industry']|| 'NA',
              _Date :  company_details['date']|| 'NA',
              BSE_Price : company_details['BSE_price']|| 'NA',
              NSE_Price : company_details['NSE_price']|| 'NA',
              BSE_Code : company_details['BSE_code']|| 'NA',
              NSE_Code : company_details['NSE_code']|| 'NA',
              TTM_EPS : company_details['ttm_eps']|| 'NA',
              p_b : company_details['p_b']|| 'NA',
              Dividend_Yield : company_details['dividend_yield']|| 'NA',
              Book_Value : company_details['book_value']|| 'NA',
              Face_Value : company_details['face_value']|| 'NA',
              C_Address : company_details['c_address']|| 'NA',
              C_Email : company_details['c_email']|| 'NA',
              C_Phone : company_details['c_phone'] || 'NA',
              C_Fax :company_details['c_fax']|| 'NA',
              C_Website : company_details['c_website']|| 'NA',
              Rt_Name : company_details['rt_name']|| 'NA',
              Rt_Address : company_details['rt_address']|| 'NA',
              Rt_Email : company_details['rt_email']|| 'NA',
              Rt_Phone : company_details['rt_phone']|| 'NA',
              Rt_Fax : company_details['rt_fax']|| 'NA',
              Rt_Website : company_details['rt_website']|| 'NA'
          });
              var upsertData = company.toObject();
              delete upsertData._id;
              company_list1.update({'Company_name': company_details['c_name']}, upsertData, {upsert: true}, function(err,doc){
              });
          });
    };
  }
}
//jay end

//Shareholder_details
var insert_shareholder_list = function(com_name){
    var uristring ='mongodb://localhost:27017/Value_Research_Online';
    var shareholder_details;
    var db = mongoose.connection;
    mongoose.connect(uristring);
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback () {

        company_list.find({ 'company_name': com_name}, function(err, doc){
        if(err) throw err;
        else{
              code = doc[0].company_code;
              i_share(shareholder_details,code,com_name,function(error,fly){
              //console.log("Data is Inserted");
              });
        }
      })
        var com1 = com_name.split(' Ltd');
        com_name = com1[0].trim();
        setTimeout(function(){print_share(com_name);}, 5000);

  });
    var i_share  = function(shareholder_details,code,com_name, callback){

          share_details.fetchFromUrl(surl,code, function (error, shareholder_details) {
              if(error) {
                return callback(error);
              }
          async.each(shareholder_details , function (shareholder_details , callback) {
          save_shareholderDetails(shareholder_details );
          callback();

      })

                callback(null,"success");
          });

    var save_shareholderDetails = function (shareholder_details ){
          shareholder_list.find({ 'company_name': shareholder_details.c_name, 'shareholder_name' : shareholder_details.sh_name }, function (err, doc){
            var array = {
                      June_15 : shareholder_details.percentage[0].June_15,
                      March_15 : shareholder_details.percentage[0].March_15,
                      Dec_14 : shareholder_details.percentage[0].Dec_14,
                      Sep_14 : shareholder_details.percentage[0].Sep_14,
                      June_14 : shareholder_details.percentage[0].June_14
            };
            var shareholder = new shareholder_list ({
                  Company_name : shareholder_details.c_name,
                  shareholder_name : shareholder_details.sh_name,
                  category : shareholder_details.category,
                   percentage : array,
                   date: shareholder_details.date

            });
            var upsertData = shareholder.toObject();
            delete upsertData._id;
            shareholder_list.update({'company_name': shareholder_details.c_name , 'shareholder_name' : shareholder_details.sh_name}, upsertData, {upsert: true}, function(err,doc){
            });

          });
    };
  }
}

// Main program
assert.ok(process.argv.length > 2, 'Choose output by command line (0/1/2/3)');

if (process.argv[2] === '0') {
  insert_companyList(process.argv[3]);
}
else if (process.argv[2] === '1') {
  insert_company(process.argv[3]);
}
else if (process.argv[2] === '2'){
  insert_shareholder_list(process.argv[3]);
}
else {
  console.log('Invalid output');
  process.exit();
}
