import { pool } from "../../services/sql";
import { Product } from "../../models/types/Product";

export const getProducts = async (): Promise<Product[]> => {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT * FROM products');
    return res.rows as Product[];
  } finally {
    client.release();
  }
};