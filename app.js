'use strict';
const express = require('express'),
    mysql = require('promise-mysql');

const app = express();

let connection = undefined;

app.get('/dishes', async (req, res) => {
    let size = parseInt(req.query.size) || 10;
    let from = parseInt(req.query.from) || 0;

    let where = 'where fa_foods.deletetime is NULL and fa_restaurants.deletetime is NULL ';
    let type = req.query.type;
    if (type) {
        where = where + " and fa_foods.category_name = '" + type + "'";
    }


    let query = 'SELECT fa_foods.*,fa_restaurants.name as name1 FROM fa_foods left join fa_restaurants on fa_foods.restaurants_id = fa_restaurants.id ' + where + ' order by fa_foods.weigh asc LIMIT ' + size + ' offset ' + from;

    let resp = await connection.query(query);

    let results = [];

    for (let data of resp) {

        results.push({
            name: data.name,
            type: data.category_name,
            description: data.description,
            restaurants: [data.name1],
            image: data.image
        });

    }

    res.send(results);

});

app.get('/dish/:id', async (req, res) => {

    let dishName = req.params.id;

    let query = "SELECT fa_foods.*,fa_restaurants.id as id1,fa_restaurants.name as name1,fa_restaurants.category_name as type1,fa_restaurants.description as description1,fa_restaurants.location,fa_restaurants.contact ,fa_restaurants.contact_no ,fa_restaurants.longitude,fa_restaurants.latitude,fa_restaurants.images as image1 FROM fa_foods left join fa_restaurants on fa_foods.restaurants_id = fa_restaurants.id where fa_foods.deletetime is NULL and fa_foods.name='" + dishName + "'";

    let resp = await connection.query(query);


    if (resp.length > 0) {

        let data = resp[0];

        let restaurantID = data.id1;

        let query1 = "select name,category_name as type,image from fa_foods where restaurants_id = " + restaurantID + " and deletetime is NULL order by weigh";

        let resp1 = await connection.query(query1);

        let dishes = [];
        for (let data of resp1) {
            dishes.push(data);
        }

        let result = {
            name: data.name,
            type: data.category_name,
            description: data.description,
            restaurants: [data.name1],
            image: data.image,
            restaurants_detail: [{
                name: data.name1,
                type: data.type1,
                description: data.description1,
                location: data.location,
                contact: data.contact,
                contactNo: data.contact_no,
                coordinate: {
                    longitude: data.longitude,
                    latitude: data.latitude
                },
                images: data.image1.split(','),
                dishes: dishes
            }]
        };


        return res.json(result);


    } else {
        return res.json({});
    }


    //     let dish = dishes[req.params.id];

    //     if (!dish) {
    //         return res.json({});
    //     }

    //     dish.restaurants_detail = [];

    //     for (let restaurantKey of dish.restaurants) {
    //         let restaurant = restaurants[restaurantKey];

    //         if (restaurant) {
    //             dish.restaurants_detail.push(restaurant);
    //         }
    //     }

    //     res.json(dish);


});


app.get('/restaurants', async (req, res) => {

    let type = req.query.type;

    if (!type) {
        return res.json({});
    }

    let query = "SELECT fa_restaurants.*,fa_foods.name as name1,fa_foods.category_name as type,fa_foods.image as image1 FROM fa_restaurants left join fa_foods on fa_restaurants.id=fa_foods.restaurants_id where fa_restaurants.deletetime is NULL and fa_foods.deletetime is NULL and fa_restaurants.category_name='" + type + "' order by fa_restaurants.weigh";

    let resp = await connection.query(query);

    let results = [];

    let restaurantID = 0;
    let item = undefined;

    for (let data of resp) {

        if (data.id !== restaurantID) {

            restaurantID = data.id;

            item = {
                name: data.name,
                type: data.category_name,
                description: data.description,
                location: data.location,
                contact: data.contact,
                contactNo: data.contact_no,
                coordinate: {
                    longitude: data.longitude,
                    latitude: data.latitude
                },
                images: data.images.split(','),
                dishes: [{
                    name: data.name1,
                    type: data.type,
                    image: data.image1
                }]
            };
            results.push(item);

        } else {

            item.dishes.push({
                name: data.name1,
                type: data.type,
                image: data.image1
            });

        }

    }

    return res.json(results);
});

app.get('/banners',async(req,res)=>{
    let query = "select value from fa_config where name='banner'";

    let resp = await connection.query(query);

    let results = [];

    if(resp.length>0){
        results = resp[0].value.split(',');
    }

    return res.json(results);
});
// let dishes = JSON.parse(fs.readFileSync('data/dishes.json', 'utf8'));
// let restaurants = JSON.parse(fs.readFileSync('data/restaurants.json', 'utf8'));
// let dishNames = [];

// let dishesByType = {};

// for (let dishKey in dishes) {
//     dishNames.push(dishKey);

//     let dish = dishes[dishKey];

//     let dishType = dish.type;

//     let typeArray = dishesByType[dishType];

//     if (!typeArray) {
//         typeArray = [];
//         dishesByType[dishType] = typeArray;
//     }

//     typeArray.push(dishKey)
// }

// app.use(express.static('public'));

// app.get('/banners', (req, res) => {
//     return res.json({
//         images: ['images/banner1.jpg', 'images/banner2.jpg', 'images/banner3.jpg'],
//         videos: ['vidoes/banner1.mp4']
//     });
// });


// app.get('/dishes', (req, res) => {
//     let size = parseInt(req.query.size) || 10;
//     let from = parseInt(req.query.from) || 0;

//     let type = req.query.type;

//     let results = [];

//     if (type) {

//         let dishArray = dishesByType[type];

//         if (dishArray) {

//             for (let i = 0; i < size && i + from < dishArray.length; i++) {
//                 results.push(dishes[dishArray[i + from]]);
//             }

//         } else {
//             return res.json([]);
//         }

//     } else {
//         for (let i = 0; i < size && i + from < dishNames.length; i++) {
//             results.push(dishes[dishNames[i + from]]);
//         }
//     }

//     res.json(results);
// });

// app.get('/dish/:id', (req, res) => {

//     let dish = dishes[req.params.id];

//     if (!dish) {
//         return res.json({});
//     }

//     dish.restaurants_detail = [];

//     for (let restaurantKey of dish.restaurants) {
//         let restaurant = restaurants[restaurantKey];

//         if (restaurant) {
//             dish.restaurants_detail.push(restaurant);
//         }
//     }

//     res.json(dish);


// });


app.listen(3001, async () => {
    connection = await mysql.createConnection({
        host: '47.112.209.180',
        user: 'pingshan',
        password: 'Hk7JYyPXfwjca357',
        database: 'pingshan'
    });
    console.log('Server started.');
});