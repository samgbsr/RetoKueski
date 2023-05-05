import { createPool } from 'mysql2/promise.js'
import { MYSQLDATABASE, MYSQLHOST, MYSQLPASSWORD, MYSQLUSER} from './config.js'

//BD
export const pool = mysql.createPool({
    host: MYSQLHOST,
    user: MYSQLUSER,
    password: MYSQLPASSWORD,
    database: MYSQLDATABASE
})