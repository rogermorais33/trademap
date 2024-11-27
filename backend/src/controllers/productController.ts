import { Request, Response } from 'express';
import { fetchProducts, fetchReferenceData } from '../services/comtradeService';

export async function getProducts(req: Request, res: Response): Promise<void> {
  try {
    const productType = req.query.productType;
    if (productType === 'HS' || productType === 'BEC' || productType === 'SITC') {
      const products = await fetchProducts(productType);
      res.send(products);
    } else {
      res.status(400).send('Invalid product type');
    }
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
