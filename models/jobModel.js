import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
{
     title: {
      type: String,
      required: true
    },

    company: {
      type: String,
      default: 'Marvel Tech Hub'
    },

    description: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true
    },

    location: {
      type: String
    },

    salary: {
      type: String
    },

    skills: [
      {
        type: String
      }
    ],

    experience: {
      type: String
    },

    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Remote', 'Internship'],
      default: 'Full-time'
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  
}, {timestamps: true});

const Job = mongoose.model("Job", jobSchema);
export default Job;