module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      mobilenumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "users",
      timestamps: true, // adds createdAt, updatedAt
    }
  );

  //   // Associations (if needed later)
  //   User.associate = (models) => {
  //     // Example: User.hasMany(models.Post);
  //   };

  return User;
};
