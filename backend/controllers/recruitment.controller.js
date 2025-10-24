const JobPosting = require('../models/JobPosting');
const JobApplication = require('../models/JobApplication');

// Get all job postings
exports.getAllJobPostings = async (req, res) => {
  try {
    const jobs = await JobPosting.findAll({
      order: [['created_at', 'DESC']],
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job postings', error: error.message });
  }
};

// Create job posting
exports.createJobPosting = async (req, res) => {
  try {
    const job = await JobPosting.create(req.body);
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error creating job posting', error: error.message });
  }
};

// Update job posting
exports.updateJobPosting = async (req, res) => {
  try {
    const { id } = req.params;
    await JobPosting.update(req.body, { where: { id } });
    const updated = await JobPosting.findByPk(id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating job posting', error: error.message });
  }
};

// Delete job posting
exports.deleteJobPosting = async (req, res) => {
  try {
    const { id } = req.params;
    await JobPosting.destroy({ where: { id } });
    res.json({ message: 'Job posting deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job posting', error: error.message });
  }
};

// Get all applications
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await JobApplication.findAll({
      order: [['applied_date', 'DESC']],
    });
    res.json({
      success: true,
      data: applications
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching applications', 
      error: error.message 
    });
  }
};

// Create application
exports.createApplication = async (req, res) => {
  try {
    const application = await JobApplication.create(req.body);
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Error creating application', error: error.message });
  }
};

// Update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await JobApplication.update({ status }, { where: { id } });
    const updated = await JobApplication.findByPk(id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating application', error: error.message });
  }
};

// Get application counts by status
exports.getApplicationStats = async (req, res) => {
  try {
    const stats = await JobApplication.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      group: ['status'],
    });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};

