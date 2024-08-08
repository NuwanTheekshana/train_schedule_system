import React from "react";
import { Link } from 'react-router-dom';
import notFoundImage from '../img/not-found.svg';

function Page404() {
    return (
       <div>
        <main>
            <div class="container">

                <section class="section error-404 min-vh-100 d-flex flex-column align-items-center justify-content-center">
                <h1>404</h1>
                <h2>The page you are looking for doesn't exist.</h2>
                <Link to="/">
                <a class="btn btn-danger">Back to home</a>
                </Link>
                <img src={notFoundImage} class="img-fluid py-5" width="40%" alt="Page Not Found" />
                </section>

            </div>
        </main>
       </div>
    );
}

export default Page404;