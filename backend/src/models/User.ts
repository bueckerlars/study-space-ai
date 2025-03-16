import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import { User as UserType } from '../types/User';

interface UserCreationAttributes extends Optional<UserType, 'user_id'> {}

class User extends Model<UserType, UserCreationAttributes> implements UserType {
  public user_id!: number;
  public email!: string;
  public password!: string;
  public username!: string;
  public role!: string;
  public created_at!: Date;
  public updated_at!: Date;

  // Associations
  static associate(models: any) {
    User.hasMany(models.Project, { foreignKey: 'user_id' });
    User.hasMany(models.Deadline, { foreignKey: 'user_id' });
    User.hasMany(models.Task, { foreignKey: 'user_id' });
    User.hasMany(models.PomodoroSession, { foreignKey: 'user_id' });
    User.hasMany(models.File, { foreignKey: 'user_id' });
  }
}

export default (sequelize: Sequelize) => {
  User.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'user',
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
      modelName: 'User',
      tableName: 'Users',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return User;
};
