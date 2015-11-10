var bcrypt = require('bcrypt');

'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true, len: [1, 50] }},
    password: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true }},
    bio: { type: DataTypes.STRING, validate: { len: [0, 300] }},
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Post);
        User.hasMany(models.Comment);
        User.belongsToMany(models.Post, { through: 'PostVotes' });
      },
      generateHash : function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
      },
    },
    instanceMethods: {
      validPassword : function(password) {
        return bcrypt.compareSync(password, this.password);
      }
    }
  });
  return User;
};
