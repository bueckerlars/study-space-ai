import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import { Task as TaskType } from '../types/Task';

interface TaskCreationAttributes extends Optional<TaskType, 'task_id'> {}

class Task extends Model<TaskType, TaskCreationAttributes> implements TaskType {
  public task_id!: number;
  public user_id!: number;
  public project_id?: string;
  public deadline_id?: number;
  public title!: string;
  public description?: string;
  public is_completed?: boolean;
  public created_at!: Date;
  public updated_at!: Date;

  // Associations
  static associate(models: any) {
    Task.belongsTo(models.User, { foreignKey: 'user_id' });
    Task.belongsTo(models.Project, { foreignKey: 'project_id' });
    Task.belongsTo(models.Deadline, { foreignKey: 'deadline_id' });
    Task.hasMany(models.PomodoroSession, { foreignKey: 'task_id' });
  }
}

export default (sequelize: Sequelize) => {
  Task.init(
    {
      task_id: {
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
      project_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Projects',
          key: 'project_id',
        },
      },
      deadline_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Deadlines',
          key: 'deadline_id',
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
      is_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
      modelName: 'Task',
      tableName: 'Tasks',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Task;
};
