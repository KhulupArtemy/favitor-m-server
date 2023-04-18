const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const itemRouter = require('./itemRouter')
const itemRowRouter = require('./itemRowRouter')

router.use('/user', userRouter)
router.use('/item', itemRouter)
router.use('/row', itemRowRouter)

module.exports = router