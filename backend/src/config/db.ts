import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  host: 'localhost',
  dialect: 'postgres',
  username: 'trademapUser',
  password: 'trademapPassword',
  database: 'trademapDB',
  logging: false,
});

export default sequelize;
