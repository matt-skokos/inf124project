import React, { useState } from "react";
import ContentCard from "./Custom/ContentCard";
import './Profile.css'

function Profile(){

    // Initialize with information from user data API
    const [avatarImg, setAvatarImg]   = useState(null); 
    const [name, setName]               = useState("Zachary Thomas")
    const [email, setEmail]             = useState("abscdef1234@gmail.com")
    const [phone, setPhone]             = useState("123-45-6789")
    const [password, setPassword]       = useState("hello world")
    const [skill, setSkill]             = useState('Beginner');
    const [notifyBy, setNotifyBy]       = useState('Email');

    const handlePicChange = e =>{
        const file = e.taget.files[0]
        if(!file) return; 
        const reader = new FileReader(); 
        reader.onload = () => setAvatarImg(reader.result); 
        reader.readAsDataURL(file);
    }

    const handleSave = e => {
        e.preventDefault(); 

        // TODO: Call API Patch/user/profile {name, email, ...}
        console.log({name, email, phone, password, skill, notifyBy});
        alert("Profile Saved!"); 
    }

    return(
        <div className="profile-container">
            <ContentCard className="profile-card">

                <div className="profile-header">
                    <div className="avatar-wrapper">
                        <img
                            src={avatarImg || '/default-avatar.png'}
                            alt="Profile"
                            className="avatar-img"
                        />
                    </div>

                </div>

                <form className="profile-form" onSubmit={handleSave}>

                </form>
            </ContentCard>
        </div>
    );
}

export default Profile