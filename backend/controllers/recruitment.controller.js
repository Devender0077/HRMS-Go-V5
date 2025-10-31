const fs = require('fs');
const path = require('path');
const { sequelize } = require('../config/syncDatabase');
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
    // Ensure association so we can include job title in the result
    try {
      JobApplication.belongsTo(JobPosting, { foreignKey: 'job_id', as: 'job' });
    } catch (err) {
      // ignore if association already exists
    }

    const applications = await JobApplication.findAll({
      include: [
        {
          model: JobPosting,
          as: 'job',
          attributes: ['id', 'title'],
        },
      ],
      order: [['applied_date', 'DESC']],
    });

    res.json({
      success: true,
      data: applications,
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
    // If a base64 resume was sent, decode and save it to uploads and set resume_path
    if (req.body.resume_base64) {
      try {
        const uploadsDir = path.join(__dirname, '..', 'uploads', 'resumes');
        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

        // resume_base64 may be a data URL (data:application/pdf;base64,AAAA..)
        const dataUrl = req.body.resume_base64;
        const matches = String(dataUrl).match(/^data:(.+);base64,(.+)$/);
        let buffer;
        if (matches) {
          buffer = Buffer.from(matches[2], 'base64');
        } else {
          // fallback: assume entire string is base64
          buffer = Buffer.from(dataUrl, 'base64');
        }

        // sanitize filename
        const original = req.body.resume_path || `resume-${Date.now()}.pdf`;
        const safeName = original.replace(/[^a-zA-Z0-9.\-_%]/g, '_');
        const filename = `${Date.now()}-${safeName}`;
        const filePath = path.join(uploadsDir, filename);
        fs.writeFileSync(filePath, buffer);

        // expose path relative to server root for static serving
        req.body.resume_path = `/uploads/resumes/${filename}`;
        // remove base64 payload to avoid storing large data in DB
        delete req.body.resume_base64;
      } catch (err) {
        console.error('Error saving resume file:', err);
        // continue - we don't want to block application creation if file save fails
      }
    }

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

