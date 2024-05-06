import React, { useState } from 'react';
import axios from 'axios';

const AddImage = ({ cred, type }) => {
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
            let route = "";
            if (type === "pfp") {
                formData.append("username", cred.username);
                route = "image/pfpUpload";
            }
            else if (type === "post") {
                formData.append("postID", cred._id);
                route = "image/postImgUpload";
            }
            else {
                console.log("Invalid image type");
                return;
            }
            await axios.post(`http://localhost:3000/${route}`, formData)
                // TODO ADD Authorization header
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
