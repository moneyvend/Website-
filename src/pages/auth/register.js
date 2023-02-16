/* eslint-disable prefer-template */
/* eslint-disable max-len */
/* eslint-disable indent */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import { register, reset } from '../../features/authentication/signupSlice';
import registerStyle from './register.module.scss';
import AppImages from '../../utilities/images/images';
import ErrorModal from '../../components/Modals/errorModal';
import Loader from '../../components/Loader/Loader';

export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [match, setMatch] = useState('');
  const [phone, setPhone] = useState('');
  const [errorModal, setErrorModal] = useState(false);
  const [formDate, setFormDate] = useState({
    fullname: '',
    email: '',
    password: '',
    password2: '',
    frontendUrl: 'https://monievend.netlify.app/',
  });

  // console.log(window.location.hostname);

  const {
    fullname,
    email,
    password,
    password2,
  } = formDate;

  if (phone.charAt(0) === '0') {
    setPhone(phone.replace('0', ''));
  }

  const {
    user,
    isLoading,
    isError,
    isSuccess,
    message,
  } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      setErrorModal(true);
    }
    if (isSuccess || user) {
      navigate('/auth/verify-email');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormDate((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      setMatch('Password do not match');
    } else {
      // const userData = {
        // fullname,
        // email,
        // phone: '+234' + phone,
        // password,
        // frontendUrl: 'https://monievend.netlify.app/',
      // };
      // dispatch(register(userData));
      // setMatch('');

      const item = { fullname, email, phone, password };
      let result = fetch('https://monievend.herokuapp.com/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(item),
      });
      result = item.JSON();
      localStorage.setItem("user-info", JSON.stringify(result));
      navigate('./verifyEmail');
    }

  };

  // regeter api integration

  return (
    <section className={registerStyle.holdAll}>
      <div className={registerStyle.holdFormNText}>
        <div className={registerStyle.holdText}>
          <div className={registerStyle.holdImage}>
            <img src={AppImages.LOGO_VERT} alt="Logo" />
          </div>
          <div>
            <h3>Creating payment solutions</h3>
            <p>A product which specializes in creating terminal solution products for customers, SME&apos;s and merchants. </p>
          </div>
        </div>
        <div className={registerStyle.holdForm}>
          <div className={registerStyle.holdImage}>
            <img src={AppImages.LOGO_VERT} alt="Logo" />
          </div>
          <div className={registerStyle.headerText}>
            <h3>Create Account</h3>
            <p>Please sign up by creating a personal account to  access all payment services and unique products</p>
          </div>
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="formBasicFullName">
              <Form.Label>Full name</Form.Label>
              <Form.Control type="text" placeholder="Full name" name="fullname" value={fullname} onChange={onChange} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" name="email" value={email} onChange={onChange} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPhoneNumber">
              <Form.Label>
                Phone number
                <span className={registerStyle.dont}>(Please don&apos;t include the first 0 of your phone number)</span>
              </Form.Label>
              <Form.Control type="number" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" name="password" value={password} onChange={onChange} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword2">
              <Form.Label>Re-type password</Form.Label>
              <Form.Control type="password" placeholder="Password" name="password2" value={password2} onChange={onChange} />
              <Form.Text className="text-muted">
                {match}
              </Form.Text>
            </Form.Group>

            <p className={registerStyle.already}>
              Already have an account?
              <Link to="/auth/login">Login</Link>
            </p>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </div>
      </div>
      {isError ? <ErrorModal show={errorModal} onHide={() => setErrorModal(false)} errorMsg={message} /> : null}
      {isLoading ? <Loader /> : null}
    </section>
  );
}
