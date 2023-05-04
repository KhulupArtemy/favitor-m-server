const ApiError = require('../error/ApiError')
const jwt = require('jsonwebtoken')
const {User, CalculationParameter} = require('../models/models')

const generateJwt = (id, userLogin, userRole) => {
    return jwt.sign(
        {id, userLogin, userRole},
        process.env.SECRET_KEY,
        {expiresIn: '3h'}
    )
}

class UserController {
    async registration (req, res, next) {
        const {userLogin, userPassword} = req.body

        if (!userLogin || !userPassword){
            return next(ApiError.badRequest('Не все поля заполнены'))
        }

        if (userLogin.length < 5){
            return next(ApiError.badRequest('Логин не должен быть короче 5 символов'))
        }

        if (userPassword.length < 5){
            return next(ApiError.badRequest('Пароль не должен быть короче 5 символов'))
        }

        const candidateLogin = await User.findOne({where: {userLogin}})
        if (candidateLogin) {
            return next(ApiError.badRequest('Пользователь с таким логином уже существует'))
        }

        await User.create({userLogin, userPassword})
        return res.json('Аккаунт успешно зарегистрирован')
    }

    async login(req, res, next) {
        const {userLogin, userPassword} = req.body
        const user = await User.findOne({where: {userLogin}})
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        if (userPassword !== user.userPassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }
        const token = generateJwt(user.id, user.userLogin, user.userRole)
        return res.json({token})
    }

    async check(req, res) {
        const token = generateJwt(req.user.id, req.user.userLogin, req.user.userRole)
        return res.json({token})
    }

    async getUserLogins (req, res, next) {
        try {
            const logins = await User.sequelize.query('SELECT userLogin FROM users')
            return res.json(logins[0])
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }


    async createCalculationParameters (req, res, next) {
        try {
            const {userLogin, softwareNumber, softwareName, downloadLink, workstationsNumber, keyExpirationDate} = req.body

            if (!userLogin || !softwareName || !softwareNumber || !keyExpirationDate || !downloadLink || !workstationsNumber) {
                return next(ApiError.badRequest('Не все поля заполнены'))
            }

            const user = await User.findOne({where: {userLogin}})
            if (!user) {
                return next(ApiError.badRequest('Пользователь с указанным логином не найден'))
            }

            const userId = user.id
            await CalculationParameter.create({userId, softwareName, softwareNumber, downloadLink, workstationsNumber, keyExpirationDate})
            return res.json('Расчетные параметры успешно добавлены для указанного пользователя')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getCalculationParameters (req, res, next) {
        try {
            const token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.SECRET_KEY)

            if (!decoded.id){
                return next(ApiError.badRequest('Пользователь не найден'))
            }

            const userId = decoded.id
            const calculationParameters = await CalculationParameter.findAll({where: {userId}})
            return res.json(calculationParameters)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new UserController()