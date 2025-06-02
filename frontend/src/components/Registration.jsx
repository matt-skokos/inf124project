import { useReducer } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";        // helper
import ContentCard from "./Custom/ContentCard";
import PageContainer from "./Custom/PageContainer";
import Button from "./Custom/Button";
import './Registration.css';

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  skill: "Beginner",     // you can set a default if you’d like
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
    case "RESET_FORM":
        return initialState;
    default:
        return state;
  }
}

function Registration() {
    const [formState, dispatch] = useReducer(formReducer, initialState);
    const navigate = useNavigate(); 

    // A single change handler for all inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        dispatch({
            type: "FIELD_CHANGE",
            payload: { field: name, value },
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            phone,
            skill,
            notifyBy,
        } = formState;

        // Handle registration logic here, 

        // password match check
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try{
            // create new user in Auth + Firestore
            await API.post("/users/new", {
                email, 
                password, 
                name: `${firstName} ${lastName}`,
                phone,
                skill,
                notifyBy,
            }).then(
                console.log(`Name: ${firstName} ${lastName}\n` +
                    `Email: ${email}\n` +
                    `Password: ${password}\n` +
                    `Confirm password: ${confirmPassword}\n` +
                    `Phone: ${phone}\n` +
                    `Skill: ${skill}\n` +
                    `Notify By: ${notifyBy}`
                )
            )

            //log the new user in 
            dispatch({ type: "RESET_FORM" }); // clear form (optional)
            navigate('/') // on success, redirect to home

        }catch(err){
            console.error(err); 
            alert(err.response?.data?.error || `Registration failed: ${err.message}`);
        }
    };

    return(
        <PageContainer title="Register">
            <ContentCard className="registration-card">
                <form className="registration-form" onSubmit={handleSubmit}>

                    {/* USER NAME  */}
                    <div className="mb-3 d-flex gap-2">
                        {/* FIRST NAME  */}
                        <label className="visually-hidden" htmlFor="first-name">First Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="first-name"
                            name="firstName" // name must match state key
                            placeholder="first name"
                            value={formState.firstName}
                            onChange={handleChange}
                            required
                        />

                        {/* LAST NAME */}
                        <label className="visually-hidden" htmlFor="last-name">Last Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="last-name"
                             name="lastName" // name must match state key 
                            placeholder="last name"
                            value={formState.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* EMAIL  */}
                    <div className="mb-3">
                        <label className="visually-hidden" htmlFor="email">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email" // name must match state key
                            placeholder="email"
                            value={formState.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* PASSWORD */}
                    <div className="mb-3">
                        <label className="visually-hidden" htmlFor="password">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"  // name must match state key
                            autoComplete="on"
                            placeholder="password"
                            value={formState.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div className="mb-3">
                        <label className="visually-hidden" htmlFor="confirm-password">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="confirm-password"
                            name="confirmPassword" // name must match state key
                            autoComplete="on"
                            placeholder="confirm password"
                            value={formState.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="mb-3">
                        <label className="visually-hidden" htmlFor="tel-number">Phone Number</label>
                        <input
                            type="tel"
                            className="form-control"
                            id="tel-number"
                            name="phone" // name must match state key
                            placeholder="telphone number"
                            value={formState.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Skill Level */}
                    <div className="mb-3">
                        <label className="visually-hidden" htmlFor="skill">Skill Level</label>
                         <select
                                id="skill"
                                name="skill" // name must match state key
                                className="profile-input"
                                value={formState.skill}
                                onChange={handleChange}
                                required
                            >
                                <option>Beginner</option>
                                <option>Intermediate</option>
                                <option>Advanced</option>
                            </select>
                    </div>

                    {/* Notification Method */}
                    <div className="mb-3">
                        <fieldset className="notification-group">
                            <legend>Receive Reports By</legend>
                                
                                {/* SMS */}
                                <label className="notify-option">
                                    <input
                                        type="radio"
                                        name="notifyBy" // name must match state key
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
                                        name="notifyBy" // name must match state key
                                        value="email"
                                        checked={formState.notifyBy === 'email'}
                                        onChange={handleChange}
                                    /> 
                                    <span>Email</span>
                                </label>
                        </fieldset>
                    </div>

                    {/* SUBMIT BUTTON  */}
                    <Button type="submit" className="registration-button btn btn-primary w-100 mb-3">Register</Button>
                    
                    {/* Redicit to login page */}
                    <div className="text-center">
                        <p>Already have an account? <a href="/login">Login</a></p>
                    </div>
                </form>
            </ContentCard>
        </PageContainer>
    )
};

export default Registration;