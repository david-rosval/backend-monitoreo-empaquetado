import mongoose from 'mongoose'

const registeredPackageSchema = new mongoose.Schema({
  weight: {
    type: Number,
    required: true,
  },
  isValid: {
    type: Boolean,
    required: true,
  }
}, { timestamps: true })

export const RegisteredPackage = mongoose.models.RegisteredPackage || mongoose.model('RegisteredPackage', registeredPackageSchema)
 
