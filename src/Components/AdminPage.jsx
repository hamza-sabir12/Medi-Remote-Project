import React, { useEffect, useState, useRef } from "react";
import { FormControl, Paper, Tooltip } from "@mui/material";
import { Box } from "@mui/system";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { DataGrid } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import ErrorSharpIcon from "@mui/icons-material/ErrorSharp";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { styled } from "@mui/material/styles";
import Backdrop from "@mui/material/Backdrop";
import Typography from "@mui/material/Typography";
import CancelIcon from "@mui/icons-material/Cancel";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { useReactToPrint } from "react-to-print";

// Modal Style
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "white",
  borderRadius: "1rem",
  boxShadow: 24,
  display: {
    xs: "block",
  },
};

// const rows = [
//   {
//     id: 101,
//     firstName: "Arham",
//     lastName: "Sabir",
//     phoneno: "03042533122",
//     email: "arham@gmail.com",
//   },
//   {
//     id: 102,
//     firstName: "Shahid",
//     lastName: "Ashraf",
//     phoneno: "03042533122",
//     email: "arham@gmail.com",
//   },
//   {
//     id: 103,
//     firstName: "Waseem",
//     lastName: "Khan",
//     phoneno: "03042533122",
//     email: "arham@gmail.com",
//   },
//   {
//     id: 104,
//     firstName: "Akram",
//     lastName: "Abbass",
//     phoneno: "03042533122",
//     email: "arham@gmail.com",
//   },
//   {
//     id: 105,
//     firstName: "Ayub",
//     lastName: "Khan",
//     phoneno: "03042533122",
//     email: "arham@gmail.com",
//   },
//   {
//     id: 106,
//     firstName: "Matt",
//     lastName: "Henry",
//     phoneno: "03042533122",
//     email: "arham@gmail.com",
//   },
//   {
//     id: 107,
//     firstName: "Salman",
//     lastName: "Khan",
//     phoneno: "03042533122",
//     email: "arham@gmail.com",
//   },
//   {
//     id: 108,
//     firstName: "Shahrukh",
//     lastName: "Khan",
//     phoneno: "03042533122",
//     email: "arham@gmail.com",
//   },
//   {
//     id: 109,
//     firstName: "Shahrukh",
//     lastName: "Khan",
//     phoneno: "03042533122",
//     email: "arham@gmail.com",
//   },
//   {
//     id: 110,
//     firstName: "Shahrukh",
//     lastName: "Khan",
//     phoneno: "03042533122",
//     email: "arham@gmail.com",
//   },
// ];

const AdminPage = () => {
  // Modal States
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Navigate Function
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://192.168.10.15/PatientAPIs/api/Patient_L/GetUser"
      );
      const rowsWithIds = response.data.result.map((row, index) => ({
        id: row.user_ID, // Or generate a unique ID using a library like `uuid`
        ...row,
      }));
      setRows(rowsWithIds);

      // console.log("All Data from Api...", rowsWithIds)
    } catch (error) {
      setError(error.message);
    }
  };

  // Function -- Automatically Call for First Time Fetch Data

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    { field: "id", headerName: "User Id", width: 120 },
    { field: "first_Name", headerName: "First Name", width: 130 },
    { field: "last_Name", headerName: "Last Name", width: 130 },
    { field: "user_Contact", headerName: "Phone#", width: 130 },
    { field: "user_Email", headerName: "E-mail", width: 160 },
    {
      field: "actionbtns",
      headerName: "Action-Buttons",
      width: 150,
      renderCell: (cellValues) => {
        return (
          <IconButton style={{ fontSize: "1.2rem" }}>
            <VisibilityIcon style={{ color: "black" }} />
            <Tooltip title="Edit User">
              <IconButton
                onClick={() => {
                  handleUpdate(cellValues);
                }}
              >
                <EditIcon style={{ color: "#1976D2" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete User">
              <IconButton
                onClick={() => {
                  handleDelete(cellValues.row.user_ID);
                }}
              >
                <DeleteIcon style={{ color: "red" }} />
              </IconButton>
            </Tooltip>
            <ErrorSharpIcon style={{ color: "black" }} />
          </IconButton>
        );
      },
    },
    {
      field: "appointmenthandlers",
      headerName: "Appointment Handlers",
      width: 190,
      align: "center",
      renderCell: (cellValues) => {
        return (
          // <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid black' }}>
          <IconButton align="center" style={{ display: "flex", gap: "0.2rem" }}>
            <AddCircleIcon
              align="center"
              style={{ fontSize: "1.4rem", color: "green" }}
            />
            <CheckCircleIcon style={{ fontSize: "1.4rem", color: "#1976D2" }} />
          </IconButton>

          // </div>
        );
      },
    },
    {
      field: "appointmentstatus",
      headerName: "Appointment Status",
      width: 150,
      renderCell: (cellValues) => {
        return (
          // <IconButton
          //   style={{ gap: 2 , border: '1px solid black'}}
          // >
          <FormControl
            sx={{ borderRadius: "1.2rem", "&:hover": { bgcolor: "yellow" } }}
          >
            <Button
              sx={{
                bgcolor: "#EBEBEB",
                borderRadius: "1.2rem",
                border: "none",
                textTransform: "capitalize",
                color: "black",
              }}
              variant="outlined"
              startIcon={
                <PendingIcon style={{ fontSize: "1.2rem", color: "black" }} />
              }
            >
              Pending...
            </Button>
          </FormControl>
          // </IconButton>
        );
      },
    },
  ];

  // Function -- Fetching Data to Show on Modal Textfields

  const handleUpdate = (oldData) => {
    // Fetching data to show modal textfields
    setRows(oldData.row);

    // Modal Open
    handleOpen();

    // Routing -- Navigate to update-data
    if (oldData.id) {
      navigate(`/AdminPage/${oldData.id}`);
    } else {
      navigate("/AdminPage");
    }
  };

  // Function -- Target Modal Textfields Values
  const targetModalValue = (event) => {
    event.preventDefault();
    setRows({
      ...rows,
      [event.target.name]: event.target.value,
    });
  };

  // Function -- Update Function
  const updateModalValues = async () => {
    console.log(rows.user_ID);
    try {
      // Make a PUT request to the API endpoint with the updated data
      const response = await axios.put(
        `http://192.168.10.15/PatientAPIs/api/Patient_L/UpdateUser?user_ID=${rows.user_ID}`,
        rows
      );

      // Handle the response or update the local state as needed
      alert("Updated Successfully...");
      // console.log('Data updated successfully:', response.data);
      handleClose(); // Modal Close
      fetchData(); // Again Fetch Function
    } catch (error) {
      // Handle errors
      console.error("Error updating data:", error);
    }
  };

  // Function -- Delete Record

  const handleDelete = async (deleteID) => {
    // Routing -- Navigate to update-data
    if (deleteID) {
      navigate(`/AdminPage/${deleteID}`);
      const confirmation = window.confirm(
        `Are you sure you want to delete this user ${deleteID}`
      );
      if (confirmation) {
        try {
          // Make a DELETE request to the API endpoint

          await axios.delete(
            `http://192.168.10.15/PatientAPIs/api/Patient_L/DeleteUser?user_ID=${deleteID}`
          );

          // Filter out the deleted item from the state
          const deletedRows = rows.filter((row) => row.user_ID !== deleteID);
          console.log(deletedRows);
          setRows(deletedRows);

          alert("Record Deleted Successfully...");

          handleClose(); // Modal Close
          fetchData(); // Again Fetch Function
        } catch (error) {
          console.error("Error deleting data:", error);
        }
      } else {
        navigate("/AdminPage");
      }
    } else {
      alert("no record found...");
    }
  };

  const conponentPDF= useRef();

  const downloadFile = useReactToPrint({
        content: ()=>conponentPDF.current,
        documentTitle:"Userdata",
        onAfterPrint:()=>alert("Data saved in PDF")
    });


  // Function -- Download Pdf File
  //const downloadFile = async () => {

    // ****************** Using document Approach to download data in Pdf file **************************
    
    // ****************** Simple Approach to download data in Pdf file **************************

    // const doc = new jsPDF({ orientation: "landscape" });

    // // Extract data from rows and columns
    // const data = rows.map(row => {
    //   const rowData = {};
    //   columns.forEach(column => {
    //     rowData[column.field] = row[column.field];
    //   });
    //   return rowData;
    // });
    
    // // Create PDF table
    // doc.autoTable({
    //   // html: "#my-datagrid-id",
    //   head: [columns.map(col => col.headerName)],
    //   body: data.map(row => columns.map(col => row[col.field])),
    // });

    // doc.save("Data.pdf");
  //};

  return (
    <div>
      <Paper>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                p: "0.5rem 1rem",
                bgcolor: "#1976D2",
                gap: "1rem",
              }}
            >
              <Button
                sx={{ color: "white", border: "1px solid white" }}
                variant="contained"
                onClick={() => {
                  downloadFile();
                }}
              >
                Export File
              </Button>
              <Button sx={{ color: "white" }} variant="text">
                Add-Patients
              </Button>
              <Button
                sx={{ color: "white" }}
                variant="text"
                onClick={() => {
                  navigate("/Login");
                }}
              >
                Logout
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12}>
          <div style={{width:'100%'}}>
            <Paper style={{ height: 500, width: "100%" }}>
              <DataGrid
                id="my-datagrid-id"
                ref={conponentPDF}
                rows={rows}
                columns={columns}
                pageSize={5}
                //   checkboxSelection
                disableSelectionOnClick
              />
              {error && <p>Error: {error}</p>}
            </Paper>
            </div>
          </Grid>
        </Grid>

        {/* Design Modal Page*/}

        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          // onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={open}>
            <Box sx={style}>
              <Box
                sx={{
                  bgcolor: "#2B5690",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "5px 1rem",
                  borderTopRightRadius: "1rem",
                  borderTopLeftRadius: "1rem",
                }}
              >
                <Typography sx={{ color: "white" }}>Edit Patient</Typography>
                <IconButton
                  onClick={() => {
                    handleClose();
                    navigate("/AdminPage");
                    fetchData();
                  }}
                >
                  <CancelIcon
                    sx={{
                      color: "white",
                      fontSize: "2.1rem",
                      "&:hover": { color: "#cddc39" },
                    }}
                  />
                </IconButton>
              </Box>

              {
                // Modal Page Textfields Structure
              }

              <Grid
                container
                justify="space-around"
                spacing={2}
                sx={{ mt: "0.5%", p: "1rem" }}
              >
                <Grid item xs={6}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    <TextField
                      id="outlined-basic"
                      fullWidth
                      label="User ID"
                      variant="outlined"
                      value={rows.id}
                      required
                    />
                    <TextField
                      id="outlined-basic"
                      fullWidth
                      label="Last Name"
                      variant="outlined"
                      name="last_Name"
                      value={rows.last_Name}
                      required
                      onChange={targetModalValue}
                    />
                    <TextField
                      id="outlined-basic"
                      fullWidth
                      label="Phone Number"
                      variant="outlined"
                      name="user_Contact"
                      value={rows.user_Contact}
                      required
                      onChange={targetModalValue}
                    />
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    <TextField
                      id="outlined-basic"
                      fullWidth
                      label="First Name"
                      variant="outlined"
                      name="first_Name"
                      value={rows.first_Name}
                      required
                      onChange={targetModalValue}
                    />
                    <TextField
                      id="outlined-basic"
                      fullWidth
                      label="Email Address"
                      variant="outlined"
                      name="user_Email"
                      value={rows.user_Email}
                      required
                      onChange={targetModalValue}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        gap: "0.5rem",
                        justifyContent: "center",
                        alignItems: "center",
                        mt: "0.5rem",
                      }}
                    >
                      <Button
                        variant="contained"
                        sx={{
                          borderRadius: "2rem",
                          p: "0.5rem 1.2rem",
                          bgcolor: "#252F3E",
                          letterSpacing: "0.1rem",
                        }}
                        onClick={() => {
                          updateModalValues();
                        }}
                      >
                        Update
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => {
                          handleClose();
                          navigate("/AdminPage");
                          fetchData();
                        }}
                        sx={{
                          borderRadius: "2rem",
                          p: "0.5rem 1rem",
                          bgcolor: "#808080",
                          letterSpacing: "0.1rem",
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        </Modal>
      </Paper>
    </div>
  );
};

export default AdminPage;
