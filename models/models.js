const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('users', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    userLogin: {type: DataTypes.STRING, unique: true, allowNull: false},
    userPassword: {type: DataTypes.STRING, allowNull: false},
    userRole: {type: DataTypes.STRING, defaultValue: "USER"},
}, {
    timestamps: false
})

const Item = sequelize.define('items', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    itemPosition: {type: DataTypes.INTEGER, allowNull: false},
    title: {type: DataTypes.STRING, unique: true, allowNull: false}
}, {
    timestamps: false
})

const ItemRow = sequelize.define('itemRows', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    itemId: {type: DataTypes.INTEGER, allowNull: false},
    rowPosition: {type: DataTypes.INTEGER, allowNull: false},
    serialNumber: {type: DataTypes.INTEGER},
    softwareName: {type: DataTypes.STRING, allowNull: false},
    linkText: {type: DataTypes.STRING},
    link: {type: DataTypes.TEXT},
    softwareVersion: {type: DataTypes.STRING}
}, {
    timestamps: false
})


Item.hasMany(ItemRow, {
    foreignKey: {
        name: 'itemId',
        allowNull: false
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    hooks: true
})
ItemRow.belongsTo(Item)

module.exports = {
    User,
    Item,
    ItemRow
}