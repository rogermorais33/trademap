import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/db';

interface FileAttributes {
  id: number;
  name: string;
  type: string;
  content: Buffer;
}

// Since `id` is auto-generated, it is not required in the input
interface FileCreationAttributes extends Optional<FileAttributes, 'id'> {}

class File extends Model<FileAttributes, FileCreationAttributes> implements FileAttributes {
  public id!: number;
  public name!: string;
  public type!: string;
  public content!: Buffer;
}

File.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    type: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    content: {
      type: DataTypes.BLOB('long'), // BYTEA
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'files',
    timestamps: false,
  },
);

export default File;
