import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import { Module as ModuleType } from '../types/Module';

interface ModuleCreationAttributes extends Optional<ModuleType, 'module_id'> {}

class Module extends Model<ModuleType, ModuleCreationAttributes> implements ModuleType {
  public module_id!: number;
  public user_id!: number;
  public name!: string;
  public description?: string;
  public created_at!: Date;
  public updated_at!: Date;

  // Associations
  static associate(models: any) {
    Module.belongsTo(models.User, { foreignKey: 'user_id' });
    Module.hasMany(models.Project, { foreignKey: 'module_id' });
    Module.hasMany(models.Deadline, { foreignKey: 'module_id' });
    Module.hasMany(models.Task, { foreignKey: 'module_id' });
  }
}

export default (sequelize: Sequelize) => {
  Module.init(
    {
      module_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
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
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Module',
      tableName: 'Modules',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Module;
};
