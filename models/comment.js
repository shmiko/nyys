'use strict';
module.exports = function(sequelize, DataTypes) {
  var Comment = sequelize.define('Comment', {
    content: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        Comment.hasMany(models.Comment);
        Comment.belongsTo(models.User, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });
        Comment.belongsTo(models.Post, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: true
          }
        });
      }
    }
  });
  return Comment;
};
