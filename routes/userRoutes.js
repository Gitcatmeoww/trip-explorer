const express = require('express');
const userConctroller = require('../controllers/userController');

const router = express.Router();

router.
    route('/')
    .get(userConctroller.getAllUsers)
    .post(userConctroller.createUser);

router.
    route('/:id')
    .get(userConctroller.getUser)
    .patch(userConctroller.updateUser)
    .delete(userConctroller.deleteUser);

module.exports = router;