import React, { useEffect, useState, useRef } from "react";
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
import PendingIcon from "@mui/icons-material/Pending";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const UserDetails = () => {
  // Navigate Function
  // const navigate = useNavigate();

  // Route Params ID
  const { id } = useParams();
  console.log("Routes Params ID: ", id);

  // Function -- Download Pdf File
  // const conponentPDF= useRef();

  // const downloadFile = useReactToPrint({
  //       content: ()=>conponentPDF.current,
  //       documentTitle:"Userdata",
  //       onAfterPrint:()=>alert("Data saved in PDF")
  //   });

  // Pdf url State
  const [pdfUrl, setPdfUrl] = useState("");
  const [showExportButton, setShowExportButton] = useState(true);
  const [showPdf, setShowPdf] = useState(false);

  const closePdfFormat = () => {
    setShowExportButton(true);
    setShowPdf(false);

    // navigate(`/UserDetails/${id}`)
  };

  // Function -- Automatically Call for First Time Fetch Data

  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);

  const [error, setError] = useState(null);
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://192.168.10.15/PatientAPIs/api/Appoinment_Schedule/GetUserByID?user_ID=${id}`
      );
      // console.log("Data 1:", response.data)
      const rowsWithPatIds = response.data.result.Patient.map((row, index) => ({
        id: row.user_ID, // Or generate a unique ID using a library like `uuid`
        ...row,
      }));

      console.log("Data 1: ", rowsWithPatIds);
      setData1(rowsWithPatIds);

      // Another Record -- Schedule Object
      const rowsWithScheduleIds = response.data.result.Schedule.map(
        (row, index) => ({
          id: row.user_ID, // Or generate a unique ID using a library like `uuid`
          ...row,
        })
      );

      console.log("Data 2: ", rowsWithScheduleIds);
      setData2(rowsWithScheduleIds);
    } catch (error) {
      setError(error.message);
    }
  };

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
      head: [["ID", "First Name", "Last Name", "Phone#", "E-mail"]],
      body: data1.map((item) => [
        item.user_ID,
        item.first_Name,
        item.last_Name,
        item.user_Contact,
        item.user_Email,
        item.value,
      ]),
    });

    // Add data from object 2 to PDF
    // doc.addPage();     -- Move Data to next page

    doc.text("Data from Patient Appointment Details", 10, 60);
    doc.autoTable({
      startY: 70,
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
    // { field: "patient_Name", headerName: "Patient Name", width: 90 },

    { field: "id", headerName: "ID", width: 90 },
    {
      field: "first_Name",
      headerName: "First Name",
      width: 150,
      editable: true,
    },
    { field: "last_Name", headerName: "Last Name", width: 150, editable: true },
    { field: "user_Contact", headerName: "Phone#", width: 110, editable: true },
    { field: "user_Email", headerName: "E-Mail", width: 150, editable: true },
    {
      field: "appoinment_Date_Time",
      headerName: "Appointment-Time",
      width: 150,
      editable: true,
    },
    {
      field: "updateTime",
      headerName: "Change-Time",
      width: 140,
      align: "center",
      renderCell: (cellValues) => {
        return (
          <IconButton style={{ color: "green" }}>
            <Tooltip title="Watch Time">
              <UpdateIcon />
            </Tooltip>
          </IconButton>
        );
      },
    },

    {
      field: "status",
      headerName: "Appointment-Status",
      width: 150,
      editable: true,
      renderCell: (cellValues) => {
        return (
          // <IconButton
          //   style={{ gap: 2 , border: '1px solid black'}}
          // >
          <FormControl sx={{ borderRadius: "1.2rem" }}>
            <Button
              sx={{
                bgcolor: "yellow",
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

  //   const rows = [
  //     { id: 1, firstName: "John", lastName: "Jon", phoneNo: 92312457850, email: "salman@gmail.com",
  //      time: "24-02-2012", updateTime: "21-12-2019", status: "Approval"  },
  //     { id: 1, firstName: "John", lastName: "Jon", phoneNo: 92312457850, email: "salman@gmail.com",
  //      time: "24-02-2012", updateTime: "21-12-2019", status: "Approval"  },
  //     { id: 1, firstName: "John", lastName: "Jon", phoneNo: 92312457850, email: "salman@gmail.com",
  //      time: "24-02-2012", updateTime: "21-12-2019", status: "Approval"  },
  //   ];

  // Date States and function
  const [value, setValue] = useState();

  const handleDate = () => {
    console.log(value.$d.toISOString().split("T")[0]);
  };

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
                      value={value}
                      onChange={(newValue) => setValue(newValue)}
                    />
                  </DemoContainer>
                </LocalizationProvider>

                <Button
                  variant="contained"
                  style={{ textTransform: "capitalize" }}
                  onClick={handleDate}
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
      </Box>
    </div>
  );
};

export default UserDetails;
