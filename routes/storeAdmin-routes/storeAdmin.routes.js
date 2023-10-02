const router = require('express').Router();
let Item = require('../../models/storeAdmin-models/items.model');

//get all items
router.route('/').get((req, res) => {
    Item.find()
        .then(items => res.json(items))
        .catch(err => res.status(400).json('Error: ' + err));
});

//insert item
router.route('/add').post((req, res) => {

    const itemName = req.body.itemName;
    const description = req.body.description;
    const specifications = req.body.specifications;
    const price = req.body.price;
    const quantity = req.body.quantity;
    const orderedQuanity = req.body.orderedQuanity;
    const images = req.body.images;
    const offer = req.body.offer;

    const newItem = new Item({
        itemName,
        description,
        specifications,
        price,
        quantity,
        orderedQuanity,
        images,
        offer,

    });

    newItem.save()
        .then(() => res.json('Item added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

//get item by ID
router.route('/:id').get((req, res) => {
    Item.findById(req.params.id)
        .then(item => res.json(item))
        .catch(err => res.status(400).json('Error: ' + err));
});

//delete item
router.route('/:id').delete((req, res) => {
    Item.findByIdAndDelete(req.params.id)
        .then(() => res.json('Item deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});


//update item details
router.route('/updateitem/:id').post((req, res) => {
    Item.findById(req.params.id)
        .then(item => {

            item.itemName = req.body.itemName;
            item.description = req.body.description;
            item.specifications = req.body.specifications;
            item.price = req.body.price;
            item.quantity = req.body.quantity;

            item.images = req.body.images;
            item.offer = req.body.offer;

            item.save()
                .then(() => res.json('Item updated!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});


//update item details
router.route('/update/:id').post((req, res) => {
    Item.findById(req.params.id)
        .then(item => {

            item.itemName = req.body.itemName;
            item.description = req.body.description;
            item.specifications = req.body.specifications;
            item.price = req.body.price;
            item.quantity = req.body.quantity;

            item.images = req.body.images;
            item.offer = req.body.offer;
            const x = parseInt(item.orderedQuanity);
            const y = parseInt(req.body.orderedQuanity);

            let sum = x + y;
            item.orderedQuanity = sum;

            item.save()
                .then(() => res.json('Item updated!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

//updateItemPayment
router.route('/updateItemPayment/:id').post((req, res) => {
    Item.findById(req.params.id)
        .then(item => {

            const a = parseInt(item.orderedQuanity);
            const b = parseInt(req.body.orderedQuanity);

            let sum = a + b;
            item.orderedQuanity = sum;

            const x = parseInt(item.quantity);
            const y = parseInt(req.body.orderedQuanity);
            let sub = x - y;

            item.quantity = sub;

            item.save()
                .then(() => res.json('Payment updated!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;