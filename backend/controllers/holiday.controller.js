const Holiday = require('../models/Holiday');
const { Op } = require('sequelize');

// Get all holidays with filters
exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, region, year, status } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    
    if (type) where.type = type;
    
    // Region filtering for JSON arrays - use LIKE to search within JSON
    if (region && region !== 'all') {
      where.region = {
        [Op.like]: `%"${region}"%` // Search for region within JSON array
      };
    }
    
    // Only filter by status if explicitly provided
    if (status) where.status = status;
    
    // Filter by year if provided
    if (year) {
      where.date = {
        [Op.between]: [`${year}-01-01`, `${year}-12-31`]
      };
    }

    const { count, rows } = await Holiday.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['date', 'ASC']],
    });

    console.log(`📅 [Holidays] Fetched ${rows.length} holidays (page ${page}, total: ${count})`);

    res.json({
      success: true,
      holidays: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('❌ [Holidays] Error fetching holidays:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch holidays',
      error: error.message,
    });
  }
};

// Get holiday by ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const holiday = await Holiday.findByPk(id);

    if (!holiday) {
      return res.status(404).json({
        success: false,
        message: 'Holiday not found',
      });
    }

    res.json({
      success: true,
      holiday,
    });
  } catch (error) {
    console.error('Error fetching holiday:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch holiday',
      error: error.message,
    });
  }
};

// Create new holiday
exports.create = async (req, res) => {
  try {
    const holidayData = req.body;
    
    console.log('📅 [Holidays] Creating holiday with data:', holidayData);
    console.log('📅 [Holidays] Region type:', typeof holidayData.region, 'Value:', holidayData.region);
    
    // Check for duplicate holiday on same date
    const existing = await Holiday.findOne({
      where: {
        date: holidayData.date,
        name: holidayData.name,
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Holiday with same name and date already exists',
      });
    }

    const holiday = await Holiday.create(holidayData);
    
    console.log('✅ [Holidays] Holiday created successfully:', holiday.id);

    res.status(201).json({
      success: true,
      message: 'Holiday created successfully',
      holiday,
    });
  } catch (error) {
    console.error('❌ [Holidays] Error creating holiday:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create holiday',
      error: error.message,
    });
  }
};

// Update holiday
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log('📅 [Holidays] Updating holiday ID:', id);
    console.log('📅 [Holidays] Update data:', updateData);
    console.log('📅 [Holidays] Region type:', typeof updateData.region, 'Value:', updateData.region);

    const holiday = await Holiday.findByPk(id);

    if (!holiday) {
      return res.status(404).json({
        success: false,
        message: 'Holiday not found',
      });
    }

    await holiday.update(updateData);
    
    console.log('✅ [Holidays] Holiday updated successfully:', id);

    res.json({
      success: true,
      message: 'Holiday updated successfully',
      holiday,
    });
  } catch (error) {
    console.error('❌ [Holidays] Error updating holiday:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update holiday',
      error: error.message,
    });
  }
};

// Delete holiday
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const holiday = await Holiday.findByPk(id);

    if (!holiday) {
      return res.status(404).json({
        success: false,
        message: 'Holiday not found',
      });
    }

    await holiday.destroy();

    res.json({
      success: true,
      message: 'Holiday deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting holiday:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete holiday',
      error: error.message,
    });
  }
};

// Get upcoming holidays
exports.getUpcoming = async (req, res) => {
  try {
    const { limit = 5, region } = req.query;
    const today = new Date().toISOString().split('T')[0];

    const where = {
      date: {
        [Op.gte]: today,
      },
      status: 'active',
    };

    if (region && region !== 'all') {
      where.region = {
        [Op.like]: `%"${region}"%` // Search for region within JSON array
      };
    }

    const holidays = await Holiday.findAll({
      where,
      limit: parseInt(limit),
      order: [['date', 'ASC']],
    });

    res.json({
      success: true,
      holidays,
    });
  } catch (error) {
    console.error('Error fetching upcoming holidays:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch upcoming holidays',
      error: error.message,
    });
  }
};

// Bulk import holidays
exports.bulkImport = async (req, res) => {
  try {
    const { holidays } = req.body;

    if (!Array.isArray(holidays) || holidays.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of holidays',
      });
    }

    const created = await Holiday.bulkCreate(holidays, {
      validate: true,
      ignoreDuplicates: true,
    });

    res.status(201).json({
      success: true,
      message: `${created.length} holidays imported successfully`,
      holidays: created,
    });
  } catch (error) {
    console.error('Error importing holidays:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to import holidays',
      error: error.message,
    });
  }
};

