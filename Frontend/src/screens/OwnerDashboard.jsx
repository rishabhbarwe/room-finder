import React,{useEffect, useState} from "react";
import Spinner from "../utils/Spinner";
import ValidatePropertyDetails from "../utils/ValidatePropertyDetails";
import { Link, useNavigate } from "react-router-dom";
import profile from '../assets/dummyProfile.jpeg'
import logo1 from '../assets/logo.png'
import OwnerProfileModal from "../utils/OwnerProfileModal";
import { addProperty, removeProperty } from "../reduxsetup/PropertySlice";
import { useDispatch,useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const OwnerDashboard = () => {
  
  const location = useLocation();
  const name = location.state?.name;  //Name of the user
  console.log("Name of the user : ",name)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showModal, setShowmodal] = useState(false);
 

  const [formData, setFormData] = useState({
    buildingName: "",
    buildingImage: null,
    address: "",
    city: "",
    state: "",
    pincode: "",
    mobile: "",
    altMobile: "",
    email: "",
    altEmail: "",
    roomSizes: {
      Room: { selected: false, image: null },
      "1RK": { selected: false, image: null },
      "1BHK": { selected: false, image: null },
      "2BHK": { selected: false, image: null },
    },
    facilities: {
      WiFi: false,
      RO: false,
      Furnished: false,
      Laundary : false,
    },
    rentFrom: "",
    rentTo: "",
  });
  

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
  
    // for checkboxes (like facilities)
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        facilities: {
          ...prev.facilities,
          [id]: checked,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const { id, files } = e.target;
  
    // For Building Image
    if (id === "buildingImage") {
      setFormData((prev) => ({
        ...prev,
        buildingImage: files[0],
      }));
    }
  
    // For Room Size image (e.g., id="image_Room")
    else if (id.startsWith("image_")) {
      const sizeType = id.replace("image_", "");
      setFormData((prev) => ({
        ...prev,
        roomSizes: {
          ...prev.roomSizes,
          [sizeType]: {
            ...prev.roomSizes[sizeType],
            image: files[0],
          },
        },
      }));
    }
  };
  
  // For Room Size checkbox toggle
  const handleRoomSizeCheckbox = (label) => {
    setFormData((prev) => ({
      ...prev,
      roomSizes: {
        ...prev.roomSizes,
        [label]: {
          ...prev.roomSizes[label],
          selected: !prev.roomSizes[label].selected,
        },
      },
    }));
  };
  
  
  

  function showToast() {
    const container = document.getElementById("modalToastContainer");
    if (!container) return;
  
    const alert = document.createElement("div");
    alert.className =
      "alert alert-success text-center p-2 m-2 shadow-sm ";
    alert.innerText = "Property added successfully!";
  
    container.appendChild(alert);
  
    setTimeout(() => alert.remove(), 1000);
  }

  const dispatch = useDispatch(); // to dispatch actions

  const propertyData = useSelector((state)=>state.property.properties)
  
  // useEffect(()=>{
  //   console.log("propertyData : ",propertyData)
  // })
  

  const handleSubmit = (e)=>{
    e.preventDefault();
    // console.log("Form submitted",formData);
    const isValid = ValidatePropertyDetails(formData, setAlertMsg, setShowAlert);
    // console.log("Valid : ",isValid)
    if (!isValid) return;

     
    dispatch(addProperty(formData))

    setLoading(true);
    

    setTimeout(() => {
      setLoading(false);
    
      
    }, 1000);
    

    setTimeout(()=>{
       showToast()
    },1200)
    
    
  }
   

  return (
    //  Property Modal form
    <>

    <Spinner show={loading} />
    <OwnerProfileModal isOpen={showModal}  onClose={() => setShowmodal(false)}/>
   

     <div 
  className="modal fade"
  id="propertyModal"
  tabIndex="-1"
  role="dialog"
  aria-labelledby="exampleModalLabel"
  aria-hidden="true"
>
  <div className="modal-dialog modal-dialog-scrollable modal-lg" role="document">
    <div className="modal-content">
      
      <div className="modal-header d-flex justify-content-center align-items-center">
      <div id="modalToastContainer" className="position-absolute top-0 end-0 px-3 py-3 mt-0" style={{ zIndex: 1100 }}></div>
        <h5 className="modal-title" id="exampleModalLabel">
          Property Details
        </h5>
      </div>
      <div className="modal-body">
      {showAlert && (
  <div className="alert alert-danger alert-dismissible fade show z-3" role="alert">
    {alertMsg}
    <button
      type="button"
      className="btn-close"
      onClick={() => setShowAlert(false)}
    ></button>
  </div>
)}
        <form onSubmit={handleSubmit}>
        
          {/* Building Name */}
          <div className="mb-3">
            <label htmlFor="buildingName" className="h6 text-primary">Building Name</label>
            <input
              type="text"
              className="form-control"
              id="buildingName"
              placeholder="e.g., Rituraj Apartment"
              accept="image/*"
              value={formData.buildingName}
  onChange={handleFileChange}
  required
            />
            <div className="invalid-feedback">Please provide a valid building name.</div>
          </div>

          {/* Building Image */}
          <div className="mb-3">
            <label htmlFor="buildingImage" className="h6 text-primary">Building Image</label>
            <input
              type="file"
              className="form-control"
              id="buildingImage"
              accept="image/*"
              onChange={(e) =>
                setFormData({ ...formData, buildingImage: e.target.files[0] })
              }
            />
          </div>

          {/* Address */}
          <div className="mb-3">
            <label htmlFor="address" className="h6 text-primary">Address</label>
            <input
              type="text"
              className="form-control"
              id="address"
              placeholder="e.g., House no.23, Bholaram"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <div className="invalid-feedback">Please provide a valid address.</div>
          </div>

          {/* City, State, Pincode */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="city" className="h6 text-primary">City</label>
              <input
                type="text"
                className="form-control"
                id="city"
                placeholder="City"
                value={formData.city}
  onChange={handleChange}
  required
              />
              <div className="invalid-feedback">Please provide a valid city.</div>
            </div>
            <div className="col-md-3">
              <label htmlFor="state" className="h6 text-primary">State</label>
              <select className="form-select" id="state"
                       value={formData.state}
                       onChange={handleChange}
              >
                <option value="">--State--</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
              </select>
            </div>
            <div className="col-md-3">
              <label htmlFor="pincode"  className="h6 text-primary">Pin Code</label>
              <input
                type="text"
                id="pincode"
                className="form-control"
                value={formData.pincode}
  onChange={handleChange}
  required
              />
              <div className="invalid-feedback">Please provide a valid pin code.</div>
            </div>
          </div>

           {/* Mobile No. and Alternate Mobile No. */}
  <div className="row mt-2">
    <div className="col-md-6">
      <label htmlFor="mobile" className="h6 text-primary">Mobile No.</label>
      <input
        type="tel"
        className="form-control"
        id="mobile"
        placeholder="Enter mobile no."
        value={formData.mobile}
  onChange={handleChange}
  required
      />
    </div>
    <div className="col-md-6">
      <label htmlFor="altMobile" className="h6 text-primary">Alternate Mobile No.</label>
      <input
        type="tel"
        className="form-control"
        id="altMobile"
        placeholder="Enter alternate mobile no."
        value={formData.altMobile}
  onChange={handleChange}
      />
    </div>
  </div>

  {/* Email and Alternate Email */}
  <div className="row mt-2">
    <div className="col-md-6">
      <label htmlFor="email" className="h6 text-primary">Email</label>
      <input
        type="email"
        className="form-control"
        id="email"
        placeholder="Enter email"
        value={formData.email}
        onChange={handleChange}
        required
      />
    </div>
    <div className="col-md-6">
      <label htmlFor="altEmail" className="h6 text-primary">Alternate Email</label>
      <input
        type="email"
        className="form-control"
        id="altEmail"
        placeholder="Enter alternate email"
        value={formData.altEmail}
  onChange={handleChange}
      />
    </div>
  </div>


          {/* Sizes */}
          <div className="mb-3">
  <label className="h6 text-primary">Select Sizes</label>
  {["Room", "1RK", "1BHK", "2BHK"].map((label) => (
    <div className="form-check mt-1 d-flex align-items-center" key={label}>
      <input
        className="form-check-input me-2"
        type="checkbox"
        id={`size_${label}`}
        checked={formData.roomSizes[label].selected}
        onChange={() => handleRoomSizeCheckbox(label)}
      />
      <label className="form-check-label me-3" htmlFor={`size_${label}`}>
        {label}
      </label>
      <input
        type="file"
        className="form-control form-control-sm ms-3"
        id={`image_${label}`}
        accept=".jpg,.jpeg,.png"
        onChange={handleFileChange}
        disabled={!formData.roomSizes[label].selected}
      />
    </div>
  ))}
</div>


          {/* Facilities */}
          <div className="mb-3">
            <label className="h6 text-primary">Facilities</label>
            <div className="d-flex flex-wrap">
              {["WiFi", "RO", "Furnished","Laundary"].map((facility, index) => (
                <div className="form-check form-check-inline me-3" key={index}>
                  <input className="form-check-input" type="checkbox" id={`facility${index}`}  checked={formData.facilities[index]} onChange={handleChange}/>
                  <label className="form-check-label" htmlFor={`facility${index}`}>
                    {facility}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Rent */}
          <div className="mb-3 row">
            <label className="h6 text-primary">Rent Varies</label>
            <div className="col-md-6">
              <label htmlFor="rentFrom">From</label>
              <input type="text" className="form-control" id="rentFrom" placeholder="Minimum rent" value={formData.rentFrom}
  onChange={handleChange}/>
            </div>
            <div className="col-md-6">
              <label htmlFor="rentTo">To</label>
              <input type="text" className="form-control" id="rentTo" placeholder="Maximum rent"  value={formData.rentTo}
  onChange={handleChange}/>
            </div>
          </div>
         
        </form>
      </div>
      <div className="modal-footer">
     
      <button type="button" className="btn btn-secondary" data-dismiss="modal">
          Close
        </button>
      <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
          Save Changes
        </button>
      
       
      </div>
    </div>
  </div>
</div>

      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-2 d-none d-md-block vh-100 p-3 position-fixed top-0 start-0"
           style={{
            backgroundImage: 'linear-gradient(to right,rgb(237, 232, 232),rgb(23, 234, 234))'

           }}
          >
            <div className="d-flex align-items-center flex-row justify-content-start align-items-center">
              <img src={profile} alt=""
              style={{
                width : 40,
                height : 40,
                borderRadius : '50%'
              }}/>
              <p className="h6 ms-2 text-white">{name}</p>
            </div>
            <hr className="text-white"/>
            <ul className="nav flex-column">
              <li className="nav-item">
                <a href="#" className="nav-link fw-bold" onClick={(e)=>{e.preventDefault(); navigate('/propertiesowner')}}>
                  My Properties
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link fw-bold" onClick={(e)=>{e.preventDefault(); navigate('/rentoverviewowner')}}>
                  Rent Overview
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link fw-bold" onClick={(e)=>{e.preventDefault(); navigate('/teantdetailsowner')}}>
                  Tenant details
                </a>
              </li>

              <li className="nav-item">
                <a href="#" className="nav-link fw-bold" data-target="#ownerProfileModal" 
                  onClick={(e)=>{ console.log("Hello") ;e.preventDefault();setShowmodal(true)}}
                >
                  Profile Settings
                </a>
              </li>
             
             
              
            </ul>
            <div className="box h-75 d-flex flex-column justify-content-end align-items-start">
            <button className="btn btn-danger px-4 mx-1 my-4" onClick={()=>{navigate('/')}}
         
            >logout</button>
            </div>
            
          </div>

          {/* Main Content */}
          <div className="col-md-10 p-4 offset-md-2 vh-100" 
          style={{
            // backgroundImage: 'linear-gradient(to right,rgb(76, 144, 217),rgb(237, 231, 215))'
          }}>
            <div className="row d-md-none position-sticky top-0 z-3">
              <nav class="navbar  navbar-expand-lg navbar-dark rounded-4 px-3" 
                style={{
                  backgroundColor : '#1d3557'
                }}>
                <img src={logo1} alt="" width={50} style={{
                  borderRadius : '50%'
                }}/>
                <button
                  className="navbar-toggler"
                  type="button"
                  data-toggle="collapse"
                  data-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon" ></span>
                </button>

                <div
                  class="collapse navbar-collapse"
                  id="navbarSupportedContent"
                >
                  <ul class="navbar-nav mr-auto">
                    <li class="nav-item active my-1">
                      <a class="nav-link" href="#" className="fw-bold text-info text-decoration-none">
                        My properties 
                      </a>
                    </li>
                    <li class="nav-item my-1">
                      <a class="nav-link" href="#" className="fw-bold text-info text-decoration-none">
                        Rent overview
                      </a>
                    </li>
                    <li class="nav-item my-1">
                      <a class="nav-link" href="#" className="fw-bold text-info text-decoration-none">
                        Tenant details
                      </a>
                    </li>
                    <li class="nav-item my-1">
                      <a class="nav-link" href="#" className="fw-bold text-info text-decoration-none">
                        Profile setting
                      </a>
                    </li>
                    <li class="nav-item my-1">
                     <Link to="/" style={{
                      textDecoration : "none",
                     
                      
                     }} className="fw-bold text-danger">Logout</Link>
                    </li>
                  </ul>
                </div>
               
              </nav>
              
            </div>

            {/* Second row */}
            <div className="row">
              <h3>Welcome, Home Owner</h3>

              {/* Summary Cards */}
              <div className="row my-4">
                <div className="col-md-4 px-4 my-3 ">
                  <div className="row text-center py-2" style={{
                    backgroundColor : '#0096c7',
                    borderTopRightRadius : 10,
                    borderTopLeftRadius : 10
                  }}>
                  <h5 className="card-title">Total Properties</h5>
                 
                  </div>
                  <div className="row text-center py-2" 
                  style={{
                    backgroundColor : '#00b4d8',
                    borderBottomLeftRadius : 10,
                    borderBottomRightRadius : 10
                  }}> 
                  <p className="card-text display-6">3</p>
                  </div>
                </div>
                <div className="col-md-4  px-4 my-3">
                  <div className="row text-center py-2" style={{
                    backgroundColor : '#4f772d',
                    borderTopRightRadius : 10,
                    borderTopLeftRadius : 10
                  }}>
                  <h5 className="card-title">Pending rent</h5>
                 
                  </div>
                  <div className="row text-center py-2" 
                  style={{
                    backgroundColor : '#90a955',
                    borderBottomLeftRadius : 10,
                    borderBottomRightRadius : 10
                  }}> 
                  <p className="card-text display-6">1</p>
                  </div>
                </div>
                <div className="col-md-4  px-4 my-3">
                  <div className="row text-center py-2" style={{
                    backgroundColor : '#ff8fab',
                    borderTopRightRadius : 10,
                    borderTopLeftRadius : 10
                  }}>
                  <h5 className="card-title">New Tenant Request</h5>
                 
                  </div>
                  <div className="row text-center py-2" 
                  style={{
                    backgroundColor : '#ffb3c6',
                    borderBottomLeftRadius : 10,
                    borderBottomRightRadius : 10
                  }}> 
                  <p className="card-text display-6">2</p>
                  </div>
                </div>
               
              </div>

              {/* Property List */}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5>My Properties</h5>
                <button
                  className="btn btn-primary"
                  data-toggle="modal"
                  data-target="#propertyModal"
                >
                  + Add Property
                </button>
              </div>
              {
                propertyData.map((item)=>(<div 
                 style={{
                  border : '2px solid black',
                  width : '40%',
                  backgroundColor : 'skyblue',
                  margin : 10,
                  padding :10

                 }}
                key={item.buildingName}>

                  <h1>Name : {item.buildingName}</h1>
                  <h6>Address : {item.address}</h6>
                  <h6>Mobile : {item.mobile}</h6>
                  <button onClick={()=>{dispatch(removeProperty(item))}}>Remove</button>


                </div>))
              }
             
            
            </div>
            {/* Tenant Requests Table */}
            <h5>Tenant Requests</h5>
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>Name</th>
                    <th>Property</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>John Doe</td>
                    <td>Sample Property</td>
                    <td>
                      <span className="badge bg-warning text-dark">
                        Pending
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-success me-2">
                        Accept
                      </button>
                      <button className="btn btn-sm btn-danger">Reject</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
           
          </div>
        </div>
      </div>
    </>
  );
};

export default OwnerDashboard;
