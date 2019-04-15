var mysql = require("mysql");
var inquirer = require("inquirer");
const {table} = require('table');
// import {
//   table
// } from 'table';
 
let data,
    output;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "bullet04",
    database: "bamazon_db"
  });

  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    start();
  });

 

  function start() {
    connection.query ("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        data = [];
        data.push(["item_id", "product_name", "department_name", "price", "stock_quantity","product_sales"]);
        for (var i = 0; i < results.length; i++) {
            // console.log("--------------------");
            // console.log("id: " + results[i].item_id);
            // console.log("name: " + results[i].product_name);
            // console.log("department: " + results[i].department_name);
            // console.log("price: " + results[i].price);
            // console.log("quantity: " + results[i].stock_quantity);
            // console.log("total product sales: " + results[i].product_sales);
            data.push([results[i].item_id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity, results[i].product_sales]);
        }
        options = {
          /**
           * @typedef {function} drawHorizontalLine
           * @param {number} index 
           * @param {number} size 
           * @return {boolean} 
           */
          drawHorizontalLine: (index, size) => {
              return index === 1;
          }
      };
        output = table(data, options);
        console.log(output);
        start2();
    });
}
function start2() {
    inquirer.prompt([
        {
          type: "input",
          message: "What is the id of the item you would like to buy?",
          name: "productid",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        },
        {
          type: "input",
          message: "How many units would you like to purchase?",
          name: "quantity",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
        ]).then(function(data) {
            connection.query ("SELECT * FROM products WHERE item_id = ?",[data.productid], function (err, result) {
                if (err) throw err;
                if (result[0].stock_quantity < data.quantity) {
                    console.log("Insufficient quantity!");
                    connection.end();
                }
                else {
                    connection.query ("Update products set stock_quantity = ? WHERE item_id = ?",[[result[0].stock_quantity - data.quantity],[data.productid]], function (err2, results) {
                        if (err2) throw err2;
                        console.log("Your total purchase is: $" + data.quantity*result[0].price);
                    });
                    connection.query ("Update products set product_sales = ? WHERE item_id = ?",[[result[0].product_sales + data.quantity*result[0].price],[data.productid]], function (err2) {
                        if (err2) throw err2;
                        console.log("Product Sales updated!");
                    });
                    connection.end();
                }
            });
        });
    }