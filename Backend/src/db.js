import { createPool } from 'mysql2/promise.js'
import { MYSQLDATABASE, MYSQLHOST, MYSQLPASSWORD, MYSQLUSER, MYSQLPORT} from './config.js'

//BD
export const pool = createPool({
    host: MYSQLHOST,
    user: MYSQLUSER,
    password: MYSQLPASSWORD,
    port: MYSQLPORT,
    database: MYSQLDATABASE
})