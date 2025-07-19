const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const usageRoutes = require('./routes/usage');
const newConnectionRoute = require("./routes/newConnection");
const tariffRoutes = require("./routes/tariff");
const scheduleRoutes = require('./routes/schedule');
const fmeRoutes = require("./routes/fme");
const chatbotRoute = require('./routes/chatbot');
const adminRoutes = require('./routes/admin');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/api/auth', authRoutes);
app.use('/api/usage', usageRoutes);
app.use("/api/new-connection", newConnectionRoute);
app.use("/api/tariffs", tariffRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use("/api/fmes", fmeRoutes);
app.use("/api/chatbot", chatbotRoute); 
app.use("/api", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
