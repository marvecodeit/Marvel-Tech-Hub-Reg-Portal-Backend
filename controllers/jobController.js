import Job from '../models/jobModel.js';
// Create  job
export const createJob = async (req, res) => {
    try {
        const { 
      title,
      description,
      category,
      location,
      salary,
      skills,
      experience,
      jobType } = req.body;

        const existing = await Job.findOne({ title: { $regex: new RegExp(`^${title}$`, 'i') } });
        if (existing) {
          return res.status(400).json({ message: 'A job with this title already exists' });
        }

        const job = await Job.create({
            title,
      description,
      category,
      location,
      salary,
      skills,
      experience,
      jobType,
      createdBy: req.user._id
        });
        res.status(201).json(job);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Get All Jobs
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate(
      'createdBy',
      'fullname email'
    )

    res.status(200).json(jobs)
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

// Get Single Job
export const getSingleJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({
        message: 'Job not found'
      })
    }

    res.status(200).json(job)
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

// Delete Job
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({
        message: 'Job not found'
      })
    }

    await job.deleteOne()

    res.status(200).json({
      message: 'Job deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}