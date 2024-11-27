import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db';

class TradeData extends Model {
  public id!: number;
  public typeCode!: string;
  public freqCode!: string;
  public refPeriodId!: number;
  public refYear!: number;
  public refMonth!: number;
  public period!: string;
  public reporterCode!: number;
  public reporterISO!: string | null;
  public reporterDesc!: string | null;
  public flowCode!: string;
  public flowDesc!: string | null;
  public partnerCode!: number;
  public partnerISO!: string | null;
  public partnerDesc!: string | null;
  public partner2Code!: number;
  public partner2ISO!: string | null;
  public partner2Desc!: string | null;
  public classificationCode!: string;
  public classificationSearchCode!: string;
  public isOriginalClassification!: boolean;
  public cmdCode!: string;
  public cmdDesc!: string | null;
  public aggrLevel!: number | null;
  public isLeaf!: boolean | null;
  public customsCode!: string;
  public customsDesc!: string | null;
  public mosCode!: string;
  public motCode!: number;
  public motDesc!: string | null;
  public qtyUnitCode!: number | null;
  public qtyUnitAbbr!: string | null;
  public qty!: number | null;
  public isQtyEstimated!: boolean;
  public altQtyUnitCode!: number | null;
  public altQtyUnitAbbr!: string | null;
  public altQty!: number | null;
  public isAltQtyEstimated!: boolean;
  public netWgt!: number | null;
  public isNetWgtEstimated!: boolean;
  public grossWgt!: number | null;
  public isGrossWgtEstimated!: boolean;
  public cifvalue!: number | null;
  public fobvalue!: number | null;
  public primaryValue!: number;
  public legacyEstimationFlag!: number;
  public isReported!: boolean;
  public isAggregate!: boolean;
}

TradeData.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    typeCode: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    freqCode: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    refPeriodId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    refYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    refMonth: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    period: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    reporterCode: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reporterISO: {
      type: DataTypes.STRING(10),
      allowNull: true, // Nullable
    },
    reporterDesc: {
      type: DataTypes.STRING(255),
      allowNull: true, // Nullable
    },
    flowCode: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    flowDesc: {
      type: DataTypes.STRING(255),
      allowNull: true, // Nullable
    },
    partnerCode: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    partnerISO: {
      type: DataTypes.STRING(10),
      allowNull: true, // Nullable
    },
    partnerDesc: {
      type: DataTypes.STRING(255),
      allowNull: true, // Nullable
    },
    partner2Code: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    partner2ISO: {
      type: DataTypes.STRING(10),
      allowNull: true, // Nullable
    },
    partner2Desc: {
      type: DataTypes.STRING(255),
      allowNull: true, // Nullable
    },
    classificationCode: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    classificationSearchCode: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    isOriginalClassification: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    cmdCode: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    cmdDesc: {
      type: DataTypes.STRING(255),
      allowNull: true, // Nullable
    },
    aggrLevel: {
      type: DataTypes.INTEGER,
      allowNull: true, // Nullable
    },
    isLeaf: {
      type: DataTypes.BOOLEAN,
      allowNull: true, // Nullable
    },
    customsCode: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    customsDesc: {
      type: DataTypes.STRING(255),
      allowNull: true, // Nullable
    },
    mosCode: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    motCode: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    motDesc: {
      type: DataTypes.STRING(255),
      allowNull: true, // Nullable
    },
    qtyUnitCode: {
      type: DataTypes.INTEGER,
      allowNull: true, // Nullable
    },
    qtyUnitAbbr: {
      type: DataTypes.STRING(10),
      allowNull: true, // Nullable
    },
    qty: {
      type: DataTypes.FLOAT,
      allowNull: true, // Nullable
    },
    isQtyEstimated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    altQtyUnitCode: {
      type: DataTypes.INTEGER,
      allowNull: true, // Nullable
    },
    altQtyUnitAbbr: {
      type: DataTypes.STRING(10),
      allowNull: true, // Nullable
    },
    altQty: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    isAltQtyEstimated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    netWgt: {
      type: DataTypes.FLOAT,
      allowNull: true, // Nullable
    },
    isNetWgtEstimated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    grossWgt: {
      type: DataTypes.INTEGER,
      allowNull: true, // Nullable
    },
    isGrossWgtEstimated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    cifvalue: {
      type: DataTypes.FLOAT,
      allowNull: true, // Nullable
    },
    fobvalue: {
      type: DataTypes.FLOAT,
      allowNull: true, // Nullable
    },
    primaryValue: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    legacyEstimationFlag: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isReported: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    isAggregate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'trade_data',
    timestamps: false,
  },
);

export default TradeData;
