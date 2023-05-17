const ApiError = require("../error/ApiError");
const {User, CalculationParameter, Program} = require("../models/models");
const jwt = require("jsonwebtoken");
const ffi = require("ffi-napi");

class CalculationParameterController {
    async createCalculationParameters (req, res, next) {
        try {
            const {userLogin, softwareName, downloadLink, workstationsNumber, keyExpirationDate} = req.body

            if (!userLogin || !softwareName || !keyExpirationDate || !downloadLink || !workstationsNumber) {
                return next(ApiError.badRequest('Не все поля заполнены'))
            }

            const user = await User.findOne({where: {userLogin}})
            if (!user) {
                return next(ApiError.badRequest('Пользователь с указанным логином не найден'))
            }

            const program = await Program.findOne({where: {softwareName}})
            if (!program) {
                return next(ApiError.badRequest('Программа с указанным названием не найдена'))
            }

            if (!Number.isInteger(Number(workstationsNumber))){
                return next(ApiError.badRequest('Неверный формат количества АРМ. Введите целое число'))
            }

            const userId = user.id
            const programId = program.id
            await CalculationParameter.create({userId, programId, downloadLink, workstationsNumber, keyExpirationDate})
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
            const calculationParameters = await CalculationParameter.sequelize.query(`SELECT programs.softwareName, calculationParameters.programId, calculationParameters.userId, 
                calculationParameters.workstationsNumber, calculationParameters.downloadLink, calculationParameters.keyExpirationDate 
                FROM calculationParameters INNER JOIN programs ON calculationParameters.programId = programs.id
                WHERE calculationParameters.userId = `+userId+` ORDER BY calculationParameters.keyExpirationDate`)
            return res.json(calculationParameters[0])
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getRegistrationKey (req, res, next) {
        try {
            const {programId, userId, workstationsNumber, keyExpirationDate, serialNumber} = req.body

            if (!programId || !userId || !workstationsNumber || !keyExpirationDate){
                return next(ApiError.badRequest('Заданы не все рассчетные параметры'))
            }

            if (!serialNumber){
                return next(ApiError.badRequest('Вы не указали серийный номер'))
            }

            if (String(parseInt(serialNumber)).length !== 16 || serialNumber.length !== 16){
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

            const RK = snrkLib.GetRKValue(String(programId), String(userId), String(workstationsNumber), String(keyExpirationDate), String(serialNumber))

            return res.json(RK)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getCalculationParameters (req, res, next) {
        try {
            const calculationParameters = await CalculationParameter.sequelize.query(`SELECT calculationParameters.id, users.userLogin, programs.softwareName, 
                calculationParameters.workstationsNumber, calculationParameters.keyExpirationDate, 
                calculationParameters.downloadLink FROM calculationParameters 
                INNER JOIN users ON calculationParameters.userId = users.id
                INNER JOIN programs ON calculationParameters.programId = programs.id
                ORDER BY calculationParameters.keyExpirationDate, users.userLogin`)
            return res.json(calculationParameters[0])
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async updateCalculationParameter (req, res, next) {
        try {
            const {id, softwareName, downloadLink, workstationsNumber, keyExpirationDate} = req.body

            if (!softwareName || !keyExpirationDate || !downloadLink || !workstationsNumber) {
                return next(ApiError.badRequest('Не все поля заполнены'))
            }

            const program = await Program.findOne({where: {softwareName}})
            if (!program) {
                return next(ApiError.badRequest('Программа с указанным названием не найдена'))
            }

            if (!Number.isInteger(Number(workstationsNumber))){
                return next(ApiError.badRequest('Неверный формат количества АРМ. Введите целое число'))
            }

            const programId = program.id
            await CalculationParameter.update({programId, downloadLink, workstationsNumber, keyExpirationDate}, {
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