const express = require('express');
const userRoutes = require('./routes/userRoutes');
const providerRoutes = require('./routes/providerRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const app = express();
const dotenv = require('dotenv');
const port = parseInt(process.env.PORT) || 8080;
app.use(express.json());

app.use('/user', userRoutes);
app.use('/providers', providerRoutes);
app.use('/services', serviceRoutes);
app.use('/orders', orderRoutes);
app.use('/reviews', reviewRoutes);

app.get("/", (req, res, next) => {
  res.json("API is online");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});