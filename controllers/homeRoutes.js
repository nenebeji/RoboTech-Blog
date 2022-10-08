const router = require('express').Router();
const { Post, User, Comment } = require('../models');

router.get('/', async (req, res) => {
    try {
      // Get all posts and JOIN with user data
      const postData = await Post.findAll({
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
      res.render('homepage', { 
        posts, 
        logged_in: req.session.logged_in 
      });
    } catch (err) {
      res.status(500).json(err);
    }
});

router.get('/post/:id', async (req, res) => {
    try {
      // Get a single post and JOIN with user data
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

      // Serialize data so the template can read it
      const post = postData.get({plain: true})
  
      // Pass serialized data and session flag into template
      res.render('single-post', { 
        post, 
        logged_in: req.session.logged_in 
      });
    } catch (err) {
      res.status(500).json(err);
    }
});

router.get('/login', (req, res) => {
    // If the user is already logged in, redirect the request to dashboard page
    if (req.session.logged_in) {
      res.redirect('/');
      return;
    }
  
    res.render('login');
});

router.get('/signup', (req, res) => {
    // If the user is already logged in, redirect the request to dashboard page
    if (req.session.logged_in) {
      res.redirect('/');
      return;
    }
  
    res.render('signup');
});

module.exports = router;