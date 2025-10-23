const { DataTypes } = require('sequelize');
const sequelize = require('../config/database2');

const Employee = sequelize.define('Employee', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
    field: 'user_id',
  },
  employeeId: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    field: 'employee_id',
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'first_name',
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'last_name',
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'date_of_birth',
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: true,
  },
  maritalStatus: {
    type: DataTypes.ENUM('single', 'married', 'divorced', 'widowed'),
    allowNull: true,
    field: 'marital_status',
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  state: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  postalCode: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'postal_code',
  },
  branchId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
    field: 'branch_id',
  },
  departmentId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
    field: 'department_id',
  },
  designationId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
    field: 'designation_id',
  },
  joiningDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'joining_date',
  },
  employmentType: {
    type: DataTypes.ENUM('full_time', 'part_time', 'contract', 'intern'),
    defaultValue: 'full_time',
    field: 'employment_type',
  },
  basicSalary: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
    field: 'basic_salary',
  },
  managerId: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true,
    field: 'manager_id',
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'terminated'),
    defaultValue: 'active',
  },
  terminationDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'termination_date',
  },
  terminationReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'termination_reason',
  },
  profilePhoto: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'profile_photo',
  },
  // Bank Details
  bankName: {
    type: DataTypes.STRING(200),
    allowNull: true,
    field: 'bank_name',
  },
  accountNumber: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'account_number',
  },
  routingNumber: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'routing_number',
  },
  swiftCode: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'swift_code',
  },
  bankAddress: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'bank_address',
  },
  // Additional Employment Details
  shift: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  attendancePolicy: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'attendance_policy',
  },
  paymentMethod: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'Bank Transfer',
    field: 'payment_method',
  },
  // Personal Details
  bloodGroup: {
    type: DataTypes.STRING(10),
    allowNull: true,
    field: 'blood_group',
  },
  nationality: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  // Emergency Contact
  emergencyContactName: {
    type: DataTypes.STRING(200),
    allowNull: true,
    field: 'emergency_contact_name',
  },
  emergencyContactPhone: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'emergency_contact_phone',
  },
  emergencyContactRelation: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'emergency_contact_relation',
  },
}, {
  tableName: 'employees',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['employee_id'] },
    { fields: ['status'] },
    { fields: ['department_id'] },
    { fields: ['branch_id'] },
    { fields: ['email'] },
  ],
});

// Virtual field for full name
Employee.prototype.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

module.exports = Employee;

