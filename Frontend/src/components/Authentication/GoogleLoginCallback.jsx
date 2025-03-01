import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";

const GoogleLoginCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const googleToken = urlParams.get('token');

    if (googleToken) {
      const loginWithGoogle = async () => {
        try {
          const response = await fetch('http://localhost:8080/api/authentication/google-login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: googleToken }),
          });

          if (response.ok) {
            const data = await response.json();
            localStorage.setItem('accessToken', data.message);
            Swal.close();
            navigate('/dashboard');
          } else {
            const data = await response.json();
            showErrorInSwal(data.message);
          }
        } catch (error) {
          showErrorInSwal(error);
        }
      };

      swalLoading();
      loginWithGoogle();
    }
  }, []);

  const swalLoading = () => {
    Swal.fire({
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  const showErrorInSwal = (message) => {
    Swal.close();
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      showConfirmButton: true,
      allowOutsideClick: true
    }).then(() => {
      navigate('/authentication/login');
    });;
  }

  return <></>;
};

export default GoogleLoginCallback;
