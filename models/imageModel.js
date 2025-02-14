const db = require('../db');

exports.uploadDocument = async (documentData) => {
    return db('documents').insert({ ...documentData, created_at: new Date() });
};

exports.findDocumentByPetIdAndType = async (petId, fileType) => {
    return db('documents').where({ pet_id: petId, file_type: fileType }).first();
  };
  
  exports.deleteDocument = async (documentId) => {
    return db('documents').where({ document_id: documentId }).del();
  };