require('dotenv').config();
const express = require('express');
const app = express();
const agendaRoutes = require('./routes/agendaRoutes');
const petRoutes = require('./routes/petRoutes');
const userRoutes = require('./routes/userRoutes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/agendas', agendaRoutes);
app.use('/api/pet', petRoutes);
app.use('/api/user', userRoutes);

const port = process.env.SERVER_PORT;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});