const express = require('express');
const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;


const ImageSchema = new Schema({
    url: String,
    filename: String
});

const opts = { toJSON: { virtuals: true } };

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const CastleSchema = new Schema({
    title: String,
    image: String,
    geometry: {
        coordinates: {
            type: [Number],
            required: true
        },
        type: {
            type: String,
            enum: ['Point'],
            required: true
        }
    },
    description: String,
    location: String,
    price: Number,
    images: [ImageSchema],
    description: String,
    location: String,
    price: Number,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],

    author:
    {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, opts);

CastleSchema.virtual('properties.popUp').get(function () {
    return `
    <a href="/castles/${this._id}">${this.title}</a><strong>`
});

CastleSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Castle', CastleSchema);