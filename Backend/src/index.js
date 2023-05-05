import express from 'express';
import cors from 'cors'; 
import { PORT } from './config.js';
import { pool } from './db.js';


const app = express();

app.use(express.json());
app.use(cors());


//puerto localhost
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

//actividad de clase
app.get("/test", (req, res) => {
    res.json({ message: "Hello from server side!" });
});

//endpoints DASHBOARD

const get_pending_petitions="SELECT ARCO_PETITIONS.PETITION_ID, CONCAT(CLIENT.CLIENT_NAME, ' ', CLIENT.CLIENT_FIRST_LASTNAME, ' ', CLIENT.CLIENT_SECOND_LASTNAME) AS CLIENT_FULL_NAME, CASE ARCO_PETITIONS.ARCO_RIGHT WHEN 1 THEN 'Acceso' WHEN 2 THEN 'Rectificación' WHEN 3 THEN 'Cancelación' WHEN 4 THEN 'Oposición' ELSE '' END AS ARCO_RIGHT, ARCO_PETITIONS.CREATED_AT FROM ARCO_PETITIONS INNER JOIN CLIENT ON ARCO_PETITIONS.CLIENT_ID = CLIENT.CLIENT_ID WHERE ARCO_PETITIONS.CURRENT_STATUS = 'pendiente';";;

app.get("/dashboard/pending", async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(get_pending_petitions);
        connection.release();
        res.json(rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving data from the database');
    }
});

app.get("/dashboard/notPending", async (req, res) => {
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
});

//endpoints USER
app.get('/user/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('SELECT * FROM CLIENT WHERE CLIENT_ID=?', [id]);
        connection.release();
        res.json(rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving data from the database');
    }
});

app.put('/user/:id/opposition', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await pool.getConnection();
        await connection.execute('CALL approve_opposition(?)', [id]);
        connection.release();
        res.json({ message: `Client ${id} has been set as in opposition` });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating the database');
    }
});

//endpoints PETITION
app.get('/petition/:id/', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('CALL get_arco_petition_info(?)', [id]);
        connection.release();
        res.json(rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving data from the database');
    }
});

app.get('/petition/:id/comment', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('CALL get_arco_comment(?)', [id]);
        connection.release();
        res.json(rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving data from the database');
    }
});

app.put('/petition/:id/approve', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await pool.getConnection();
        await connection.execute('CALL approve_arco_petition(?)', [id]);
        connection.release();
        res.json({ message: `ARCO Petition ${id} has been approved` });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating the database');
    }
});

app.put('/petition/:id/reject', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await pool.getConnection();
        await connection.execute('CALL reject_arco_petition(?)', [id]);
        connection.release();
        res.json({ message: `ARCO Petition ${id} has been rejected` });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating the database');
    }
});

