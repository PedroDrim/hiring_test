const app = require("./app")
const connectDB = require('./config/database');

const PORT = process.env.PORT || 5000;
connectDB(process.env.MONGODB_URI).then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})