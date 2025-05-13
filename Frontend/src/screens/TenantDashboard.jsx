import React from "react";
import { Link } from "react-router-dom";

const TenantDashboard = () => {
 
  return (
    <div className="container-fluid">
  <div className="row min-vh-100">
    {/* Sidebar for md and above */}
    <div className="col-md-2 d-none d-md-block bg-dark text-white p-3">
      <h4 className="text-center mb-4">Tenant Panel</h4>
      <ul className="nav flex-column">
        <li className="nav-item">
          <a href="#" className="nav-link text-white">My property</a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link text-white">Payment details</a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link text-white">Message</a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link text-white">Profile setting</a>
        </li>
        <li className="nav-item">
          <Link to="/" className="nav-link text-white">Logout</Link>
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
                                Payment details
                              </a>
                            </li>
                            <li class="nav-item my-1">
                              <a class="nav-link" href="#" className="fw-bold text-info text-decoration-none">
                                Messages
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
      <nav className="navbar navbar-light bg-light px-4">
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