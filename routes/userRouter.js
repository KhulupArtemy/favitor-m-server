const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/AuthMiddleware')
const checkRole = require("../middleware/CheckRoleMiddleware");

router.post('/registration', checkRole('ADMIN'), userController.registration)
router.post('/login', userController.login)
router.post('/createCalculationParameters', checkRole('ADMIN'), userController.createCalculationParameters)
router.get('/auth', authMiddleware, userController.check)
router.get('/getCalculationParameters', authMiddleware, userController.getCalculationParameters)

module.exports = router