import React, { useState } from 'react';
import axios from 'axios';

const AddImage = ({ username, type }) => {
    const [image, setImage] = useState(null);

    const handleChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
        if (image && allowedTypes.includes(image.type.toLowerCase())) {
            const formData = new FormData();
            formData.append("file", image);
            formData.append("username", username);
            let route = "";
            if (type === "pfp") {
                route = "image/pfpUpload";
            }
            else {
                route = "image/postImgUpload";
            }
            await axios.post(`http://localhost:3000/${route}`, formData)
                .then((res) => {
                    console.log("Image uploaded");
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        else {
            console.log("Invalid file type");
        }
    }

    return (
        <div className="add-image">
            <h2>Add Image</h2>
            <input type="file" onChange={handleChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default AddImage;
