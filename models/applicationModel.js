import mongoose from 'mongoose'

const applicationSchema = new mongoose.Schema(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: false
    },

    coverLetter: {
      type: String
    },

    experience: {
      type: String
    },

    resume: {
      type: String
    },

    resumeMimeType: {
      type: String
    },

    status: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Accepted', 'Rejected'],
      default: 'Pending'
    },

    meta: {
      country: String,
      state: String,
      address: String,
      techStack: String,
      qualification: String,
      institution: String,
      gradYear: String,
      availability: String,
      workPreference: String,
    }
  },
  {
    timestamps: true
  }
)

const Application = mongoose.model(
  'Application',
  applicationSchema
)

export default Application