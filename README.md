# bamazon

## Overview

This project is a amazon like application.   

### Problem 
In this cli application, the user can order products, view products, manage products, and manage sales.  There are three different types of users - Customer, Manager, and Supervisor.

### BamazonCustomer
As a customer, you can view all products and select a product to purchase. View an example in action of ![Bamazon Customer](bamazonCustomer.gif).

### BamazonManager
As a manager, you can view all products, add a new product to the inventory, add more inventory to a product, and View Low Inventory (with less than 5 items). View an example in action of ![Bamazon Manager](bamazonManager.gif).

### BamazonSupervisor
As a supervisor, you can view all sales by department and create a new department. View an example in action of ![Bamazon Supervisor](bamazonSupervisor.gif).


### How I solved it
I solved this challenge using mysql to create a database and node to read and update the database.   

### Technical Approach
I solved this problem by using a combination SQL and Javascript.  I used SQL to create the database and to populate the database with some initial entries.  I used a complex inner join statement to query and aggregate all sales by department from a department table and a products table.  I used Javascript to write the program itself.  

- - -

## Contributors and Maintainers

Contributors and maintainers: Cynthia Nikolai

- - -

## Dependancies

inquirer
mysql
table

- - -

## License
  
None.  You are free to use this code as desired for commercial or private use. 

- - -

## For Assistance

For assistance, please contact Cynthia at cnikolai@earthlink.net. 

- - -

## Donations
    
If you like this project, please donate to cnikolai@earthlink.net.  :smiley:
