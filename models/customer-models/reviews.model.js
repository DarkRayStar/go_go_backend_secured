const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reviewsSchema = new Schema({
    itemId: { type: String, required: true },
    itemName: { type: String, required: true },
    review: { type: String, required: true },
    userId: { type: String },
}, {
    timestamps: true,
});

const Reviews = mongoose.model('reviews', reviewsSchema);

module.exports = Reviews;