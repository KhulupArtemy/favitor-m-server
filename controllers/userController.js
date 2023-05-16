const ApiError = require('../error/ApiError')
const jwt = require('jsonwebtoken')
const {User} = require('../models/models')

const generateJwt = (id, userLogin, userRole) => {
    return jwt.sign(
        {id, userLogin, userRole},
        process.env.SECRET_KEY,
        {expiresIn: '3h'}
    )
}

class UserController {
    async createUserAccount (req, res, next) {
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

    async updateUserLogin (req, res, next) {
        try {
            const {userLogin, newLogin} = req.body

            if (newLogin.length < 5){
                return next(ApiError.badRequest('Логин не должен быть короче 5 символов'))
            }

            const oldLogin = await User.findOne({where: {userLogin}})
            if (!oldLogin) {
                return next(ApiError.badRequest('Пользователь с указанным логином не существует'))
            }

            const candidateLogin = await User.findOne({where: {userLogin: newLogin}})
            if (candidateLogin) {
                return next(ApiError.badRequest('Пользователь с таким логином уже существует'))
            }

            await User.update({userLogin: newLogin}, {
                where: {userLogin}
            })
            return res.json('Изменение произошло успешно')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteUserAccount (req, res, next) {
        try {
            const {userLogin} = req.body

            const candidateLogin = await User.findOne({where: {userLogin}})
            if (!candidateLogin) {
                return next(ApiError.badRequest('Пользователь с указанным логином не существует'))
            }

            if (candidateLogin.userRole === 'ADMIN') {
                return next(ApiError.badRequest('Невозможно удалить аккаунт администратора'))
            }

            await User.destroy({where: {userLogin}})
            return res.json('Удаление произошло успешно')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new UserController()