const mysql = require(`mysql2/promise`);

const databaseConfig = {
    connectionLimit: "10",
    host: "localhost",
    user: "root",
    password: "",
    database: "peperehobbits01's bot",
};

const pool = mysql.createPool(databaseConfig);

async function executeQuery(query) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.execute(query);
        return rows;
    } catch (error) {
        console.error(`Erreur lors de l'exécution de la requête: \n`, error);
    } finally {
        if (!connection) return connection.release();
    }
}

module.exports = { executeQuery };