import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db';

class Partner extends Model {
  public id!: number;
  public text!: string;
  public PartnerCode!: number;
  public PartnerDesc!: string;
  public partnerNote!: string | null;
  public PartnerCodeIsoAlpha2!: string | null;
  public PartnerCodeIsoAlpha3!: string;
  public entryEffectiveDate!: Date;
  public entryExpiredDate!: Date | null;
  public isGroup!: boolean;
}

Partner.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PartnerCode: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    PartnerDesc: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    partnerNote: {
      type: DataTypes.STRING,
      allowNull: true, // Nullable
    },
    PartnerCodeIsoAlpha2: {
      type: DataTypes.STRING(2),
      allowNull: true, // Nullable
    },
    PartnerCodeIsoAlpha3: {
      type: DataTypes.STRING(3),
      allowNull: true,
    },
    entryEffectiveDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    entryExpiredDate: {
      type: DataTypes.DATE,
      allowNull: true, // Nullable
    },
    isGroup: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'partners',
    timestamps: false,
  },
);

export default Partner;
