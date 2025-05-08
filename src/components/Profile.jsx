import React, { useState } from "react";
import ContentCard from "./Custom/ContentCard";
import Button from "./Custom/Button";
import './Profile.css'

function Profile(){

    // Initialize with information from user data API
    const [avatarImg, setAvatarImg]     = useState(null); 
    const [name, setName]               = useState("Zachary Thomas")
    const [email, setEmail]             = useState("abscdef1234@gmail.com")
    const [phone, setPhone]             = useState("123-45-6789")
    const [password, setPassword]       = useState("hello world")
    const [skill, setSkill]             = useState('Beginner');
    const [notifyBy, setNotifyBy]       = useState('Email');

    const handleAvatarChange = e =>{
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
        <div className="profile-container p-3">
            {/* ----HEADER---- */}
            <div className="profile-header">
                {/* AVATAR */}
                <div className="avatar-wrapper">
                    {avatarImg ? (                    
                        <img
                            src={avatarImg}
                            alt="Profile"
                            className="avatar-img"
                        />
                    ):(
                        <i className="avatar-icon bi bi-person-circle"></i>
                    )}

                    <label className="visually-hidden" htmlFor="avator-input">avator input</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="avatar-input"
                        id="avatar-input"
                    />
                </div>

                {/* NAME */}
                <div className="profile-name">
                    <h1>{name}</h1>
                </div>
            </div>
            
            <ContentCard className="profile-card">
                <form className="profile-form" onSubmit={handleSave} aria-label="profile input form">
                    <div className="profile-fields p-1">
                        
                        {/* NAME */}
                        <label>
                            Name
                            <input
                                type="text"
                                id="fullName"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </label>

                        {/* EMAIL */}
                        <label>
                            Email
                            <input
                                type="email"
                                id="email"
                                autoComplete="on"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </label>

                        {/* PHONE NUMBER */}
                        <label>
                            Phone Number
                            <input
                                type="tel"
                                id="tel"
                                className="profile-input"
                                placeholder="(xxx)-xxx-xxxx"
                                autoComplete="on"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                            />
                        </label>

                        {/* PASSWORD */}
                        <label>
                            Password
                            <input
                                type="password"
                                id="password"
                                className="profile-input"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </label>

                        {/* SKILL LEVEL */}
                        <label>
                            Skill Level
                            <select
                                value={skill}
                                id="skill"
                                className="profile-input"
                                onChange={e => setSkill(e.target.value)}
                            >
                                <option>Beginner</option>
                                <option>Intermediate</option>
                                <option>Advanced</option>
                            </select>
                        </label>

                        {/* NOTIFICATION */}
                        <fieldset className="notification-group">
                            <legend>Receive Reports By</legend>
                                
                                {/* SMS */}
                                <label className="notify-option">
                                    <input
                                        type="radio"
                                        name="notify"
                                        value="SMS"
                                        checked={notifyBy === 'SMS'}
                                        onChange={e => setNotifyBy(e.target.value)}
                                    /> 
                                    <span>SMS</span>
                                </label>
                                
                                {/* EMAIL */}
                                <label className="notify-option">
                                    <input
                                        type="radio"
                                        name="notify"
                                        value="Email"
                                        checked={notifyBy === 'Email'}
                                        onChange={e => setNotifyBy(e.target.value)}
                                    /> 
                                    <span>Email</span>
                                </label>
                        </fieldset>
                    </div>

                    <Button type="submit" className="save-button">
                        Save
                    </Button>

                </form>
            </ContentCard>
        </div>
    );
}

export default Profile