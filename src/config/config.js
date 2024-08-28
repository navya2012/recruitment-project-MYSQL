
const MYSQL_DATABASE = {
    host: process.env.SQL_DATABASE_HOST || "localhost",
    port: parseInt(process.env.SQL_DATABASE_PORT || "3306"),
    username: process.env.SQL_DATABASE_USERNAME,
    password: process.env.SQL_DATABASE_PASSWORD,
    db_name: process.env.SQL_DATABASE_NAME || "",
    pool_size: parseInt(process.env.SQL_DATABASE_POOL_SIZE || "30"),
  };
  
  module.exports = MYSQL_DATABASE;