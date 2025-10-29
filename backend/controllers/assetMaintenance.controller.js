const AssetMaintenance = require('../models/AssetMaintenance');
const Asset = require('../models/Asset');
const { Op } = require('sequelize');

// Get all maintenance records
exports.getAll = async (req, res) => {
  try {
    const { status, asset_id, maintenance_type } = req.query;
    const where = {};

    if (status) where.status = status;
    if (asset_id) where.asset_id = asset_id;
    if (maintenance_type) where.maintenance_type = maintenance_type;

    const maintenance = await AssetMaintenance.findAll({
      where,
      include: [
        {
          model: Asset,
          as: 'asset',
          attributes: ['id', 'asset_code', 'asset_name'],
        },
      ],
      order: [['start_date', 'DESC']],
    });

    console.log(`✅ Found ${maintenance.length} maintenance records`);

    res.status(200).json({
      success: true,
      data: maintenance, // Return array directly
    });
  } catch (error) {
    console.error('Get maintenance records error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching maintenance records',
      error: error.message,
    });
  }
};

// Get maintenance by ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const maintenance = await AssetMaintenance.findByPk(id);

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance record not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { maintenance },
    });
  } catch (error) {
    console.error('Get maintenance record error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching maintenance record',
      error: error.message,
    });
  }
};

// Create maintenance record
exports.create = async (req, res) => {
  try {
    const {
      asset_id,
      maintenance_type,
      title,
      description,
      service_provider,
      contact_person,
      contact_phone,
      start_date,
      end_date,
      cost,
      status,
      priority,
      notes,
    } = req.body;

    // Check if asset exists
    const asset = await Asset.findByPk(asset_id);
    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found',
      });
    }

    const maintenance = await AssetMaintenance.create({
      asset_id,
      maintenance_type: maintenance_type || 'scheduled',
      title,
      description,
      service_provider,
      contact_person,
      contact_phone,
      start_date,
      end_date,
      cost: cost || 0,
      status: status || 'scheduled',
      priority: priority || 'medium',
      notes,
      created_by: req.user?.id || 1,
    });

    // Update asset status if maintenance is starting
    if (status === 'in_progress') {
      await asset.update({ current_status: 'under_maintenance' });
    }

    res.status(201).json({
      success: true,
      message: 'Maintenance record created successfully',
      data: { maintenance },
    });
  } catch (error) {
    console.error('Create maintenance record error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating maintenance record',
      error: error.message,
    });
  }
};

// Update maintenance record
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const maintenance = await AssetMaintenance.findByPk(id);

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance record not found',
      });
    }

    const oldStatus = maintenance.status;
    await maintenance.update(req.body);

    // Update asset status based on maintenance status
    const asset = await Asset.findByPk(maintenance.asset_id);
    if (asset) {
      if (req.body.status === 'in_progress' && oldStatus !== 'in_progress') {
        await asset.update({ current_status: 'under_maintenance' });
      } else if (req.body.status === 'completed' && oldStatus === 'in_progress') {
        // Check if asset has any other active maintenance
        const activeMaintenance = await AssetMaintenance.count({
          where: {
            asset_id: asset.id,
            status: 'in_progress',
            id: { [Op.ne]: id },
          },
        });
        if (activeMaintenance === 0) {
          await asset.update({ current_status: 'available' });
        }
      }
    }

    res.status(200).json({
      success: true,
      message: 'Maintenance record updated successfully',
      data: { maintenance },
    });
  } catch (error) {
    console.error('Update maintenance record error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating maintenance record',
      error: error.message,
    });
  }
};

// Delete maintenance record
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const maintenance = await AssetMaintenance.findByPk(id);

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance record not found',
      });
    }

    // If maintenance was in progress, check if asset should be set to available
    if (maintenance.status === 'in_progress') {
      const asset = await Asset.findByPk(maintenance.asset_id);
      if (asset) {
        const activeMaintenance = await AssetMaintenance.count({
          where: {
            asset_id: asset.id,
            status: 'in_progress',
            id: { [Op.ne]: id },
          },
        });
        if (activeMaintenance === 0) {
          await asset.update({ current_status: 'available' });
        }
      }
    }

    await maintenance.destroy();

    res.status(200).json({
      success: true,
      message: 'Maintenance record deleted successfully',
    });
  } catch (error) {
    console.error('Delete maintenance record error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting maintenance record',
      error: error.message,
    });
  }
};

// Get upcoming maintenance
exports.getUpcoming = async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const upcomingMaintenance = await AssetMaintenance.findAll({
      where: {
        status: 'scheduled',
        start_date: {
          [Op.between]: [today, thirtyDaysFromNow],
        },
      },
      order: [['start_date', 'ASC']],
    });

    res.status(200).json({
      success: true,
      data: { maintenance: upcomingMaintenance },
    });
  } catch (error) {
    console.error('Get upcoming maintenance error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching upcoming maintenance',
      error: error.message,
    });
  }
};

// Complete maintenance
exports.complete = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`✅ Completing maintenance record: ${id}`);
    
    const maintenance = await AssetMaintenance.findByPk(id);
    
    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance record not found',
      });
    }
    
    // Update status to completed and set end date
    await maintenance.update({
      status: 'completed',
      end_date: new Date(),
    });
    
    console.log(`✅ Maintenance record ${id} marked as completed`);
    
    res.status(200).json({
      success: true,
      message: 'Maintenance completed successfully',
      data: maintenance,
    });
  } catch (error) {
    console.error('Complete maintenance error:', error);
    res.status(500).json({
      success: false,
      message: 'Error completing maintenance',
      error: error.message,
    });
  }
};

