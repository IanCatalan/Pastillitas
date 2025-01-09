const dbConfig = require ('./config/config.js')
const Sequelize = require ('sequielize')

const sequelize = new Sequelize (dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    operatorAliases: false,
    pool:{
        max: dbConfig.max,
        min: dbConfig.min,
        acquire: dbConfig.acquire,
        idle: dbConfig.idle
    }
})

const db ={}

db.sequelize = sequelize
db.Sequelize = Sequelize

db.simiItems = require ('./models/simiItem.model.js')
db.cruzverdeItem = require ('./models/cruzverdeItem.model.js')
