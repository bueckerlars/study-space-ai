import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import { Deadline as DeadlineType } from '../types/Deadline';

interface DeadlineCreationAttributes extends Optional<DeadlineType, 'deadline_id'> {}

class Deadline extends Model<DeadlineType, DeadlineCreationAttributes> implements DeadlineType {
  public deadline_id!: number;
  public user_id!: number;
  public module_id?: number;
  public project_id?: number;
  public title!: string;
  public description?: string;
  public due_date!: Date;
  public created_at!: Date;
  public updated_at!: Date;

  // Associations
  static associate(models: any) {
    Deadline.belongsTo(models.User, { foreignKey: 'user_id' });
    Deadline.belongsTo(models.Module, { foreignKey: 'module_id' });
    Deadline.belongsTo(models.Project, { foreignKey: 'project_id' });
    Deadline.hasMany(models.Task, { foreignKey: 'deadline_id' });
  }
}

export default (sequelize: Sequelize) => {
  Deadline.init(
    {
      deadline_id: {
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
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Projects',
          key: 'project_id',
        },
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      due_date: {
        type: DataTypes.DATE,
        allowNull: false,
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
      modelName: 'Deadline',
      tableName: 'Deadlines',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Deadline;
};
