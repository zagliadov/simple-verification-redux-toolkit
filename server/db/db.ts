import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user: 'admin',
    host: 'trashDB',
    password: 'admin',
    port: 5432,
    database: 'trashDB',

})

export default pool