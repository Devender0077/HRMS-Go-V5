const GeneralSetting = require('../models/GeneralSetting');
const { Op } = require('sequelize');

/**
 * Get all settings
 */
exports.getAll = async (req, res) => {
  try {
    const { category, is_public } = req.query;
    
    const whereClause = { status: 'active' };
    if (category) {
      whereClause.category = category;
    }
    if (is_public !== undefined) {
      whereClause.isPublic = is_public === 'true';
    }

    const settings = await GeneralSetting.findAll({
      where: whereClause,
      order: [['category', 'ASC'], ['settingKey', 'ASC']],
    });

    // Group settings by category
    const grouped = {};
    const raw = [];
    
    settings.forEach(setting => {
      const category = setting.category;
      if (!grouped[category]) {
        grouped[category] = {};
      }
      grouped[category][setting.settingKey] = setting.settingValue;
      raw.push({
        id: setting.id,
        setting_key: setting.settingKey,
        setting_value: setting.settingValue,
        category: setting.category,
        description: setting.description,
        type: setting.type,
      });
    });

    // Calculate category counts
    const categoryCounts = {};
    settings.forEach(setting => {
      const cat = setting.category;
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    res.json({
      success: true,
      settings: grouped,
      raw,
      total: settings.length,
      categoryCounts,
      categories: Object.keys(grouped).length,
    });
  } catch (error) {
    console.error('Get all settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching settings',
      error: error.message,
    });
  }
};

/**
 * Get settings by category
 */
exports.getByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const settings = await GeneralSetting.findAll({
      where: {
        category,
        status: 'active',
      },
      order: [['settingKey', 'ASC']],
    });

    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.settingKey] = setting.settingValue;
    });

    res.json({
      success: true,
      category,
      settings: settingsObj,
      raw: settings,
    });
  } catch (error) {
    console.error('Get category settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category settings',
      error: error.message,
    });
  }
};

/**
 * Get single setting by key
 */
exports.getByKey = async (req, res) => {
  try {
    const { key } = req.params;
    
    const setting = await GeneralSetting.findOne({
      where: { settingKey: key, status: 'active' },
    });

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: 'Setting not found',
      });
    }

    res.json({
      success: true,
      setting: {
        key: setting.settingKey,
        value: setting.settingValue,
        category: setting.category,
        description: setting.description,
        type: setting.type,
      },
    });
  } catch (error) {
    console.error('Get setting by key error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching setting',
      error: error.message,
    });
  }
};

/**
 * Create or update a setting
 */
exports.upsert = async (req, res) => {
  try {
    const { key, value, category, description, type, is_public } = req.body;

    if (!key) {
      return res.status(400).json({
        success: false,
        message: 'Setting key is required',
      });
    }

    const [setting, created] = await GeneralSetting.upsert({
      settingKey: key,
      settingValue: value,
      category: category || 'general',
      description,
      type: type || 'text',
      isPublic: is_public || false,
      status: 'active',
    }, {
      returning: true,
    });

    res.json({
      success: true,
      message: created ? 'Setting created successfully' : 'Setting updated successfully',
      setting: {
        id: setting.id,
        key: setting.settingKey,
        value: setting.settingValue,
        category: setting.category,
      },
    });
  } catch (error) {
    console.error('Upsert setting error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving setting',
      error: error.message,
    });
  }
};

/**
 * Update multiple settings at once
 */
exports.updateMultiple = async (req, res) => {
  try {
    const { settings } = req.body;

    if (!Array.isArray(settings) || settings.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Settings array is required',
      });
    }

    const results = [];
    
    for (const item of settings) {
      const [setting] = await GeneralSetting.upsert({
        settingKey: item.key,
        settingValue: item.value,
        category: item.category || 'general',
        description: item.description,
        type: item.type || 'text',
        isPublic: item.is_public || false,
        status: 'active',
      }, {
        returning: true,
      });
      
      results.push(setting);
    }

    res.json({
      success: true,
      message: `${results.length} settings updated successfully`,
      updated: results.length,
    });
  } catch (error) {
    console.error('Update multiple settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating settings',
      error: error.message,
    });
  }
};

/**
 * Delete a setting
 */
exports.delete = async (req, res) => {
  try {
    const { key } = req.params;

    const deleted = await GeneralSetting.destroy({
      where: { settingKey: key },
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Setting not found',
      });
    }

    res.json({
      success: true,
      message: 'Setting deleted successfully',
    });
  } catch (error) {
    console.error('Delete setting error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting setting',
      error: error.message,
    });
  }
};

/**
 * Get public settings (for frontend use)
 */
exports.getPublic = async (req, res) => {
  try {
    const settings = await GeneralSetting.findAll({
      where: {
        isPublic: true,
        status: 'active',
      },
    });

    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.settingKey] = setting.settingValue;
    });

    res.json({
      success: true,
      settings: settingsObj,
    });
  } catch (error) {
    console.error('Get public settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching public settings',
      error: error.message,
    });
  }
};
