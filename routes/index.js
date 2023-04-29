const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const categoryRouter = require('./categoryRouter')
const programRouter = require('./programRouter')

router.use('/user', userRouter)
router.use('/category', categoryRouter)
router.use('/program', programRouter)

module.exports = router