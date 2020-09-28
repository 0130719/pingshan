'use strict';
const express = require('express'),
    fs = require('fs');

const app = express();

let dishes = JSON.parse(fs.readFileSync('data/dishes.json', 'utf8'));
let restaurants = JSON.parse(fs.readFileSync('data/restaurants.json', 'utf8'));
let dishNames = [];


for (let dishKey in dishes) {
    dishNames.push(dishKey);
}

app.use(express.static('public'));

app.get('/dishes', (req, res) => {
    let size = parseInt(req.query.size) || 10;
    let from = parseInt(req.query.from) || 0;

    let results = [];

    for (let i = 0; i < size && i + from < dishNames.length; i++) {
        results.push(dishes[dishNames[i + from]]);
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