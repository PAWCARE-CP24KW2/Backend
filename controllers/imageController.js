const multer = require('multer');
const minioClient = require('../config/minioClient');
const Image = require('../models/imageModel');

const upload = multer({ storage: multer.memoryStorage() });

exports.uploadImage = async (req, res) => {
    const { petId } = req.params;
    const file = req.file;
    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const bucketName = 'images';
    const objectName = `${Date.now()}-${file.originalname}`;
    try {
        const bucketExists = await minioClient.bucketExists(bucketName);
        if (!bucketExists) {
            await minioClient.makeBucket(bucketName, 'us-east-1');
        }
        await minioClient.putObject(bucketName, objectName, file.buffer, file.mimetype);
        await Image.uploadDocument({ pet_id: petId, file_path: `${bucketName}/${objectName}`, file_name: file.originalname });

        // const fileUrl = `http://cp24kw2.sit.kmutt.ac.th:9000/${bucketName}/${objectName}`;
        const fileUrl = `http://cp24kw2.sit.kmutt.ac.th:9001/api/v1/buckets/images/objects/download?preview=true&prefix=${objectName}&version_id=null`;
        
        res.status(201).json({ message: 'File uploaded successfully', file: { bucketName, objectName, url: fileUrl } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};