import React from 'react';
import Signup from './screens/Signup';
import Login from './screens/Login';
import OwnerDashboard from './screens/OwnerDashboard';
import TenantDashboard from './screens/TenantDashboard';
import TenantDetails from './screens/TenantDetails';
import RentOverview from './screens/RentOverview';
import Myproperties from './screens/Myproperties';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import {Provider} from 'react-redux';
import { Store } from './reduxsetup/Store';



const App = ()=>{

  let token = localStorage.getItem("token");
  let usertype = null;

  const data = localStorage.getItem("signupdata");
  if (data) {
    try {
      usertype = JSON.parse(data).usertype;
    } catch (e) {
      console.error("Invalid JSON in localStorage for signupdata");
    }
  }


      return(
         
            <Provider store={Store}>
                <BrowserRouter>
               <Routes>
                  <Route path='/' element={token ? usertype === "tenant" ? <TenantDashboard/>:<OwnerDashboard/> : <Login/> }></Route>
                  <Route path='/login' element={<Login/>}></Route>
                  <Route path='/tenant' element={<TenantDashboard/>}></Route>
                  <Route path='/signup' element={<Signup/>}></Route>
                  <Route path='/owner' element={<OwnerDashboard/>}></Route>

                  {/*Owner side url bar routes */}
                  <Route path='/teantdetailsowner' element={<TenantDetails/>}></Route>
                  <Route path='/rentoverviewowner' element={<RentOverview/>}></Route>
                  <Route path='/propertiesowner' element={<Myproperties/>}></Route>

                  {/*end */}
                  
                  {/*Tenant side url bar routes */}
                  


                  

               </Routes>
            
            
            </BrowserRouter>
            </Provider>
        
        
      )
}
export default App

