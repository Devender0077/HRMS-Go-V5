const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');
const Leave = require('../models/Leave');
const JobPosting = require('../models/JobPosting');
const JobApplication = require('../models/JobApplication');
const TrainingProgram = require('../models/TrainingProgram');
const PerformanceGoal = require('../models/PerformanceGoal');
const sequelize = require('../config/database2');

const sampleEmployees = [
  {
    employeeId: 'EMP001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@hrmsgo.com',
    phone: '+1234567890',
    dateOfBirth: '1990-05-15',
    gender: 'male',
    joiningDate: '2024-01-15',
    departmentId: 1,
    branchId: 1,
    designationId: 1,
    status: 'Active',
    employmentType: 'full_time',
    basicSalary: 75000,
  },
  {
    employeeId: 'EMP002',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@hrmsgo.com',
    phone: '+1234567891',
    dateOfBirth: '1992-08-22',
    gender: 'female',
    joiningDate: '2024-02-01',
    departmentId: 2,
    branchId: 1,
    designationId: 2,
    status: 'Active',
    employmentType: 'full_time',
    basicSalary: 65000,
  },
  {
    employeeId: 'EMP003',
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@hrmsgo.com',
    phone: '+1234567892',
    dateOfBirth: '1988-12-10',
    gender: 'male',
    joiningDate: '2023-06-15',
    departmentId: 1,
    branchId: 2,
    designationId: 3,
    status: 'Active',
    employmentType: 'full_time',
    basicSalary: 85000,
  },
  {
    employeeId: 'EMP004',
    firstName: 'Sarah',
    lastName: 'Williams',
    email: 'sarah.williams@hrmsgo.com',
    phone: '+1234567893',
    dateOfBirth: '1995-03-18',
    gender: 'female',
    joiningDate: '2024-03-10',
    departmentId: 3,
    branchId: 1,
    designationId: 1,
    status: 'Active',
    employmentType: 'full_time',
    basicSalary: 60000,
  },
  {
    employeeId: 'EMP005',
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.brown@hrmsgo.com',
    phone: '+1234567894',
    dateOfBirth: '1991-07-25',
    gender: 'male',
    joiningDate: '2024-01-20',
    departmentId: 2,
    branchId: 2,
    designationId: 2,
    status: 'Active',
    employmentType: 'full_time',
    basicSalary: 70000,
  },
  {
    employeeId: 'EMP006',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@hrmsgo.com',
    phone: '+1234567895',
    dateOfBirth: '1993-11-05',
    gender: 'female',
    joiningDate: '2023-09-01',
    departmentId: 4,
    branchId: 1,
    designationId: 4,
    status: 'Active',
    employmentType: 'full_time',
    basicSalary: 72000,
  },
  {
    employeeId: 'EMP007',
    firstName: 'Robert',
    lastName: 'Miller',
    email: 'robert.miller@hrmsgo.com',
    phone: '+1234567896',
    dateOfBirth: '1989-04-30',
    gender: 'male',
    joiningDate: '2023-05-10',
    departmentId: 1,
    branchId: 3,
    designationId: 5,
    status: 'Active',
    employmentType: 'full_time',
    basicSalary: 90000,
  },
  {
    employeeId: 'EMP008',
    firstName: 'Lisa',
    lastName: 'Anderson',
    email: 'lisa.anderson@hrmsgo.com',
    phone: '+1234567897',
    dateOfBirth: '1994-09-14',
    gender: 'female',
    joiningDate: '2024-04-01',
    departmentId: 5,
    branchId: 1,
    designationId: 1,
    status: 'Active',
    employmentType: 'full_time',
    basicSalary: 58000,
  },
];

const sampleAttendance = async (employees) => {
  const attendanceRecords = [];
  const today = new Date();
  
  // Create attendance for last 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Random 70-90% attendance
    const presentCount = Math.floor(employees.length * (0.7 + Math.random() * 0.2));
    const presentEmployees = employees.slice(0, presentCount);
    
    for (const emp of presentEmployees) {
      const checkIn = new Date(dateStr);
      checkIn.setHours(9, 0, 0);
      const checkOut = new Date(dateStr);
      checkOut.setHours(18, 0, 0);
      
      attendanceRecords.push({
        employeeId: emp.id,
        date: dateStr,
        checkIn: checkIn,
        checkOut: checkOut,
        workDuration: 9.0,
        totalHours: 9.0,
        status: 'present',
      });
    }
  }
  
  return attendanceRecords;
};

const sampleLeaves = (employees) => {
  const leaves = [];
  const today = new Date();
  
  // Add 3 pending leaves
  leaves.push({
    employeeId: employees[0].id,
    leaveTypeId: 2,
    startDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    endDate: new Date(today.getTime() + 9 * 24 * 60 * 60 * 1000),
    days: 3,
    reason: 'Family vacation',
    status: 'pending',
  });

  leaves.push({
    employeeId: employees[1].id,
    leaveTypeId: 3,
    startDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
    endDate: new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000),
    days: 2,
    reason: 'Medical appointment',
    status: 'pending',
  });

  // Add 1 approved leave for today
  leaves.push({
    employeeId: employees[2].id,
    leaveTypeId: 2,
    startDate: today,
    endDate: today,
    days: 1,
    reason: 'Personal work',
    status: 'approved',
  });

  return leaves;
};

const sampleJobPostings = [
  {
    title: 'Senior Software Engineer',
    departmentId: 1,
    positionType: 'full_time',
    vacancies: 2,
    experienceRequired: '5 years',
    status: 'open',
    postedDate: new Date(),
  },
  {
    title: 'HR Manager',
    departmentId: 2,
    positionType: 'full_time',
    vacancies: 1,
    experienceRequired: '7 years',
    status: 'open',
    postedDate: new Date(),
  },
];

const sampleApplications = (jobPostings) => [
  {
    jobId: jobPostings[0].id,
    candidateName: 'Alex Thompson',
    candidateEmail: 'alex.thompson@email.com',
    candidatePhone: '+1234567898',
    status: 'pending',
    appliedDate: new Date(),
  },
  {
    jobId: jobPostings[0].id,
    candidateName: 'Maria Garcia',
    candidateEmail: 'maria.garcia@email.com',
    candidatePhone: '+1234567899',
    status: 'pending',
    appliedDate: new Date(),
  },
  {
    jobId: jobPostings[1].id,
    candidateName: 'James Wilson',
    candidateEmail: 'james.wilson@email.com',
    candidatePhone: '+1234567900',
    status: 'pending',
    appliedDate: new Date(),
  },
];

const sampleTrainings = [
  {
    title: 'Leadership Development Program',
    description: 'Enhance leadership skills',
    startDate: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000),
    endDate: new Date(new Date().getTime() + 16 * 24 * 60 * 60 * 1000),
    maxParticipants: 20,
    status: 'upcoming',
  },
  {
    title: 'Technical Skills Workshop',
    description: 'Latest technology training',
    startDate: new Date(new Date().getTime() + 21 * 24 * 60 * 60 * 1000),
    endDate: new Date(new Date().getTime() + 22 * 24 * 60 * 60 * 1000),
    maxParticipants: 30,
    status: 'upcoming',
  },
];

const sampleGoals = (employees) => [
  {
    employeeId: employees[0].id,
    title: 'Complete Project Alpha',
    description: 'Deliver project by Q2',
    targetDate: new Date(new Date().getTime() + 60 * 24 * 60 * 60 * 1000),
    status: 'active',
    createdBy: employees[0].id,
  },
  {
    employeeId: employees[1].id,
    title: 'Improve Team Productivity',
    description: 'Increase efficiency by 20%',
    targetDate: new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000),
    status: 'active',
    createdBy: employees[1].id,
  },
];

async function seedDashboardData() {
  try {
    console.log('🌱 Seeding dashboard data...\n');
    
    // Clear existing data
    console.log('Clearing existing data...');
    await PerformanceGoal.destroy({ where: {}, force: true });
    await TrainingProgram.destroy({ where: {}, force: true });
    await JobApplication.destroy({ where: {}, force: true });
    await JobPosting.destroy({ where: {}, force: true });
    await Leave.destroy({ where: {}, force: true });
    await Attendance.destroy({ where: {}, force: true });
    await Employee.destroy({ where: {}, force: true });
    
    console.log('✅ Cleared existing data\n');
    
    // Insert employees
    console.log('Creating employees...');
    const employees = await Employee.bulkCreate(sampleEmployees);
    console.log(`✅ Created ${employees.length} employees\n`);
    
    // Insert attendance
    console.log('Creating attendance records...');
    const attendanceRecords = await sampleAttendance(employees);
    await Attendance.bulkCreate(attendanceRecords);
    console.log(`✅ Created ${attendanceRecords.length} attendance records\n`);
    
    // Insert leaves
    console.log('Creating leave applications...');
    const leaves = sampleLeaves(employees);
    await Leave.bulkCreate(leaves);
    console.log(`✅ Created ${leaves.length} leave applications\n`);
    
    // Insert job postings
    console.log('Creating job postings...');
    const jobPostings = await JobPosting.bulkCreate(sampleJobPostings);
    console.log(`✅ Created ${jobPostings.length} job postings\n`);
    
    // Insert applications
    console.log('Creating job applications...');
    const applications = sampleApplications(jobPostings);
    await JobApplication.bulkCreate(applications);
    console.log(`✅ Created ${applications.length} job applications\n`);
    
    // Insert trainings
    console.log('Creating training programs...');
    await TrainingProgram.bulkCreate(sampleTrainings);
    console.log(`✅ Created ${sampleTrainings.length} training programs\n`);
    
    // Insert goals
    console.log('Creating performance goals...');
    const goals = sampleGoals(employees);
    await PerformanceGoal.bulkCreate(goals);
    console.log(`✅ Created ${goals.length} performance goals\n`);
    
    console.log('🎉 Dashboard data seeding completed successfully!');
    console.log('\nSummary:');
    console.log(`  - ${employees.length} Employees`);
    console.log(`  - ${attendanceRecords.length} Attendance Records`);
    console.log(`  - ${leaves.length} Leave Applications`);
    console.log(`  - ${jobPostings.length} Job Postings`);
    console.log(`  - ${applications.length} Job Applications`);
    console.log(`  - ${sampleTrainings.length} Training Programs`);
    console.log(`  - ${goals.length} Performance Goals`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding dashboard data:', error);
    process.exit(1);
  }
}

seedDashboardData();

