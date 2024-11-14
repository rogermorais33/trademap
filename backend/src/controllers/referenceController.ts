import { Request, Response } from 'express';
import { fetchReferenceData } from '../services/comtradeService';

export async function getReporters(req: Request, res: Response): Promise<void> {
  try {
    const data = await fetchReferenceData('Reporters');
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching reporters data' });
  }
}

export async function getPartners(req: Request, res: Response): Promise<void> {
  try {
    const data = await fetchReferenceData('partnerAreas');
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching partners data' });
  }
}

export async function getCustomsCodes(req: Request, res: Response): Promise<void> {
  try {
    const data = await fetchReferenceData('CustomsCodes');
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching transport codes' });
  }
}

export async function getMotc(req: Request, res: Response): Promise<void> {
  try {
    const data = await fetchReferenceData('ModeOfTransportCodes');
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching transport codes' });
  }
}
