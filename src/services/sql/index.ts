import { Pool } from 'pg';
import { databaseName, databasePassword, databaseURL, databaseUser } from '../../config';

export const pool = new Pool({
  host: databaseURL,
  port: 5432,
  user: databaseName,
  password: databasePassword,
  database: databaseUser
});
