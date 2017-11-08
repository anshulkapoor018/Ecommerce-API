var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/swag-shop', {
    useMongoClient: true
});

var Product = require('./model/product');
var WishList = require('./model/wishList');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));


app.post('/wishlist', function (request, response) {
    var wishList = new WishList();
    wishList.title = request.body.title;
    wishList.save(function (err, newWishList) {
        if (err) {
            response.error(500).send({
                error: "Could not create Wishlist"
            })
        } else {
            response.status(200).send(newWishList);
        }
    });
});

app.get('/wishlist', function (request, response) {
    //Asynchronous: will be working on a different thread.
    WishList.find({}).populate({
        path: 'products',
        model: 'Product'
    }).exec(function (err, wishLists) {
        if (err) {
            response.status(500).send({
                error: "Could not add products to Wishlist"
            })
        } else {
            response.status(200).send(wishLists);
        }

    })
});

app.put('/wishlist/product/add', function (request, response) {
    Product.findOne({
        _id: request.body.productId
    }, function (err, product) {
        if (err) {
            response.error(500).send({
                error: "Could not save product to wishlist "
            })
        } else {
            WishList.update({
                _id: request.body.wishListId
            }, {
                $addToSet: {
                    products: product._id
                }
            }, function (err, wishList) {
                if (err) {
                    response.status(500).send({
                        error: "Could not add items to WishLists."
                    })
                } else {
                    response.send("Successfully added to wishlist");
                }
            });
        }
    });
});

app.post('/product', function (request, response) {
    var product = new Product();
    product.title = request.body.title;
    product.price = request.body.price;
    product.save(function (err, savedProduct) {
        if (err) {
            response.error(500).send({
                error: "Could not save product"
            })
        } else {
            response.status(200).send(savedProduct);
        }
    });
});

app.get('/product', function (request, response) {

    //Asynchronous: will be working on a different thread.
    Product.find({}, function (err, products) {
        if (err) {
            response.status(500).send({
                error: "Could not fetch products."
            })
        } else {
            response.status(200).send(products);
        }
    });

});

app.listen(3000, function () {
    console.log("Swag API is up and running on port 3000...")
});