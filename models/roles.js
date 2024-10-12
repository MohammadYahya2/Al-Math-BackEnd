module.exports = (sequelize, DataTypes) => {
  const roles = sequelize.define(
    "roles",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: false,
    }
  );
  roles.associate = function (models) {
    roles.hasMany(models.users, { foreignKey: "roleId" });
  };

  roles.addDefaultRoles = async () => {
    const rolesList = ["admin", "basic"];
    for (const roleName of rolesList) {
      await roles.findOrCreate({
        where: { name: roleName },
        defaults: { name: roleName },
      });
    }
  };

  return roles;
};
