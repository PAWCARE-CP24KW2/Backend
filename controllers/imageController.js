const multer = require("multer");
const minioClient = require("../config/minioClient");
const Image = require("../models/imageModel");
const Pet = require("../models/petModel");

const upload = multer({ storage: multer.memoryStorage() });

exports.uploadProfilePet = async (req, res) => {
  const { petId } = req.params;
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const bucketName = "profilepet";
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

    await Pet.update(petId, { profile_path: fileUrl });

    res.status(201).json({
      message: "File uploaded successfully",
      file: { bucketName, objectName, url: fileUrl },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.uploadRegistration = async (req, res) => {
  const { petId } = req.params;
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const bucketName = "registration";
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

    await Image.uploadDocument({
      pet_id: petId,
      file_type: "registration",
      file_path: fileUrl,
    });

    res.status(201).json({
      message: "File uploaded successfully",
      file: { bucketName, objectName, url: fileUrl },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.uploadMedicalBook = async (req, res) => {
  const { petId } = req.params;
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const bucketName = "medicalbook";
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

    await Image.uploadDocument({
      pet_id: petId,
      file_type: "medicalbook",
      file_path: fileUrl,
    });

    res.status(201).json({
      message: "File uploaded successfully",
      file: { bucketName, objectName, url: fileUrl },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.uploadPassportNo = async (req, res) => {
  const { petId } = req.params;
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const bucketName = "passportno";
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

    await Image.uploadDocument({
      pet_id: petId,
      file_type: "passportno",
      file_path: fileUrl
    });

    res.status(201).json({
      message: "File uploaded successfully",
      file: { bucketName, objectName, url: fileUrl },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProfilePet = async (req, res) => {
  const { petId } = req.params;

  try {
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    const fileUrl = pet.profile_path;
    if (!fileUrl) {
      return res.status(400).json({ message: "No profile path to delete" });
    }

    const objectName = fileUrl.split("prefix=")[1].split("&")[0];
    const bucketName = "profilepet";

    await minioClient.removeObject(bucketName, objectName);
    await Pet.update(petId, { profile_path: null });

    res.status(200).json({ message: "Profile path deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteDocument = async (req, res) => {
  const { petId, fileType } = req.params;

  try {
    const document = await Image.findDocumentByPetIdAndType(petId, fileType);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const fileUrl = document.file_path;
    if (!fileUrl) {
      return res.status(400).json({ message: "No file path to delete" });
    }

    const objectName = fileUrl.split("prefix=")[1].split("&")[0];
    const bucketName = fileType;

    await minioClient.removeObject(bucketName, objectName);
    await Image.deleteDocument(document.document_id);

    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFilePath = async (req, res) => {
  const { petId, fileType } = req.params;

  try {
    const document = await Image.getFilePathByPetIdAndType(petId, fileType);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.status(200).json({ file_path: document.file_path });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};