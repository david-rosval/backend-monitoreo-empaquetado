import mongoose from 'mongoose'

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI ?? '')
    console.log('Conectado a MongoDB')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error) {
    console.log(error)
  }
}

export default connectDb