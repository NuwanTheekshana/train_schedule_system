import React, { useEffect } from 'react';
import Navbar from './Navbar';
import { Link, useNavigate } from 'react-router-dom';
import homeimg from './img/ent_img.avif';

function Home() {


  return (
    
    <div>
        <Navbar />

        <main>
            <div class="container">

                <section class="section error-404 min-vh-100 d-flex flex-column align-items-center justify-content-center">
                <h1>Welcome</h1>
                <h2>Railway Ticketing System</h2>
                
                <img src={homeimg} class="img-fluid py-5" width="40%" alt="Page Not Found" />
                </section>

            </div>
        </main>
       
    </div>


    


  );
}

export default Home;
