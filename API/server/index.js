const express = require("express");
const cors = require('cors');
import { PORT } from './config.js'
import testRoutes from './routes/test.routes.js'
import dashboardRoutes from './routes/dashboard.routes.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use(testRoutes)
app.use(dashboardRoutes)


app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
