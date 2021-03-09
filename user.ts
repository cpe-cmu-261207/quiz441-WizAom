const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

class User extends Model {}
User.init({
  username: DataTypes.STRING,
  password: DataTypes.STRING,
  firstname: DataTypes.STRING,
  lastname: DataTypes.STRING,
  balance: DataTypes.number
}, { sequelize, modelName: 'user' });
(async () => {
    await sequelize.sync();
    const test = await User.create({
      username: '',
      password: '',
      firstname: '',
      lastname: '',
      balance: ''
    });
    console.log(test.toJSON());
  })();