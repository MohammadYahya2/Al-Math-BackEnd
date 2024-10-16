const { legalDocs, users } = require("../models");

module.exports = (sequelize, DataTypes) => {
  const comments = sequelize.define("comments", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    docId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: legalDocs,
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: users,
        key: "id",
      },
    },
  });

  comments.associate = function (models) {
    comments.belongsTo(models.legalDocs, { foreignKey: "docId" });
    comments.belongsTo(models.users, { foreignKey: "userId" }); // Association with users table
  };

  return comments;
};
