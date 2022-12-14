const router = require('express').Router();
const { User, Comment, Post } = require('../../models');

// Get all /api/users
router.get('/', async (req, res) => {
    try {
        const userData = await User.findAll({
            attributes: {
              exclude: ['password']
            }
        })
        res.status(200).json(userData)
    } catch (err) {
        res.status(500).json(err);
    }
});


// Get specific api/users/:id
router.get('/:id', async (req, res) => {
   try {const userData = await User.findByPk(req.params.id, {
            attributes: {
                exclude: ['password']
            },
            include: [{
                    model: Post,
                    attributes: ['id', 'title', 'content', 'date_created']
                },
                {
                    model: Comment,
                    attributes: ['id', 'text', 'date_created'],
                    include: {
                        model: Post,
                        attributes: ['title']
                    }
                }
            ]
        });
        if (!userData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
          }
          res.status(200).json(userData);

    } catch (err) {
        res.status(500).json(err);
    }
});

// POST /api/users
router.post('/', async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.username = userData.username;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    // Find the user who matches the posted username
    const userData = await User.findOne({ where: { username: req.body.username } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect username or password, please try again' });
      return;
    }

    // Verify the posted password with the password store in the database
    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect username or password, please try again' });
      return;
    }

    // Create session variables based on the logged in user
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  }
  else {
    res.status(404).end();
  }
});

module.exports = router;
