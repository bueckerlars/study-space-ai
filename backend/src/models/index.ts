import { Sequelize } from 'sequelize';

import initUserModel from './User';
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
  const Project = initProjectModel(sequelize);
  const Deadline = initDeadlineModel(sequelize);
  const Task = initTaskModel(sequelize);
  const PomodoroSession = initPomodoroSessionModel(sequelize);
  const File = initFileModel(sequelize);

  // Set up associations
  if (typeof User.associate === 'function') User.associate({ Project, Deadline, Task, PomodoroSession, File });
  if (typeof Project.associate === 'function') Project.associate({ User, Deadline, Task });
  if (typeof Deadline.associate === 'function') Deadline.associate({ User, Project, Task });
  if (typeof Task.associate === 'function') Task.associate({ User, Project, Deadline, PomodoroSession });
  if (typeof PomodoroSession.associate === 'function') PomodoroSession.associate({ User, Task });
  if (typeof File.associate === 'function') File.associate({ User, Project });

  logger.info('Models initialized');
  return {
    User,
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
  initProjectModel,
  initDeadlineModel,
  initTaskModel,
  initPomodoroSessionModel,
  initFileModel
};

// Default export
export default initModels;
