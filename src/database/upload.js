import { getDownloadURL, ref, storage, uploadBytesResumable } from './fireBaseConfique'
const upload = async (file) => {
    const date = new Date();

    const storageRef = ref(storage, `images/${date + file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            },
            async (error) => {
                await Swal.fire({
                    title: 'SomeThing gone Wrong',
                    text: reject(error.code),
                    icon: 'error',
                    confirmButtonText: 'Click to countinue'
                })
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL)
                });
            }
        );
    })
}

export default upload