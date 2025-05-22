module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
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
      lastName: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "lastName"
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
          isEmail: {
            args: true,
            msg: "invalid email"
          }
        },
        field: "email"
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "password"
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
      address1: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "address1"
      },
      city: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "city"
      },
      state: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "state"
      },
      country: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "country"
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
      two_fa_secret:{
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "two_fa_secret"
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
      },
      deletedAt: {
        type: DataTypes.DATE,  
        allowNull: true,         
        field: "deletedAt"
      }
    }
  );
  return User;
};
  