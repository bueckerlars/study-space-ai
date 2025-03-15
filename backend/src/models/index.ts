import { Sequelize } from 'sequelize';

import initUserModel from './User';
import initModuleModel from './Module';
import initProjectModel from './Project';
import initDeadlineModel from './Deadline';
import initTaskModel from './Task';
import initLearningPlanModel from './LearningPlan';
import initLearningPlanContentModel from './LearningPlanContent';
import initPomodoroSessionModel from './PomodoroSession';

// Function to initialize all models
export const initModels = (sequelize: Sequelize) => {
  // Initialize models
  const User = initUserModel(sequelize);
  const Module = initModuleModel(sequelize);
  const Project = initProjectModel(sequelize);
  const Deadline = initDeadlineModel(sequelize);
  const Task = initTaskModel(sequelize);
  const LearningPlan = initLearningPlanModel(sequelize);
  const LearningPlanContent = initLearningPlanContentModel(sequelize);
  const PomodoroSession = initPomodoroSessionModel(sequelize);

  // Set up associations
  if (typeof User.associate === 'function') User.associate({ Module, Project, Deadline, Task, LearningPlan, PomodoroSession });
  if (typeof Module.associate === 'function') Module.associate({ User, Project, Deadline, Task });
  if (typeof Project.associate === 'function') Project.associate({ User, Module, Deadline, Task });
  if (typeof Deadline.associate === 'function') Deadline.associate({ User, Module, Project, Task });
  if (typeof Task.associate === 'function') Task.associate({ User, Module, Project, Deadline, LearningPlan, PomodoroSession });
  if (typeof LearningPlan.associate === 'function') LearningPlan.associate({ User, LearningPlanContent, Task });
  if (typeof LearningPlanContent.associate === 'function') LearningPlanContent.associate({ LearningPlan });
  if (typeof PomodoroSession.associate === 'function') PomodoroSession.associate({ User, Task });

  return {
    User,
    Module, 
    Project,
    Deadline,
    Task,
    LearningPlan,
    LearningPlanContent,
    PomodoroSession
  };
};

// Export individual model initializers
export {
  initUserModel,
  initModuleModel,
  initProjectModel,
  initDeadlineModel,
  initTaskModel,
  initLearningPlanModel,
  initLearningPlanContentModel,
  initPomodoroSessionModel
};

// Default export
export default initModels;
