const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const categoryRouter = require('./categoryRouter')
const programRouter = require('./programRouter')
const calculationParameterRouter = require('./calculationParameterRouter')

router.use('/user', userRouter)
router.use('/category', categoryRouter)
router.use('/program', programRouter)
router.use('/calculationParameter', calculationParameterRouter)

module.exports = router