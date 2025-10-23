const express = require('express');
const router = express.Router();
const recruitmentController = require('../controllers/recruitment.controller');

// Job Postings
router.get('/jobs', recruitmentController.getAllJobPostings);
router.post('/jobs', recruitmentController.createJobPosting);
router.put('/jobs/:id', recruitmentController.updateJobPosting);
router.delete('/jobs/:id', recruitmentController.deleteJobPosting);

// Applications
router.get('/applications', recruitmentController.getAllApplications);
router.post('/applications', recruitmentController.createApplication);
router.put('/applications/:id/status', recruitmentController.updateApplicationStatus);
router.get('/applications/stats', recruitmentController.getApplicationStats);

module.exports = router;

