import React from "react";
import eye from '../assets/eye.png'
import hidden from '../assets/hidden.png'
import name from '../assets/name.png'
import email from '../assets/email.png'
import phone from '../assets/phone.png'
import username from '../assets/username.png'
import lock from '../assets/lock.png'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register,login } from "../authAPI/authService";







const Signup = () => {
 
  const navigate = useNavigate();
  const [showPass , setShowPass] = useState(false);


  const handleImage = ()=>{
    setShowPass(!showPass)  
}

  const redirectToLogin = () => {
        navigate("/");
  }

  const [formData, setFormdata] = useState({
    usertype : "",
    name : "",
    username : "",
    phone : "",
    email : "",
    password : ""
});

const [error, setError] = useState({
  usertype : "",
  name : "",
  username : "",
  phone : "",
  email : "",
  password : ""
});






const handleChange = (event)=>{
  //  const name = event.target.name;//selet
  //  const value = event.target.value//tenant
  const {name,value} = event.target;

   setFormdata((data)=>({...data,[name]:value}))
   
}

const Validate = ()=>{
    let valid = true;
     let errors={}

    if(!formData.usertype){
      errors.usertype = "Please usertype your type"
      valid = false;
    }
    if(!formData.name){
      errors.name = "Please enter your name"
      valid = false;
    }
    if(!formData.username){
       errors.username = "Please enter your username"
      valid = false;
    }
    if(!formData.phone){
       errors.phone = "Please enter your phone"
      valid = false;
    }
    if(!formData.email){
       errors.email = "Please enter your email"
      valid = false;
    }
    if(!formData.password){
       errors.password = "Please enter your password"
       valid = false;
    }




  setError(errors)

  return valid;
}

const handleSubmit = async(e)=>{
    e.preventDefault();
    console.log("Formdata : ",formData);
    if(Validate()){

      localStorage.setItem('Signupdata',JSON.stringify(formData));
      try{
          const response = await register(formData);
          console.log("Hello from Signup")
          console.log('Registered successfully:', response.data);
          navigate('/', { state: { name: response.data.user.name } });
      }catch(e){
          console.error('Registration failed:', error.response?.data || error.message);
      }

     
    }

}
  

  
  return (
    <div className="container-fluid ">
      <div className="row fullScreen">
       
       
       <div className="col-12 signupForm">
          {/* signup form */}
          <div className="row">
            <div className="col-12 text-center mt-4">
              <p className="h3 text-danger topText">Find Your Perfect Room — Anytime, Anywhere!</p>
            </div>
          </div>
          <div className="signupFormDiv">
            
            <h4 className="text-center">Register please!</h4>
            <form>
            <div>
              <label htmlFor="type">Select type</label><br />
                 <select id="type" name="usertype" value={formData.usertype} onChange={handleChange}>
                   <option value="">--Select user type--</option>
                   <option value="owner">Owner</option>
                   <option value="tenant">Tenant</option>
                 </select>
                 {error.usertype && <p  className="errorsMessage" >{error.usertype}</p>}
              </div>
              <div className="itemDiv">
                <label htmlFor="name">Name</label><br />
                <input  type="text" id="name" placeholder="name" name="name" value={formData.name} onChange={handleChange} ></input>
                {error.name && <p  className="errorsMessage" >{error.name}</p>}
                <img src={name} alt="" width={20}  className="icons"/>
              </div>
              <div className="itemDiv">
                <label htmlFor="username">Username</label><br />
                <input type="text" id="username" placeholder="username" name="username" value={formData.username} onChange={handleChange}></input>
                {error.username && <p  className="errorsMessage" >{error.username}</p>}
                <img src={username} alt="" width={20}  className="icons"/>
              </div>
              <div className="itemDiv">
                <label htmlFor="phone">Phone</label><br />
                <input type="text" id="phone" placeholder="phone no" name="phone" value={formData.phone} onChange={handleChange}></input>
                {error.phone && <p className="errorsMessage" >{error.phone}</p>}
                <img src={phone} alt="" width={20} className="icons"/>
              </div>
              <div className="itemDiv">
                <label htmlFor="email">Email</label><br />
                <input type="text" id="email" placeholder="email" name="email" value={formData.email} onChange={handleChange}></input>
                {error.email && <p   className="errorsMessage">{error.email}</p>}
                <img src={email} alt="" width={20} className="icons"/>
              </div>
              <div className="itemDiv">
                <label htmlFor="password">Password</label><br />
                <input type={showPass ? "text" : "password"} id="password" placeholder="password" name="password" value={formData.password} onChange={handleChange}></input>
                {error.password && <p  className="errorsMessage" >{error.password}</p>}
                <img src={lock} alt="" width={20}  className="icons"/>
                <img src={showPass ? hidden : eye} width={18} style={{
                     position : "absolute",
                     top : 51,
                     right : 14,
                }} onClick={handleImage}></img>
              </div>
             
              <button className="btn btn-primary rounded-4 text-white mx-5 mt-4" onClick={handleSubmit}>Submit</button>
              <div className="text-center d-flex justify-content-center align-items-center text-white ms-3 mt-2">Already have an account?<button type="button" class="btn text-danger text-decoration-underline" onClick={redirectToLogin}>Login</button></div>
              
            </form>
          </div>
        </div>
       
      </div>
    </div>
  );
};

export default Signup;
