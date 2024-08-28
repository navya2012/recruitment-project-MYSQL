
const mysql = require('mysql2/promise')

const pool = mysql.createPool({
    host: process.env.DATABASE_HOSTNAME,
    user: process.env.DATABASE_USERNAME, 
    password: process.env.DATABASE_PASSWORD, 
    database:process.env.DATABASE_NAME,
    waitForConnections: true,
    connectionLimit:10,
    queueLimit:0
})

pool.getConnection()
.then(conn => {
    console.log(`MYSQL Database Connected Successfully`)
    conn.release()
})
.catch(err => {
    console.log(`Database Connection failed: `, err)
})

module.exports = pool;