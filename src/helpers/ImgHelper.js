const { getStorage, ref, getDownloadURL, uploadBytesResumable, deleteObject } = require("firebase/storage");
const multer = require("multer");
const moment = require("moment");

// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGINGSENDERID,
    appId: process.env.APPID,
};

// Initialize Firebase
initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

// Setting up multer as a middleware to grab photo uploads
multer({ storage: multer.memoryStorage() });

const uploadImg = async (file, folder) => {
    const dateTime = moment(new Date()).format("DD_MM_YYYY-HH_mm_ss");

    const imageName = `${folder}/${dateTime+'-'+file.originalname}`;

    const storageRef = ref(storage, imageName);

    // Create file metadata including the content type
    const metadata = {
        contentType: file.mimetype,
    };

    // Upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata);
    //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

    // Grab the public url
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
        imageName,
        image: downloadURL,
    };
};

const deleteImg = async (imageName) => {
    try {
        // Create a reference to the file to delete
        const desertRef = ref(storage, imageName);
        // Delete the file
        await deleteObject(desertRef);
        return true;
    } catch (error) {
        console.log("error", error);
        return false;
    }
};

module.exports = {
    uploadImg,
    deleteImg
};
