"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.User, {
        as: "user",
        foreignKey: {
          name: "userId",
        },
      });
    }
  }
  Product.init(
    {
      title: DataTypes.STRING,
      price: DataTypes.STRING,
      image: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
