const multer = require("multer");
const minioClient = require("../config/minioClient");
const Image = require("../models/imageModel");

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

    await minioClient.putObject( bucketName, objectName, file.buffer, file.size,
      {
        "Content-Type": file.mimetype,
        "Content-Disposition": "inline",
      }
    );

    await Image.uploadDocument({ pet_id: petId, file_path: `${bucketName}/${objectName}`, file_name: file.originalname, });

    const fileUrl = `http://cp24kw2.sit.kmutt.ac.th:9001/api/v1/buckets/${bucketName}/objects/download?preview=true&prefix=${objectName}&version_id=null`;

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

    await minioClient.putObject( bucketName, objectName, file.buffer, file.size,
      {
        "Content-Type": file.mimetype,
        "Content-Disposition": "inline",
      }
    );

    await Image.uploadDocument({ pet_id: petId, file_path: `${bucketName}/${objectName}`, file_name: file.originalname, });

    const fileUrl = `http://cp24kw2.sit.kmutt.ac.th:9001/api/v1/buckets/${bucketName}/objects/download?preview=true&prefix=${objectName}&version_id=null`;

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

    await minioClient.putObject( bucketName, objectName, file.buffer, file.size,
      {
        "Content-Type": file.mimetype,
        "Content-Disposition": "inline",
      }
    );

    await Image.uploadDocument({ pet_id: petId, file_path: `${bucketName}/${objectName}`, file_name: file.originalname, });

    const fileUrl = `http://cp24kw2.sit.kmutt.ac.th:9001/api/v1/buckets/${bucketName}/objects/download?preview=true&prefix=${objectName}&version_id=null`;

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

    await minioClient.putObject( bucketName, objectName, file.buffer, file.size,
      {
        "Content-Type": file.mimetype,
        "Content-Disposition": "inline",
      }
    );

    await Image.uploadDocument({ pet_id: petId, file_path: `${bucketName}/${objectName}`, file_name: file.originalname, });

    const fileUrl = `http://cp24kw2.sit.kmutt.ac.th:9001/api/v1/buckets/${bucketName}/objects/download?preview=true&prefix=${objectName}&version_id=null`;

    res.status(201).json({
      message: "File uploaded successfully",
      file: { bucketName, objectName, url: fileUrl },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getImage = async (req, res) => {
  const { petId, type } = req.params;

  try {
    const document = await db("documents")
      .where({ pet_id: petId })
      .andWhere("file_path", "like", `%${type}%`)
      .orderBy("created_at", "desc")
      .first();

    if (!document) {
      return res.status(404).json({ message: "Image not found" });
    }

    const fileUrl = `http://cp24kw2.sit.kmutt.ac.th:9001/api/v1/buckets/${type}/objects/download?preview=true&prefix=${document.file_path.split("/")[1]}&version_id=null`;

    res.status(200).json({
      message: "Image retrieved successfully",
      file: { type, file_path: document.file_path, url: fileUrl },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};