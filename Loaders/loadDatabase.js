const mysql = require("mysql")

module.exports = () => mysql.createConnection({
    
        host: "localhost",
        user: "root",
        password: "",
        database: "peperehobbits01's bot"
})