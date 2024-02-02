import React, { useState } from "react";
import { Button, Grid, Link } from "@mui/material";
import { Box } from "@mui/system";
import Typography from "@mui/material/Typography";
import logo from "./images/logo.png.webp";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Signup = () => {

  const navigate = useNavigate()
  
  // Navigate To Login Function
  const navigateToLogin = () => {
    navigate("/Login")
  }
  // Email Checker Validation State

  const [emailChacker, setEmailChecker] = useState(false);

  const emailValidation = (ourEmail) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // {
    emailRegex.test(ourEmail) ? setEmailChecker(true) : setEmailChecker(false);
    // }
  };

  // Password States
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmfPassword, setShowConfirmPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Form Data States
  const [formdata, setformData] = useState({
    first_Name: "",
    last_Name: "",
    user_Contact: "",
    user_Email: "",
    user_Password: "",
    user_Confirm_Password: "",
  });

  // Target Textfields Data
  const handletargetValues = (event) => {
    setformData({
      ...formdata,
      [event.target.name]: event.target.value,
    });

    emailValidation(formdata.user_Email);
  };
  // Getting All Form Data

  const getFormData = async (event) => {
    try {
      const apiData = {
        first_Name: formdata.first_Name,
        last_Name: formdata.last_Name,
        user_Contact: formdata.user_Contact,
        user_Email: formdata.user_Email,
        user_Password: formdata.user_Password,
        // Exclude confirm password from API request
        // user_Confirm_Password: formdata.user_Confirm_Password,
      };

      await axios.post(
        "http://192.168.10.15/PatientAPIs/api/Patient_L/CreateLogin", apiData);

      setformData({
        first_Name: "",
        last_Name: "",
        user_Contact: "",
        user_Email: "",
        user_Password: "",
        user_Confirm_Password: "",
      });
      // console.log(apiData);
      alert("New User Created Successfully...");
    } catch (error) {
      console.error(`Error message:`, error.message);
    }
  };


  return (
    <div>
      <Grid container>
        {/* Grid item 1 */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              bgcolor: "#01619B",
              color: "white",
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "1.5rem",
            }}
          >
            <Box
              sx={{
                m: "0 3.2rem 0 0",
                width: "250px",
              }}
            >
              <Typography variant="h5">
                Welcome to the MEDIREMOTE PHR
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.5rem",
                width: "300px",
                textTransform: "capitalize",
              }}
            >
              <Typography variant="body1">
                A brand of E-Healthcare Systems and Wireless Communications.
                Current and Future Challenges
              </Typography>
              <Typography variant="caption">
                Copyright &#169; 2023 MEDIREMOTE. All Rights Reserved.
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Grid item 2 */}
        <Grid item xs={12} md={6}>
          {/* Image Section - Top */}

          <Box
            sx={{
              height: "30vh",
              // display: "flex",
              // flexDirection: "column"
            }}
          >
            <Box
              sx={{
                height: "190px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "end",
                gap: "0.2rem",
              }}
            >
              <Box
                component={"img"}
                src={logo}
                sx={{ height: "30px", width: "120px" }}
              ></Box>
              <Typography variant="h6" color={"primary"}>
                Sign-Up Here
              </Typography>
              <Typography variant="caption">
                Enter signup information for your account
              </Typography>
            </Box>
          </Box>

          {/* Form Section - Below */}

          <Grid container spacing={1} p={2}>
            <Grid item xs={6}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  // width: '300px'
                }}
              >
                <Typography
                  variant="button"
                  display="block"
                  color={"primary"}
                  sx={{ textTransform: "capitalize", fontWeight: "bold" }}
                >
                  Step 1: Identify Your-Self
                </Typography>
                {/* <form onSubmit={ getFormData }> */}
                <TextField
                  label="First Name"
                  required
                  variant="outlined"
                  name="first_Name"
                  value={formdata.first_Name}
                  onChange={handletargetValues}
                  error={formdata.first_Name.length <= 4 ? true : false}
                  helperText={
                    formdata.first_Name.length === 0
                      ? ""
                      : formdata.first_Name.length <= 4
                      ? ""
                      : ""
                  }
                />
                <TextField
                  label="Last Name"
                  required
                  variant="outlined"
                  name="last_Name"
                  value={formdata.last_Name}
                  onChange={handletargetValues}
                  error={formdata.last_Name.length <= 4 ? true : false}
                  helperText={
                    formdata.last_Name.length === 0
                      ? ""
                      : formdata.last_Name.length <= 4
                      ? ""
                      : ""
                  }
                />
                <TextField
                  label="Phone Number"
                  type="number"
                  variant="outlined"
                  name="user_Contact"
                  value={formdata.user_Contact}
                  onChange={handletargetValues}
                  error={formdata.user_Contact.length <= 4 ? true : false}
                  helperText={
                    formdata.user_Contact.length === 0
                      ? ""
                      : formdata.user_Contact.length <= 4
                      ? ""
                      : ""
                  }
                />
                {/* </form> */}
                <Box align="left" mt={2}>
                  <Button
                    href=""
                    variant="body1"
                    underline="always"
                    color={"primary"}
                    sx={{
                      textTransform: "capitalize",
                      fontWeight: "bold",
                      fontSize: "15px",
                      textDecoration: "none",
                      color: "#1976D2",
                      "&:hover": { textDecoration: "underline" },
                    }}
                    onClick={() => {
                      navigateToLogin()
                    }}
                  >
                    {"Already have an account? Login"}
                  </Button>
                </Box>
                {/*<Typography
                  variant="button"
                  display="block"
                  color={"primary"}
                  sx={{ textTransform: "capitalize", fontWeight: "bold", cursor: 'pointer' }}
                  mt={2}
                  
                >
                  Already have an account? Login
              </Typography>*/}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <Typography
                  variant="button"
                  display="block"
                  color={"primary"}
                  sx={{ textTransform: "capitalize", fontWeight: "bold" }}
                >
                  Step 2: Choose Username and Password
                </Typography>
                {/* <form  onSubmit={ getFormData }> */}
                <TextField
                  label="Email"
                  required
                  variant="outlined"
                  name="user_Email"
                  value={formdata.user_Email}
                  onChange={handletargetValues}
                  helperText={emailChacker === true ? "" : ""}
                  error={formdata.user_Email && emailChacker ? false : true}
                />
                <FormControl fullWidth variant="outlined">
                  {/*<InputLabel htmlFor="outlined-adornment-password" required>
                    Password
              </InputLabel>*/}
                  <TextField
                    id="outlined-adornment-password"
                    name="user_Password"
                    label="Password"
                    required
                    value={formdata.user_Password}
                    onChange={handletargetValues}
                    type={showPassword ? "text" : "password"}
                    error={formdata.user_Password.length <= 4 ? true : false}
                    helperText={
                      formdata.user_Password.length === 0
                        ? ""
                        : formdata.user_Password.length <= 4
                        ? ""
                        : ""
                    }
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
                </FormControl>
                <FormControl fullWidth variant="outlined">
                  {/*<InputLabel htmlFor="outlined-adornment-password" required>
                    Password
              </InputLabel>*/}
                  <TextField
                    id="outlined-adornment-confpassword"
                    name="user_Confirm_Password"
                    label="Confirm Password"
                    required
                    value={formdata.user_Confirm_Password}
                    onChange={handletargetValues}
                    type={showConfirmfPassword ? "text" : "password"}
                    error={
                      formdata.user_Confirm_Password !==
                        formdata.user_Password ||
                      formdata.user_Confirm_Password.length <= 4
                        ? true
                        : false
                    }
                    helperText={
                      formdata.user_Confirm_Password.length === 0
                        ? ""
                        : formdata.user_Confirm_Password.length <= 4
                        ? ""
                        : ""
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowConfirmPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showConfirmfPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
                {/* </form> */}
                <Box
                  sx={{
                    display: "flex",
                    gap: "1rem",
                    justifyContent: "flex-end",
                    mt: "1rem",
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "black",
                      color: "white",
                      textTransform: "capitalize",
                      borderRadius: "1rem",
                      p: "3px 1rem",
                      fontSize: "1rem",
                    }}
                    disabled
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "black",
                      color: "white",
                      textTransform: "capitalize",
                      borderRadius: "1rem",
                      p: "3px 1rem",
                      fontSize: "1rem",
                    }}
                    disabled={
                      formdata.first_Name &&
                      formdata.last_Name &&
                      formdata.user_Contact &&
                      formdata.user_Email &&
                      emailChacker &&
                      formdata.user_Password.length >= 4 &&
                      formdata.user_Confirm_Password ===
                        formdata.user_Password &&
                      formdata.user_Confirm_Password.length >= 4
                        ? false
                        : true
                    }
                    onClick={() => {
                      getFormData();
                      navigate("/Login")
                    }}
                  >
                    Create
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Signup;
