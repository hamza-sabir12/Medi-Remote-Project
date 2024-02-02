import React, { useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Link,
} from "@mui/material";
import logo from "./images/logo.png.webp";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import "./Style.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  // Navigate Function
  const navigate = useNavigate();

  const navigateToAdminPage = () => {
    // navigate("/AdminPage");
  };

  const [showPassword, setShowPassword] = React.useState(false);

  // Email Checker Validation State

  const [emailChacker, setEmailChecker] = useState(false);

  const emailValidation = (ourEmail) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // {
    emailRegex.test(ourEmail) ? setEmailChecker(true) : setEmailChecker(false);
    // }
  };
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // States of  Target Values

  const [data, setdata] = useState({
    user_Email: "",
    user_Password: "",
  });

  
  const targetValues = (event) => {
    setdata({
      ...data,
      [event.target.name]: event.target.value,
    });
    emailValidation(data.user_Email);
  };
  

  const getFormValues = async (e) => {
    e.preventDefault();
    try {
      await axios
        .get(
          `http://192.168.10.15/PatientAPIs/api/Patient_L/Login?UserEmail=${data.user_Email}&UserPassword=${data.user_Password}`
        )
        .then((response) => {
          
          // Navigate when enter the correct Email && Password

          if (
            response.data.result.user_Email &&
            response.data.result.user_Password && response.data.result.role === "Admin"
          ) {

            navigate("/AdminPage");
            alert("Admin : Login Successfully");
          } else {

            alert("User : Login Successfully");
            navigate(`/UserDetails/${response.data.result.user_ID}`)
          }
          console.log(response.data.result)
        });
    } catch (error) {
      console.log("Login failed:", error);
      alert("Login failed: Please Check Your Email or Password.");
    }
  };

  return (
    <>
      <Paper
        elevation={12}
        sx={{ width: "85%", borderRadius: "1.5rem", m: "1.2rem auto" }}
      >
        <Grid
          container
          className="item-1"
          sx={{
            flexDirection: {
              xs: "column-reverse",
              md: "column-reverse",
              lg: "row",
            },
          }}
        >
          <Grid item lg={5} md={12} sm={12} xs={12}>
            <Box sx={{ mt: "5rem", mb: "8rem", ml: "5rem", mr: "5rem" }}>
              <Box
                sx={{ display: "flex", justifyContent: "center", mb: "15px" }}
              >
                <Box
                  component={"img"}
                  src={logo}
                  sx={{ height: "35px", width: "130px" }}
                />
              </Box>
              <form onSubmit={getFormValues}>
                <Box sx={{ mt: "1.5rem" }}>
                  <TextField
                    xs={12}
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    autoComplete="email"
                    autoFocus
                    name="user_Email"
                    value={data.user_Email}
                    onChange={targetValues}
                    helperText={emailChacker === true ? "" : "Email Required"}
                    error={emailChacker === true ? false : true}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Password"
                    // type="password"
                    id="password"
                    autoComplete="current-password"
                    name="user_Password"
                    value={data.user_Password}
                    onChange={targetValues}
                    error={data.user_Password.length <= 4 ? true : false}
                    helperText={
                      data.user_Password.length === 0
                        ? "Password requerd"
                        : data.user_Password.length <= 4
                        ? "Password Must Be 5 Chracture"
                        : ""
                    }
                    type={showPassword ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                <Box sx={{ mt: "1rem" }}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={
                      emailChacker && data.user_Password.length > 4
                        ? false
                        : true
                    }
                    sx={{ mt: 0, mb: 2, borderRadius: 10 }}
                    onClick={() => {
                      navigateToAdminPage();
                    }}
                  >
                    Login
                  </Button>
                </Box>
              </form>
              <Box align="center">
                <Button
                  href=""
                  variant="h6"
                  // underline="always"
                  sx={{
                    color: "#1976D2",
                    fontWeight: "bold",
                    fontSize: "16px",
                    textDecoration: "none",
                    textTransform: "capitalize",
                    "&:hover": { textDecoration: "underline" },
                  }}
                  onClick={() => {
                    navigate("/")
                  }}
                >
                  {"Don't have an account? Sign up"}
                </Button>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
                width: "95%",
                mt: 0,
                mb: "1rem",
                ml: "auto",
                mr: "auto",
                bgcolor: "#e6f0f894",
                p: "1rem 0",
                borderRadius: "12px",
              }}
            >
              <ErrorOutlineIcon sx={{ color: "#339EF4" }} />
              <Typography sx={{ fontSize: "14px" }}>
                Incase of any issues & concerns please contact administrator.
              </Typography>
            </Box>
          </Grid>

          <Grid
            item
            lg={7}
            md={12}
            xs={12}
            sm={12}
            sx={{
              bgcolor: "#01619B",
              borderRadius: {
                xs: "1.5rem",
                sm: "1.5rem",
                lg: "0 1.5rem 1.5rem 0",
              },
            }}
            className="item-2"
          >
            <Box
              sx={{
                m: { xs: "13rem auto", sm: "13rem auto", lg: "13rem 10rem" },
                color: "white",
              }}
            >
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", textAlign: "center" }}
              >
                Welcome to the MEDIREMOTE
              </Typography>
              <Typography
                sx={{
                  m: "10px auto",
                  letterSpacing: "1px",
                  textAlign: "center",
                }}
              >
                A brand of E-Healthcare Systems and Wireless communications.
                Current and Future Challenges
              </Typography>
              <Typography
                sx={{ fontSize: "14px", textAlign: "center", m: "10px auto" }}
              >
                {"Copyright © "} {new Date().getFullYear()} MEDIREMOTE. All
                Rights Reserved.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};
export default Login;

// ***   Remaining task   ***
// Forgot button to perform action hyperlink && cursor pointer. Done
// Mobile responsive to show 1st welcome page. Done
// Show target values to alert. Done
// login button is enabled when required field fill. Done
// JavaScript expression can be execute from left to right.
