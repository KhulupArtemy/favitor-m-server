const Router = require('express')
const router = new Router()
const checkRole = require("../middleware/CheckRoleMiddleware");
const categoryController = require("../controllers/categoryController");

router.post('/createFirst', checkRole('ADMIN'), categoryController.createFirstCategory)
router.post('/createLast', checkRole('ADMIN'), categoryController.createLastCategory)
router.post('/createAfter', checkRole('ADMIN'), categoryController.createAfterCategory)
router.get('/getAll', categoryController.getAllCategories)
router.put('/updateOne', checkRole('ADMIN'), categoryController.updateOneCategory)
router.post('/deleteOne', checkRole('ADMIN'), categoryController.deleteOneCategory)

module.exports = router