import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import { PomodoroSession as PomodoroSessionType } from '../types/PomodoroSession';

interface PomodoroSessionCreationAttributes extends Optional<PomodoroSessionType, 'pomodoro_id'> {}

class PomodoroSession extends Model<PomodoroSessionType, PomodoroSessionCreationAttributes> implements PomodoroSessionType {
  public pomodoro_id!: number;
  public user_id!: number;
  public task_id!: number;
  public start_time!: Date;
  public end_time?: Date;
  public duration?: number;
  public created_at!: Date;
  public updated_at!: Date;

  // Associations
  static associate(models: any) {
    PomodoroSession.belongsTo(models.User, { foreignKey: 'user_id' });
    PomodoroSession.belongsTo(models.Task, { foreignKey: 'task_id' });
  }
}

export default (sequelize: Sequelize) => {
  PomodoroSession.init(
    {
      pomodoro_id: {
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
      task_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Tasks',
          key: 'task_id',
        },
      },
      start_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      duration: {
        type: DataTypes.INTEGER,
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
      modelName: 'PomodoroSession',
      tableName: 'PomodoroSessions',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return PomodoroSession;
};
