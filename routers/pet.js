const express = require('express');
const router = express.Router();
const db = require('../db');

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

// Method: GET
router.get('/my', async (req, res) => {
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
router.get('/:petId', async (req, res) => {
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
router.get('/:petId/calendars', async (req, res) => {
    const { petId } = req.params;
    try {
        const calendars = await db('agenda').where({ user_has_pet_pet_pet_id: petId });
        res.json(calendars);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:petId/agendas', async (req, res) => {
    const { petId } = req.params;

    try {
        // Retrieve the agenda entries from the database
        const agendas = await db('agenda')
            .where({ user_has_pet_pet_pet_id: petId })
            .select('agenda_id', 'agenda_title', 'agenda_message', 'status', 'appointment', 'created_at');

        res.status(200).json(agendas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//pass Get pet/id/user
router.get('/:petId/users', async (req, res) => {
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
router.get('/:petId/records', async (req, res) => {
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
router.post('/addPet', async (req, res) => {
    const { pet_id, pet_export, pet_name, pet_type, pet_breed, weight, date_of_birth } = req.body;
    try {
        await db('pet').insert({ pet_id, pet_export, pet_name, pet_type, pet_breed, weight, date_of_birth, created_at: new Date() });
        res.status(201).json({ message: 'Pet registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//pass Post/pet/id/export *แต่อาจจะมีอะไรเพิ่มเติม
router.post('/:petId/exports', async (req, res) => {
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
router.post('/import', async (req, res) => {
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
router.post('/:petId/calendars', async (req, res) => {
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

router.post('/:petId/agendas', async (req, res) => {
    const { petId } = req.params;
    const { event_title, event_description, event_start, status } = req.body;

    try {
        // Insert the agenda entry into the database
        await db('agenda').insert({
            agenda_title: event_title,
            agenda_message: event_description,
            appointment: new Date(event_start),
            status: status || 'Scheduled', // Provide a default value if not provided
            user_has_pet_pet_pet_id: petId,
            created_at: new Date()
        });

        res.status(201).json({ message: 'Agenda entry created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:petId/documents', upload.single('document'), async (req, res) => {
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
router.put('/:petId', async (req, res) => {
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
router.delete('/:petId', async (req, res) => {
    const { petId } = req.params;
    try {
        const deleted = await db('pet').where({ pet_id: petId }).del();
        if (deleted) res.json({ message: 'Pet deleted successfully' });
        else res.status(404).json({ message: 'Pet not found' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;