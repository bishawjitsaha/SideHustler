import React, { useState } from 'react';
import { ref, getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from 'uuid';

// You need a const [imageUrl, setImageUrl] = useState(""); in parent component

const AddImage = ({ setImageUrl }) => {
    const [image, setImage] = useState(null);

    const handleChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };

    const handleUpload = async () => {
        const storage = getStorage();
        const storageRef = ref(storage, `images/${image.name + v4()}`);
        await uploadBytes(storageRef, image);
        const url = await getDownloadURL(storageRef);
        setImageUrl(url);
    };

    return (
        <div className="add-image">
            <h2>Add Image</h2>
            <input type="file" onChange={handleChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default AddImage;
