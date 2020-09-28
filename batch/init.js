const fs = require('fs');


fs.readdir('../public/images', function (err, files) {

    let json = {};

    for (filename of files) {
        filename = filename.substring(0, filename.length - 4);
        json[filename] = {
            name: filename,
            description: filename + "介绍",
            restaurants: ["餐厅A", "餐厅C"],
            image: "images/" + filename + ".jpg"

        }

    }

    console.log(JSON.stringify(json));

});