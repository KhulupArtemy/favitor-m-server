const ApiError = require('../error/ApiError')
const {ProgramCategory} = require("../models/models");

class CategoryController {
    async createFirstCategory (req, res, next) {
        try {
            const {nameCategory} = req.body

            if (!nameCategory.length) {
                return next(ApiError.badRequest('Для добавления требуется ввести название категории'))
            }

            if (nameCategory.length > 255) {
                return next(ApiError.badRequest('Название категории не должно превышать 255 символа'))
            }

            const category = await ProgramCategory.findOne({where: {nameCategory}})
            if (category) {
                return next(ApiError.badRequest('Категория с таким названием уже существует'))
            }

            await ProgramCategory.sequelize.query('insert into programCategories values(1, \''+nameCategory+'\')')
            return res.json('Добавление произошло успешно')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async createLastCategory (req, res, next) {
        try {
            const {nameCategory} = req.body

            if (!nameCategory.length) {
                return next(ApiError.badRequest('Для добавления требуется ввести название категории'))
            }

            if (nameCategory.length > 255) {
                return next(ApiError.badRequest('Название категории не должно превышать 255 символа'))
            }

            const category = await ProgramCategory.findOne({where: {nameCategory}})
            if (category) {
                return next(ApiError.badRequest('Категория с таким названием уже существует'))
            }

            await ProgramCategory.sequelize.query('insert into programCategories values((SELECT COALESCE(MAX(categoryPosition), 0) FROM programCategories) + 1, \''+nameCategory+'\')')
            return res.json('Добавление произошло успешно')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async createAfterCategory (req, res, next) {
        try {
            const {nameCategory, afterName} = req.body

            if (!nameCategory.length) {
                return next(ApiError.badRequest('Для добавления требуется ввести название категории'))
            }

            if (nameCategory.length > 255) {
                return next(ApiError.badRequest('Название категории не должно превышать 255 символа'))
            }

            const afterCategory = await ProgramCategory.findOne({where: {nameCategory: afterName}})
            if (!afterCategory) {
                return next(ApiError.badRequest('Категория после которой происходит добавление не найдена'))
            }

            const category = await ProgramCategory.findOne({where: {nameCategory}})
            if (category) {
                return next(ApiError.badRequest('Категория с таким названием уже существует'))
            } else {

            }
            await ProgramCategory.sequelize.query('insert into programCategories values((SELECT categoryPosition + 1 FROM programCategories WHERE nameCategory=\''+afterName+'\'), \''+nameCategory+'\')')
            return res.json('Добавление произошло успешно')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAllCategories (req, res, next) {
        try {
            const categories = await ProgramCategory.findAll({order: ['categoryPosition']})
            return res.json(categories)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async updateOneCategory (req, res, next) {
        try {
            const {nameCategory, newNameCategory} = req.body

            if (!newNameCategory.length) {
                return next(ApiError.badRequest('Для изменения требуется ввести название категории'))
            }

            if (newNameCategory.length > 255) {
                return next(ApiError.badRequest('Название категории не должно превышать 255 символа'))
            }

            const category = await ProgramCategory.findOne({where: {nameCategory}})
            if (!category) {
                return next(ApiError.badRequest('Категории c выбранным названием не существует'))
            }

            const newCategory = await ProgramCategory.findOne({where: {nameCategory: newNameCategory}})
            if (newCategory) {
                return next(ApiError.badRequest('Категория c таким названием уже существует'))
            }

            await ProgramCategory.update({nameCategory: newNameCategory}, {
                where: {nameCategory}
            })
            return res.json('Изменение произошло успешно')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteOneCategory (req, res, next) {
        try {
            const {nameCategory} = req.body

            const category = await ProgramCategory.findOne({where: {nameCategory}})
            if (!category) {
                return next(ApiError.badRequest('Категории c таким названием не существует'))
            }

            await ProgramCategory.destroy({where: {nameCategory}})
            return res.json('Удаление произошло успешно')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new CategoryController()