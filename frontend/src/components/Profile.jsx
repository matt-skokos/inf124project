import { useState, useEffect } from "react";
import API from "../api"; // configured Axios/fetch wrapper
import ContentCard from "./Custom/ContentCard";
import PageContainer from "./Custom/PageContainer";
import Button from "./Custom/Button";
import './Profile.css'

function Profile(){
    const id = localStorage.getItem("UID");

    // Initialize with information from user data API
    const [avatarImg, setAvatarImg]     = useState(null); 
    const [name, setName]               = useState("");
    const [email, setEmail]             = useState("");
    const [phone, setPhone]             = useState("");
    const [password, setPassword]       = useState("");
    const [skill, setSkill]             = useState('Beginner');
    const [notifyBy, setNotifyBy]       = useState('Email');

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError]         = useState(null);

    // Fetch user data on mount (or if `id` changes)
    useEffect(() => {
        if (!id) {
            setError("No user ID provided.");
            setIsLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const res = await API.get(`/users/${id}`);
                const userData = res.data;

                setName(userData.name || "");
                setEmail(userData.email || "");
                setPhone(userData.phone || "");
                setPassword(userData.password || "");
                setSkill(userData.skill || "Beginner");
                setNotifyBy(userData.notifyBy || "Email");

                if (userData.avatarUrl) {
                    setAvatarImg(userData.avatarUrl);
                }
            } catch(err){
                console.error("Failed to fetch user:", err);
                setError(err.response?.data?.message || "Unable to load profile.");
            } finally{
                setIsLoading(false);
            }
        }

        fetchUser();
    }, [id])

    const handleAvatarChange = e =>{
        const file = e.taget.files[0]
        if(!file) return; 
        const reader = new FileReader(); 
        reader.onload = () => setAvatarImg(reader.result); 
        reader.readAsDataURL(file);
    }

    const handleSave = async (e) => {
        e.preventDefault(); 
        // TODO: Call API Patch/user/profile {name, email, ...}
        try {
            const payload = { name, email, phone, password, skill, notifyBy };
            if (avatarImg) payload.avatar = avatarImg;

            await API.put(`users/${id}`, payload);
            alert("Profile successfully updaated."); 
        } catch(err){
            console.error("Error updating profile:", err);
            alert("Failed to save changes. Please try again.");
        }
    };

    return(
        <PageContainer title="Profile" hideTitle={true}>
            {isLoading ? (
                <div className="loading-container">
                    <p>Loading profile…</p>
                </div>
            ) : error ? (
                <div className="error-container">
                    <p className="error">{error}</p>
                </div>
            ) : (
                <>
                    {/* ----HEADER----  */}
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

                            <label className="visually-hidden" htmlFor="avatar-input">avator input</label>
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
                                                checked={notifyBy === 'sms'}
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
                                                checked={notifyBy === 'email'}
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
                </>
            )}
        </PageContainer>
    );
}

export default Profile