import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../lib/Firebase";

export const uploadImageApi = async (
  path: string,
  fileName: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const storageRef = ref(
    storage,
    `${path}/${fileName}.${file.name.split(".").pop()}`
  );

  const uploadTask = uploadBytesResumable(storageRef, file, {
    contentType: file.type,
    cacheControl: "public, max-age=604800",
  });

  return new Promise((res, rej) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress && onProgress(progress);
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        switch (error.code) {
          case "storage/unauthorized":
            rej("Unauthorized");
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            rej("cancelled");
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            rej("unknown");
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          res(url);
        });
      }
    );
  });
};
