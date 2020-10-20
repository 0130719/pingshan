'use strict';
const express = require('express'),
    fs = require('fs');
const {
    type
} = require('os');

const app = express();

let dishes = JSON.parse(fs.readFileSync('data/dishes.json', 'utf8'));
let restaurants = JSON.parse(fs.readFileSync('data/restaurants.json', 'utf8'));
let dishNames = [];

let dishesByType = {};

for (let dishKey in dishes) {
    dishNames.push(dishKey);

    let dish = dishes[dishKey];

    let dishType = dish.type;

    let typeArray = dishesByType[dishType];

    if (!typeArray) {
        typeArray = [];
        dishesByType[dishType] = typeArray;
    }

    typeArray.push(dishKey)
}

app.use(express.static('public'));

app.get('/banners', (req, res) => {
    return res.json({
        images: ['images/banner1.jpg', 'images/banner2.jpg', 'images/banner3.jpg'],
        videos: ['vidoes/banner1.mp4']
    });
});


app.get('/dishes', (req, res) => {
    let size = parseInt(req.query.size) || 10;
    let from = parseInt(req.query.from) || 0;

    let type = req.query.type;

    let results = [];

    if (type) {

        let dishArray = dishesByType[type];

        if (dishArray) {

            for (let i = 0; i < size && i + from < dishArray.length; i++) {
                results.push(dishes[dishArray[i + from]]);
            }

        } else {
            return res.json([]);
        }

    } else {
        for (let i = 0; i < size && i + from < dishNames.length; i++) {
            results.push(dishes[dishNames[i + from]]);
        }
    }

    res.json(results);
});

app.get('/dish/:id', (req, res) => {

    let dish = dishes[req.params.id];

    if (!dish) {
        return res.json({});
    }

    dish.restaurants_detail = [];

    for (let restaurantKey of dish.restaurants) {
        let restaurant = restaurants[restaurantKey];

        if (restaurant) {
            dish.restaurants_detail.push(restaurant);
        }
    }

    res.json(dish);


});


app.listen(3001, async () => {
    console.log('Server started.');
});