import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import { Project as ProjectType } from '../types/Project';

interface ProjectCreationAttributes extends Optional<ProjectType, 'project_id'> {}

class Project extends Model<ProjectType, ProjectCreationAttributes> implements ProjectType {
  public project_id!: number;
  public user_id!: number;
  public module_id?: number;
  public name!: string;
  public description?: string;
  public created_at!: Date;
  public updated_at!: Date;

  // Associations
  static associate(models: any) {
    Project.belongsTo(models.User, { foreignKey: 'user_id' });
    Project.belongsTo(models.Module, { foreignKey: 'module_id' });
    Project.hasMany(models.Deadline, { foreignKey: 'project_id' });
    Project.hasMany(models.Task, { foreignKey: 'project_id' });
  }
}

export default (sequelize: Sequelize) => {
  Project.init(
    {
      project_id: {
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
      module_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Modules',
          key: 'module_id',
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
      modelName: 'Project',
      tableName: 'Projects',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Project;
};
