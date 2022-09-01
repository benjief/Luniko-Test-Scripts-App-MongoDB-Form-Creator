import { initializeApp } from "firebase/app";
import { getStorage, ref, deleteObject } from "firebase/storage";

/** 
 * Note the filename of this file (and associated code in package.json). This is needed in order to dynamically import the function below into index.js.
 */
const firebaseConfig = {
  apiKey: "AIzaSyB60XfbGMLbWXdBaMZ57xl8dEhPOAp4ooA",
  authDomain: "luniko-test-scripts-app.firebaseapp.com",
  projectId: "luniko-test-scripts-app",
  storageBucket: "luniko-test-scripts-app.appspot.com",
  messagingSenderId: "218423320291",
  appId: "1:218423320291:web:3d044bdc2ab07c8a506fd6",
  measurementId: "G-GCVK77L20Z",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

/**
 * Deletes an existing image from Google Firebase Cloud Storage.
 * @param {string} imageName - the name of the image to be deleted (stored with step responses in the database).
 */
const deleteStepResponseImage = async (imageName) => {
  const deleteRef = ref(storage, imageName);
  try {
    await deleteObject(deleteRef)
    console.log("image deleted from storage");
  } catch (e) {
    console.log(e);
  }
}

export { deleteStepResponseImage };
