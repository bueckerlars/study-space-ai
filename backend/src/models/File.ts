import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import { File as FileType } from '../types/File';

interface FileCreationAttributes extends Optional<FileType, 'file_id'> {}

class File extends Model<FileType, FileCreationAttributes> implements FileType {
  public file_id!: string;
  public user_id!: number;
  public project_id!: number;
  public name!: string;
  public size!: number;
  public type!: string;
  public url!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  // For compatibility with database column naming
  public created_at!: Date;
  public updated_at!: Date;

  // Associations
  static associate(models: any) {
    File.belongsTo(models.User, { foreignKey: 'user_id' });
    File.belongsTo(models.Project, { foreignKey: 'project_id' });
  }
}

export default (sequelize: Sequelize) => {
  File.init(
    {
      file_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
          model: 'Users',
          key: 'user_id',
          },
      },
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Projects',
          key: 'project_id',
        },
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      size: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      url: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at',
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'File',
      tableName: 'Files',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return File;
};
