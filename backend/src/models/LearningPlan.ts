import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import { LearningPlan as LearningPlanType } from '../types/LearningPlan';

interface LearningPlanCreationAttributes extends Optional<LearningPlanType, 'learning_plan_id'> {}

class LearningPlan extends Model<LearningPlanType, LearningPlanCreationAttributes> implements LearningPlanType {
  public learning_plan_id!: number;
  public user_id!: number;
  public name!: string;
  public description?: string;
  public created_at!: Date;
  public updated_at!: Date;

  // Associations
  static associate(models: any) {
    LearningPlan.belongsTo(models.User, { foreignKey: 'user_id' });
    LearningPlan.hasMany(models.LearningPlanContent, { foreignKey: 'learning_plan_id' });
    LearningPlan.hasMany(models.Task, { foreignKey: 'learning_plan_id' });
  }
}

export default (sequelize: Sequelize) => {
  LearningPlan.init(
    {
      learning_plan_id: {
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
      modelName: 'LearningPlan',
      tableName: 'LearningPlans',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return LearningPlan;
};
