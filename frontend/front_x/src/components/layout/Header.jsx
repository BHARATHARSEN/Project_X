import React from 'react';
import px1 from '../../images/px1.png';
import avatar from '../../images/default_avatar.jpg';
import Search from './Search.jsx';
import { useGetMeQuery } from '../../redux/api/userApi.js';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'; // Import Link component

const Header = () => {

  const { isLoading } = useGetMeQuery();

  const { user } = useSelector((state) => state.auth);

  return (
    <nav className="navbar row">
      <div className="col-12 col-md-3 ps-5">
        <div className="navbar-brand">
          <a href="/">
            <img src={px1} alt="Project X Logo" />
          </a>
        </div>
      </div>
      <div className="col-12 col-md-6 mt-2 mt-md-0">
        <Search />
      </div>
      <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
        <a href="/cart" style={{ textDecoration: 'none' }}>
          <span id="cart" className="ms-3">
            Cart
          </span>
          <span className="ms-1" id="cart_count">
            0
          </span>
        </a>

        {user ? (
          <div className="ms-4 dropdown">
            <button
              className="btn dropdown-toggle text-white"
              type="button"
              id="dropDownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <figure className="avatar avatar-nav">
                <img src={avatar} alt="User" className="rounded-circle" />
              </figure>
              <span>User</span>
            </button>
            <div className="dropdown-menu w-100" aria-labelledby="dropDownMenuButton">
              <a className="dropdown-item" href="/admin/dashboard">
                Dashboard
              </a>

              <a className="dropdown-item" href="/me/orders">
                Orders
              </a>

              <a className="dropdown-item" href="/me/profile">
                Profile
              </a>

              <a className="dropdown-item text-danger" href="/">
                Logout
              </a>
            </div>
          </div>
        ) : (
          !isLoading && (
            <Link to="/login" className="btn ms-4" id="login_btn">
              Login
            </Link>
          )
        )}
      </div>
    </nav>
  );
};

export default Header;
