module.exports = (sequelize, DataTypes) => {
  const legalDocs = sequelize.define("legalDocs", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    file: {
      type: DataTypes.BLOB("long"), // To store the file as binary data (for large files like PDFs)
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING, // For the document type (e.g., "contract", "agreement")
      allowNull: false,
    },
  });

  legalDocs.associate = function (models) {
    legalDocs.hasMany(models.comments, {
      foreignKey: "docId",
      onDelete: "CASCADE",
    });
  };
  return legalDocs;
};
