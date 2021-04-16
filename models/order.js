"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.Product, {
        as: "product",
        foreignKey: {
          name: "productId",
        },
      });
      Order.belongsTo(models.Transaction, {
        as: "transaction",
        foreignKey: {
          name: "transactionId",
        },
      });
    }
  }
  Order.init(
    {
      qty: DataTypes.INTEGER,
      productId: DataTypes.INTEGER,
      transactionId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
