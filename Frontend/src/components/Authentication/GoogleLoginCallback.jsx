import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const GoogleLoginCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const googleToken = urlParams.get("token");

    if (googleToken) {
      const loginWithGoogle = async () => {
        try {
          const response = await fetch(
            "http://localhost:8080/api/authentication/google-login",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                token: googleToken
              })
            }
          );

          if (response.status == 200) {
            const responseData = await response.json();
            localStorage.setItem("accessToken", responseData.message);
            Swal.close();
            navigate("/authentication/user-setup");
          } else {
            const responseData = await response.json();
            showErrorInSwal(responseData.message);
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

  useEffect(() => {
    const handleBackButton = (event) => {
      event.preventDefault();
    };

    window.history.pushState(null, "", window.location.href);
    window.onpopstate = handleBackButton;

    return () => {
      window.onpopstate = null;
    };
  }, []);


  const showErrorInSwal = (message) => {
    Swal.close();
    Swal.fire({
      icon: "error",
      title: "Error",
      text: message,
      showConfirmButton: true,
      allowOutsideClick: true
    }).then(() => navigate("/authentication/login"));
  }

  return <></>;
}

export default GoogleLoginCallback;
