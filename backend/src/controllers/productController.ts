import { Request, Response } from 'express';
import { fetchProducts, fetchReferenceData } from '../services/comtradeService';

export async function getProducts(req: Request, res: Response): Promise<void> {
  try {
    const products = await fetchProducts();
    res.send(products);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching products' });
  }
}

export async function getServices(req: Request, res: Response): Promise<void> {
  try {
    const services = await fetchReferenceData('EB');
    res.send(services);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching services' });
  }
}
