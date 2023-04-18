const Router = require('express')
const router = new Router()
const checkRole = require("../middleware/CheckRoleMiddleware");
const itemController = require("../controllers/itemController");

router.post('/createFirst', checkRole('ADMIN'), itemController.createFirst)
router.post('/createLast', checkRole('ADMIN'), itemController.createLast)
router.post('/createAfter', checkRole('ADMIN'), itemController.createAfter)
router.get('/', itemController.getAll)
router.put('/', checkRole('ADMIN'), itemController.updateOne)
router.post('/deleteOne', checkRole('ADMIN'), itemController.deleteOne)

module.exports = router