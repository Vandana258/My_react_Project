module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define("item", {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "id"
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "name"
      },
      phone: {
        type: DataTypes.STRING(15),
        allowNull: true,
        field: "phone",
      },
      image: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "image"
      },
      role: {
        type: DataTypes.ENUM,
        values:['SuperAdmin','Admin','Client'],
        allowNull: false,
        field: "role"
      },
      status: {
        type: DataTypes.ENUM,
        values: ['0', '1'],
        defaultValue: '1',
        field: "status"
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        timestamps: true,
        field: "createdAt"
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,      
        field: "updatedAt"
      }
    }
  );
  return Item;
};