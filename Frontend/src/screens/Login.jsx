import React, { useState } from "react";
import email from '../assets/email.png';
import { login } from "../authAPI/authService";
import lock from "../assets/lock.png";
import eye from "../assets/eye.png";
import hidden from "../assets/hidden.png";

import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false); // 1️⃣ Loading state until reposnse is recieved from api


  const [formData, setFormData] = useState({
    username_or_email: "",
    password: "",
    remember: false,
  });


  

  
  const [error, setError] = useState({
    username_or_email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((data) => ({...data,[name]: type === "checkbox" ? checked : value,}));

  };




  //  let  Userdata = localStorage.getItem('Signupdata');
  //   Userdata = JSON.parse(Userdata);



  const validate = () => {
    let valid = true;
    let errors = {};


    if (!formData.username_or_email) {
      errors.username_or_email = "Please enter username or email";
      valid = false;
    }
    // else{
    //   if((formData.username_or_email === Userdata.email) && (formData.password === Userdata.password)){
        
    //     valid = true;
    //     return valid;
    //   }
    //   if((formData.username_or_email === Userdata.username) && (formData.password === Userdata.password)){
    //     valid = true;
    //     return valid;
    //   }
    // }

    // if(formData.username_or_email.includes('@gmail.com')){
    //   if((formData.username_or_email !== Userdata.email)) {
    //     errors.username_or_email = "Email is incorrect";
    //     valid = false;
    //   }

    // }else{
    //   if((formData.username_or_email !== Userdata.username)) {
    //     errors.username_or_email = "Username is incorrect";
    //     valid = false;
    //   }

    // }
   
    

    if (!formData.password) {
      errors.password = "Please enter password";
      valid = false;
    }
    // else{
    //   if(formData.password !== Userdata.password ){
    //     errors.password = "Password is incorrect";
    //     valid = false;
    //   }
    // }

    setError(errors);
    return valid;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  // 2️⃣ Show spinner

  if(validate()){
      setLoading(true);
      try {
    const response = await login(formData); // Calls Django login API
    console.log("Login success:", response.data);
    localStorage.setItem("Name", response.data.user.name);
    localStorage.setItem("token", response.data.token);
    // Save token/user info if needed
     if(formData.remember){
        
        localStorage.setItem("token", response.data.token);

      }
    

    if (response.data.user.usertype === "tenant") {
      navigate("/tenant");
    } else {
      console.log("Usertype : ",response.data.user.usertype)
      navigate("/owner");
    }
  } catch (error) {
    console.error("Login error:", error.response?.data);

    const errors = {};

    if (error.response?.data?.username_or_email) {
      errors.username_or_email = error.response.data.username_or_email[0];
    }
    if (error.response?.data?.password) {
      errors.password = error.response.data.password[0];
    }
    if (error.response?.data?.non_field_errors) {
      errors.password = error.response.data.non_field_errors[0]; // general auth error
    }

    setError(errors);
  
  }
    setLoading(false); // 3️⃣ Hide spinner
  }
};


  const redirectToSignUp = () => {
          navigate("/signup");
  }

  return (
    <div className="container-fluid ">
      <div className="row loginScreen">
      {/* <div className="col-6 d-none d-md-block firstHalf">
         <div className="row">
         <div className="container text-center my-5">
  <blockquote className="blockquote">
    <p className="mb-3 fs-4 fst-italic text-danger">
      "If finding rooms is your desire, honestly this site will never tire!"
    </p>
    <footer className="blockquote-footer text-muted text-end me-5">Former Room Finder</footer>
  </blockquote>
</div>

         </div>
  <div className="loginImage w-100 d-flex justify-content-center align-items-center">
    <img 
      src={loginImg} 
      alt="Login Visual" 
      style={{ 
        objectFit: "contain", 
        width: "80%", 
        height: "auto", 
        maxHeight: "90vh",
        border: "5px solid white",       // 👈 border added
       
        borderRadius : 12
      }} 
    />
  </div>
</div> */}


        <div className="container d-flex flex-column justify-content-center align-items-center">
        <div className="h-25 text-center quoteBox">
  <blockquote className="blockquote">
    <p className="mb-3 fs-4 fst-italic quote">
      "If finding rooms is your desire, honestly this site will never tire!"
    </p>
    <footer className="blockquote-footer text-muted">Former Room Finder</footer>
  </blockquote>
</div>
          <div className="loginForm">
            <h3 className="text-center mb-4">Welcome Back!</h3>
            <form>
              <div className="mb-3 position-relative">
                <label htmlFor="username_or_email">Username or Email</label>
                <input
                  type="text"
                  id="username_or_email"
                  name="username_or_email"
                  placeholder="Enter username or email"
                  value={formData.username_or_email}
                  onChange={handleChange}
                  className="form-control"
                  style={{paddingLeft : 30}}
                />
                {error.username_or_email && <p className="errorsMessage">{error.username_or_email}</p>}
                <img src={email} alt="" width={20} className="icons position-absolute" style={{ right: 10, top: 33 }} />
              </div>

              <div className="mb-3 position-relative">
                <label htmlFor="password">Password</label>
                <input
                  type={showPass ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control"
                  style={{paddingLeft : 30}}
                />
                {error.password && <p className="errorsMessage">{error.password}</p>}
                <img src={lock} alt="" width={20} className="icons position-absolute" style={{ left: 10, top: 33 }} />
                <img
                  src={showPass ? hidden : eye}
                  alt="toggle"
                  width={20}
                  style={{ position: "absolute", right: 10, top: 33, cursor: "pointer" }}
                  onClick={() => setShowPass(!showPass)}
                />
              </div>

              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="remember"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="remember">Remember Me</label>
              </div>

              <button className="btn btn-primary w-50 align-self-center rounded-3" onClick={handleSubmit} disabled={loading}>
                {loading ? (
        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      ) : (
        "Login"
      )}
              </button>
              <div className="text-center d-flex justify-content-center align-items-center text-white ms-3 mt-2">
                New here?
                <button type="button" class="btn text-danger text-decoration-underline" onClick={redirectToSignUp}>
                  Register
                  </button>
                  </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
