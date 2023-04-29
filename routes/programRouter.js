const Router = require('express')
const router = new Router()
const checkRole = require("../middleware/CheckRoleMiddleware");
const programController = require("../controllers/programController");

router.post('/createFirst/:programCategoryId', checkRole('ADMIN'), programController.createFirstProgram)
router.post('/createLast/:programCategoryId', checkRole('ADMIN'), programController.createLastProgram)
router.post('/createAfter/:programCategoryId', checkRole('ADMIN'), programController.createAfterProgram)
router.get('/getAll/:programCategoryId', programController.getAllPrograms)
router.put('/updateOne', checkRole('ADMIN'), programController.updateOneProgram)
router.post('/deleteOne', checkRole('ADMIN'), programController.deleteOneProgram)

module.exports = router