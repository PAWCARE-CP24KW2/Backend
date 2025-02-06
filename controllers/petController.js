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
    const userId = req.query.userId; // For demo purpose; replace with actual user session ID
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
        const user = await Pet.findUserByPetId(petId);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRecordsByPetId = async (req, res) => {
    const { petId } = req.params;
    try {
        const records = await Pet.findRecordsByPetId(petId);
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// exports.addPet = async (req, res) => {
//     const { pet_name, pet_type, pet_breed, pet_color, pet_gender, pet_space, pet_neutered, weight, date_of_birth } = req.body;
//     try {
//         const newPet = await Pet.create({ pet_export, pet_name, pet_type, pet_breed, pet_color, pet_gender, pet_space, pet_neutered, weight, date_of_birth });
//         res.status(201).json({ ...newPet });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
exports.addPet = async (req, res) => {
    const { pet_name, pet_type, pet_breed, pet_color, pet_gender, pet_space, pet_neutered, weight, date_of_birth } = req.body;
    const user_user_id = req.user.userId; // Extract user ID from the token
    try {
        const newPet = await Pet.create({ pet_name, pet_type, pet_breed, pet_color, pet_gender, pet_space, pet_neutered, weight, date_of_birth, user_user_id });
        res.status(201).json({ ...newPet });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// exports.exportPet = async (req, res) => {
//     const { petId } = req.params;
//     const gencode = crypto.randomBytes(8).toString('hex');
//     try {
//         await Pet.export({ pet_id: petId, gencode });
//         res.status(201).json({ gencode });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// exports.importPet = async (req, res) => {
//     const { gencode, userId } = req.body;
//     try {
//         const exportEntry = await Pet.findExportByGencode(gencode);
//         if (!exportEntry) {
//             return res.status(404).json({ message: 'Invalid gencode' });
//         }
//         await Pet.import({ user_id: userId, pet_id: exportEntry.pet_id });
//         res.status(201).json({ message: 'Pet added to user\'s list successfully' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// exports.addCalendar = async (req, res) => {
//     const { petId } = req.params;
//     const { event_title, event_description, event_start } = req.body;
//     try {
//         await Pet.addCalendar({ pet_id: petId, event_title, event_description, event_start });
//         res.status(201).json({ message: 'Calendar entry created successfully' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

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
    const { pet_export, pet_name, pet_type, pet_breed, pet_color, pet_gender, pet_space, pet_neutered, weight, date_of_birth } = req.body;
    try {
        const updated = await Pet.update(petId, { pet_export, pet_name, pet_type, pet_breed, pet_color, pet_gender, pet_space, pet_neutered, weight, date_of_birth });
        if (updated) res.json({ ...updated });
        else res.status(404).json({ message: 'Pet not found' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deletePet = async (req, res) => {
    const { petId } = req.params;
    try {
        // ลบแถวที่เกี่ยวข้องในตาราง user_has_pet ก่อน
        await Pet.deleteUserHasPetByPetId(petId);

        // ลบแถวที่เกี่ยวข้องในตาราง exports ก่อน
        await Pet.deleteExportsByPetId(petId);

        // ลบแถวที่เกี่ยวข้องในตาราง agenda ก่อน
        await Pet.deleteAgendaByPetId(petId);

        // ลบแถวในตาราง pet
        const deleted = await Pet.delete(petId);
        if (deleted) res.json({ message: 'Pet deleted successfully' });
        else res.status(404).json({ message: 'Pet not found' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};