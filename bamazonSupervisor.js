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
      choices: ["View Sales by Department", "Create New Department","Exit Bamazon"], 
      name: "whattodo"
    }
  ]).then(function(data) {
      //console.log(data.whattodo);
      switch (data.whattodo) {
          case "View Sales by Department":
            ViewSalesByDepartment();
            break;
          case "Create New Department":
            CreateNewDepartment();
            break;
          case "Exit Bamazon":
            connection.end();
            process.exit();
            break;
      }
  });
}

function ViewSalesByDepartment() {
    connection.query ("SELECT DISTINCT departments.department_id, departments.department_name, departments.overhead_costs, SUM(products.product_sales), departments.overhead_costs-SUM(products.product_sales) as 'Total Profit' FROM departments left JOIN products ON departments.department_name = products.department_name group by departments.department_id ORDER by departments.department_id", function (err, results) {
        if (err) throw err;
        console.log(results);
        data = [];
        data.push(["department_id", "department_name", "overhead_costs", "sum: product_sales", "Total Profit"]);
        for (var i = 0; i < results.length; i++) {
            // console.log("--------------------");
            // console.log("id: " + results[i].department_id);
            // console.log("department: " + results[i].department_name);
            // console.log("overhead costs: " + results[i].overhead_costs);
            // console.log("product sales: " + results[i]['SUM(products.product_sales)']);
            // console.log("total profit: " + results[i]["Total Profit"]);
            data.push([results[i].department_id,results[i].department_name, results[i].overhead_costs,results[i]['SUM(products.product_sales)'],results[i]["Total Profit"]]);
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

function CreateNewDepartment() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of department of the item you would like to add?",
            name: "department",
        },
        {
            type: "input",
            message: "What overhead cost of the item that you would like to add?",
            name: "overhead_cost",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
          }
        ]).then(function(data) {
          connection.query ("INSERT INTO departments (department_name, overhead_costs) values (?,?)", [[data.department],[data.overhead_cost]], function (err) {
              if (err) throw err;
              start();
          });
       });
}

