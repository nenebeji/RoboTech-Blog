const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
    try {
        // Get all posts and JOIN with user data
        const postData = await Post.findAll({
            where: {user_id: req.session.user_id},
          include: [
            {
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
            }
          ],
        });
    
        // Serialize data so the template can read it
        const posts = postData.map((post) => post.get({ plain: true }));
    
        // Pass serialized data and session flag into template
        res.render('user-dashboard', { 
          posts, 
          logged_in: true 
        });
      } catch (err) {
        res.status(500).json(err);
      }
})

router.get('/edit/:id', withAuth, async (req, res) => {
    try {
        // Get a single post posts and JOIN with user data
        const postData = await Post.findByPk(req.params.id, {
          include: [
            {
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
            }
          ],
        });
        if (!postData) {
            res.status(404).json({ message: 'No post found with this id!' });
            return;
        }
        res.status(200).json(postData);
    
        // Serialize data so the template can read it
        const post = postData.get({ plain: true });
    
        // Pass serialized data and session flag into template
        res.render('edit-post', { 
          post, 
          logged_in: true 
        });
      } catch (err) {
        res.status(500).json(err);
      }
})

router.get('/create', (req, res) => {
    res.render('create-post', {
        logged_in: true
    })
})

module.exports = router;