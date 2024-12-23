const path = require('path');

module.exports = {
  config: path.resolve('src/config/db.ts'),
  'models-path': path.resolve('src/models'),
  'migrations-path': path.resolve('src/config/database/migrations'),
};
