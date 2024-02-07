import React, { useEffect, useState } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { IconButton, TextField, Tooltip, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import { DataGrid } from "@mui/x-data-grid";
import UpdateIcon from "@mui/icons-material/Update";
import axios from "axios";
import { useParams } from "react-router-dom";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import dayjs from "dayjs";
import Modal from "@mui/material/Modal";
import CancelIcon from "@mui/icons-material/Cancel";

const UserDetails = () => {

  // Pop-Up Modal Styling

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 450,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 2,
    borderRadius: 6,
  };

  // Modal States
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [isFutureDate, setIsFutureDate] = useState(true); // Initially assume it's a future date

  // Route Params ID
  const { user_ID } = useParams();

  // Pdf url State
  const [pdfUrl, setPdfUrl] = useState("");
  const [showExportButton, setShowExportButton] = useState(true);
  const [showPdf, setShowPdf] = useState(false);

  const closePdfFormat = () => {
    setShowExportButton(true);
    setShowPdf(false);
  };


  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);


  const [error, setError] = useState(null);
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://192.168.10.15/PatientAPIs/api/Appoinment_Schedule/GetUserByID?user_ID=${user_ID}`
      );
      // console.log("Data 1:", response.data.result.Schedule)
      const rowsWithPatIds = response.data.result.Schedule.map(
        (row, index) => ({
          ...row,
          id: index, // Or generate a unique ID using a library like `uuid`
          appoinment_Date_Time: dayjs(row.appoinment_Date_Time).format( "YYYY-MM-DD" ),
        })
      );

      const date = rowsWithPatIds[0].appoinment_Date_Time;
      const formattedDate = dayjs(date).format("YYYY-MM-DD");
      console.log(formattedDate);
      
      setData1(rowsWithPatIds);
      
      // Another Record -- Schedule Object
      const rowsWithScheduleIds = response.data.result.Schedule.map(
        (row, index) => ({
          id: row.user_ID, // Or generate a unique ID using a library like `uuid`
          ...row,
        })
      );

      // console.log("Patient Data: ", rowsWithScheduleIds);
      setData2(rowsWithScheduleIds);
    } catch (error) {
      setError(error.message);
    }
  };

  // Function -- Automatically Call for First Time Fetch Data

  useEffect(() => {
    fetchData();
  }, []);

  const downloadFile = () => {
    setShowExportButton(false);
    setShowPdf(true);

    const doc = new jsPDF();

    // Add data from object 1 to PDF
    doc.text("Data from Patient Details", 10, 10);
    doc.autoTable({
      startY: 20,
      head: [
        [
          "ID",
          "Patient Name",
          "Doctor Name",
          "Appointment Status",
          "Patient Contact",
          "Appointment Date&Time",
        ],
      ],
      body: data1.map((item) => [
        item.user_ID,
        item.patient_Name,
        item.doctor_Name,
        item.appointment_Status,
        item.patient_Contact,
        item.appoinment_Date_Time,
      ]),
    });

    // Add data from object 2 to PDF
    // doc.addPage();     -- Move Data to next page

    doc.text("Data from Patient Appointment Details", 10, 80);
    doc.autoTable({
      startY: 90,
      head: [
        [
          "ID",
          "Patient Name",
          "Doctor Name",
          "Appointment Status",
          "Patient Contact",
          "Appointment Date&Time",
        ],
      ],
      body: data2.map((item) => [
        item.user_ID,
        item.patient_Name,
        item.doctor_Name,
        item.appointment_Status,
        item.patient_Contact,
        item.appoinment_Date_Time,
      ]),
    });

    // doc.save('Data.pdf');

    // Save PDF as blob
    const blob = doc.output("blob");

    // Create blob URL
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
  };

  // Function Starts now
  const columns = [

  // Hide this Columns

    // { field: "patient_Name", headerName: "Patient Name", width: 90 },
    // { field: "first_Name", headerName: "First Name", width: 150, editable: true, },
    // { field: "last_Name", headerName: "Last Name", width: 150, editable: true },
    // { field: "user_Email", headerName: "E-Mail", width: 150, editable: true },

  // Use This Columns 
    { field: "user_ID",
      headerName: "ID",
      width: 90 
    },
    {
      field: "patient_Name",
      headerName: "Patient Name",
      width: 150,
      editable: true,
    },
    {
      field: "doctor_Name",
      headerName: "Doctor Name",
      width: 150,
      editable: true,
    },
    {
      field: "patient_Contact",
      headerName: "Phone#",
      width: 110,
      editable: true,
    },
    {
      field: "appoinment_Date_Time",
      headerName: "Appointment-Time",
      width: 200,
      editable: true,
      align: "center",
    },
    {
      field: "updateTime",
      headerName: "Change-Time",
      width: 140,
      align: "center",
      renderCell: (cellValues) => {
        return (
          <IconButton style={{ color: "green" }}>
            {console.log("Update-Time: ", cellValues.row.appoinment_Date_Time)}
            <Tooltip title="Watch Time">
              <UpdateIcon
                onClick={() => {
                  getModalValues(cellValues);
                }}
              />
            </Tooltip>
          </IconButton>
        );
      },
    },

    {
      field: "appointment_Status",
      headerName: "Appointment-Status",
      width: 150,
      editable: true,
      align: "center",
      renderCell: (cellValues) => {
        return (
          <FormControl
            sx={{
              background:
                cellValues.row.appointment_Status === "Active"
                  ? "#009432"
                  : "#1B1464",
              p: "0.1rem 1rem",
              borderRadius: "1rem",
            }}
          >
            <Typography sx={{ color: "white" }}>
              {cellValues.row.appointment_Status}
            </Typography>
          </FormControl>
        );
      },
    },
  ];

  // Date States and function
  const [dateTimeValue, setdateTimeValue] = useState(dayjs());
  const [modaldateTimeValue, setmodaldateTimeValue] = useState(dayjs());

  const getAppointmentData = async () => {
    try {
      const response = await axios.post(
        "http://192.168.10.15/PatientAPIs/api/Appoinment_Schedule/AddAppoinment",
        {
          user_ID: data1[0].user_ID,
          patient_Name: data1[0].patient_Name,
          doctor_Name: data1[0].doctor_Name,
          patient_Contact: data1[0].patient_Contact,
          appointment_Status: "pending",
          appoinment_Date_Time: new Date(dateTimeValue).toISOString(),
        }
      );

      setdateTimeValue(null); // After Date Set Then Date Field Reset
      console.log("Post request successful:", response);
      // Optionally, you can update the state or fetch data again after the post request
      fetchData(); // Fetch data again after successful post request

      alert("Appointment Created Successfully...");
    } catch (error) {
      console.error(`Error message:`, error.message);
    }
  };

  // Get Modal Values
  const getModalValues = (modalValues) => {
    setData1(modalValues.row);
    console.log("Modal data", data1);
    handleOpen();
  };

  const changeAppointment = async () => {
    try {
      // Make a PUT request to the API endpoint with the updated data
      const response = await axios.put(
        `http://192.168.10.15/PatientAPIs/api/Appoinment_Schedule/UpdateUser?serial_No=${data1.serial_No}`,
        {
          appoinment_Date_Time: new Date(modaldateTimeValue).toISOString(),
          patient_Name: data1.patient_Name,
          doctor_Name: data1.doctor_Name,
          patient_Contact: data1.patient_Contact,
          appointment_Status: data1.appointment_Status,
        }
      );

      alert("Update Appointment Successfully...");

      // Handle the response or update the local state as needed
      console.log('Data updated successfully:', response.data);
    } catch (error) {
      // Handle errors
      console.error("Error updating data:", error);
    }

    handleClose(); // Modal Close
    fetchData(); // Again Fetch Function
  };

  // Function -- Date-Picker
  const handleDateChange = (date) => {
    setdateTimeValue(date);
    const today = dayjs();
    const selectedDate = dayjs(date);
    const isFuture =
      selectedDate.isSame(today, "day") || selectedDate.isAfter(today, "day");
    setIsFutureDate(isFuture);
  };

  // Function -- Modal Date-Picker
  const handleModalDateChange = (date) => {
    setmodaldateTimeValue(date);
    const today = dayjs();
    const selectedDate = dayjs(date);
    const isFuture =
      selectedDate.isSame(today, "day") || selectedDate.isAfter(today, "day");
    setIsFutureDate(isFuture);
  };

  // Get Date Then Show to Modal i-e Previous Date
  const formattedDate = data1.appoinment_Date_Time
    ? dayjs(data1.appoinment_Date_Time).format("YYYY-MM-DD")
    : ""; // Format the date if it exists

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <Typography id="date"></Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography
              variant="h6"
              style={{ textAlign: "center", paddingTop: "1rem" }}
            >
              User Details for taking Appointment
            </Typography>
            <Paper>
              <Box
                sx={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                  pl: "1rem",
                  mb: "1rem",
                }}
              >
                <Typography variant="h6">Please Select Data: </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      label="Set Your Appointment"
                      value={dateTimeValue}
                      // onChange={(newValue) => setdateTimeValue(newValue)}
                      onChange={handleDateChange}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </DemoContainer>
                </LocalizationProvider>

                <Button
                  variant="contained"
                  style={{ textTransform: "capitalize" }}
                  onClick={getAppointmentData}
                  disabled={!isFutureDate}
                >
                  Set Appointment
                </Button>
              </Box>
              <Box sx={{ textAlign: "right", p: "5px 10rem" }}>
                {showExportButton ? (
                  <Button
                    variant="contained"
                    onClick={() => {
                      downloadFile();
                    }}
                  >
                    Export File
                  </Button>
                ) : (
                  <Button variant="contained" onClick={closePdfFormat}>
                    Cancel
                  </Button>
                )}
              </Box>
              <Box sx={{ height: 400, width: "100%" }}>
                {showPdf
                  ? pdfUrl && (
                      <div style={{ marginTop: "20px" }}>
                        <iframe
                          src={pdfUrl}
                          width="100%"
                          height="600px"
                          title="PDF"
                        />
                      </div>
                    )
                  : ""}

                <DataGrid
                  // ref={conponentPDF}
                  rows={data1}
                  columns={columns}
                  // If hide toolbar in Data grid table
                  //            components={{
                  //   Pagination: () => null, // Hide pagination toolbar
                  // }}
                  initialState={
                    {
                      // pagination: {
                      //   paginationModel: {
                      //     pageSize: 5,
                      //   },
                      // },
                    }
                  }
                  // pageSizeOptions={[5]}
                  // checkboxSelection
                  // disableRowSelectionOnClick
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Modal Structure */}

        <Modal
          open={open}
          // onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Box>
              <Box
                sx={{
                  bgcolor: "#2B5690",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "5px 1rem",
                  borderTopRightRadius: "1rem",
                  borderTopLeftRadius: "1rem",
                  mb: "2rem",
                }}
              >
                <Typography sx={{ color: "white" }}>
                  Change Appointment
                </Typography>
                <IconButton
                  onClick={() => {
                    handleClose();
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
              {data1 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  {/*
                    If Data Shows in Modal Fields then use this Textfields
                  <TextField
                    id="outlined-basic"
                    label="User ID"
                    variant="outlined"
                    value={data1.user_ID}
                  />
                  <TextField
                    id="outlined-basic"
                    label="Patient Name"
                    variant="outlined"
                    value={data1.patient_Name}
                  />
                  <TextField
                    id="outlined-basic"
                    label="Contact No"
                    variant="outlined"
                    value={data1.patient_Contact}
                />*/}

                  <Typography
                    variant="h6"
                    gutterBottom
                    style={{ textTransform: "capitalize" }}
                  >
                    Your Previous Date: {formattedDate}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      style={{ textTransform: "capitalize" }}
                    >
                      Change Date:
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                          label="Change Appointment"
                          value={modaldateTimeValue}
                          onChange={handleModalDateChange}
                          // onChange={(newValue) => setmodaldateTimeValue(newValue)}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </Box>
                  <Button
                    variant="contained"
                    disabled={!isFutureDate}
                    onClick={() => {
                      changeAppointment();
                    }}
                  >
                    Update Appointment
                  </Button>
                </div>
              ) : (
                <div>Loading......</div>
              )}
            </Box>
          </Box>
        </Modal>
      </Box>
    </div>
  );
};

export default UserDetails;
