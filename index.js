const express = require('express');
const app = express();
const db = require('./db');

const crypto = require('crypto');
const multer = require('multer');
const Minio = require('minio');

const minioClient = new Minio.Client({
    endPoint: '172.18.0.2', // Replace with your MinIO endpoint
    port: 9000, // Replace with your MinIO port
    useSSL: true, // Set to false if not using SSL
    accessKey: 'nTfIOmCSzNtpO3SvBPUu', // Replace with your MinIO access key
    secretKey: 'fN1r0xqyQvT2hzsjzgB9r1F2mSVgp48s93FMFjfc' // Replace with your MinIO secret key
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.send('Hello World! test nodemon');
});

// -------------------- User API --------------------
// Method: GET
// pass Get user/id
app.get('/api/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await db('user').where({ user_id: userId }).first();
        if (user) res.json(user);
        else res.status(404).json({ message: 'User not found' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Method: POST
//pass Post user/register
app.post('/api/user/register', async (req, res) => {
    const { username, password, email, user_firstname, user_lastname, user_phone } = req.body;
    try {
        const [userId] = await db('user').insert({
            username, password, email, user_firstname, user_lastname, user_phone, create_at: new Date()
        });
        res.status(201).json({ message: 'User registered successfully', userId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//pass Post user/auth/login
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await db('user').where({ username, password }).first();
        if (user) res.json({ message: 'Login successful', user });
        else res.status(401).json({ message: 'Invalid username or password' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Method: PUT
//pass Put user/id
app.put('/api/user/:userId', async (req, res) => {
    const { userId } = req.params;
    const { username, password, email, user_firstname, user_lastname, user_phone } = req.body;
    try {
        const updated = await db('user').where({ user_id: userId }).update({
            username, password, email, user_firstname, user_lastname, user_phone
        });
        if (updated) res.json({ message: 'User updated successfully' });
        else res.status(404).json({ message: 'User not found' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Method: DELETE
//pass Delete user/id
app.delete('/api/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        // Delete data in the comment table linked to posts
        await db('comment').whereIn('post_post_id', function() {
            this.select('post_id').from('post').where('user_user_id', userId);
        }).del();

        // Delete data in the category table linked to posts
        await db('category').whereIn('post_post_id', function() {
            this.select('post_id').from('post').where('user_user_id', userId);
        }).del();
        
        // Delete data in the post table linked to the user
        await db('post').where({ user_user_id: userId }).del();
        
        // Delete data in the user table
        const deleted = await db('user').where({ user_id: userId }).del();
        if (deleted) res.json({ message: 'User deleted successfully' });
        else res.status(404).json({ message: 'User not found' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});





// --------------------------------------------------

// -------------------- Pet API ---------------------
// Method: GET
app.get('/api/pet/my', async (req, res) => {
    // Assuming user ID is available in request (e.g., from session)
    const userId = req.query.userId; // For demo purpose; replace with actual user session ID
    try {
        const pets = await db('user_has_pet')
            .join('pet', 'user_has_pet.pet_pet_id', '=', 'pet.pet_id')
            .where({ user_userฟำ_คต_ภง_id: uตวบงฝๆไserId });
        res.json(pets);
    } catch (error) {
        res.status(500).json({ error: erจror.message });
    }
});

//pass Get pet/id
app.get('/api/pet/:petId', async (req, res) => {
    const { petId } = req.params;
    try {
        const pet = await db('pet').where({ pet_id: petId }).first();
        if (pet) res.json(pet);
        else res.status(404).json({ message: 'Pet not found' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//pass Get pet/id/calendar
app.get('/api/pet/:petId/calendars', async (req, res) => {
    const { petId } = req.params;
    try {
        const calendars = await db('agenda').where({ user_has_pet_pet_pet_id: petId });
        res.json(calendars);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//pass Get pet/id/user
app.get('/api/pet/:petId/users', async (req, res) => {
    const { petId } = req.params;
    try {
        const users = await db('user_has_pet')
            .join('user', 'user_has_pet.user_user_id', '=', 'user.user_id')
            .where({ pet_pet_id: petId });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//pass Get pet/id/records
app.get('/api/pet/:petId/records', async (req, res) => {
    const { petId } = req.params;
    try {
        const records = await db('agenda').where({ user_has_pet_pet_pet_id: petId });
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Method: POST
//pass Post /pet
app.post('/api/pet', async (req, res) => {
    const { pet_id, pet_export, pet_name, pet_type, pet_breed, weight, date_of_birth } = req.body;
    try {
        await db('pet').insert({ pet_id, pet_export, pet_name, pet_type, pet_breed, weight, date_of_birth, created_at: new Date() });
        res.status(201).json({ message: 'Pet registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//pass Post/pet/id/export *แต่อาจจะมีอะไรเพิ่มเติม
app.post('/api/pet/:petId/exports', async (req, res) => {
    const { petId } = req.params;

    // Generate a unique gencode
    const gencode = crypto.randomBytes(8).toString('hex');

    try {
        // Insert the export entry into the database
        await db('exports').insert({
            pet_id: petId,
            gencode: gencode,
            created_at: new Date()
        });

        res.status(201).json({ message: 'Export entry created successfully', gencode });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//pass Post/pet/id/import *แต่อาจจะมีอะไรเพิ่มเติม
app.post('/api/pet/import', async (req, res) => {
    const { gencode, userId } = req.body;

    try {
        // Find the export entry by gencode
        const exportEntry = await db('exports').where({ gencode }).first();

        if (!exportEntry) {
            return res.status(404).json({ message: 'Invalid gencode' });
        }

        // Add the pet to the user's list
        await db('user_has_pet').insert({
            user_user_id: userId,
            pet_pet_id: exportEntry.pet_id,
            created_at: new Date()
        });

        res.status(201).json({ message: 'Pet added to user\'s list successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//pass Post/pet/id/calendars *แต่อาจจะมีอะไรเพิ่มเติม
app.post('/api/pet/:petId/calendars', async (req, res) => {
    const { petId } = req.params;
    const { event_title, event_description, event_start } = req.body;

    try {
        // Insert the calendar entry into the database
        await db('calendar').insert({
            pet_id: petId,
            event_title: event_title,
            event_description: event_description,
            event_start: new Date(event_start),
            created_at: new Date()
        });

        res.status(201).json({ message: 'Calendar entry created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/pet/:petId/documents', upload.single('document'), async (req, res) => {
    const { petId } = req.params;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const bucketName = 'documents';
    const objectName = `${Date.now()}-${file.originalname}`;

    try {
        // Ensure the bucket exists
        const bucketExists = await minioClient.bucketExists(bucketName);
        if (!bucketExists) {
            await minioClient.makeBucket(bucketName, 'us-east-1');
        }

        // Upload the file to MinIO
        await minioClient.putObject(bucketName, objectName, file.buffer, file.mimetype);

        // Insert the document entry into the database
        await db('documents').insert({
            pet_id: petId,
            file_path: `${bucketName}/${objectName}`,
            file_name: file.originalname,
            created_at: new Date()
        });

        res.status(201).json({ message: 'File uploaded successfully', file: { bucketName, objectName } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Method: PUT
app.put('/api/pet/:petId', async (req, res) => {
    const { petId } = req.params;
    const { pet_export, pet_name, pet_type, pet_breed, weight, date_of_birth } = req.body;
    try {
        const updated = await db('pet').where({ pet_id: petId }).update({ pet_export, pet_name, pet_type, pet_breed, weight, date_of_birth });
        if (updated) res.json({ message: 'Pet updated successfully' });
        else res.status(404).json({ message: 'Pet not found' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Method: DELETE
app.delete('/api/pet/:petId', async (req, res) => {
    const { petId } = req.params;
    try {
        const deleted = await db('pet').where({ pet_id: petId }).del();
        if (deleted) res.json({ message: 'Pet deleted successfully' });
        else res.status(404).json({ message: 'Pet not found' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --------------------------------------------------

app.listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
});