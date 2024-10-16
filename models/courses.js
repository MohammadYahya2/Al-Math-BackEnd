module.exports = (sequelize, DataTypes) => {
  const courses = sequelize.define("courses", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    zoomLink: {
      type: DataTypes.STRING(255),
      allowNull: true, // Optional: Only needed for online courses
    },
    location: {
      type: DataTypes.ENUM("online", "onsite"),
      allowNull: false,
      validate: {
        isIn: [["online", "onsite"]], // Ensures only 'online' or 'onsite' is allowed
      },
    },
  });

  return courses;
};
