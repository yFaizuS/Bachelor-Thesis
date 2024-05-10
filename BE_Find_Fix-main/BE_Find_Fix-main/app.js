const express = require('express');
const userRoutes = require('./routes/userRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const orderRoutes = require('./routes/orderRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const app = express();
const dotenv = require('dotenv');
const port = parseInt(process.env.PORT) || 8080;
app.use(express.json());

app.use('/user', userRoutes);
app.use('/services', serviceRoutes);
app.use('/orders', orderRoutes);
app.use('/checkout',checkoutRoutes);
app.get("/", (req, res, next) => {
  res.json("API is online");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});