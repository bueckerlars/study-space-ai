import { FindOptions, WhereOptions } from 'sequelize';
import databaseService from '../services/databaseService';
import logger from '../services/logger';
import initModels from '../models';
import {
  User,
  Module,
  Project,
  Deadline,
  Task, 
  LearningPlan,
  LearningPlanContent,
  PomodoroSession
} from '../types';

// Initialize models
const models = initModels(databaseService.getSequelize());

/**
 * DatabaseController provides a simplified interface for database operations
 * across all models in the application
 */
export class DatabaseController {
  // Store model references
  private models = models;

  constructor() {
    databaseService.syncModels();
  }
  
  /**
   * Generic method to create a record of any model type
   */
  private async create<T>(modelName: string, data: Partial<T>): Promise<T | null> {
    try {
      return await databaseService.create<any>(modelName, data);
    } catch (error) {
      logger.error(`Error in DatabaseController.create: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Generic method to find all records of any model type
   */
  private async findAll<T>(modelName: string, options: FindOptions = {}): Promise<T[]> {
    try {
      return await databaseService.findAll<any>(modelName, options);
    } catch (error) {
      logger.error(`Error in DatabaseController.findAll: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Generic method to find a record by primary key
   */
  private async findById<T>(modelName: string, id: number | string): Promise<T | null> {
    try {
      return await databaseService.findByPk<any>(modelName, id);
    } catch (error) {
      logger.error(`Error in DatabaseController.findById: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Generic method to find a single record matching criteria
   */
  private async findOne<T>(modelName: string, options: FindOptions): Promise<T | null> {
    try {
      return await databaseService.findOne<any>(modelName, options);
    } catch (error) {
      logger.error(`Error in DatabaseController.findOne: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Generic method to update records matching criteria
   */
  private async update<T>(modelName: string, data: Partial<T>, where: WhereOptions): Promise<[number, any[]]> {
    try {
      return await databaseService.update(modelName, data, where);
    } catch (error) {
      logger.error(`Error in DatabaseController.update: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Generic method to delete records matching criteria
   */
  private async delete(modelName: string, where: WhereOptions): Promise<number> {
    try {
      return await databaseService.destroy(modelName, where);
    } catch (error) {
      logger.error(`Error in DatabaseController.delete: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  // Type-specific methods for better developer experience

  // User model methods
  public async createUser(data: Partial<User>): Promise<User | null> {
    return this.create<User>('User', data);
  }

  public async findAllUsers(options: FindOptions = {}): Promise<User[]> {
    return this.findAll<User>('User', options);
  }

  public async findUserById(id: number): Promise<User | null> {
    return this.findById<User>('User', id);
  }

  public async findUserByEmail(email: string): Promise<User | null> {
    return this.findOne<User>('User', { where: { email } });
  }

  public async updateUser(data: Partial<User>, where: WhereOptions): Promise<[number, User[]]> {
    return this.update<User>('User', data, where);
  }

  public async deleteUser(where: WhereOptions): Promise<number> {
    return this.delete('User', where);
  }

  // Module model methods
  public async createModule(data: Partial<Module>): Promise<Module | null> {
    return this.create<Module>('Module', data);
  }

  public async findAllModules(options: FindOptions = {}): Promise<Module[]> {
    return this.findAll<Module>('Module', options);
  }

  public async findModulesByUser(userId: number): Promise<Module[]> {
    return this.findAll<Module>('Module', { where: { user_id: userId } });
  }

  public async findModuleById(id: number): Promise<Module | null> {
    return this.findById<Module>('Module', id);
  }

  public async updateModule(data: Partial<Module>, where: WhereOptions): Promise<[number, Module[]]> {
    return this.update<Module>('Module', data, where);
  }

  public async deleteModule(where: WhereOptions): Promise<number> {
    return this.delete('Module', where);
  }

  // Project model methods
  public async createProject(data: Partial<Project>): Promise<Project | null> {
    return this.create<Project>('Project', data);
  }

  public async findAllProjects(options: FindOptions = {}): Promise<Project[]> {
    return this.findAll<Project>('Project', options);
  }

  public async findProjectsByUser(userId: number): Promise<Project[]> {
    return this.findAll<Project>('Project', { where: { user_id: userId } });
  }

  public async findProjectsByModule(moduleId: number): Promise<Project[]> {
    return this.findAll<Project>('Project', { where: { module_id: moduleId } });
  }

  public async findProjectById(id: number): Promise<Project | null> {
    return this.findById<Project>('Project', id);
  }

  public async updateProject(data: Partial<Project>, where: WhereOptions): Promise<[number, Project[]]> {
    return this.update<Project>('Project', data, where);
  }

  public async deleteProject(where: WhereOptions): Promise<number> {
    return this.delete('Project', where);
  }

  // Deadline model methods
  public async createDeadline(data: Partial<Deadline>): Promise<Deadline | null> {
    return this.create<Deadline>('Deadline', data);
  }

  public async findAllDeadlines(options: FindOptions = {}): Promise<Deadline[]> {
    return this.findAll<Deadline>('Deadline', options);
  }

  public async findDeadlinesByUser(userId: number): Promise<Deadline[]> {
    return this.findAll<Deadline>('Deadline', { where: { user_id: userId } });
  }

  public async findDeadlinesByModule(moduleId: number): Promise<Deadline[]> {
    return this.findAll<Deadline>('Deadline', { where: { module_id: moduleId } });
  }

  public async findDeadlinesByProject(projectId: number): Promise<Deadline[]> {
    return this.findAll<Deadline>('Deadline', { where: { project_id: projectId } });
  }

  public async findDeadlineById(id: number): Promise<Deadline | null> {
    return this.findById<Deadline>('Deadline', id);
  }

  public async updateDeadline(data: Partial<Deadline>, where: WhereOptions): Promise<[number, Deadline[]]> {
    return this.update<Deadline>('Deadline', data, where);
  }

  public async deleteDeadline(where: WhereOptions): Promise<number> {
    return this.delete('Deadline', where);
  }

  // Task model methods
  public async createTask(data: Partial<Task>): Promise<Task | null> {
    return this.create<Task>('Task', data);
  }

  public async findAllTasks(options: FindOptions = {}): Promise<Task[]> {
    return this.findAll<Task>('Task', options);
  }

  public async findTasksByUser(userId: number): Promise<Task[]> {
    return this.findAll<Task>('Task', { where: { user_id: userId } });
  }

  public async findTasksByModule(moduleId: number): Promise<Task[]> {
    return this.findAll<Task>('Task', { where: { module_id: moduleId } });
  }

  public async findTasksByProject(projectId: number): Promise<Task[]> {
    return this.findAll<Task>('Task', { where: { project_id: projectId } });
  }

  public async findTasksByDeadline(deadlineId: number): Promise<Task[]> {
    return this.findAll<Task>('Task', { where: { deadline_id: deadlineId } });
  }

  public async findCompletedTasks(userId: number): Promise<Task[]> {
    return this.findAll<Task>('Task', { where: { user_id: userId, is_completed: true } });
  }

  public async findIncompleteTasks(userId: number): Promise<Task[]> {
    return this.findAll<Task>('Task', { where: { user_id: userId, is_completed: false } });
  }

  public async findTaskById(id: number): Promise<Task | null> {
    return this.findById<Task>('Task', id);
  }

  public async updateTask(data: Partial<Task>, where: WhereOptions): Promise<[number, Task[]]> {
    return this.update<Task>('Task', data, where);
  }

  public async deleteTask(where: WhereOptions): Promise<number> {
    return this.delete('Task', where);
  }

  // PomodoroSession model methods
  public async createPomodoroSession(data: Partial<PomodoroSession>): Promise<PomodoroSession | null> {
    return this.create<PomodoroSession>('PomodoroSession', data);
  }

  public async findAllPomodoroSessions(options: FindOptions = {}): Promise<PomodoroSession[]> {
    return this.findAll<PomodoroSession>('PomodoroSession', options);
  }

  public async findPomodoroSessionsByUser(userId: number): Promise<PomodoroSession[]> {
    return this.findAll<PomodoroSession>('PomodoroSession', { where: { user_id: userId } });
  }

  public async findPomodoroSessionsByTask(taskId: number): Promise<PomodoroSession[]> {
    return this.findAll<PomodoroSession>('PomodoroSession', { where: { task_id: taskId } });
  }

  public async findActivePomodoroSessions(userId: number): Promise<PomodoroSession[]> {
    return this.findAll<PomodoroSession>('PomodoroSession', { 
      where: { 
        user_id: userId,
        end_time: null
      } 
    });
  }

  public async findPomodoroSessionById(id: number): Promise<PomodoroSession | null> {
    return this.findById<PomodoroSession>('PomodoroSession', id);
  }

  public async updatePomodoroSession(data: Partial<PomodoroSession>, where: WhereOptions): Promise<[number, PomodoroSession[]]> {
    return this.update<PomodoroSession>('PomodoroSession', data, where);
  }

  public async deletePomodoroSession(where: WhereOptions): Promise<number> {
    return this.delete('PomodoroSession', where);
  }
}

// Register models with database service
Object.entries(models).forEach(([name, model]) => {
  databaseService.registerModel(name, model);
});

// Create a singleton instance
export const databaseController = new DatabaseController();

export default databaseController;
