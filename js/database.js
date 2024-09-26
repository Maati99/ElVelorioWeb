const { Sequelize } = require('sequelize')

const sequelize = new Sequelize("elvelorio-db", "user", "pass", {
    dialect: "sqlite",
    host: "./db.sqlite"
})

module.exports = sequelize