const ApiError = require("../error/ApiError");
const {User, CalculationParameter} = require("../models/models");
const jwt = require("jsonwebtoken");
const ffi = require("ffi-napi");

class CalculationParameterController {
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

    async getUserCalculationParameters (req, res, next) {
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

    async getRegistrationKey (req, res, next) {
        try {
            const {softwareNumber, userId, workstationsNumber, keyExpirationDate, serialNumber} = req.body

            if (!softwareNumber || !userId || !workstationsNumber || !keyExpirationDate){
                return next(ApiError.badRequest('Заданы не все рассчетные параметры'))
            }

            if (!serialNumber){
                return next(ApiError.badRequest('Вы не указали серийный номер'))
            }

            if (!Number.isInteger(Number(serialNumber)) || serialNumber.length != 16){
                return next(ApiError.badRequest('Неверный формат серийного номера'))
            }

            const snrkLib = new ffi.Library('./dll/snrkLibrary', {
                'GetRKValue': [
                    'string', [
                        'string',
                        'string',
                        'string',
                        'string',
                        'string'
                    ]
                ],
            })

            const RK = snrkLib.GetRKValue(String(softwareNumber), String(userId), String(workstationsNumber), String(keyExpirationDate), String(serialNumber))

            return res.json(RK)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getCalculationParameters (req, res, next) {
        try {
            const calculationParameters = await CalculationParameter.sequelize.query(`SELECT calculationParameters.id, users.userLogin, calculationParameters.softwareNumber, 
                calculationParameters.softwareName, calculationParameters.workstationsNumber, 
                calculationParameters.keyExpirationDate, calculationParameters.downloadLink 
                FROM calculationParameters INNER JOIN users ON calculationParameters.userId = users.id;`)
            return res.json(calculationParameters[0])
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async updateCalculationParameter (req, res, next) {
        try {
            const {id, softwareNumber, softwareName, downloadLink, workstationsNumber, keyExpirationDate} = req.body

            if (!softwareName || !softwareNumber || !keyExpirationDate || !downloadLink || !workstationsNumber) {
                return next(ApiError.badRequest('Не все поля заполнены'))
            }

            await CalculationParameter.update({softwareNumber, softwareName, downloadLink, workstationsNumber, keyExpirationDate}, {
                    where: {id}
            })
            return res.json('Изменение произошло успешно')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteCalculationParameter (req, res, next) {
        try {
            const {id} = req.body

            await CalculationParameter.destroy({where: {id}})
            return res.json('Удаление произошло успешно')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new CalculationParameterController()