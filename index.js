require('dotenv').config();
const express = require('express');
const app = express();
const agendaRoutes = require('./routes/agendaRoutes');
const petRoutes = require('./routes/petRoutes');
const userRoutes = require('./routes/userRoutes');
const imageRoutes = require('./routes/imageRoutes');
const postRoutes = require('./routes/postRoutes');
const cors = require('cors');

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/agendas', agendaRoutes);
app.use('/api/pet', petRoutes);
app.use('/api/user', userRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/post', postRoutes);

const port = process.env.SERVER_PORT;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});