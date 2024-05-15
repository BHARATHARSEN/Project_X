import React, { useEffect, useState } from 'react';
import {countries} from 'countries-list';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingInfo } from '../../redux/features/cartSlice';
import { useNavigate } from 'react-router-dom';

const Shipping = () => {
  console.log(countries);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const countriesList = Object.values(countries);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');

  const {shippingInfo} = useSelector((state) => state.cart)

  useEffect(() => {
    if(shippingInfo){
      setAddress(shippingInfo?.address);
      setCity(shippingInfo?.city);
      setPhoneNo(shippingInfo?.phoneNo);
      setZipCode(shippingInfo?.zipCode);
      setCountry(shippingInfo?.country);
    }

  },[shippingInfo])

  const submitHandler = (event) => {
    event.preventDefault();
    // Add your form submission logic here
    dispatch(saveShippingInfo({address, city,phoneNo, zipCode, country }));
    navigate("/confirm_order");
  };

  return (
    <>
      <div className="row wrapper mb-5">
        <div className="col-10 col-lg-5">
          <form
            className="shadow rounded bg-body"
            onSubmit={submitHandler}
          >
            <h2 className="mb-4">Shipping Info</h2>
            <div className="mb-3">
              <label htmlFor="address_field" className="form-label">
                Address
              </label>
              <input
                type="text"
                id="address_field"
                className="form-control"
                name="address"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="city_field" className="form-label">
                City
              </label>
              <input
                type="text"
                id="city_field"
                className="form-control"
                name="city"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="phone_field" className="form-label">
                Phone No
              </label>
              <input
                type="tel"
                id="phone_field"
                className="form-control"
                name="phoneNo"
                value={phoneNo}
                onChange={(event) => setPhoneNo(event.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="zip_code_field" className="form-label">
                Zip Code
              </label>
              <input
                type="number"
                id="zip_code_field"
                className="form-control"
                name="zipCode"
                value={zipCode}
                onChange={(event) => setZipCode(event.target.value)}
                required
              />
            </div>

            <div className="mb-3">
                {/* countries-list Using this package to get all the countries (npm i countries- list)*/}
              <label htmlFor="country_field" className="form-label">
                Country
              </label>
              <select
                id="country_field"
                className="form-select"
                name="country"
                value={country}
                onChange={(event) => setCountry(event.target.value)}
                required
              >
                {countriesList?.map((country) => (
                  <option key={country?.name} value={country?.name}>
                    {country?.name}
                  </option>
                ))}
              </select>
            </div>

            <button id="shipping_btn" type="submit" className="btn w-100 py-2">
              CONTINUE
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Shipping;