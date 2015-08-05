var Table = require('cli-table');

// Constants
var HDELIMITER = '\t\t\t';
var DELIMITER = '\t\t';

exports.company = function (company) {

    var table = new Table({
      head: ['Company ID','company Name'],
      colWidths: [20,70],
    });
    company.forEach(function (comp) {
      table.push([comp.company_code, comp.company_name]);
    });

    console.log(table.toString());
}

exports.table = function (table1) {

    var table = new Table({
       head: ['company Name','Sector','Industry','Date','NSE','BSE','TTM EPS','P/B', 'Dividend Yield','Book Value','NSE Code','BSE Code','Face Value'],
       colWidths: [25,10,10,30,10,10,15,15,20,15,15,15,15],
    });
    var table2 = new Table({
      head: ['C_Address','C_Email','C_Phone','C_Fax','C_Website','Registrar & Transfer Agent','RT_Address','RT_Email','RT_Phone','RT_Fax','RT_Website'],
      colWidths: [40,25,15,15,25,30,20,20,15,15,20],
    });
    table.push([table1[0].Company_name,
         table1[0].Sector,
         table1[0].Industry,
         table1[0]._Date,
         table1[0].NSE_Price,
         table1[0].BSE_Price,
         table1[0].TTM_EPS,
         table1[0].p_b,
         table1[0].Dividend_Yield,
         table1[0].Book_Value,
         table1[0].NSE_Code,
         table1[0].BSE_Code,
         table1[0].Face_Value
         ]);;
table2.push([
         table1[0].C_Address,
         table1[0].C_Email,
         table1[0].C_Phone,
         table1[0].C_Fax,
         table1[0].C_Website,
         table1[0].Rt_Name,
         table1[0].Rt_Address,
         table1[0].Rt_Email,
         table1[0].Rt_Phone,
         table1[0].Rt_Fax,
         table1[0].Rt_Website

      ]);
    console.log(table.toString());
    console.log(table2.toString());
}

exports.shareHolders = function (shareHolders) {

    var table = new Table({
      head: ['Company Name','Name','Catagory','Jun-15','Mar-15','Dec-14','Sep-14','Jun-14','Date'],
      colWidths: [30,30,30,20,20,20,20,20,40],
    });

    shareHolders.forEach(function (comp) {
      table.push([
        comp.company_name,
         comp.shareholder_name,
         comp.category,
         comp.percentage[0].June_14,
        comp.percentage[0].Sep_14,
        comp.percentage[0].Dec_14,
        comp.percentage[0].March_15,
        comp.percentage[0].June_15,
        comp.date
        ]);
    });

    console.log(table.toString());
};
