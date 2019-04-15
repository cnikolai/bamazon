var inquirer = require("inquirer");
var mysql = require("mysql");
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
inquirer.prompt([
    {
      type: "list",
      message: "What do you want to do?", 
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory","Add New Product","Exit Bamazon"], 
      name: "whattodo"
    }
  ]).then(function(data) {
      //console.log(data.whattodo);
      switch (data.whattodo) {
          case "View Products for Sale":
            ViewProductsForSale();
            break;
          case "View Low Inventory":
            ViewLowInventory();
            break;
          case "Add to Inventory":
            AddToInventory();
            break;
          case "Add New Product":
            AddNewProuct();
            break;
          case "Exit Bamazon":
            connection.end();
            process.exit();
            break;
      }
  });
}

function ViewProductsForSale() {
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
        start();
    });
}

function ViewLowInventory() {
    connection.query ("SELECT * FROM products WHERE stock_quantity < 5", function (err, results) {
        if (err) throw err;
        if (results.length === 0) {
            console.log("You do not have any products with a low inventory.");
        }
        else {
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
        start();
    });
}

function AddToInventory() {
    inquirer.prompt([
        {
          type: "input",
          message: "What is the id of the item you would like to add more inventory to?",
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
          message: "How many units would you like to add?",
          name: "quantity",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
        ]).then(function(data) {
            connection.query ("Update products set stock_quantity = stock_quantity + ? WHERE item_id = ?",[[data.quantity],[data.productid]], function (err2) {
                if (err2) throw err2;
            });
            start();
        });
}

function AddNewProuct() {
    inquirer.prompt([
        {
          type: "input",
          message: "What is the name of the item you would like to add?",
          name: "item_name",
        },
        {
            type: "input",
            message: "What is the name of department of the item you would like to add?",
            name: "department",
        },
        {
            type: "input",
            message: "What price of the item that you would like to add?",
            name: "price",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
          },
          {
            type: "input",
            message: "What quantity of the item that you would like to add?",
            name: "quantity",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
          }
        ]).then(function(data) {
          connection.query ("INSERT INTO products (product_name, department_name, price, stock_quantity) values (?,?,?,?)", [[data.item_name], [data.department],[data.price],[data.quantity]], function (err, result) {
              if (err) throw err;
              start();
          });
       });
}