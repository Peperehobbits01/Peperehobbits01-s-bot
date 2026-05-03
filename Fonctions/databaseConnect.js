const mysql = require(`mysql2/promise`);

const databaseConfig = {
    connectionLimit: process.env.DB_CONNECTION_LIMIT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

const pool = mysql.createPool(databaseConfig);

async function executeQuery(query) {
    let connection;
    try {
        connection = await pool.getConnection();
        let sql, values;

        if (Array.isArray(query) && query.length === 2) {
            [sql, values] = query;
        } else {
            sql = query;
            values = undefined;
        }

        const [rows] = await connection.execute(sql, values);
        return rows;
    } catch (error) {
        console.error(`Erreur lors de l'exécution de la requête: \n`, error);
    } finally {
        if (connection) connection.release();
    }
}

module.exports = { executeQuery };