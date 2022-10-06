const router = require('express').Router();
const { Post, Comment, User } = require('../../models');
const withAuth = require('../../utils/auth');

// Get all /api/posts
router.get('/', async (req, res) => {
    try {
        const postData = Post.findAll({
            attributes: {
                order: [['date_created', 'DESC']],
                include: [{
                    model: User,
                    attributes: ['username']
                },
                {
                    model: Comment,
                    attributes: ['id', 'text', 'date_created', 'user_id', 'post_id'],
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                }],
            }
        })
        res.status(200).json(postData)
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get a single /api/posts
router.get('/:id', async (req, res) => {
    try {
        const postData = Post.findByPk(req.params.id, {
            attributes: {
                include: [{
                    model: User,
                    attributes: ['username']
                },
                {
                    model: Comment,
                    attributes: ['id', 'text', 'date_created', 'user_id', 'post_id'],
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                }],
            }
        })
        if(!postData) {
            res.status(404).json({message: 'No post found with this id'});
            return;
        }
        res.status(200).json(userData)
    } catch (err) {
        res.status(500).json(err);
    }
});

// Create Post
router.post('/', withAuth, async (req, res) => {
  try {
    const newPost = await Post.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newPost);
  } catch (err) {
    res.status(400).json(err);
  }
});

//Update Post
router.put('/:id', withAuth, async(res, req) => {
    try{
        const postData = await Post.update(req.body, {
            where: {
                id: req.params.id,
            },
        })
        if(!postData) {
            res.status(404).json({message: 'No post found with this id'});
            return;
        }
    } catch (err) {
        res.status(500).json(err);
    }
})

//Delete Post
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }
    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
