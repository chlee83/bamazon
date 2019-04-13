var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "letmein",
    database: "bamazon_db"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    searchProducts();
});

//display all items for sale from mysql table: products
//include ids, names and prices
function searchProducts() {
    connection.query("SELECT item_id, product_name, price FROM products", function(err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price);
        }
        console.log("\n-----------------------------------------\n");
    });
    questions();
}

//after display, prompt users with two messages:
//1. ask the ID of product they want to buy
//2. ask how many units of the product they would like
function questions() {

    //select from all columns in table
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        //prompt users for item Id number and then quantity
        inquirer.prompt([

            {
                type: "input",
                name: "itemChoice",
                message: "Write the ID Number of the product you want to buy."
            },
            {
                type: "input",
                name: "quantity",
                message: "How many of this item do you want?",
            }

        ]).then(function(action) {

            //store the chosen item object into variable
            var chosenItem;
            //find the product and assign it to chosenItem
            for (var i = 0; i < res.length; i++) {
                if (res[i].item_id == action.itemChoice) {
                    chosenItem = res[i];
                } 
            }

            //check to see if there is enough of that item
            //If it does have enough, fulfill order
            if (chosenItem.stock_quantity >= action.quantity) {

                console.log("\nYou have ordered " + action.quantity + " of " + chosenItem.product_name + ".\n");

                //then show customer total cost of purchase
                console.log("Your total is: $" + chosenItem.price * action.quantity);
                console.log("\n-----------------------------------------\n");

                //then update SQL database to reflect updated quantity
                connection.query("UPDATE `products` SET `stock_quantity` = " + (chosenItem.stock_quantity - action.quantity) + " WHERE `item_id` = " + action.itemChoice, function(err) {
                    if (err) throw err;
                    orderAgain();
                });
                
                
            //if not enough, write insufficient quantity, and don't let order go through
            } else {
                console.log("Insufficient quantity!");
                console.log("\n-----------------------------------------\n");
                orderAgain();
            }

        });
    });
}



function orderAgain() {

    //prompt users if they want to order again or end
    inquirer.prompt([

        {
            type: "list",
            name: "orderOrEnd",
            message: "Would you like to order another item or close application?",
            choices: ["yes", "no"]
        },
  
    ]).then(function(response) {

        if (response.orderOrEnd === "yes") {
            questions();
        } else {
            connection.end();
        }

    });
    
}
