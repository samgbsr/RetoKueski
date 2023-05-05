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

const get_pending_petitions = `
SELECT ARCO_PETITIONS.PETITION_ID, 
CONCAT(CLIENT.CLIENT_NAME, ' ', CLIENT.CLIENT_FIRST_LASTNAME, ' ', CLIENT.CLIENT_SECOND_LASTNAME) AS CLIENT_FULL_NAME,
CASE ARCO_PETITIONS.ARCO_RIGHT 
WHEN 1 THEN 'Acceso' 
WHEN 2 THEN 'Rectificación' 
WHEN 3 THEN 'Cancelación' 
WHEN 4 THEN 'Oposición' 
ELSE '' 
END AS ARCO_RIGHT,
ARCO_PETITIONS.CREATED_AT 
FROM ARCO_PETITIONS
INNER JOIN CLIENT ON ARCO_PETITIONS.CLIENT_ID = CLIENT.CLIENT_ID
WHERE ARCO_PETITIONS.CURRENT_STATUS = 'pendiente';
`;

app.get("/dashboard/pending", async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const rows = await connection.execute(get_pending_petitions);
        connection.release();
        res.json(rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving data from the database');
    }
});

const get_notPending_petitions = `
SELECT ARCO_PETITIONS.PETITION_ID, 
           CONCAT(CLIENT.CLIENT_NAME, ' ', CLIENT.CLIENT_FIRST_LASTNAME, ' ', CLIENT.CLIENT_SECOND_LASTNAME) AS CLIENT_FULL_NAME, 
           CASE ARCO_PETITIONS.ARCO_RIGHT 
               WHEN 1 THEN 'Acceso' 
               WHEN 2 THEN 'Rectificación' 
               WHEN 3 THEN 'Cancelación' 
               WHEN 4 THEN 'Oposición' 
               ELSE '' 
           END AS ARCO_RIGHT,
           ARCO_PETITIONS.CURRENT_STATUS,
           ARCO_PETITIONS.CREATED_AT,
           ARCO_PETITIONS.UPDATED_AT
    FROM ARCO_PETITIONS 
    INNER JOIN CLIENT ON ARCO_PETITIONS.CLIENT_ID = CLIENT.CLIENT_ID
    WHERE ARCO_PETITIONS.CURRENT_STATUS != 'pendiente';
`;

app.get("/dashboard/notPending", async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const rows = await connection.execute(get_notPending_petitions);
        connection.release();
        res.json(rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving data from the database');
    }
});

//endpoints USER

const get_client_info = `
SELECT CLIENT_ID, CONCAT(CLIENT_NAME, ' ', CLIENT_FIRST_LASTNAME, ' ', CLIENT_SECOND_LASTNAME) AS full_name, 
    CLIENT_BIRTHDATE, 
    CLIENT_NATIONALITY, 
    CLIENT_STATE_OF_BIRTH, 
    CLIENT_CURP, 
    CLIENT_ECONOMIC_ACTIVITY,
    CLIENT_GENDER, 
    CLIENT_PHONE_NUMBER, 
    CLIENT_EMAIL, 
    IS_CLIENT, 
    IS_BLOCKED, 
    IS_IN_OPOSITION, 
    CREATED_AT, 
    UPDATED_AT, 
    DELETED_AT
    FROM CLIENT
    WHERE CLIENT_ID = ?;
`;

app.get('/user/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(get_client_info, [id]);
        connection.release();
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving data from the database');
    }
});

const approve_oposition = `
UPDATE CLIENT 
SET IS_IN_OPOSITION = 1, 
UPDATED_AT = NOW()
WHERE CLIENT_ID = ?;
`;

app.put('/user/:id/opposition', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await pool.getConnection();
        await connection.execute(approve_oposition, [id]);
        connection.release();
        res.json({ message: `Client ${id} has been set as in opposition` });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating the database');
    }
});

const approve_cancelation = `
UPDATE CLIENT 
SET IS_BLOCKED = 1, 
UPDATED_AT = NOW(), 
DELETED_AT = NOW();
WHERE CLIENT_ID = ?;
`;

app.put('/user/:id/cancelation', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await pool.getConnection();
        await connection.execute(approve_cancelation, [id]);
        connection.release();
        res.json({ message: `Client ${id} has been set as deleted` });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating the database');
    }
});

//endpoints PETITION

const get_arco_petition_info = 
`
SELECT ARCO_PETITIONS.PETITION_ID, 
ARCO_PETITIONS.CLIENT_ID,
CONCAT(CLIENT.CLIENT_NAME, ' ', CLIENT.CLIENT_FIRST_LASTNAME, ' ', CLIENT.CLIENT_SECOND_LASTNAME) AS CLIENT_FULL_NAME, 
CASE ARCO_PETITIONS.ARCO_RIGHT 
    WHEN 1 THEN 'Acceso' 
    WHEN 2 THEN 'Rectificación' 
    WHEN 3 THEN 'Cancelación' 
    WHEN 4 THEN 'Oposición' 
    ELSE '' 
END AS ARCO_RIGHT,
ARCO_PETITIONS.CURRENT_STATUS,
ARCO_PETITIONS.PETITION_COMMENT,
ARCO_PETITIONS.CREATED_AT,
ARCO_PETITIONS.UPDATED_AT
FROM ARCO_PETITIONS 
INNER JOIN CLIENT ON ARCO_PETITIONS.CLIENT_ID = CLIENT.CLIENT_ID
WHERE ARCO_PETITIONS.PETITION_ID =?;
`;

app.get('/petition/:id/', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(get_arco_petition_info, [id]);
        connection.release();
        res.json(rows[0]);

    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving data from the database');
    }
});

const approve_arco_petition = `
UPDATE ARCO_PETITIONS 
SET STATUS = 'aprobada', 
UPDATED_AT = NOW() 
WHERE PETITION_ID = ?;
`;

app.put('/petition/:id/approve', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await pool.getConnection();
        await connection.execute(approve_arco_petition, [id]);
        connection.release();
        res.json({ message: `ARCO Petition ${id} has been approved` });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating the database');
    }
});

const reject_arco_petition = `
UPDATE ARCO_PETITIONS 
SET STATUS = 'rechazada', 
UPDATED_AT = NOW() 
WHERE PETITION_ID = ?;
`;

app.put('/petition/:id/reject', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await pool.getConnection();
        await connection.execute(reject_arco_petition, [id]);
        connection.release();
        res.json({ message: `ARCO Petition ${id} has been rejected` });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating the database');
    }
});

