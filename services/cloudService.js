const Cloud = require('@google-cloud/storage');
const path = require('path');

const {Storage} = Cloud;
const storage = new Storage({
    keyFilename: path.join(__dirname, '..', 'cloudkey.json')
})
const bucket = storage.bucket('mearn-app-01');


const uploadImage = async (file) => {
    try {
        const { originalname, buffer, mimetype } = file;
        const timestamp = Date.now(); 
        const blob = bucket.file(timestamp+originalname.replace(/ /g, "_") ); 
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: mimetype,
            },
        });
        return new Promise((resolve, reject) => {
            blobStream.on('error', (err) => {
                reject(err); 
            });
            blobStream.on('finish', () => {
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                resolve(publicUrl);
            });
            blobStream.end(buffer);
        });
    } catch (error) {
        console.log('Cannot Upload Image',error);; 
    }
};

module.exports = uploadImage;
