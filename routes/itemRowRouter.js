const Router = require('express')
const router = new Router()
const checkRole = require("../middleware/CheckRoleMiddleware");
const itemRowController = require("../controllers/itemRowController");

router.post('/createFirst/:itemId', checkRole('ADMIN'), itemRowController.createFirst)
router.post('/createLast/:itemId', checkRole('ADMIN'), itemRowController.createLast)
router.post('/createAfter/:itemId', checkRole('ADMIN'), itemRowController.createAfter)
router.get('/:itemId', itemRowController.getAll)
router.put('/', checkRole('ADMIN'), itemRowController.updateOne)
router.post('/deleteOne', checkRole('ADMIN'), itemRowController.deleteOne)

module.exports = router