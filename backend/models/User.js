const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  userType: {
    type: DataTypes.ENUM('super_admin', 'admin', 'hr_manager', 'hr', 'manager', 'employee'),
    defaultValue: 'employee',
    field: 'user_type',
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  },
  emailVerifiedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'email_verified_at',
  },
  faceDescriptor: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'face_descriptor',
  },
  faceRegisteredAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'face_registered_at',
  },
  language: {
    type: DataTypes.STRING(10),
    defaultValue: 'en',
  },
  timezone: {
    type: DataTypes.STRING(100),
    defaultValue: 'UTC',
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  rememberToken: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'remember_token',
  },
}, {
  tableName: 'users',
  indexes: [
    { fields: ['email'] },
    { fields: ['user_type'] },
    { fields: ['status'] },
  ],
});

// Hash password before saving
User.beforeCreate(async (user) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

// Instance methods
User.prototype.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

User.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  delete values.password;
  delete values.rememberToken;
  return values;
};

module.exports = User;

