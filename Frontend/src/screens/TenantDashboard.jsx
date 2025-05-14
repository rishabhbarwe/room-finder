import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import profile from '../assets/dummyProfile.jpeg'

const TenantDashboard = () => {

  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setSelectedFilters((prev) => [...prev, value]);
    } else {
      setSelectedFilters((prev) => prev.filter((item) => item !== value));
    }
  };

  const handleSearch = () => {
   
    console.log('Selected Filters:', selectedFilters);
  };

  const roomTypes = ['1RK', '1BHK', '2BHK', '3BHK'];
  const locations = ['Bholaram', 'Bhawarkua', 'Vishnupuri', 'Khandwa Naka'];
  const rents = ['4000', '5000', '6000'];
 
  return (
    <div className="container-fluid">
  <div className="row min-vh-100">
    {/* Sidebar for md and above */}
    <div className="col-md-2 d-none d-md-block bg-dark text-white p-3 vh-100">
                  <div className="d-flex align-items-center flex-row justify-content-start align-items-center">
                    <img src={profile} alt=""
                    style={{
                      width : 40,
                      height : 40,
                      borderRadius : '50%'
                    }}/>
                    <p className="h6 ms-2 text-white">Dummy name</p>
                  </div>
      <hr />
      <ul className="nav flex-column">
        <li className="nav-item">
          <a href="#" className="nav-link text-white fs-5 fw-bold">My property</a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link text-white fs-5 fw-bold">My profile</a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link text-white fs-5 fw-bold">Message</a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link text-white fs-5 fw-bold">Payment details</a>
        </li>
        <li className="nav-item">
          <Link to="/" className="nav-link text-white fs-5 fw-bold">Logout</Link>
        </li>
      </ul>
    </div>

    {/* Navbar for small screens */}
    <nav className="navbar navbar-dark  navbar-expand-lg  bg-dark d-md-none position-sticky top-0 z-3 rounded-4 px-3">
      <div className="container-fluid">
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
                                My property
                              </a>
                            </li>
                            <li class="nav-item my-1">
                              <a class="nav-link" href="#" className="fw-bold text-info text-decoration-none">
                                My profile
                              </a>
                            </li>
                            <li class="nav-item my-1">
                              <a class="nav-link" href="#" className="fw-bold text-info text-decoration-none">
                                Messages
                              </a>
                            </li>
                            <li class="nav-item my-1">
                              <a class="nav-link" href="#" className="fw-bold text-info text-decoration-none">
                                Payment details
                              </a>
                            </li>
                            <li class="nav-item my-1">
                             <Link to="/" style={{
                              textDecoration : "none",
                             
                              
                             }} className="fw-bold text-danger">Logout</Link>
                            </li>
                          </ul>
                        </div>
        
      </div>
      
    </nav>

    {/* Collapsible sidebar for small screens
    <div className="collapse bg-dark text-white d-md-none p-3" id="tenantSidebar">
      <ul className="nav flex-column">
        <li className="nav-item">
          <a href="#" className="nav-link text-white">Dashboard</a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link text-white">My Rent</a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link text-white">Property Details</a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link text-white">Messages</a>
        </li>
        <li className="nav-item">
          <Link to="/" className="nav-link text-white">Logout</Link>
        </li>
      </ul>
    </div> */}

    {/* Main content */}
    <div className="col-md-10">
      {/* Top Navbar */}
      <nav className="navbar navbar-light px-4 my-2" style={{
         backgroundColor : '#669bbc',
  padding : 10,
  borderRadius : 10
      }}>
        <span className="navbar-brand mb-0 h1">Welcome, Tenant</span>
      </nav>
    

      {/* Dashboard Content */}
      <div className="container mt-4">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card text-white bg-primary">
              <div className="card-body">
                <h5 className="card-title">Rent Status</h5>
                <p className="card-text">Next Rent Due: 15th May 2025</p>
                <p className="card-text">Status: <strong>Paid</strong></p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card text-white bg-success">
              <div className="card-body">
                <h5 className="card-title">Property Info</h5>
                <p className="card-text">Flat No: A-203</p>
                <p className="card-text">Owner: Mr. Sharma</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card text-white bg-warning">
              <div className="card-body">
                <h5 className="card-title">Messages</h5>
                <p className="card-text">2 new messages from Owner</p>
                <a href="#" className="btn btn-light btn-sm">View Messages</a>
              </div>
            </div>
          </div>
        </div>



 <div className="row align-items-center my-3" style={{
  backgroundColor : '#e5e5e5',
  padding : 10,
  borderRadius : 10
 }}>
      <div className="col-md-9">
        <div className="dropdown">
          <button
            className="btn btn-dark dropdown-toggle py-2 px-4"
            type="button"
            data-bs-toggle="dropdown"
            style={{ fontSize: '1.1rem', minWidth: '100%' }}
          >
            Filter by Room Type, Location, Rent
          </button>
          <ul
            className="dropdown-menu p-3"
            style={{ width: '100%', maxWidth: '400px', fontSize: '1rem' }}
          >
            <li><strong>Room Type</strong></li>
            {roomTypes.map((type) => (
              <li key={type}>
                <div className="form-check">
                  <input
                    className="form-check-input room-filter"
                    type="checkbox"
                    value={type.toLowerCase()}
                    id={`filter-${type}`}
                    onChange={handleCheckboxChange}
                  />
                  <label className="form-check-label" htmlFor={`filter-${type}`}>
                    {type}
                  </label>
                </div>
              </li>
            ))}

            <li className="mt-2"><strong>Location</strong></li>
            {locations.map((loc) => (
              <li key={loc}>
                <div className="form-check">
                  <input
                    className="form-check-input room-filter"
                    type="checkbox"
                    value={loc.toLowerCase()}
                    id={`filter-${loc}`}
                    onChange={handleCheckboxChange}
                  />
                  <label className="form-check-label" htmlFor={`filter-${loc}`}>
                    {loc}
                  </label>
                </div>
              </li>
            ))}

            <li className="mt-2"><strong>Rent From</strong></li>
            {rents.map((rent) => (
              <li key={rent}>
                <div className="form-check">
                  <input
                    className="form-check-input room-filter"
                    type="checkbox"
                    value={`rent-${rent}`}
                    id={`filter-rent-${rent}`}
                    onChange={handleCheckboxChange}
                  />
                  <label className="form-check-label" htmlFor={`filter-rent-${rent}`}>
                    ₹{rent}+
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="col-md-3 text-end mt-3 mt-md-0">
        <button
          className="btn btn-primary px-4 py-2"
          style={{ fontSize: '1.1rem' }}
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </div>


        <div className="mt-5">
          <h4>Recent Activity</h4>
          <table className="table table-bordered table-striped mt-3">
            <thead>
              <tr>
                <th>Date</th>
                <th>Activity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>01 May 2025</td>
                <td>Rent Paid</td>
                <td><span className="badge bg-success">Success</span></td>
              </tr>
              <tr>
                <td>25 Apr 2025</td>
                <td>Message Sent to Owner</td>
                <td><span className="badge bg-info">Sent</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default TenantDashboard;