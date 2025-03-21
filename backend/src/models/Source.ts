import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import { Source as SourceType } from '../types/Source';

interface SourceCreationAttributes extends Optional<SourceType, 'source_id'> {}

class Source extends Model<SourceType, SourceCreationAttributes> implements SourceType {
  public source_id!: string;
  public status!: string;
  public project_id!: string;
  public source_file_id?: string;
  public text_file_id?: string;
  public summary_file_id?: string;
  public created_at!: Date;
  public updated_at!: Date;

  // Associations
  static associate(models: any) {
    // Associate with Project
    Source.belongsTo(models.Project, {
      foreignKey: 'project_id',
    });
    
    // Associate with Files for different purposes
    Source.belongsTo(models.File, {
      foreignKey: 'source_file_id',
    });
    
    Source.belongsTo(models.File, {
      foreignKey: 'text_file_id',
    });
    
    Source.belongsTo(models.File, {
      foreignKey: 'summary_file_id',
    });
  }
}

export default (sequelize: Sequelize) => {
  Source.init(
    {
      source_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      project_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Projects',
          key: 'project_id',
        },
      },
      status: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      source_file_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Files',
          key: 'file_id',
        },
      },
      text_file_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Files',
          key: 'file_id',
        },
      },
      summary_file_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Files',
          key: 'file_id',
        },
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
      modelName: 'Source',
      tableName: 'Sources',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Source;
};
