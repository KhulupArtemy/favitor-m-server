const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/AuthMiddleware')
const checkRole = require("../middleware/CheckRoleMiddleware");

router.post('/createUserAccount', checkRole('ADMIN'), userController.createUserAccount)
router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.check)
router.get('/getUserLogins', checkRole('ADMIN'), userController.getUserLogins)
router.put('/updateUserLogin', checkRole('ADMIN'), userController.updateUserLogin)
router.post('/deleteUserAccount', checkRole('ADMIN'), userController.deleteUserAccount)

module.exports = router