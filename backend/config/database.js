const mongoose = require('mongoose')

const connectDB = async (uri) => {
  if (mongoose.connection.readyState === 1) return

  try {
    await mongoose.connect(uri)
    console.log('MongoDB connected')
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }
}

module.exports = connectDB