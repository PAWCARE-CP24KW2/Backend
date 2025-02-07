require('dotenv').config();
const Pet = require('../models/petModel');
const crypto = require('crypto');
const Minio = require('minio');

const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT, 10),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY
});

exports.getAllPets = async (req, res) => {
    try {
        const pets = await Pet.findAll();
        res.status(200).json(pets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMyPets = async (req, res) => {
    const { userId } = req.params;
    try {
        const pets = await Pet.findByUserId(userId);
        res.json(pets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPetById = async (req, res) => {
    const { petId } = req.params;
    try {
        const pet = await Pet.findById(petId);
        if (pet) res.json(pet);
        else res.status(404).json({ message: 'Pet not found' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUsersByPetId = async (req, res) => {
    const { petId } = req.params;
    try {
        const users = await Pet.findUsersByPetId(petId);
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// exports.getRecordsByPetId = async (req, res) => {
//     const { petId } = req.params;
//     try {
//         const records = await Pet.findRecordsByPetId(petId);
//         res.json(records);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

exports.addPet = async (req, res) => {
    const { pet_name, pet_type, pet_breed, pet_color, pet_gender, pet_space, pet_neutered, weight, date_of_birth, user_id  } = req.body;
    try {
        const newPet = await Pet.create({ pet_name, pet_type, pet_breed, pet_color, pet_gender, pet_space, pet_neutered, weight, date_of_birth, user_id  });
        res.status(201).json({ ...newPet });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// exports.uploadDocument = async (req, res) => {
//     const { petId } = req.params;
//     const file = req.file;
//     if (!file) {
//         return res.status(400).json({ message: 'No file uploaded' });
//     }
//     const bucketName = 'documents';
//     const objectName = `${Date.now()}-${file.originalname}`;
//     try {
//         const bucketExists = await minioClient.bucketExists(bucketName);
//         if (!bucketExists) {
//             await minioClient.makeBucket(bucketName, 'us-east-1');
//         }
//         await minioClient.putObject(bucketName, objectName, file.buffer, file.mimetype);
//         await Pet.uploadDocument({ pet_id: petId, file_path: `${bucketName}/${objectName}`, file_name: file.originalname });
//         res.status(201).json({ message: 'File uploaded successfully', file: { bucketName, objectName } });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

exports.updatePet = async (req, res) => {
    const { petId } = req.params;
    const { pet_name, pet_type, pet_breed, pet_color, pet_gender, pet_space, pet_neutered, weight, date_of_birth } = req.body;
    try {
        const updated = await Pet.update(petId, { pet_name, pet_type, pet_breed, pet_color, pet_gender, pet_space, pet_neutered, weight, date_of_birth });
        if (updated) res.json({ ...updated });
        else res.status(404).json({ message: 'Pet not found' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deletePet = async (req, res) => {
    const { petId } = req.params;
    try {
        const deleted = await Pet.delete(petId);
        if (deleted) res.json({ message: 'Pet deleted successfully' });
        else res.status(404).json({ message: 'Pet not found' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}