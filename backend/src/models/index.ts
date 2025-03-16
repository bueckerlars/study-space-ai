import { Sequelize } from 'sequelize';

import initUserModel from './User';
import initModuleModel from './Module';
import initProjectModel from './Project';
import initDeadlineModel from './Deadline';
import initTaskModel from './Task';
import initPomodoroSessionModel from './PomodoroSession';
import initFileModel from './File';
import logger from '../services/logger';

// Function to initialize all models
export const initModels = (sequelize: Sequelize) => {
  // Initialize models
  const User = initUserModel(sequelize);
  const Module = initModuleModel(sequelize);
  const Project = initProjectModel(sequelize);
  const Deadline = initDeadlineModel(sequelize);
  const Task = initTaskModel(sequelize);
  const PomodoroSession = initPomodoroSessionModel(sequelize);
  const File = initFileModel(sequelize);

  // Set up associations
  if (typeof User.associate === 'function') User.associate({ Module, Project, Deadline, Task, PomodoroSession, File });
  if (typeof Module.associate === 'function') Module.associate({ User, Project, Deadline, Task });
  if (typeof Project.associate === 'function') Project.associate({ User, Module, Deadline, Task });
  if (typeof Deadline.associate === 'function') Deadline.associate({ User, Module, Project, Task });
  if (typeof Task.associate === 'function') Task.associate({ User, Module, Project, Deadline, PomodoroSession });
  if (typeof PomodoroSession.associate === 'function') PomodoroSession.associate({ User, Task });
  if (typeof File.associate === 'function') File.associate({ User });

  logger.info('Models initialized');
  return {
    User,
    Module, 
    Project,
    Deadline,
    Task,
    PomodoroSession,
    File
  };
};

// Export individual model initializers
export {
  initUserModel,
  initModuleModel,
  initProjectModel,
  initDeadlineModel,
  initTaskModel,
  initPomodoroSessionModel,
  initFileModel
};

// Default export
export default initModels;
