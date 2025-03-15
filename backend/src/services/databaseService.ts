import { Sequelize, Model, ModelStatic, Transaction, Op, WhereOptions, FindOptions } from 'sequelize';
import databaseConfig from '../config/databaseConfig';
import logger from './logger';

class DatabaseService {
  private sequelize: Sequelize;
  private models: Map<string, ModelStatic<Model>> = new Map();
  private isConnected: boolean = false;

  constructor() {
    logger.info('Initializing DatabaseService');
    this.sequelize = new Sequelize(
      databaseConfig.database,
      databaseConfig.username,
      databaseConfig.password,
      {
        host: databaseConfig.host,
        dialect: databaseConfig.dialect,
        logging: (msg) => logger.debug(msg),
      }
    );
  }

  /**
   * Establishes connection to the database
   */
  public async connect(): Promise<boolean> {
    try {
      await this.sequelize.authenticate();
      this.isConnected = true;
      logger.info('Database connection established successfully');
      return true;
    } catch (error) {
      this.isConnected = false;
      logger.error(`Unable to connect to the database: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }

  /**
   * Closes the database connection
   */
  public async disconnect(): Promise<void> {
    if (this.isConnected) {
      try {
        await this.sequelize.close();
        this.isConnected = false;
        logger.info('Database connection closed successfully');
      } catch (error) {
        logger.error(`Error closing database connection: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  /**
   * Returns the Sequelize instance
   */
  public getSequelize(): Sequelize {
    return this.sequelize;
  }

  /**
   * Register a model with the service
   */
  public registerModel(name: string, model: ModelStatic<Model>): void {
    logger.debug(`Registering model: ${name}`);
    this.models.set(name, model);
  }

  /**
   * Get a registered model by name
   */
  public getModel(name: string): ModelStatic<Model> | undefined {
    const model = this.models.get(name);
    if (!model) {
      logger.warn(`Model not found: ${name}`);
    }
    return model;
  }

  /**
   * Create a new record
   */
  public async create<T extends Model>(modelName: string, data: any): Promise<T | null> {
    try {
      const model = this.getModel(modelName);
      if (!model) {
        return null;
      }

      logger.debug(`Creating record in ${modelName}: ${JSON.stringify(data)}`);
      const result = await model.create(data);
      return result as unknown as T;
    } catch (error) {
      logger.error(`Error creating record in ${modelName}: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Find all records matching the criteria
   */
  public async findAll<T extends Model>(modelName: string, options: FindOptions = {}): Promise<T[]> {
    try {
      const model = this.getModel(modelName);
      if (!model) {
        return [];
      }

      logger.debug(`Finding all records in ${modelName} with options: ${JSON.stringify(options)}`);
      const results = await model.findAll(options);
      return results as unknown as T[];
    } catch (error) {
      logger.error(`Error fetching records from ${modelName}: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Find a record by primary key
   */
  public async findByPk<T extends Model>(modelName: string, id: string | number): Promise<T | null> {
    try {
      const model = this.getModel(modelName);
      if (!model) {
        return null;
      }

      logger.debug(`Finding record in ${modelName} with ID: ${id}`);
      const result = await model.findByPk(id);
      return result as unknown as T;
    } catch (error) {
      logger.error(`Error fetching record from ${modelName} with ID ${id}: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Find a single record matching the criteria
   */
  public async findOne<T extends Model>(modelName: string, options: FindOptions): Promise<T | null> {
    try {
      const model = this.getModel(modelName);
      if (!model) {
        return null;
      }

      logger.debug(`Finding one record in ${modelName} with options: ${JSON.stringify(options)}`);
      const result = await model.findOne(options);
      return result as unknown as T;
    } catch (error) {
      logger.error(`Error fetching record from ${modelName}: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Update records matching the criteria
   */
  public async update(modelName: string, data: any, where: WhereOptions): Promise<[number, Model[]]> {
    try {
      const model = this.getModel(modelName);
      if (!model) {
        return [0, []];
      }

      logger.debug(`Updating records in ${modelName} where ${JSON.stringify(where)} with data: ${JSON.stringify(data)}`);
      return await model.update(data, { where, returning: true });
    } catch (error) {
      logger.error(`Error updating records in ${modelName}: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Delete records matching the criteria
   */
  public async destroy(modelName: string, where: WhereOptions): Promise<number> {
    try {
      const model = this.getModel(modelName);
      if (!model) {
        return 0;
      }

      logger.debug(`Deleting records from ${modelName} where: ${JSON.stringify(where)}`);
      return await model.destroy({ where });
    } catch (error) {
      logger.error(`Error deleting records from ${modelName}: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Start a new transaction
   */
  public async transaction<T>(callback: (transaction: Transaction) => Promise<T>): Promise<T> {
    try {
      logger.debug('Starting database transaction');
      return await this.sequelize.transaction(callback);
    } catch (error) {
      logger.error(`Transaction failed: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Execute a raw SQL query
   */
  public async query(sql: string, options: any = {}): Promise<any> {
    try {
      logger.debug(`Executing raw SQL query: ${sql}`);
      return await this.sequelize.query(sql, options);
    } catch (error) {
      logger.error(`Error executing SQL query: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Sync all models with the database
   */
  public async syncModels(force: boolean = false): Promise<void> {
    try {
      logger.info(`Syncing database models (force: ${force})`);
      await this.sequelize.sync({ force });
      logger.info('Database sync completed successfully');
    } catch (error) {
      logger.error(`Error syncing database models: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }
}

// Create and export a singleton instance
export const databaseService = new DatabaseService();

// Also export the class for testing and specialized instances
export default databaseService;
