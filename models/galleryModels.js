const db = require('../db');

exports.create = async (galleryData) => {
    const [galleryId] = await db('gallery').insert({ ...galleryData, created_at: new Date() }).returning('gallery_id');
    return db('gallery').where({ gallery_id: galleryId }).first();
};

exports.getGalleryImageById = async (galleryId) => {
    return db('gallery').where({ gallery_id: galleryId }).first();
};

exports.getGalleryByPetIdModel = async (petId) => {
    return db('gallery').where({ pet_id: petId }).select('*');
};

exports.deleteGalleryImageById = async (galleryId) => {
    return db('gallery').where({ gallery_id: galleryId }).del();
};