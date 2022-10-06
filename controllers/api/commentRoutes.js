const router = require('express').Router();
const {Comment} = require('../../models');
const withAuth = require('../../utils/auth');

//Find all comments
router.get('/', async (req, res) => {
    try {
        const commentData = await Comment.findAll()
        res.status(200).json(commentData)
    } catch (err) {
        res.status(500).json(err);
    }
});

//Create comment
router.post('/', withAuth, async (res, req) => {
    if(req.session) {
        try {
            const newComment = await Comment.create({
                ...req.body,
                user_id: req.session.user_id
            });
            res.status(200).json(newComment);
        } catch (err) {
            res.status(400).json(err);
        }
    }
});

module.exports = router;