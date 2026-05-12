import Application from '../models/applicationModel.js';
import Job from '../models/jobModel.js';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

// Apply For Job — auto-creates user account if not exists
export const applyForJob = async (req, res) => {
  try {
    const {
      jobId,
      fullName,
      email,
      phone,
      country,
      state,
      address,
      experience,
      skills,
      techStack,
      portfolio,
      github,
      linkedin,
      qualification,
      institution,
      gradYear,
      whyHire,
      strongestProject,
      availability,
      workPreference,
    } = req.body;

    // Validate required fields
    if (!fullName || !email) {
      return res.status(400).json({ message: 'Full name and email are required' });
    }

    // Find Job — optional, support general applications
    let job = null;
    if (jobId) {
      job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({ message: 'Selected job not found' });
      }
    }

    // Find or auto-create applicant user
    let applicant = await User.findOne({ email });

    if (!applicant) {
      const salt = await bcrypt.genSalt(10);
      // Temporary password — applicant can request reset later
      const hashedPassword = await bcrypt.hash(email + Date.now(), salt);

      applicant = await User.create({
        fullname: fullName,
        email,
        phone: phone || '',
        password: hashedPassword,
        role: 'applicant',
        skills: skills ? (Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim())) : [],
        portfolio: portfolio || '',
        github: github || '',
        linkedin: linkedin || '',
      });
    }

    // Prevent duplicate application (only if a specific job was selected)
    if (jobId && job) {
      const existing = await Application.findOne({ applicant: applicant._id, job: jobId });
      if (existing) {
        return res.status(400).json({ message: 'You already applied for this job' });
      }
    }

    const resumeUrl = req.file ? req.file.path : '';
    const resumeMimeType = req.file ? req.file.mimetype : '';
    const coverLetter = [whyHire, strongestProject].filter(Boolean).join('\n\n');

    const application = await Application.create({
      applicant: applicant._id,
      job: job ? job._id : undefined,
      coverLetter,
      experience: experience || '',
      resume: resumeUrl,
      resumeMimeType,
      meta: {
        country, state, address,
        techStack, qualification, institution, gradYear,
        availability, workPreference,
      },
    });

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get My Applications (logged-in user)
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('job', 'title category location salary');
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Applications (Admin)
export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('applicant', 'fullname email phone skills portfolio github linkedin')
      .populate('job', 'title category location salary')
      .sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Application Status (Admin)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;
    await application.save();

    res.status(200).json({ message: 'Status updated', application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
