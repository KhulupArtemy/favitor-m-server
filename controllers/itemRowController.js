const ApiError = require('../error/ApiError')
const {ItemRow} = require("../models/models");

class ItemRowController {
    async createFirst (req, res, next) {
        try {
            const {itemId} = req.params
            const {serialNumber, softwareName, linkText, link, softwareVersion} = req.body

            if (softwareName.length < 4 || softwareName.length > 255) {
                return next(ApiError.badRequest('В наименовании программного продукта должно быть не менее 4 символов и не более 255 символов'))
            }

            if (serialNumber && serialNumber !== '0') {
                await ItemRow.sequelize.query('insert into itemRows values('+itemId+', 1, '+serialNumber+', \''+softwareName+'\', \''+linkText+'\', \''+link+'\', \''+softwareVersion+'\')')
            } else {
                await ItemRow.sequelize.query('insert into itemRows values('+itemId+', 1, null, \''+softwareName+'\', \''+linkText+'\', \''+link+'\', \''+softwareVersion+'\')')
            }

            //await ItemRow.create({itemId, rowPosition: 1, serialNumber, softwareName, linkText, link, softwareVersion})
            return res.json('Добавление строки произошло успешно')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async createLast (req, res, next) {
        try {
            const {itemId} = req.params
            const {serialNumber, softwareName, linkText, link, softwareVersion} = req.body

            if (softwareName.length < 4 || softwareName.length > 255) {
                return next(ApiError.badRequest('В наименовании программного продукта должно быть не менее 4 символов и не более 255 символов'))
            }

            if (serialNumber && serialNumber !== '0') {
                await ItemRow.sequelize.query('insert into itemRows values('+itemId+', (SELECT COALESCE(MAX(rowPosition), 0) FROM itemRows WHERE itemId = \''+itemId+'\') + 1, '+serialNumber+', \''+softwareName+'\', \''+linkText+'\', \''+link+'\', \''+softwareVersion+'\')')
            } else {
                await ItemRow.sequelize.query('insert into itemRows values('+itemId+', (SELECT COALESCE(MAX(rowPosition), 0) FROM itemRows WHERE itemId = \''+itemId+'\') + 1, null, \''+softwareName+'\', \''+linkText+'\', \''+link+'\', \''+softwareVersion+'\')')
            }

            return res.json('Добавление строки произошло успешно')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async createAfter (req, res, next) {
        try {
            const {itemId} = req.params
            const {rowId, serialNumber, softwareName, linkText, link, softwareVersion} = req.body

            if (softwareName.length < 4 || softwareName.length > 255) {
                return next(ApiError.badRequest('В наименовании программного продукта должно быть не менее 4 символов и не более 255 символов'))
            }

            if (serialNumber && serialNumber !== '0') {
                await ItemRow.sequelize.query('insert into itemRows values('+itemId+', (SELECT rowPosition + 1 FROM itemRows WHERE id='+rowId+'), '+serialNumber+', \''+softwareName+'\', \''+linkText+'\', \''+link+'\', \''+softwareVersion+'\')')
            } else {
                await ItemRow.sequelize.query('insert into itemRows values('+itemId+', (SELECT rowPosition + 1 FROM itemRows WHERE id='+rowId+'), null, \''+softwareName+'\', \''+linkText+'\', \''+link+'\', \''+softwareVersion+'\')')
            }

            return res.json('Добавление строки произошло успешно')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll (req, res, next) {
        try {
            const {itemId} = req.params
            const itemRows = await ItemRow.findAll({order: ['rowPosition'], where: {itemId}})
            return res.json(itemRows)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async updateOne (req, res, next) {
        try {
            const {rowId, serialNumber, softwareName, linkText, link, softwareVersion} = req.body

            if (serialNumber && serialNumber !== '0') {
                await ItemRow.update({ serialNumber, softwareName, linkText, link, softwareVersion }, {
                    where: {id: rowId}
                })
            } else {
                await ItemRow.update({ serialNumber: null, softwareName, linkText, link, softwareVersion }, {
                    where: {id: rowId}
                })
            }

            return res.json('Изменение произошло успешно')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteOne (req, res, next) {
        try {
            const {rowId} = req.body

            await ItemRow.destroy({where: {id: rowId}})
            return res.json('Удаление произошло успешно')
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new ItemRowController()