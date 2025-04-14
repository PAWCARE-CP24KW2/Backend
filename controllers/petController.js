require('dotenv').config();
const Pet = require('../models/petModel');
const Gallery = require('../models/galleryModels');
const multer = require("multer");
const minioClient = require("../config/minioClient");
const upload = multer({ storage: multer.memoryStorage() });
const QRCode = require('qrcode');

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

          profilePath = `https://capstone24.sit.kmutt.ac.th/kw2/minio/api/v1/buckets/${bucketName}/objects/download?preview=true&prefix=${objectName}&version_id=null`;
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

    //   const qrData = `http://localhost:5173/pet/${newPet.pet_id}`;
      const qrData = `https://capstone24.sit.kmutt.ac.th:443/kw2/pet/${newPet.pet_id}`;

      const qrCodeBase64 = await QRCode.toDataURL(qrData);

      const updatedRows = await Pet.updateQRCodePath(newPet.pet_id, qrCodeBase64);
      if (updatedRows === 0) {
          throw new Error('Failed to update QR Code in the database');
      }

      const updatedPet = await Pet.findById(newPet.pet_id);

      res.status(201).json({ message: 'Pet added successfully', pet: updatedPet });
  } catch (error) {
      console.error('Error in addPet:', error.message);
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
      const pet = await Pet.findById(petId);
      if (pet && pet.profile_path) {
          const profileUrl = new URL(pet.profile_path);
          const profileObjectName = profileUrl.searchParams.get('prefix');
          const profileBucketName = "profilepet";

          await minioClient.removeObject(profileBucketName, profileObjectName);
      }

      const galleryImages = await Gallery.getGalleryByPetIdModel(petId);
      for (const image of galleryImages) {
          const galleryUrl = new URL(image.gallery_path);
          const galleryObjectName = galleryUrl.searchParams.get('prefix');
          const galleryBucketName = "gallery";

          await minioClient.removeObject(galleryBucketName, galleryObjectName);
      }

      await Pet.deleteDocumentsByPetId(petId);

      await Pet.deleteAgendaByPetId(petId);

      await Pet.deleteGalleryByPetId(petId);

      await Pet.deleteExpensesByPetId(petId);

      const deleted = await Pet.delete(petId);
      if (deleted) {
          res.json({ message: 'Pet deleted successfully' });
      } else {
          res.status(404).json({ message: 'Pet not found' });
      }
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

    const fileUrl = `https://capstone24.sit.kmutt.ac.th/kw2/minio/api/v1/buckets/${bucketName}/objects/download?preview=true&prefix=${objectName}&version_id=null`;

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

exports.getGalleryByPetId = async (req, res) => {
    const { petId } = req.params;

    try {
        const galleryPaths = await Gallery.getGalleryByPetIdModel(petId);
        res.status(200).json(galleryPaths);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteGalleryImageById = async (req, res) => {
    const { galleryId } = req.params;

    try {
        const galleryImage = await Gallery.getGalleryImageById(galleryId);
        if (!galleryImage) {
            return res.status(404).json({ message: 'Gallery image not found' });
        }

        const galleryPath = galleryImage.gallery_path;
        if (!galleryPath) {
            return res.status(400).json({ message: 'Gallery path is missing' });
        }

        const url = new URL(galleryPath);
        const objectName = url.searchParams.get('prefix');
        const bucketName = "gallery";

        await minioClient.removeObject(bucketName, objectName);

        await Gallery.deleteGalleryImageById(galleryId);
        res.status(200).json({ message: 'Gallery image deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getQRCode = async (req, res) => {
  const { petId } = req.params;

  try {
      const pet = await Pet.findById(petId);

      if (!pet || !pet.qr_code_base64) {
          return res.status(404).json({ message: 'QR Code not found for this pet' });
      }

      res.status(200).json({ qr_code_base64: pet.qr_code_base64 });
  } catch (error) {
      console.error('Error in getQRCode:', error.message);
      res.status(500).json({ error: error.message });
  }
};

exports.getPetByQRCode = async (req, res) => {
  const { petId } = req.params;

  try {
      const pet = await Pet.findById(petId);

      if (!pet) {
          return res.status(404).json({ message: 'Pet not found' });
      }

      const userPhone = await Pet.findPhoneById(pet.user_id);

      if (!userPhone) {
          return res.status(404).json({ message: 'Phone number not found for this user' });
      }

      res.status(200).json({
          pet: {
              pet_id: pet.pet_id,
              pet_name: pet.pet_name,
              pet_type: pet.pet_type,
              pet_breed: pet.pet_breed,
              pet_color: pet.pet_color,
              pet_gender: pet.pet_gender,
              pet_space: pet.pet_space,
              pet_neutered: pet.pet_neutered,
              weight: pet.weight,
              date_of_birth: pet.date_of_birth,
              profile_path: pet.profile_path,
              qr_code_base64: pet.qr_code_base64,
              created_at: pet.created_at,
              user_id: pet.user_id,
              owner_phone: userPhone.user_phone,
          },
      });
  } catch (error) {
      console.error('Error in getPetByQRCode:', error.message);
      res.status(500).json({ error: error.message });
  }
};