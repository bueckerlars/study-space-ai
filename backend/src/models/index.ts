import { Sequelize } from 'sequelize';

import initUserModel from './User';
import initProjectModel from './Project';
import initDeadlineModel from './Deadline';
import initTaskModel from './Task';
import initPomodoroSessionModel from './PomodoroSession';
import initFileModel from './File';
import initSourceModel from './Source';
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
  const Source = initSourceModel(sequelize);

  // Set up associations
  if (typeof User.associate === 'function') User.associate({ Project, Deadline, Task, PomodoroSession, File });
  if (typeof Project.associate === 'function') Project.associate({ User, Deadline, Task });
  if (typeof Deadline.associate === 'function') Deadline.associate({ User, Project, Task });
  if (typeof Task.associate === 'function') Task.associate({ User, Project, Deadline, PomodoroSession });
  if (typeof PomodoroSession.associate === 'function') PomodoroSession.associate({ User, Task });
  if (typeof File.associate === 'function') File.associate({ User, Project });
  if (typeof Source.associate === 'function') Source.associate({ File });

  logger.info('Models initialized');
  return {
    User,
    Project,
    Deadline,
    Task,
    PomodoroSession,
    File,
    Source
  };
};

// Export individual model initializers
export {
  initUserModel,
  initProjectModel,
  initDeadlineModel,
  initTaskModel,
  initPomodoroSessionModel,
  initFileModel,
  initSourceModel
};

// Default export
export default initModels;
