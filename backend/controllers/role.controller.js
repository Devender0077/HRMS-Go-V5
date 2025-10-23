const Role = require('../models/Role');
const Permission = require('../models/Permission');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// Get all roles
exports.getAll = async (req, res) => {
  try {
    const { status, search } = req.query;
    const where = {};

    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { slug: { [Op.like]: `%${search}%` } },
      ];
    }

    const roles = await Role.findAll({
      where,
      order: [['created_at', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: { roles },
    });
  } catch (error) {
    console.error('Get roles error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching roles',
      error: error.message,
    });
  }
};

// Get role by ID with permissions
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found',
      });
    }

    // Get role permissions
    const [permissions] = await sequelize.query(`
      SELECT p.* FROM permissions p
      INNER JOIN role_permissions rp ON p.id = rp.permission_id
      WHERE rp.role_id = ?
    `, { replacements: [id] });

    res.status(200).json({
      success: true,
      data: { 
        role,
        permissions,
      },
    });
  } catch (error) {
    console.error('Get role error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching role',
      error: error.message,
    });
  }
};

// Create role
exports.create = async (req, res) => {
  try {
    const { name, slug, description, status, permissions } = req.body;

    // Check if role already exists
    const existing = await Role.findOne({ 
      where: { 
        [Op.or]: [{ name }, { slug }],
      },
    });
    
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Role with this name or slug already exists',
      });
    }

    const role = await Role.create({
      name,
      slug,
      description,
      status: status || 'active',
      is_system: false,
    });

    // Assign permissions if provided
    if (permissions && permissions.length > 0) {
      const values = permissions.map(permId => 
        `(${role.id}, ${permId}, NOW(), NOW())`
      ).join(',');
      
      await sequelize.query(`
        INSERT INTO role_permissions (role_id, permission_id, created_at, updated_at)
        VALUES ${values}
      `);
    }

    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: { role },
    });
  } catch (error) {
    console.error('Create role error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating role',
      error: error.message,
    });
  }
};

// Update role
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, status, permissions } = req.body;

    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found',
      });
    }

    // Check if system role
    if (role.is_system && (name !== role.name || slug !== role.slug)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify system role name or slug',
      });
    }

    // Check for duplicate name/slug
    if (name !== role.name || slug !== role.slug) {
      const existing = await Role.findOne({
        where: {
          id: { [Op.ne]: id },
          [Op.or]: [{ name }, { slug }],
        },
      });
      
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Role with this name or slug already exists',
        });
      }
    }

    await role.update({ name, slug, description, status });

    // Update permissions if provided
    if (permissions !== undefined) {
      // Delete existing permissions
      await sequelize.query(
        'DELETE FROM role_permissions WHERE role_id = ?',
        { replacements: [id] }
      );

      // Add new permissions
      if (permissions.length > 0) {
        const values = permissions.map(permId =>
          `(${id}, ${permId}, NOW(), NOW())`
        ).join(',');

        await sequelize.query(`
          INSERT INTO role_permissions (role_id, permission_id, created_at, updated_at)
          VALUES ${values}
        `);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Role updated successfully',
      data: { role },
    });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating role',
      error: error.message,
    });
  }
};

// Delete role
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found',
      });
    }

    // Check if system role
    if (role.is_system) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete system role',
      });
    }

    // Check if role is assigned to users
    const [userCount] = await sequelize.query(
      'SELECT COUNT(*) as count FROM user_roles WHERE role_id = ?',
      { replacements: [id] }
    );

    if (userCount[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete role that is assigned to users',
      });
    }

    await role.destroy();

    res.status(200).json({
      success: true,
      message: 'Role deleted successfully',
    });
  } catch (error) {
    console.error('Delete role error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting role',
      error: error.message,
    });
  }
};

// Get role statistics
exports.getStatistics = async (req, res) => {
  try {
    const [stats] = await sequelize.query(`
      SELECT 
        COUNT(*) as total_roles,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_roles,
        SUM(CASE WHEN is_system = 1 THEN 1 ELSE 0 END) as system_roles,
        SUM(CASE WHEN is_system = 0 THEN 1 ELSE 0 END) as custom_roles
      FROM roles
    `);

    res.status(200).json({
      success: true,
      data: stats[0],
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message,
    });
  }
};

