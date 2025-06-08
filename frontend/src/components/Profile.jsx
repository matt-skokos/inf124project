import { useState, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";  
import { signOut } from 'firebase/auth';
import API from "../api"; // configured Axios/fetch wrapper
import ContentCard from "./Custom/ContentCard";
import PageContainer from "./Custom/PageContainer";
import Button from "./Custom/Button";
import './Profile.css'

const initialState = {
  name: "",
  email: "",
  phone: "",
  password: "",
  skill: "Beginner",     // you can set a default if you'd like
  notifyBy: "",          // e.g. "SMS" or "Email"
};

function formReducer(state, action) {
  switch (action.type) {
    case "FIELD_CHANGE":
      // action.payload = { field: string, value: any }
        return {
            ...state,
            [action.payload.field]: action.payload.value,
        };
    default:
        return state;
  }
}

function Profile(){
    const id = localStorage.getItem("UID");

    // Initialize with information from user data API
    const [avatarImg, setAvatarImg]     = useState(null); 
    const [formState, dispatch]         = useReducer(formReducer, initialState); 
    const navigate = useNavigate();

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

                dispatch({
                    type: "FIELD_CHANGE",
                    payload: { field: "name", value: userData.name || "" },
                });
                dispatch({
                    type: "FIELD_CHANGE",
                    payload: { field: "email", value: userData.email || "" },
                }); 
                dispatch({
                    type: "FIELD_CHANGE",
                    payload: { field: "phone", value: userData.phone || "" },
                });
                dispatch({
                    type: "FIELD_CHANGE",
                    payload: { field: "skill", value: userData.skill || "" },
                });
                dispatch({
                    type: "FIELD_CHANGE",
                    payload: { field: "notifyBy", value: userData.notifyBy || "" },
                });

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
        const file = e.target.files[0]
        if(!file) return; 
        const reader = new FileReader(); 
        reader.onload = () => setAvatarImg(reader.result); 
        reader.readAsDataURL(file);
    }

    // A single change handler for all inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        dispatch({
            type: "FIELD_CHANGE",
            payload: { field: name, value },
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        const {
            name,
            email,
            password,
            phone,
            skill,
            notifyBy,
        } = formState;

        // TODO: Call API Patch/user/profile {name, email, ...}
        try {
            const payload = { name, email, phone, skill, notifyBy };
            if (avatarImg) payload.avatar = avatarImg;
            if(password !== "") payload.password = password;

            await API.put(`users/${id}`, payload);
            alert("Profile successfully updated."); 
        } catch(err){
            console.error("Error updating profile:", err);
            alert("Failed to save changes. Please try again.");
        }
    };

    const handleLogout = async (e) => {
        try{
            // Sign out from Firebase auth
            await signOut(auth);

            // Remove ID_TOKEN from localStoragae
            localStorage.removeItem("ID_TOKEN");
            localStorage.removeItem("UID");

            // Navigate back to the home page
            navigate("/");
            console.log('Log out successfully');
        }catch(err){
            console.error("Error during sign-out:", err);
            // Optionally show a toast/alert here
            alert("Failed to log out. Please try again.");
        }
    }

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
                        
                        {/* Profile Header */}
                        <div className="profile-name d-flex justify-content-center align-items-center">
                            {/* name */}
                            <h1 className="px-1">{formState.name}</h1>
                             {/* log out icon */}
                            <div className="title-icon" onClick={handleLogout}>
                                <i className="bi bi-box-arrow-right"></i>
                            </div>
                        </div>
                    </div>
                    
                    <ContentCard className="profile-card mx-auto">
                        <form className="profile-form" onSubmit={handleSubmit} aria-label="profile input form">
                            <div className="profile-fields p-1">
                                
                                {/* NAME */}
                                <label>
                                    Name
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="name" // name must match state key
                                        value={formState.name}
                                        onChange={handleChange}
                                    />
                                </label>

                                {/* EMAIL */}
                                <label>
                                    Email
                                    <input
                                        type="email"
                                        id="email"
                                        name="email" // name must match state key
                                        autoComplete="on"
                                        value={formState.email}
                                        onChange={handleChange}
                                    />
                                </label>

                                {/* PHONE NUMBER */}
                                <label>
                                    Phone Number
                                    <input
                                        type="tel"
                                        id="tel"
                                        name="phone" // name must match state key
                                        className="profile-input"
                                        placeholder="(xxx)-xxx-xxxx"
                                        autoComplete="on"
                                        value={formState.phone}
                                        onChange={handleChange}
                                        required={formState.notifyBy === 'sms'}
                                    />
                                </label>

                                {/* PASSWORD */}
                                <label>
                                    Password
                                    <input
                                        type="password"
                                        id="password"
                                        name="password" // name must match state key
                                        className="profile-input"
                                        value={formState.password}
                                        onChange={handleChange}
                                    />
                                </label>

                                {/* SKILL LEVEL */}
                                <label>
                                    Skill Level
                                    <select
                                        id="skill"
                                        name="skill" // name must match state key
                                        className="profile-input"
                                        value={formState.skill}
                                        onChange={handleChange}
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
                                                name="notifyBy"
                                                value="sms"
                                                checked={formState.notifyBy === 'sms'}
                                                onChange={handleChange}
                                            /> 
                                            <span>SMS</span>
                                        </label>
                                        
                                        {/* EMAIL */}
                                        <label className="notify-option">
                                            <input
                                                type="radio"
                                                name="notifyBy"
                                                value="email"
                                                checked={formState.notifyBy === 'email'}
                                                onChange={handleChange}
                                            /> 
                                            <span>Email</span>
                                        </label>
                                </fieldset>
                            </div>

                            <Button type="submit" className="save-button">
                                Update
                            </Button>
                        </form>
                    </ContentCard>
                </>
            )}
        </PageContainer>
    );
}

export default Profile;
