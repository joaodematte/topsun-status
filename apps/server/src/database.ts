import mysql from "mysql2/promise";

export const database = mysql.createPool({
  connectionLimit: 10,
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
});
