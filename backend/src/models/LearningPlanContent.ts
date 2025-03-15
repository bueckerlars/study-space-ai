import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import { LearningPlanContent as LearningPlanContentType } from '../types/LearningPlanContent';

interface LearningPlanContentCreationAttributes extends Optional<LearningPlanContentType, 'content_id'> {}

class LearningPlanContent extends Model<LearningPlanContentType, LearningPlanContentCreationAttributes> implements LearningPlanContentType {
  public content_id!: number;
  public learning_plan_id!: number;
  public title!: string;
  public url?: string;
  public order?: number;
  public created_at!: Date;
  public updated_at!: Date;

  // Associations
  static associate(models: any) {
    LearningPlanContent.belongsTo(models.LearningPlan, { foreignKey: 'learning_plan_id' });
  }
}

export default (sequelize: Sequelize) => {
  LearningPlanContent.init(
    {
      content_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      learning_plan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'LearningPlans',
          key: 'learning_plan_id',
        },
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      url: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      order: {
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
      modelName: 'LearningPlanContent',
      tableName: 'LearningPlanContent',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return LearningPlanContent;
};
