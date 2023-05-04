
const mysql = require('mysql2/promise');

app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/popper', express.static(__dirname + '/node_modules/popper.js/dist/umd/'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));



//endpoints DASHBOARD




//endpoints USER


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

