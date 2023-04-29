const ApiError = require('../error/ApiError')
const {Program} = require("../models/models");

class ProgramController {
    async createFirstProgram (req, res, next) {
        try {
            const {programCategoryId} = req.params
            const {softwareName} = req.body

            if (!softwareName.length) {
                return next(ApiError.badRequest('Для добавления требуется ввести название программного продукта'))
            }

            if (softwareName.length > 255) {
                return next(ApiError.badRequest('Название программного продукта не должно превышать 255 символа'))
            }

            await Program.sequelize.query('insert into programs values('+programCategoryId+', 1, \''+softwareName+'\')')
            return res.json('Добавление произошло успешно')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async createLastProgram (req, res, next) {
        try {
            const {programCategoryId} = req.params
            const {softwareName} = req.body

            if (!softwareName.length) {
                return next(ApiError.badRequest('Для добавления требуется ввести название программного продукта'))
            }

            if (softwareName.length > 255) {
                return next(ApiError.badRequest('Название программного продукта не должно превышать 255 символа'))
            }

            await Program.sequelize.query('insert into programs values('+programCategoryId+', (SELECT COALESCE(MAX(programPosition), 0) FROM programs WHERE programCategoryId = \''+programCategoryId+'\') + 1, \''+softwareName+'\')')
            return res.json('Добавление произошло успешно')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async createAfterProgram (req, res, next) {
        try {
            const {programCategoryId} = req.params
            const {id, softwareName} = req.body

            if (!softwareName.length) {
                return next(ApiError.badRequest('Для добавления требуется ввести название программного продукта'))
            }

            if (softwareName.length > 255) {
                return next(ApiError.badRequest('Название программного продукта не должно превышать 255 символа'))
            }

            await Program.sequelize.query('insert into programs values('+programCategoryId+', (SELECT programPosition + 1 FROM programs WHERE id='+id+'), \''+softwareName+'\')')
            return res.json('Добавление произошло успешно')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAllPrograms (req, res, next) {
        try {
            const {programCategoryId} = req.params
            const programs = await Program.findAll({order: ['programPosition'], where: {programCategoryId}})
            return res.json(programs)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async updateOneProgram (req, res, next) {
        try {
            const {id, softwareName} = req.body

            await Program.update({softwareName}, {
                where: {id}
            })
            return res.json('Изменение произошло успешно')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteOneProgram (req, res, next) {
        try {
            const {id} = req.body

            await Program.destroy({where: {id}})
            return res.json('Удаление произошло успешно')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new ProgramController()