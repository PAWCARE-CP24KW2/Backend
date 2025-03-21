require('dotenv').config();
const Pet = require('../models/petModel');
const multer = require("multer");
const minioClient = require("../config/minioClient");
const upload = multer({ storage: multer.memoryStorage() });


exports.getAllPets = async (req, res) => {
    try {
        const pets = await Pet.findAll();
        res.status(200).json(pets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMyPets = async (req, res) => {
    const { userId } = req.user;
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
    const { userId } = req.user;
    const { pet_name, pet_type, pet_breed, pet_color, pet_gender, pet_space, pet_neutered, weight, date_of_birth } = req.body;
    const file = req.file;
  
    try {
      let profilePath = null;
  
      if (file) {
        const bucketName = "profilepet";
        const objectName = `${Date.now()}-${file.originalname}`;
  
        const bucketExists = await minioClient.bucketExists(bucketName);
        if (!bucketExists) {
          await minioClient.makeBucket(bucketName, "us-east-1");
        }
  
        await minioClient.putObject(bucketName, objectName, file.buffer, file.size, {
          "Content-Type": file.mimetype,
          "Content-Disposition": "inline",
        });
  
        profilePath = `http://cp24kw2.sit.kmutt.ac.th:9001/api/v1/buckets/${bucketName}/objects/download?preview=true&prefix=${objectName}&version_id=null`;
      }
  
      const newPet = await Pet.create({
        pet_name,
        pet_type,
        pet_breed,
        pet_color,
        pet_gender,
        pet_space,
        pet_neutered,
        weight,
        date_of_birth,
        user_id: userId,
        profile_path: profilePath,
      });
  
      res.status(201).json({ ...newPet });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

exports.upload = upload.single('profile_picture');

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
        // Delete related documents first
        await Pet.deleteDocumentsByPetId(petId);

        // Delete related agenda entries
        await Pet.deleteAgendaByPetId(petId);

        // Then delete the pet
        const deleted = await Pet.delete(petId);
        if (deleted) res.json({ message: 'Pet deleted successfully' });
        else res.status(404).json({ message: 'Pet not found' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.uploadGalleryImage = upload.single('gallery_image');

exports.addGalleryImage = async (req, res) => {
  const { petId } = req.params;
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const bucketName = "gallery";
  const objectName = `${Date.now()}-${file.originalname}`;

  try {
    const bucketExists = await minioClient.bucketExists(bucketName);
    if (!bucketExists) {
      await minioClient.makeBucket(bucketName, "us-east-1");
    }

    await minioClient.putObject(bucketName, objectName, file.buffer, file.size, {
      "Content-Type": file.mimetype,
      "Content-Disposition": "inline",
    });

    const fileUrl = `http://cp24kw2.sit.kmutt.ac.th:9001/api/v1/buckets/${bucketName}/objects/download?preview=true&prefix=${objectName}&version_id=null`;

    await Gallery.create({
      pet_id: petId,
      gallery_path: fileUrl,
    });

    res.status(201).json({
      message: "File uploaded successfully",
      file: { bucketName, objectName, url: fileUrl },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};