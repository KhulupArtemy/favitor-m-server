const Router = require('express')
const router = new Router()
const calculationParameterController = require('../controllers/calculationParameterController')
const authMiddleware = require('../middleware/AuthMiddleware')
const checkRole = require("../middleware/CheckRoleMiddleware");

router.get('/getUserCalculationParameters', authMiddleware, calculationParameterController.getUserCalculationParameters)
router.post('/createCalculationParameters', checkRole('ADMIN'), calculationParameterController.createCalculationParameters)
router.post('/getRegistrationKey', authMiddleware, calculationParameterController.getRegistrationKey)
router.get('/getCalculationParameters', checkRole('ADMIN'), calculationParameterController.getCalculationParameters)
router.put('/updateCalculationParameter', checkRole('ADMIN'), calculationParameterController.updateCalculationParameter)
router.post('/deleteCalculationParameter', checkRole('ADMIN'), calculationParameterController.deleteCalculationParameter)

module.exports = router