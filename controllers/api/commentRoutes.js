const router = require('express').Router();
const {Comment, User} = require('../../models');
const withAuth = require('../../utils/auth');

//Find all comments
router.get('/', async (req, res) => {
    try {
        const commentData = await Comment.findAll({
          include: [{model: User, attributes: ['username']}]
        })
        res.status(200).json(commentData)
    } catch (err) {
        res.status(500).json(err);
    }
});


router.post('/', withAuth, async (req, res) => {
  // create a new comment
  try {
    const newComment = await Comment.create({
      text: req.body.text,
      post_id: req.body.post_id,
      user_id: req.session.user_id,
    });
    res.status(200).json(newComment);
  } catch (err) {
    // console.log(err);
    res.status(400).json(err);
  }
});

module.exports = router;