module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define("users", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  users.associate = function (models) {
    users.belongsTo(models.roles, { foreignKey: "roleId" });
    users.hasMany(models.comments, { foreignKey: "userId" }); // Association with comments table
  };

  users.addAdminUser = async (username, email, password) => {
    const adminRoleId = 1;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const newUser = await users.create({
        username,
        email,
        password: hashedPassword,
        roleId: adminRoleId,
      });
      return newUser;
    } catch (error) {
      console.error("Error creating admin user:", error);
      throw error;
    }
  };
  return users;
};
