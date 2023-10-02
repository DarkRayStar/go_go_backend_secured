const { boolean } = require('joi');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const deliveryOrderSchema = new Schema({
    customerName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    landlineNumber: { type: String, required: true },
    email: [{ type: String }],
    district: { type: String, required: true },
    province: { type: String, required: true },
    address: { type: String, required: true },
    zip: { type: String, required: true },
    service: { type: String, required: true },
    trackingID: { type: String, required: true },
    fee: { type: Number, required: true },
    status: { type: String, required: true }
}, {
    timestamps: true
});

const DeliveryOrder = mongoose.model('deliveryOrder', deliveryOrderSchema);

module.exports = DeliveryOrder;