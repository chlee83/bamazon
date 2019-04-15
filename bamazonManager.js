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
                        "\nID#: " + res[i].item_id + 
                        " |  Product Name: " + res[i].product_name + 
                        " |  Price: " + res[i].price.toFixed(2) + 
                        " |  Quantity: " + res[i].stock_quantity
                    );
                }
                console.log("\n-----------------------------------------\n");
                
                manageOptions();
            }


            //if manager chooses View Low Inventory
            else if (action.options == "View Low Inventory") {
            
                //list all items with an inventory count lower than five
                connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, inventory) {

                    for(var i = 0; i < inventory.length; i++) {
                        console.log(
                            "\nID#: " + inventory[i].item_id + 
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
            else if (action.options == "Add to Inventory") {
        
                addMoreItems();

            }   

            //if manager chooses Add New Product
            //allow manager to add a new product to store
            else if (action.options == "Add New Product") {
                addNewProduct();
            }

            //else close application
            else {
                connection.end();
            }
        });
        
    });
    
}

//function to add more items
function addMoreItems() {


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

        //grab columns from the item id manager chose
        connection.query("SELECT * FROM products WHERE item_id = " + action.addMore, function(err, res) {

            //add value inputted and current quantity in table together to get updated quantity
            var updatedQuantity = parseInt(action.howMany) + parseInt(res[0].stock_quantity);
           
            //add the quantity given to the item number 
            connection.query("UPDATE products SET stock_quantity = " + updatedQuantity + " WHERE item_id = " + action.addMore, function(err) {
                if (err) throw err;

                //log the product name and updated quantity to manager
                console.log("\n" + res[0].product_name + " has been updated to a quantity of " + updatedQuantity + ".\n");

                manageOptions();
            }); 

        });
   
    });

}

//function to add new products
function addNewProduct() {

    //Ask manager to input the item_id, product_name, department_name, price, and stock_quantity
    inquirer.prompt([
        {
            type: "input",
            name: "itemId",
            message: "What is the ID of this item?"
        },
        {
            type: "input",
            name: "itemName",
            message: "What is the name of the item?"
        },
        {
            type: "list",
            name: "itemDepartment",
            message: "What department is this item in?",
            choices: [
                        "Appliances", 
                        "Books", 
                        "Beauty & Personal Care",  
                        "Clothing", 
                        "Electronics", 
                        "Home & Kitchen", 
                        "Office Products", 
                        "Pet Supplies"
                    ]
        },
        {
            type: "input",
            name: "itemPrice",
            message: "What is the price of this item?"
        },
        {
            type: "input",
            name: "itemQuantity",
            message: "How many items are there?"
        }
    ]).then(function(answer) {

        //insert new product into products table
        connection.query(
            "INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) " + 
            " VALUES (" + answer.itemId + ", '" + answer.itemName + "', '" + answer.itemDepartment + "', " + answer.itemPrice + ", " + parseInt(answer.itemQuantity) + ")", function(err) {
                
                if (err) throw err;

                //log the item name that was inputted into the list of items
                console.log("\nYou've successfully added " + answer.itemName + " to the list of products.\n");

                console.log("\n-----------------------------------------\n");
                
                manageOptions();

        });

    });

}

