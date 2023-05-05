import { createPool } from 'mysql2/promise.js'
import { MYSQLDATABASE, MYSQLHOST, MYSQLPASSWORD, MYSQLUSER} from './config.js'

//BD
export const pool = createPool({
    host: MYSQLHOST,
    user: MYSQLUSER,
    password: MYSQLPASSWORD,
    database: MYSQLDATABASE
})