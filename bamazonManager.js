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
    manageOptions();
});

//function to show manager options
function manageOptions() {
    connection.query("SELECT * FROM products", function(err, res) {
     
        inquirer.prompt([
            {
                type: "list",
                name: "options",
                message: "What would you like to do?",
                choices: 
                [
                    "View Products for Sale",
                    "View Low Inventory", 
                    "Add to Inventory",
                    "Add New Product",
                    "Close Application"                    
                ]
            }
        ]).then(function(action) {

            //if manager chooses View Products for Sale
            if (action.options == "View Products for Sale") {

                //list every available item; the item IDs, names, prices, and quantities
                for (var i = 0; i < res.length; i++) {
                    console.log(
                        "ID#: " + res[i].item_id + 
                        " |  Product Name: " + res[i].product_name + 
                        " |  Price: " + res[i].price.toFixed(2) + 
                        " |  Quantity: " + res[i].stock_quantity
                    );
                }
                console.log("\n-----------------------------------------\n");
                
                manageOptions();
            }


            //if manager chooses View Low Inventory
            if (action.options == "View Low Inventory") {
            
                //list all items with an inventory count lower than five
                connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, inventory) {

                    for(var i = 0; i < inventory.length; i++) {
                        console.log(
                            "ID#: " + inventory[i].item_id + 
                            " |  Product Name: " + inventory[i].product_name + 
                            " |  Price: " + inventory[i].price.toFixed(2) + 
                            " |  Quantity: " + inventory[i].stock_quantity
                        );
                    }

                    console.log("\n-----------------------------------------\n");
                
                    manageOptions();

                });

            }


            //if manager chooses Add to Inventory
            if (action.options == "Add to Inventory") {
        
                addMoreItems();

            }   

            //if manager chooses Add New Product
            //allow manager to add a new product to store

            //else close application
            else {
                connection.end();
            }
        });
        
    });
    
}

//function to add more items
function addMoreItems() {

connection.query("SELECT * FROM products", function (err, res) { 

    //display a prompt that will let the manager add more of any item to the store
    inquirer.prompt([
        {
            type: "input",
            name: "addMore",
            message: "Type the item ID # that you would like to add more to."
        },
        {
            type: "input",
            name: "howMany",
            message: "How many more items would you like to add?"
        }
    ]).then(function(action) {

        //add the quantity given to the item number 
        connection.query("UPDATE `products` SET `stock_quantity` = " + (action.howMany + res.stock_quantity) + " WHERE `item_id` = " + action.addMore, function(err) {
            if (err) throw err;
            orderAgain();
        });

    });

});
}