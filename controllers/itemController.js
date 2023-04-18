const ApiError = require('../error/ApiError')
const {Item} = require("../models/models");

class ItemController {
    async createFirst (req, res, next) {
        try {
            const {title} = req.body

            if (title.length < 4 || title.length > 50) {
                return next(ApiError.badRequest('В названии должно быть не меньше 4 символов и не больше 50'))
            }

            const item = await Item.findOne({where: {title}})
            if (item) {
                return next(ApiError.badRequest('Элемент списка с таким наименованием уже существует'))
            }

            await Item.sequelize.query('insert into items values(1, \''+title+'\')')
            return res.json('Добавление произошло успешно')
            //return res.json(newItem)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async createLast (req, res, next) {
        try {
            const {title} = req.body

            if (title.length < 4 || title.length > 50) {
                return next(ApiError.badRequest('В названии должно быть не меньше 4 символов и не больше 50'))
            }

            const item = await Item.findOne({where: {title}})
            if (item) {
                return next(ApiError.badRequest('Элемент списка с таким наименованием уже существует'))
            }

            await Item.sequelize.query('insert into items values((SELECT COALESCE(MAX(itemPosition), 0) FROM items) + 1, \''+title+'\')')
            return res.json('Добавление произошло успешно')
            //return res.json(newItem)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async createAfter (req, res, next) {
        try {
            const {title, afterTitle} = req.body

            if (title.length < 4 || title.length > 50) {
                return next(ApiError.badRequest('В названии должно быть не меньше 4 символов и не больше 50'))
            }

            const afterItem = await Item.findOne({where: {title: afterTitle}})
            if (!afterItem) {
                return next(ApiError.badRequest('Элемент списка после которого происходит добавление не найден'))
            }

            const item = await Item.findOne({where: {title}})
            if (item) {
                return next(ApiError.badRequest('Элемент списка с таким наименованием уже существует'))
            } else {

            }
            await Item.sequelize.query('insert into items values((SELECT itemPosition + 1 FROM items WHERE title=\''+afterTitle+'\'), \''+title+'\')')
            return res.json('Добавление произошло успешно')
            //return res.json(newItem)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll (req, res, next) {
        try {
            const items = await Item.findAll({order: ['itemPosition']})
            return res.json(items)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async updateOne (req, res, next) {
        try {
            const {title, newTitle} = req.body

            if (newTitle.length < 4 || newTitle.length > 50) {
                return next(ApiError.badRequest('В названии должно быть не меньше 4 символов и не больше 50'))
            }

            const item = await Item.findOne({where: {title: title}})
            if (!item) {
                return next(ApiError.badRequest('Элемент списка c выбранным названием не существует'))
            }

            const newItem = await Item.findOne({where: {title: newTitle}})
            if (newItem) {
                return next(ApiError.badRequest('Элемент списка c таким названием уже существует'))
            }

            await Item.update({ title: newTitle }, {
                where: {title}
            })
            return res.json('Изменение произошло успешно')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteOne (req, res, next) {
        try {
            const {title} = req.body

            const item = await Item.findOne({where: {title}})
            if (!item) {
                return next(ApiError.badRequest('Элемент списка c таким названием не существует'))
            }

            await Item.destroy({where: {title}})
            return res.json('Удаление произошло успешно')
            //return res.json(item)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new ItemController()