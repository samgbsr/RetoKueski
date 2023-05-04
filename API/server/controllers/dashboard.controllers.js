import { pool } from "../db.js"

export const sp_get_pending_petitions = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute("CALL sp_get_pending_petitions() ");
        connection.release();
        res.json(rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving data from the database');
    }
}

export const sp_get_not_pending_petitions = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute("CALL sp_get_not_pending_petitions() ");
        connection.release();
        res.json(rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving data from the database');
    }
}