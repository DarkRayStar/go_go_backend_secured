const router = require('express').Router();
let DeliveryOrder = require('../../models/delivery-models/delivery-order.model');

router.route('/').get((req, res) => {
    DeliveryOrder.find()
        .then(items => res.json(items))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {

    const newDeliveryOrder = new DeliveryOrder({
        customerName: req.body.customerName,
        mobileNumber: req.body.mobileNumber,
        landlineNumber: req.body.landlineNumber,
        email: req.body.email,
        district: req.body.district,
        province: req.body.province,
        address: req.body.address,
        zip: req.body.zip,
        service: req.body.service,
        trackingID: req.body.trackingID,
        fee: req.body.fee,
        status: req.body.status
    });

    newDeliveryOrder.save()
        .then(() => res.json('Delivery Order Created Successfully'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    DeliveryOrder.findById(req.params.id)
        .then(item => res.json(item))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
    DeliveryOrder.findByIdAndDelete(req.params.id)
        .then(() => res.json('Order Deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
    DeliveryOrder.findById(req.params.id)

        .then(delivery => {
            delivery.customerName= req.body.customerName,
            delivery.mobileNumber= req.body.mobileNumber,
            delivery.landlineNumber= req.body.landlineNumber,
            delivery.email= req.body.email,
            delivery.district=req.body.district,
            delivery.province= req.body.province,
            delivery.address= req.body.address,
            delivery.zip= req.body.zip,
            delivery.service= req.body.service,
            delivery.trackingID= req.body.trackingID,
            delivery.fee= req.body.fee,
            delivery.status= req.body.status 

            delivery.save()
                .then(() => res.json('Delivery Order Updated'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
        
});

router.route('/updateDeliveryStatus/:id').post((req,res) => {
    DeliveryOrder.findByIdAndUpdate(req.params.id,{"status" : req.body.status})
    .then(() => res.json('Delivery Status Updated'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;