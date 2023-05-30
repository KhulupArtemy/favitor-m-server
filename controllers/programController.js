const ApiError = require('../error/ApiError')
const {Program} = require("../models/models");

class ProgramController {
    async createFirstProgram (req, res, next) {
        try {
            const {programCategoryId} = req.params
            const {softwareName} = req.body

            if (!softwareName.length) {
                return next(ApiError.badRequest('Для добавления требуется ввести наименование программы'))
            }

            if (softwareName.length > 255) {
                return next(ApiError.badRequest('Наименование программы не должно превышать 255 символа'))
            }

            const program = await Program.findOne({where: {softwareName}})
            if (program) {
                return next(ApiError.badRequest('Программа с таким наименованием уже существует'))
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
                return next(ApiError.badRequest('Для добавления требуется ввести наименование программы'))
            }

            if (softwareName.length > 255) {
                return next(ApiError.badRequest('Наименование программы не должно превышать 255 символа'))
            }

            const program = await Program.findOne({where: {softwareName}})
            if (program) {
                return next(ApiError.badRequest('Программа с таким наименованием уже существует'))
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
                return next(ApiError.badRequest('Для добавления требуется ввести наименование программы'))
            }

            if (softwareName.length > 255) {
                return next(ApiError.badRequest('Наименование программы не должно превышать 255 символа'))
            }

            const afterProgram = await Program.findOne({where: {id}})
            if (!afterProgram) {
                return next(ApiError.badRequest('Программа после которой происходит добавление не найдена'))
            }

            const program = await Program.findOne({where: {softwareName}})
            if (program) {
                return next(ApiError.badRequest('Программа с таким наименованием уже существует'))
            }

            await Program.sequelize.query('insert into programs values('+programCategoryId+', (SELECT programPosition + 1 FROM programs WHERE id='+id+'), \''+softwareName+'\')')
            return res.json('Добавление произошло успешно')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getProgramsSelectedCategory (req, res, next) {
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

            if (!softwareName.length) {
                return next(ApiError.badRequest('Для изменения требуется ввести наименование программы'))
            }

            if (softwareName.length > 255) {
                return next(ApiError.badRequest('Наименование программы не должно превышать 255 символа'))
            }

            const program = await Program.findOne({where: {id}})
            if (!program) {
                return next(ApiError.badRequest('Изменяемая программа не найдена'))
            }

            const newProgram = await Program.findOne({where: {softwareName}})
            if (newProgram) {
                return next(ApiError.badRequest('Программа c таким наименованием уже существует'))
            }

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

            const program = await Program.findOne({where: {id}})
            if (!program) {
                return next(ApiError.badRequest('Удаляемая программа не найдена'))
            }

            await Program.destroy({where: {id}})
            return res.json('Удаление произошло успешно')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getPrograms (req, res, next) {
        try {
            const programs = await Program.sequelize.query('SELECT softwareName FROM programs')
            return res.json(programs[0])
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new ProgramController()