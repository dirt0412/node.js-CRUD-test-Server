//Initiallising node modules
var express = require("express");
var bodyParser = require("body-parser");
var sql = require("mssql");
var app = express();

// Body Parser Middleware
app.use(bodyParser.json());

//CORS Middleware
app.use(function (req, res, next) {
    //Enabling CORS 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});

//Setting up server
var server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    console.log("App now running on port http://localhost:3000", port);
});

//Initiallising connection string
var dbConfig = {
    user: "sa",
    password: "ultravga1280",
    server: "localhost",
    database: "baza4"
};

//Function to connect to database and execute query
var executeQuery = function (res, query) {
    sql.connect(dbConfig, function (err) {
        if (err) {
            console.log("Error while connecting database :- " + err);
            res.send(err);
        }
        else {
            // create Request object
            var request = new sql.Request();
            // query to the database
            request.query(query, function (err, result) {
                if (err) {
                    console.log("Error while querying database :- " + err);
                    res.send(err);
                }
                else {
                    res.send(result);
                }
            });
        }
    });
}

//GET API
app.get("/api/product", function (req, res) {
    var query = "SELECT id, name, description, price FROM [Table_products];";
    executeQuery(res, query);
});

//GET API by id
app.get("/api/product/:id", function (req, res) {
    var query = "SELECT id, name, description, price FROM [Table_products] WHERE id = " + req.params.id + ";";
    executeQuery(res, query);
});

//POST API
app.post("/api/product", function (req, res) {
    (async function () {
        try {
            let pool = await sql.connect(dbConfig)
            let result = await pool.request()
                .input('name', sql.NVarChar, req.body.product.name)
                .input('description', sql.NVarChar, req.body.product.description)
                .query("INSERT INTO [Table_products] (name, description, price) VALUES ( @name,@description,"+req.body.product.price+");")

                res.send(result);

            // // Stored procedure            
            // let result2 = await pool.request()
            //     .input('input_parameter', sql.Int, value)
            //     .output('output_parameter', sql.VarChar(50))
            //     .execute('procedure_name')            
            // console.dir(result2)
        } catch (err) {
            console.log("Error : " + err);
            res.send(err);
        }
    })()

    sql.on('error', err => {
        // ... error handler
    })
    // var query = "INSERT INTO [Table_products] (name, description, price) VALUES ( '" + req.body.product.name+"','"+req.body.product.description+"',"+req.body.product.price+");";
    // executeQuery (res, query);
});

//PUT API
app.put("/api/product/:id", function (req, res) {
    (async function () {
        try {
            let pool = await sql.connect(dbConfig)
            let result = await pool.request()
                .input('name', sql.NVarChar, req.body.product.name)
                .input('description', sql.NVarChar, req.body.product.description)
                .query("UPDATE [Table_products] SET name=@name , description=@description , price=" + req.body.product.price + "  WHERE id= " + req.params.id + ";")

                res.send(result);
        } catch (err) {
            console.log("Error : " + err);
            res.send(err);
        }
    })()

    sql.on('error', err => {
        // ... error handler
    })
    // var query = "UPDATE [Table_products] SET name= '" + req.body.product.name + "' , description=  '" + req.body.product.description + "' , price=  " + req.body.product.price + "  WHERE id= " + req.params.id + ";";
    // executeQuery(res, query);
});

// DELETE API
app.delete("/api/product/:id", function (req, res) {
    var query = "DELETE FROM [Table_products] WHERE id=" + req.params.id + ";";
    executeQuery(res, query);
});