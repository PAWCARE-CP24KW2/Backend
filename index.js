// const express = require('express');
// const app = express();
// const db = require('./db');
// const apiForPet = require('./routers/pet');
// const agenda = require('./routers/agendas');
// const apiForUser = require('./routers/user');

// const crypto = require('crypto');
// const multer = require('multer');
// const Minio = require('minio');

// const minioClient = new Minio.Client({
//     endPoint: '172.18.0.2', // Replace with your MinIO endpoint
//     port: 9000, // Replace with your MinIO port
//     useSSL: true, // Set to false if not using SSL
//     accessKey: 'nTfIOmCSzNtpO3SvBPUu', // Replace with your MinIO access key
//     secretKey: 'fN1r0xqyQvT2hzsjzgB9r1F2mSVgp48s93FMFjfc' // Replace with your MinIO secret key
// });

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.set('view engine', 'hbs');

// app.get('/', (req, res) => {
//     res.send('Hello World! test nodemon');
// });

// // api/agendas update and delete Agendars
// app.use('/api/agendas', agenda);

// // api/pet crud pet
// app.use('/api/pet', apiForPet);

// // api/user crud user
// app.use('/api/user', apiForUser);

// app.listen(8080, () => {
//     console.log('Server is running on http://localhost:8080');
// });

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

app.listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
});