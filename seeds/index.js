const mongoose = require('mongoose');
const Castle = require('../models/castle');
const castles = require('./castles');

const dbUrl = process.env.DB_URL
// 'mongodb://127.0.0.1:27017/castles'

mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://Adrian_Daraban:Jq7xIC3xRo6kGpky@cluster1.2pentmq.mongodb.net/?retryWrites=true&w=majority')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
});


const seedDB = async () => {
    await Castle.deleteMany({});
    for (let i = 0; i < 12; i++) {
        const castle = new Castle({
            author: '64149a13d1867836f521f8cf',     // My user id!!
            title: `${castles[i].name}`,
            location: `${castles[i].county}`,
            geometry: {
                type: "Point",
                coordinates: [
                    castles[i].longitude,
                    castles[i].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dgcywxbww/image/upload/v1678790514/Castles/default_lls60v.png',
                    filename: 'Castles/ezxuyfisj6lmjzfurqyw'
                }
            ],
            description: `${castles[i].info}`,
            price: `${castles[i].price}`
        })
        await castle.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
