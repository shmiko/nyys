'use strict';
module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define('Post', {
    title: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true, len: [1, 150] }},
    url: { type: DataTypes.STRING, validate: { len: [0, 500] }},
    content: { type: DataTypes.STRING, validate: { len: [0, 5000] }}
  }, {
    classMethods: {
      associate: function(models) {
        Post.belongsTo(models.User, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });
        Post.hasMany(models.Comment);
        Post.belongsToMany(models.User, { through: 'PostVotes' });
      }
    }
  });
  return Post;
};
