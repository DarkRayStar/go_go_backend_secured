const router = require('express').Router();
let Rew = require('../../models/customer-models/reviews.model');

router.route('/').get((req, res) => {
    Rew.find()
        .then(items => res.json(items))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const itemId = req.body.itemId;
    const itemName = req.body.itemName;
    const review = req.body.review;
    const userId = req.body.userId;

    const newRew = new Rew({
        itemId,
        itemName,
        review,
        userId,
    });

    newRew.save()
        .then(() => res.json('Your review is added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/itemreviews/:id').get((req, res) => {
    Rew.find({ itemId: req.params.id})
        .then(items => res.json(items))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;