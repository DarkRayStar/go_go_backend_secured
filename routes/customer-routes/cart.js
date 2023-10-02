const router = require('express').Router();
let Cart = require('../../models/customer-models/item-cart.model');

router.route('/get/:id').get((req, res) => {
    const UId = req.params.id;

    Cart.find({ showOnCart: true, userId: UId })
        .then(items => res.json(items))
        .catch(err => res.status(400).json('Error: ' + err));

});

router.route('/history/:id').get((req, res) => {
    const UId = req.params.id;

    Cart.find({ paidStatus: true, userId: UId })
        .then(items => res.json(items))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/historyOfPaid').get((req, res) => {
    Cart.find({ paidStatus: true, deliveredStatus: false})
        .then(items => res.json(items))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const itemId = req.body.itemId;
    const itemName = req.body.itemName;
    const description = req.body.description;
    const price = req.body.price;
    const quantity = req.body.quantity;
    const orderedQuanity = req.body.orderedQuanity;
    const images = req.body.images;
    const offers = req.body.offers;
    const userId = req.body.userId;
    const showOnCart = req.body.showOnCart;
    const paidStatus = req.body.paidStatus;
    const deliveredStatus = false;

    const newCart = new Cart({
        itemId,
        itemName,
        description,
        price,
        quantity,
        orderedQuanity,
        images,
        offers,
        userId,
        showOnCart,
        paidStatus,
        deliveredStatus
    });

    newCart.save()
        .then(() => res.json('Item added to the cart!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    Cart.findById(req.params.id)
        .then(item => res.json(item))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
    Cart.findByIdAndDelete(req.params.id)
        .then(() => res.json('Item deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/').delete((req, res) => {
    Cart.deleteMany()
        .then(items => res.json(items))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
    Cart.findById(req.params.id)
        .then(item => {
            item.orderedQuanity = req.body.orderedQuanity;

            item.save()
                .then(() => res.json('Item updated!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update-delivered-status/:id').post((req, res) => {
    Cart.findById(req.params.id)
        .then(item => {
            item.deliveredStatus = true;

            item.save()
                .then(() => res.json('Delivery Status Updated!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/updatePayment/:id').post((req, res) => {
    Cart.findById(req.params.id)
        .then(item => {
            item.showOnCart = req.body.showOnCart;
            item.paidStatus = req.body.paidStatus;
            item.orderedDate = req.body.orderedDate;
            item.deliveredStatus = false;

            item.save()
                .then(() => res.json('Payment updated!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});
module.exports = router;