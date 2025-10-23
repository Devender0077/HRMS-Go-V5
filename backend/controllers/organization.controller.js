const db = require('../config/database');

// Build hierarchical organization structure
const buildHierarchy = (employees, parentId = null) => {
  const children = employees.filter(emp => {
    if (parentId === null) {
      return emp.manager_id === null || emp.manager_id === undefined;
    }
    return emp.manager_id === parentId;
  });

  return children.map(emp => ({
    id: emp.id,
    name: `${emp.first_name} ${emp.last_name}`,
    position: emp.designation_name || 'Employee',
    department: emp.department_name || 'N/A',
    email: emp.email,
    avatar: emp.profile_photo || '/assets/images/avatars/avatar_default.jpg',
    employee_id: emp.employee_id,
    children: buildHierarchy(employees, emp.id),
  }));
};

// Get organization hierarchy
exports.getOrganizationChart = async (req, res) => {
  try {
    // Fetch all employees with their department and designation names
    const [employees] = await db.execute(
      `SELECT 
        e.*,
        d.name as department_name,
        des.name as designation_name,
        b.name as branch_name
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN designations des ON e.designation_id = des.id
      LEFT JOIN branches b ON e.branch_id = b.id
      WHERE e.status = 'active'
      ORDER BY e.id`
    );

    // Build hierarchical structure
    const hierarchy = buildHierarchy(employees, null);

    res.json({
      success: true,
      organization: hierarchy.length > 0 ? hierarchy[0] : null, // Return top-level employee
      totalEmployees: employees.length,
    });
  } catch (error) {
    console.error('Get organization chart error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get organization statistics
exports.getOrganizationStats = async (req, res) => {
  try {
    const [[totalEmps]] = await db.execute('SELECT COUNT(*) as count FROM employees WHERE status = "active"');
    const [[totalDepts]] = await db.execute('SELECT COUNT(*) as count FROM departments WHERE status = "active"');
    const [[totalBranches]] = await db.execute('SELECT COUNT(*) as count FROM branches WHERE status = "active"');
    
    const [deptBreakdown] = await db.execute(
      `SELECT d.name as department, COUNT(e.id) as employee_count
       FROM departments d
       LEFT JOIN employees e ON d.id = e.department_id AND e.status = 'active'
       WHERE d.status = 'active'
       GROUP BY d.id
       ORDER BY employee_count DESC`
    );

    res.json({
      success: true,
      stats: {
        totalEmployees: totalEmps.count,
        totalDepartments: totalDepts.count,
        totalBranches: totalBranches.count,
        departmentBreakdown: deptBreakdown,
      },
    });
  } catch (error) {
    console.error('Get organization stats error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = exports;

