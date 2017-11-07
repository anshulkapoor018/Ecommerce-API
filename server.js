var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/swag-shop', {useMongoClient: true});

var Product = require('./model/product');
var WishList = require('./model/wishList');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/product', function(request, response){
    var product = new Product();
    product.title = request.body.title;
    product.price = request.body.price;
    product.save(function(err, savedProduct){
        if(err){
            response.error(500).send({error : "Could not save product"})
        } else {
            response.status(200).send(savedProduct);
        }
    });
});

























app.listen(3000, function(){
    console.log("Swag API is up and running on port 3000...")
});