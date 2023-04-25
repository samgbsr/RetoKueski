const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

const mysql = require('mysql2/promise');

//BD
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "kueskiarco"
})

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

app.get("/test", (req, res) => {
    res.json({ message: "Hello from server side!" });
});

app.get("/dashboard/pending", async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute("CALL sp_get_pending_petitions() ");
        connection.release();
        res.json(rows);
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
        res.json(rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving data from the database');
    }
});

app.get('/user/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute('CALL get_client_info(?)', [id]);
      connection.release();
      res.json(rows);

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
      res.json(rows);

    } catch (err) {
      console.error(err);
      res.status(500).send('Error retrieving data from the database');
    }
});

