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

const CalculationParameter = sequelize.define('calculationParameters', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    userId: {type: DataTypes.INTEGER, allowNull: false},
    softwareNumber: {type: DataTypes.INTEGER, allowNull: false},
    softwareName: {type: DataTypes.STRING, allowNull: false},
    keyExpirationDate: {type: DataTypes.DATEONLY, allowNull: false},
}, {
    timestamps: false
})

const ProgramCategory = sequelize.define('programCategories', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    categoryPosition: {type: DataTypes.INTEGER, allowNull: false},
    nameCategory: {type: DataTypes.STRING, unique: true, allowNull: false}
}, {
    timestamps: false
})

const Program = sequelize.define('programs', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    programCategoryId: {type: DataTypes.INTEGER, allowNull: false},
    programPosition: {type: DataTypes.INTEGER, allowNull: false},
    softwareName: {type: DataTypes.STRING, allowNull: false}
}, {
    timestamps: false
})

// Не работает onUpdate: CASCADE
// Добавить триггеры

ProgramCategory.hasMany(Program, {
    foreignKey: {
        name: 'programCategoryId',
        allowNull: false
    },
    onDelete: 'CASCADE',
    hooks: true
})
Program.belongsTo(ProgramCategory)

User.hasMany(CalculationParameter, {
    foreignKey: {
        name: 'userId',
        allowNull: false
    },
    onDelete: 'CASCADE',
    hooks: true
})
CalculationParameter.belongsTo(User)

module.exports = {
    User,
    CalculationParameter,
    ProgramCategory,
    Program
}