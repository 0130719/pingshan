const xlsx = require('node-xlsx');

const data = xlsx.parse('C:\\QG\\屏山美食节\\20201020\\123.xlsx')[1].data;

const restaurants = {};

for (i = 2; i < data.length; i++) {
    let row = data[i];

    if (row[1]) {

        restaurants[row[1]] = {
            name: row[1],
            description: '暂无餐厅介绍',
            location: row[7],
            contact: row[4],
            contactNo: row[5],
            coordinate: {
                longitude: "102",
                latitude: "999"
            },
            image: "images/餐厅.png"
        };
    }
}

// console.log(JSON.stringify(restaurants));

const types = ['马府湖文化名菜', '生态美味屏山创新菜', '屏山生态食材'];

let restaurant = '';
let dishes = {};
for (i = 2; i < data.length; i++) {
    let row = data[i];

    if (row[1]) {
        restaurant = row[1];
    }

    let description = row[6] || '';

    let dish = {
        name: row[2],
        type: types[i % 3],
        description: description.replace(/\s*/g, ""),
        restaurants: [restaurant],
        image: "images/" + row[2] + ".jpg"
    }

    dishes[row[2]] = dish;

}

console.log(JSON.stringify(dishes));