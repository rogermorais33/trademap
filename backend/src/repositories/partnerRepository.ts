import Partner from '../models/Partner';

class PartnerRepository {
  public async create(data: any): Promise<any> {
    return Partner.create(data);
  }

  public async findAll(): Promise<any[]> {
    return Partner.findAll();
  }

  public async findById(id: number): Promise<any | null> {
    return Partner.findByPk(id);
  }

  public async update(id: number, data: any): Promise<any> {
    const partner = await Partner.findByPk(id);
    if (partner) {
      return partner.update(data);
    }
    return null;
  }

  public async delete(id: number): Promise<void> {
    const partner = await Partner.findByPk(id);
    if (partner) {
      await partner.destroy();
    }
  }
}

export default new PartnerRepository();
