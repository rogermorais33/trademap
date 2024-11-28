import { Op } from "sequelize";
import TradeData from "../models/TradeData";

class FileRepository {
  async findWithFilters(filters: any) {
    const whereConditions: any = {};

    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        if (typeof value === "string" && value.includes(",")) {
          whereConditions[key] = { [Op.in]: value.split(",").map(v => v.trim()) };
        } else {
          whereConditions[key] = value;
        }
      }
    }
    try {
      const files = await TradeData.findAll({
        where: whereConditions,
      });
      const filesJson = files.map(file => file.toJSON());
      return filesJson;
    } catch (error) {
      console.error("Error executing query", error)
      throw new Error(`Error fetching files: ${error}`);
    }
  }
}

export default new FileRepository();
