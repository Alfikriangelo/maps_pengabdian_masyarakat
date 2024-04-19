import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Typography as MuiTypography, MenuItem } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import "leaflet/dist/leaflet.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { useNavigate } from "react-router-dom";
import { faMapMarker } from "@fortawesome/free-solid-svg-icons";
import "./TambahWarga.css";
import maps1 from "../icons/maps.jpg";
import pin from "../icons/placeholder.png";

library.add(faMapMarker);

export default function TambahWarga({
  jumlahIstri,
  setJumlahIstri,
  jumlahAnak,
  setJumlahAnak,
}) {
  const [formData, setFormData] = useState({
    name: "",
    nik: "",
    address: "",
    ttl: "",
    job: "",
    blok: "",
    no: "",
    lastEdu: "",
    taxNumber: "",
    bpjsNumber: "",
    numberOfVehicles: 0,
    vehicleType: [""],
    vehicleNumber: [""],
    numberOfComments: 0,
    additionalComments: [""],
    statusKTP: "",
    statusKK: "",
    fotoHome: null,
    fotoHome2: null,
    fotoDiri: null,
    coordinates: { lat: 0, lng: 0 },
    status: "", // Dropdown untuk status pernikahan
    namaIstri: [""], // Nama istri
    nikIstri: [""], // NIK istri
    statusktpIstri: [],
    samaDenganSuami: {},
    samaDenganAyah: {},
    namaAnak: [""], // Nama anak
    nikAnak: [""], // NIK anak
    usiaAnak: [""], // Usia anak
    statusktpAnak: [],
    statusAnak: [""],
    alamatAnak: [""],
    alamatIstri: [""],
    jumlahAnak: [""],
    jumlahIstri: [""],
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const initialCoordinatesRef = useRef(null);
  const steps = ["Langkah 1", "Langkah 2"];

  useEffect(() => {
    // Set initial coordinates
    initialCoordinatesRef.current = formData.coordinates;
  }, [formData.coordinates]);

  const [isMapReady, setIsMapReady] = useState(false);

  // Merender peta hanya setelah mendapatkan koordinat
  useEffect(() => {
    if (initialCoordinatesRef.current) {
      setIsMapReady(true);
    }
  }, [initialCoordinatesRef.current]);


  const [activeStep, setActiveStep] = React.useState(0);
  const navigate = useNavigate();

  const handleNextStep = () => {
    if (formData.status === "lajang") {
      setActiveStep(steps.length);
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleSubmit = async (e) => {
    const formDataToSend = new FormData();
    const dataKeluarga = [];

    // Menambahkan data ke formDataToSend
    Object.entries(formData).forEach(([key, value]) => {
      // Mengecualikan properti tertentu
      if (
        key !== "namaIstri" &&
        key !== "nikIstri" &&
        key !== "samaDenganSuami" &&
        key !== "samaDenganAyah" &&
        key !== "namaAnak" &&
        key !== "nikAnak" &&
        key !== "usiaAnak"
      ) {
        if (Array.isArray(value)) {
          // Jika value adalah array, filter elemen yang tidak kosong
          const filteredArray = value.filter((item) => item !== "");
          if (filteredArray.length > 0) {
            // Jika array masih memiliki isi setelah difilter, tambahkan ke formDataToSend
            filteredArray.forEach((item, index) => {
              formDataToSend.append(`${key}[${index}]`, item);
            });
          }
        } else if (key === "coordinates") {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          // Lainnya tambahkan ke formDataToSend
          formDataToSend.append(key, value);
        }
      }
    });
    // Menambahkan dataKeluarga ke formDataToSend
    formDataToSend.append("image_url", JSON.stringify(dataKeluarga));

    console.log("FormDataToSend:");
    formDataToSend.forEach((value, key) => {
      console.log(key, value);
    });

    // Kirim data ke backend
    const response = await fetch("http://localhost:5000/save_data", {
      method: "POST",
      body: formDataToSend,
    });

    if (response.ok) {
      console.log("Data saved successfully");
      // Handle kesuksesan, misalnya redirect atau tindakan lainnya
    } else {
      console.error("Failed to save data");
      // Handle kegagalan, misalnya menampilkan pesan kesalahan kepada pengguna
    }
    setActiveStep(steps.length);
  };

  return (
    <React.Fragment>
      <AppBar
        position="absolute"
        color="default"
        elevation={0}
        sx={{
          position: "relative",
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      ></AppBar>
      <Container
        component="main"
        maxWidth="md"
        sx={{
          mb: 4,
          margin: "auto",
        }}
      >
        <form
          id="dataForm"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          style={{ maxWidth: "650px", margin: "auto", alignItems: "center" }}
        >
          <Paper
            variant="outlined"
            sx={{
              my: { xs: 3, md: 6 },
              p: { xs: 2, md: 3 },
              borderRadius: 3,
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              align="center"
              sx={{ my: 4, paddingBottom: "20px" }}
            >
              Form Tambah Warga
            </Typography>
            {activeStep === steps.length ? (
              // Jika kita sudah mencapai langkah terakhir, tampilkan pesan keberhasilan
              <React.Fragment>
                <Typography variant="h5" textAlign="center" sx={{ my: 4 }}>
                  Pendaftaran Anda Berhasil!
                </Typography>
                <Button
                  sx={{ mt: 3, mx: "auto", display: "block" }}
                  variant="outlined"
                  onClick={() => navigate("/maps")}
                  style={{ textTransform: "none" }}
                >
                  Kembali
                </Button>
              </React.Fragment>
            ) : (
              // Jika belum mencapai langkah terakhir, tampilkan form berikutnya
              <React.Fragment>
                {/* Render form sesuai dengan langkah saat ini */}
                {activeStep === 0 && (
                  <AddressForm
                    formData={formData}
                    setFormData={setFormData}
                    setIsFormValid={setIsFormValid}
                  />
                )}
                {activeStep === 1 && (
                  <AddressForm2
                    formData={formData}
                    setFormData={setFormData}
                    setIsFormValid={setIsFormValid}
                  />
                )}
                {/* Tambahkan tombol "Next" untuk melanjutkan ke langkah berikutnya */}
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                    sx={{ mt: 3, ml: 1 }}
                    variant="outlined"
                    onClick={() => navigate("/maps")}
                    style={{ textTransform: "none" }}
                  >
                    Kembali
                  </Button>
                  <Button
                    type="button"
                    onClick={(e) => {
                      if (
                        activeStep === steps.length - 1 ||
                        formData.status === "lajang"
                      ) {
                        handleSubmit();
                      } else {
                        handleNextStep();
                      }
                    }}
                    variant="contained"
                    sx={{ mt: 3, ml: 1 }}
                    disabled={!isFormValid}
                    style={{ textTransform: "none" }}
                  >
                    {activeStep === steps.length - 1 ||
                    formData.status === "lajang"
                      ? "Kirim"
                      : "Next"}
                  </Button>
                </Box>
              </React.Fragment>
            )}
          </Paper>
        </form>
      </Container>
    </React.Fragment>
  );
}

function AddressForm({ formData, setFormData, setIsFormValid }) {
  const [errorMessages, setErrorMessages] = useState({
    Name: "",
    city: "",
    state: "",
    country: "",
    nik: "",
  });

  const handleChange = (e) => {
    const { value, files, name } = e.target;
    console.log("Index:", name); // Cetak nilai name untuk memeriksa index
    console.log("Value:", value);

    let isValid = true;
    let errorMessagesCopy = { ...errorMessages };

    const validationRules = {
      name: /^[A-Z][a-zA-Z\s]*$/,
      city: /^[A-Z][a-zA-Z\s]*$/,
      state: /^[A-Z][a-zA-Z\s]*$/,
      country: /^[A-Z][a-zA-Z\s]*$/,
    };

    if (name in validationRules) {
      if (typeof validationRules[name] === "function") {
        isValid = validationRules[name](value);
      } else {
        isValid = validationRules[name].test(value);
      }
    }

    if (!isValid) {
      errorMessagesCopy[name] = `Huruf awal merupakan huruf besar`;
    } else {
      errorMessagesCopy[name] = ""; // Bersihkan pesan kesalahan jika valid
    }

    setErrorMessages(errorMessagesCopy);
    setIsFormValid(
      Object.values(errorMessagesCopy).every((message) => !message)
    );

    setFormData((prevData) => {
      // Tangani perubahan untuk usia anak
      if (name.startsWith("usiaAnak")) {
        setUsiaAnak((prevUsia) => ({
          ...prevUsia,
          [name]: value,
        }));
      }
      // Tangani perubahan untuk nama istri dan nik istri
      else if (name.startsWith("samaDenganSuami")) {
        console.log(name);
        const index = parseInt(name.match(/\d+/)[0]);
        const alamatName = `alamatIstri${index}`;
        console.log(value);
        if (value === true) {
          return {
            ...prevData,
            [alamatName]: prevData.address || "",
            [name]: value,
          };
        } else {
          console.log(formData.address);
          return {
            ...prevData,
            [alamatName]: prevData[alamatName] || "",
            [name]: value,
          };
        }
      } else if (name.startsWith("vehicleType")) {
        const index = parseInt(name.match(/\d+/)[0]);
        const tipe = `vehicleType${index}`;
        return {
          ...prevData,
          [tipe]: prevData[tipe] || "",
          [name]: value,
        };
      } else if (name.startsWith("vehicleNumber")) {
        const index = parseInt(name.match(/\d+/)[0]);
        const number = `vehicleNumber${index}`;
        return {
          ...prevData,
          [number]: prevData[number] || "",
          [name]: value,
        };
      } else if (name.startsWith("samaDenganAyah")) {
        console.log(name);
        const index = parseInt(name.match(/\d+/)[0]);
        const alamatName = `alamatAnak${index}`;
        console.log(value);

        if (value === true) {
          console.log(formData.address);
          return {
            ...prevData,
            [alamatName]: prevData.address || "",
            [name]: value,
          };
        } else {
          console.log(formData.alamatName);
          return {
            ...prevData,
            [alamatName]: prevData[alamatName] || "",
            [name]: value,
          };
        }
      } else if (
        (name === "fotoHome" || name === "fotoHome2") &&
        files &&
        files[0]
      ) {
        return {
          ...prevData,
          [name]: files[0],
        };
      } else if (name === "fotoDiri" && files && files[0]) {
        return {
          ...prevData,
          [name]: files[0],
        };
      } else if (
        name.startsWith("alamatAnak") ||
        name.startsWith("alamatIstri")
      ) {
        // Tangani perubahan untuk alamatAnak dan alamatIstri
        return {
          ...prevData,
          [name]: value,
        };
      } else {
        console.log("Before status change10:", prevData.coordinates);
        console.log("Name:", name);
        console.log("Files:", files && files[0]);
        console.log("Value:", value);

        return {
          ...prevData,
          [name]: value,
        };
      }
    });
  };
  // Fungsi untuk menambah istri ke dalam array

  const handleNik = (e) => {
    const { name, value, files } = e.target;

    let isValid = true;
    let errorMessagesCopy = { ...errorMessages };

    const validationRules = {
      nik: (value) => !isNaN(Number(value)) && value.length === 16,
    };

    if (name in validationRules) {
      if (typeof validationRules[name] === "function") {
        isValid = validationRules[name](value);
      } else {
        isValid = validationRules[name].test(value);
      }
    }

    if (!isValid) {
      errorMessagesCopy[name] = `Harus angka dan 16 digit`;
    } else {
      errorMessagesCopy[name] = "";
    }

    setErrorMessages(errorMessagesCopy);
    setIsFormValid(
      Object.values(errorMessagesCopy).every((message) => !message)
    );

    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "image" ? files[0] : value,
    }));
  };

  const [showPin, setShowPin] = useState(false);
  const [clickedPosition, setClickedPosition] = useState({ x: 0, y: 0 });

  // Fungsi untuk menangani klik di dalam foto
  const handleImageClick = (event) => {
    // Mendapatkan posisi klik relatif terhadap elemen img
    const boundingRect = event.target.getBoundingClientRect();
    const offsetX = event.clientX - boundingRect.left;
    const offsetY = event.clientY - boundingRect.top;

    // Menyimpan nilai x dan y dari posisi klik
    setClickedPosition({ x: offsetX, y: offsetY });

    setFormData({
      ...formData,
      coordinates: { lat: offsetY, lng: offsetX }, // Koordinat disimpan sebagai { lat: y, lng: x }
    });

    setShowPin(true);
  };

  const [usiaAnak, setUsiaAnak] = useState({});
  const [jumlahIstri, setJumlahIstri] = useState(0);

  const handleUbahstatus = (e) => {
    console.log("Nilai e.target.value:", e.target.value);
    const status = e.target.value;

    setFormData((prevData) => ({
      ...prevData,
      maritalStatus: status,
      spouse: status === "menikah" ? { name: "", children: [] } : null,
    }));

    setJumlahIstri(status === "menikah" ? 1 : 0);
    console.log("New formData:", formData);
    console.log("New jumlahIstri:", jumlahIstri);
  };

  return (
    <React.Fragment>
      <Grid container spacing={2} style={{ paddingLeft: 50, paddingRight: 50 }}>
        <Grid item xs={12}>
          <Typography variant="h6">Data Diri</Typography>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ padding: "20px" }}>
          <TextField
            id="name"
            name="name"
            label="Nama"
            autoComplete="given-name"
            variant="outlined"
            size="small"
            sx={{
              height: "10px",
              width: "220px",

              "& .MuiOutlinedInput-notchedOutline": {
                borderRadius: "8px",
                borderWidth: "1.3px",
                borderColor: "#252525",
              },
            }}
            InputLabelProps={{
              sx: {
                color: "#252525", // Atur warna label
                fontSize: "14px",
                marginLeft: "3px",
              },
            }}
            value={formData.name}
            onChange={handleChange}
            error={!!errorMessages.name}
            helperText={errorMessages.name}
          />
        </Grid>
        <Grid item xs={12} sm={6} sx={{ padding: "20px" }}>
          <TextField
            id="nik"
            name="nik"
            label="NIK"
            fullWidth
            variant="outlined"
            size="small"
            sx={{
              height: "10px",
              width: "220px",

              "& .MuiOutlinedInput-notchedOutline": {
                borderRadius: "8px",
                borderWidth: "1.3px",
                borderColor: "#252525",
              },
            }}
            InputLabelProps={{
              sx: {
                color: "#252525", // Atur warna label
                fontSize: "14px",
                marginLeft: "3px",
              },
            }}
            value={formData.nik}
            onChange={handleNik}
            error={!!errorMessages.nik}
            helperText={errorMessages.nik}
          />
        </Grid>
        <Grid item xs={12} sm={6} sx={{ padding: "20px" }}>
          <TextField
            required
            id="ttl"
            name="ttl"
            label="Tempat Tanggal Lahir"
            variant="outlined"
            size="small"
            sx={{
              height: "10px",
              width: "220px",

              "& .MuiOutlinedInput-notchedOutline": {
                borderRadius: "8px",
                borderWidth: "1.3px",
                borderColor: "#252525",
              },
            }}
            InputLabelProps={{
              sx: {
                color: "#252525", // Atur warna label
                fontSize: "14px",
                marginLeft: "3px",
              },
            }}
            value={formData.ttl}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} sx={{ padding: "20px" }}>
          <TextField
            required
            id="job"
            name="job"
            label="Pekerjaan"
            variant="outlined"
            size="small"
            sx={{
              height: "10px",
              width: "220px",

              "& .MuiOutlinedInput-notchedOutline": {
                borderRadius: "8px",
                borderWidth: "1.3px",
                borderColor: "#252525",
              },
            }}
            InputLabelProps={{
              sx: {
                color: "#252525", // Atur warna label
                fontSize: "14px",
                marginLeft: "3px",
              },
            }}
            value={formData.job}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} sx={{ padding: "20px" }}>
          <TextField
            required
            id="lastEdu"
            name="lastEdu"
            label="Pendidikan Terakhir"
            variant="outlined"
            size="small"
            sx={{
              height: "10px",
              width: "220px",

              "& .MuiOutlinedInput-notchedOutline": {
                borderRadius: "8px",
                borderWidth: "1.3px",
                borderColor: "#252525",
              },
            }}
            InputLabelProps={{
              sx: {
                color: "#252525", // Atur warna label
                fontSize: "14px",
                marginLeft: "3px",
              },
            }}
            value={formData.lastEdu}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} sx={{ padding: "20px" }}>
          <TextField
            id="taxNumber"
            name="taxNumber"
            label="Nomor PBB"
            variant="outlined"
            size="small"
            sx={{
              height: "10px",
              width: "220px",

              "& .MuiOutlinedInput-notchedOutline": {
                borderRadius: "8px",
                borderWidth: "1.3px",
                borderColor: "#252525",
              },
            }}
            InputLabelProps={{
              sx: {
                color: "#252525", // Atur warna label
                fontSize: "14px",
                marginLeft: "3px",
              },
            }}
            value={formData.taxNumber}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} sx={{ padding: "20px" }}>
          <TextField
            id="bpjsNumber"
            name="bpjsNumber"
            label="Nomor BPJS"
            variant="outlined"
            size="small"
            sx={{
              height: "10px",
              width: "220px",

              "& .MuiOutlinedInput-notchedOutline": {
                borderRadius: "8px",
                borderWidth: "1.3px",
                borderColor: "#252525",
              },
            }}
            InputLabelProps={{
              sx: {
                color: "#252525", // Atur warna label
                fontSize: "14px",
                marginLeft: "3px",
              },
            }}
            value={formData.bpjsNumber}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} sx={{ padding: "20px" }}>
          <TextField
            select
            id="status"
            name="status"
            label="Status Pernikahan"
            variant="outlined"
            size="small"
            sx={{
              height: "10px",
              width: "220px",

              "& .MuiOutlinedInput-notchedOutline": {
                borderRadius: "8px",
                borderWidth: "1.3px",
                borderColor: "#252525",
              },
            }}
            InputLabelProps={{
              sx: {
                color: "#252525", // Atur warna label
                fontSize: "14px",
                marginLeft: "3px",
              },
            }}
            value={formData.status || ""}
            onChange={(e) => {
              handleUbahstatus(e);
              handleChange(e);
            }}
          >
            <MenuItem value="lajang">Lajang</MenuItem>
            <MenuItem value="menikah">Menikah</MenuItem>
            <MenuItem value="berkeluarga">Berkeluarga</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Alamat</Typography>
        </Grid>
        <Grid item xs={12} sx={{ padding: "20px" }}>
          <TextField
            id="address"
            name="address"
            label="Alamat Lengkap"
            autoComplete="address"
            variant="outlined"
            size="small"
            color="primary"
            sx={{
              height: "10px",
              width: "479px",

              "& .MuiOutlinedInput-notchedOutline": {
                borderRadius: "8px",
                borderWidth: "1.3px",
                borderColor: "#252525",
              },
            }}
            InputLabelProps={{
              sx: {
                color: "#252525", // Atur warna label
                fontSize: "14px",
                marginLeft: "3px",
              },
            }}
            value={formData.address}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} sx={{ padding: "20px" }}>
          <TextField
            required
            id="blok"
            name="blok"
            label="Blok Rumah"
            variant="outlined"
            size="small"
            sx={{
              height: "10px",
              width: "220px",

              "& .MuiOutlinedInput-notchedOutline": {
                borderRadius: "8px",
                borderWidth: "1.3px",
                borderColor: "#252525",
              },
            }}
            InputLabelProps={{
              sx: {
                color: "#252525", // Atur warna label
                fontSize: "14px",
                marginLeft: "3px",
              },
            }}
            value={formData.blok}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} sx={{ padding: "20px" }}>
          <TextField
            required
            id="no"
            name="no"
            label="Nomor Rumah"
            variant="outlined"
            size="small"
            sx={{
              height: "10px",
              width: "220px",

              "& .MuiOutlinedInput-notchedOutline": {
                borderRadius: "8px",
                borderWidth: "1.3px",
                borderColor: "#252525",
              },
            }}
            InputLabelProps={{
              sx: {
                color: "#252525", // Atur warna label
                fontSize: "14px",
                marginLeft: "3px",
              },
            }}
            value={formData.no}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Kendaraan</Typography>
        </Grid>
        <Grid item xs={12} sx={{ padding: "20px" }}>
          <TextField
            id="numberOfVehicles"
            name="numberOfVehicles"
            label="Jumlah Kendaraan"
            variant="outlined"
            size="small"
            sx={{
              height: "10px",
              width: "220px",

              "& .MuiOutlinedInput-notchedOutline": {
                borderRadius: "8px",
                borderWidth: "1.3px",
                borderColor: "#252525",
              },
            }}
            InputLabelProps={{
              sx: {
                color: "#252525", // Atur warna label
                fontSize: "14px",
                marginLeft: "3px",
              },
            }}
            value={formData.numberOfVehicles}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10) || 0;
              setFormData((prevData) => ({
                ...prevData,
                numberOfVehicles: value,
              }));
            }}
          />
        </Grid>
        {formData.numberOfVehicles > 0 && (
          <React.Fragment>
            {[...Array(formData.numberOfVehicles)].map((_, index) => (
              <Grid
                container
                spacing={2}
                key={index}
                style={{ marginLeft: "1px", marginTop: "0.5px" }}
              >
                <Grid item xs={12} sm={6} sx={{ padding: "20px" }}>
                  <TextField
                    id={`vehicleType${index}`}
                    name={`vehicleType${index}`}
                    label={`Jenis Kendaraan ${index + 1}`}
                    variant="outlined"
                    size="small"
                    sx={{
                      height: "10px",
                      width: "220px",

                      "& .MuiOutlinedInput-notchedOutline": {
                        borderRadius: "8px",
                        borderWidth: "1.3px",
                        borderColor: "#252525",
                      },
                    }}
                    InputLabelProps={{
                      sx: {
                        color: "#252525", // Atur warna label
                        fontSize: "14px",
                        marginLeft: "3px",
                      },
                    }}
                    value={formData[`vehicleType${index}`]}
                    onChange={(e) => handleChange(e, `vehicleType${index}`)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ padding: "20px" }}>
                  <TextField
                    id={`vehicleNumber${index}`}
                    name={`vehicleNumber${index}`}
                    label={`Nomor Kendaraan ${index + 1}`}
                    variant="outlined"
                    size="small"
                    sx={{
                      height: "10px",
                      width: "220px",

                      "& .MuiOutlinedInput-notchedOutline": {
                        borderRadius: "8px",
                        borderWidth: "1.3px",
                        borderColor: "#252525",
                      },
                    }}
                    InputLabelProps={{
                      sx: {
                        color: "#252525", // Atur warna label
                        fontSize: "14px",
                        marginLeft: "3px",
                      },
                    }}
                    value={formData[`vehicleNumber${index}`]}
                    onChange={(e) => handleChange(e, `vehicleNumber${index}`)}
                  />
                </Grid>
              </Grid>
            ))}
          </React.Fragment>
        )}
        <Grid item xs={12}>
          <Typography variant="h6">Keterangan Tambahan</Typography>
        </Grid>
        <Grid item xs={12} sx={{ padding: "20px" }}>
          <TextField
            id="numberOfComments"
            name="numberOfComments"
            label="Jumlah Keterangan Tambahan"
            variant="outlined"
            size="small"
            sx={{
              height: "10px",
              width: "220px",

              "& .MuiOutlinedInput-notchedOutline": {
                borderRadius: "8px",
                borderWidth: "1.3px",
                borderColor: "#252525",
              },
            }}
            InputLabelProps={{
              sx: {
                color: "#252525", // Atur warna label
                fontSize: "14px",
                marginLeft: "3px",
              },
            }}
            value={formData.numberOfComments}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10) || 0;
              setFormData((prevData) => ({
                ...prevData,
                numberOfComments: value,
              }));
            }}
          />
        </Grid>
        {formData.numberOfComments > 0 && (
          <React.Fragment>
            {[...Array(formData.numberOfComments)].map((_, index) => (
              <Grid item xs={12} key={index} sx={{ padding: "20px" }}>
                <TextField
                  id={`additionalComment${index}`}
                  name={`additionalComment${index}`}
                  label={`Keterangan Tambahan ${index + 1}`}
                  variant="outlined"
                  size="small"
                  sx={{
                    height: "10px",
                    width: "479px",

                    "& .MuiOutlinedInput-notchedOutline": {
                      borderRadius: "8px",
                      borderWidth: "1.3px",
                      borderColor: "#252525",
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      color: "#252525", // Atur warna label
                      fontSize: "14px",
                      marginLeft: "3px",
                    },
                  }}
                  value={formData[`additionalComment${index}`]}
                  onChange={(e) => handleChange(e, `additionalComment${index}`)}
                />
              </Grid>
            ))}
          </React.Fragment>
        )}
        <Grid item xs={12}>
          <Typography variant="h6">Kelengkapan Berkas</Typography>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ padding: "20px" }}>
          <TextField
            required
            id="statusKTP"
            name="statusKTP"
            label="KTP"
            variant="outlined"
            size="small"
            sx={{
              height: "10px",
              width: "220px",

              "& .MuiOutlinedInput-notchedOutline": {
                borderRadius: "8px",
                borderWidth: "1.3px",
                borderColor: "#252525",
              },
            }}
            InputLabelProps={{
              sx: {
                color: "#252525", // Atur warna label
                fontSize: "14px",
                marginLeft: "3px",
              },
            }}
            value={formData.statusKTP}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={6} sx={{ padding: "20px" }}>
          <TextField
            required
            id="statusKK"
            name="statusKK"
            label="Kartu Keluarga"
            variant="outlined"
            size="small"
            sx={{
              height: "10px",
              width: "220px",

              "& .MuiOutlinedInput-notchedOutline": {
                borderRadius: "8px",
                borderWidth: "1.3px",
                borderColor: "#252525",
              },
            }}
            InputLabelProps={{
              sx: {
                color: "#252525", // Atur warna label
                fontSize: "14px",
                marginLeft: "3px",
              },
            }}
            value={formData.statusKK}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Kelengkapan Foto</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <label htmlFor="fotoHome">
            <MuiTypography>Foto Rumah tampak Depan</MuiTypography>
          </label>
          <input
            type="file"
            id="fotoHome"
            name="fotoHome"
            accept="image/*"
            onChange={(e) => handleChange(e, "fotoHome")}
            style={{ display: "none" }}
          />
          <label htmlFor="fotoHome">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
            >
              <MuiTypography>Masukkan Foto</MuiTypography>
            </Button>
          </label>
          {formData.fotoHome && (
            <Typography
              variant="body2"
              color="text.secondary"
              style={{ marginLeft: "10px" }}
            >
              File terpilih:
              {formData.fotoHome.name}
            </Typography>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <label htmlFor="fotoHome2">
            <MuiTypography>Foto Rumah tampak Samping</MuiTypography>
          </label>
          <input
            type="file"
            id="fotoHome2"
            name="fotoHome2"
            accept="image/*"
            onChange={(e) => handleChange(e, "fotoHome2")}
            style={{ display: "none" }}
          />
          <label htmlFor="fotoHome2">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
            >
              <MuiTypography>Masukkan Foto</MuiTypography>
            </Button>
          </label>
          {formData.fotoHome2 && (
            <Typography
              variant="body2"
              color="text.secondary"
              style={{ marginLeft: "10px" }}
            >
              File terpilih:
              {formData.fotoHome2.name}
            </Typography>
          )}
        </Grid>
        <Grid
          item
          xs={12}
          style={{ textAlign: "left" }}
          sx={{ padding: "20px" }}
        >
          <label htmlFor="fotoDiri">
            <MuiTypography>Foto Diri</MuiTypography>
          </label>
          <input
            type="file"
            id="fotoDiri"
            name="fotoDiri"
            accept="image/*"
            onChange={(e) => handleChange(e, "fotoDiri")}
            style={{ display: "none" }}
          />
          <label htmlFor="fotoDiri">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
            >
              <MuiTypography>Masukkan Foto</MuiTypography>
            </Button>
          </label>
          {formData.fotoDiri &&
            formData.fotoDiri.name && ( // Pengecekan formData.fotoKK.name
              <Typography
                variant="body2"
                color="text.secondary"
                style={{ marginLeft: "10px" }}
              >
                File terpilih: {formData.fotoDiri.name}
              </Typography>
            )}
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ padding: "20px" }}>
            <Typography>Tentukan Pinpoint Rumah</Typography>
            {/* Menampilkan foto dan menambahkan event onClick */}
            <div
              style={{ position: "relative", width: "100%", height: "auto" }}
            >
              <img
                src={maps1}
                onClick={handleImageClick}
                style={{ width: "100%", height: "auto" }} // Sesuaikan gaya sesuai kebutuhan
              />
              {/* Menampilkan ikon pin */}
              {showPin &&
                clickedPosition.x !== null &&
                clickedPosition.y !== null && (
                  <div
                    style={{
                      position: "absolute",
                      left: `${clickedPosition.x}px`,
                      top: `${clickedPosition.y}px`,
                      transform: "translate(-50%, -100%)", // Membuat pin muncul di atas titik klik
                    }}
                  >
                    <img
                      src={pin}
                      alt="Icon Pin"
                      style={{ width: "32px", height: "auto" }}
                    />
                  </div>
                )}
            </div>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

function AddressForm2({ formData, setFormData, setIsFormValid }) {
  const [errorMessages, setErrorMessages] = useState({
    Name: "",
    city: "",
    state: "",
    country: "",
    nik: "",
  });

  const handleChange = (e) => {
    const { value, files, name } = e.target;

    let isValid = true;
    let errorMessagesCopy = { ...errorMessages };

    const validationRules = {
      name: /^[A-Z][a-zA-Z\s]*$/,
      city: /^[A-Z][a-zA-Z\s]*$/,
      state: /^[A-Z][a-zA-Z\s]*$/,
      country: /^[A-Z][a-zA-Z\s]*$/,
    };

    if (name in validationRules) {
      if (typeof validationRules[name] === "function") {
        isValid = validationRules[name](value);
      } else {
        isValid = validationRules[name].test(value);
      }
    }

    if (!isValid) {
      errorMessagesCopy[name] = `Huruf awal merupakan huruf besar`;
    } else {
      errorMessagesCopy[name] = ""; // Bersihkan pesan kesalahan jika valid
    }

    setErrorMessages(errorMessagesCopy);
    setIsFormValid(
      Object.values(errorMessagesCopy).every((message) => !message)
    );

    setFormData((prevData) => {
      // Tangani perubahan untuk usia anak
      if (name.startsWith("usiaAnak")) {
        setUsiaAnak((prevUsia) => ({
          ...prevUsia,
          [name]: value,
        }));
      }
      // Tangani perubahan untuk nama istri dan nik istri
      else if (name.startsWith("samaDenganSuami")) {
        console.log(name);
        const index = parseInt(name.match(/\d+/)[0]);
        const alamatName = `alamatIstri${index}`;
        console.log(value);
        if (value === true) {
          return {
            ...prevData,
            [alamatName]: prevData.address || "",
            [name]: value,
          };
        } else {
          console.log(formData.address);
          return {
            ...prevData,
            [alamatName]: prevData[alamatName] || "",
            [name]: value,
          };
        }
      } else if (name.startsWith("vehicleType")) {
        const index = parseInt(name.match(/\d+/)[0]);
        const tipe = `vehicleType${index}`;
        return {
          ...prevData,
          [tipe]: prevData[tipe] || "",
          [name]: value,
        };
      } else if (name.startsWith("vehicleNumber")) {
        const index = parseInt(name.match(/\d+/)[0]);
        const number = `vehicleNumber${index}`;
        return {
          ...prevData,
          [number]: prevData[number] || "",
          [name]: value,
        };
      } else if (name.startsWith("samaDenganAyah")) {
        console.log(name);
        const index = parseInt(name.match(/\d+/)[0]);
        const alamatName = `alamatAnak${index}`;
        console.log(value);

        if (value === true) {
          console.log(formData.address);
          return {
            ...prevData,
            [alamatName]: prevData.address || "",
            [name]: value,
          };
        } else {
          console.log(formData.alamatName);
          return {
            ...prevData,
            [alamatName]: prevData[alamatName] || "",
            [name]: value,
          };
        }
      }
      // Tangani perubahan untuk fotoKK dan fotoKTP
      else if ((name === "fotoKK" || name === "fotoKTP") && files && files[0]) {
        return {
          ...prevData,
          [name]: files[0],
          // Tetapkan fotoKTP atau fotoKK seperti sebelumnya
          ...((name === "fotoKK" && { fotoKTP: prevData.fotoKTP }) ||
            (name === "fotoKTP" && { fotoKK: prevData.fotoKK })),
          // ... tambahkan logika lain seperti ktpIstri dan ktpAnak
        };
      } else if (
        (name === "fotoHome" || name === "fotoHome2") &&
        files &&
        files[0]
      ) {
        return {
          ...prevData,
          [name]: files[0],
          // Tetapkan fotoKTP atau fotoKK seperti sebelumnya
          ...((name === "fotoKK" && { fotoKTP: prevData.fotoKTP }) ||
            (name === "fotoKTP" && { fotoKK: prevData.fotoKK })),
          // ... tambahkan logika lain seperti ktpIstri dan ktpAnak
        };
      } else if (name === "fotoDiri" && files && files[0]) {
        return {
          ...prevData,
          [name]: files[0],
        };
      }
      // Tangani perubahan untuk ktpIstri dan ktpAnak
      else if (name.startsWith("ktpIstri") || name.startsWith("ktpAnak")) {
        return {
          ...prevData,
          [name]: files ? files[0] : value,
          [name.startsWith("ktpIstri") ? "ktpIstri" : "ktpAnak"]: [
            ...prevData[name.startsWith("ktpIstri") ? "ktpIstri" : "ktpAnak"],
            files && files[0],
          ],
        };
      } else if (
        name.startsWith("alamatAnak") ||
        name.startsWith("alamatIstri")
      ) {
        // Tangani perubahan untuk alamatAnak dan alamatIstri
        return {
          ...prevData,
          [name]: value,
        };
      } else {
        console.log("Before status change10:", prevData.coordinates);
        console.log("Name:", name);
        console.log("Files:", files && files[0]);
        console.log("Value:", value);

        return {
          ...prevData,
          [name]: value,
        };
      }
    });
  };

  const handleNik = (e) => {
    const { name, value, files } = e.target;

    let isValid = true;
    let errorMessagesCopy = { ...errorMessages };

    const validationRules = {
      nik: (value) => !isNaN(Number(value)) && value.length === 16,
    };

    if (name in validationRules) {
      if (typeof validationRules[name] === "function") {
        isValid = validationRules[name](value);
      } else {
        isValid = validationRules[name].test(value);
      }
    }

    if (!isValid) {
      errorMessagesCopy[name] = `Harus angka dan 16 digit`;
    } else {
      errorMessagesCopy[name] = "";
    }

    setErrorMessages(errorMessagesCopy);
    setIsFormValid(
      Object.values(errorMessagesCopy).every((message) => !message)
    );

    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "image" ? files[0] : value,
    }));
  };

  const [jumlahIstri, setJumlahIstri] = useState(0);
  const [usiaAnak, setUsiaAnak] = useState({});

  const handleUbahJumlahAnak = (e) => {
    const jumlahIstri = parseInt(e.target.value, 10);
    setJumlahIstri(jumlahIstri);
  };

  const handleUsiaAnakChange = (index, value) => {
    setUsiaAnak((prevUsia) => ({
      ...prevUsia,
      [`usiaAnak${index}`]: value,
    }));
  };

  const handleUbahstatus = (e) => {
    console.log("Nilai e.target.value:", e.target.value);
    const status = e.target.value;

    setFormData((prevData) => ({
      ...prevData,
      maritalStatus: status,
      spouse: status === "menikah" ? { name: "", children: [] } : null,
    }));

    setJumlahIstri(status === "menikah" ? 1 : 0);
    console.log("New formData:", formData);
    console.log("New jumlahIstri:", jumlahIstri);
  };

  return (
    <React.Fragment>
      {formData.status === "menikah" && (
        <Grid
          container
          spacing={2}
          style={{ paddingLeft: 50, paddingRight: 50 }}
        >
          <Grid item xs={12}>
            <Typography variant="h6">Data Keluarga</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              id="jumlahIstri"
              name="jumlahIstri"
              label="Jumlah Istri"
              variant="outlined"
              size="small"
              sx={{
                height: "10px",
                width: "220px",

                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "8px",
                  borderWidth: "1.3px",
                  borderColor: "#252525",
                },
              }}
              InputLabelProps={{
                sx: {
                  color: "#252525", // Atur warna label
                  fontSize: "14px",
                  marginLeft: "3px",
                },
              }}
              value={formData.jumlahIstri}
              onChange={(e) => {
                handleChange(e);
                handleUbahJumlahAnak(e);
              }}
            >
              {[...Array(5).keys()].map((num) => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          {[...Array(jumlahIstri)].map((_, index) => (
            <React.Fragment key={index}>
              <Grid item xs={12} sx={{ paddingTop: "20px" }}>
                <Typography variant="h6">
                  Data diri Istri {index + 1}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} sx={{ paddingY: "20px" }}>
                <TextField
                  required
                  id={`namaIstri${index + 1}`}
                  name={`namaIstri${index + 1}`}
                  label={`Nama Istri ${index + 1}`}
                  autoComplete="given-name"
                  variant="outlined"
                  size="small"
                  sx={{
                    height: "10px",
                    width: "220px",

                    "& .MuiOutlinedInput-notchedOutline": {
                      borderRadius: "8px",
                      borderWidth: "1.3px",
                      borderColor: "#252525",
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      color: "#252525", // Atur warna label
                      fontSize: "14px",
                      marginLeft: "3px",
                    },
                  }}
                  value={formData[`namaIstri${index + 1}`]}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ paddingY: "20px" }}>
                <TextField
                  required
                  id={`nikIstri${index + 1}`}
                  name={`nikIstri${index + 1}`}
                  label={`NIK Istri ${index + 1}`}
                  variant="outlined"
                  size="small"
                  sx={{
                    height: "10px",
                    width: "220px",

                    "& .MuiOutlinedInput-notchedOutline": {
                      borderRadius: "8px",
                      borderWidth: "1.3px",
                      borderColor: "#252525",
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      color: "#252525", // Atur warna label
                      fontSize: "14px",
                      marginLeft: "3px",
                    },
                  }}
                  value={formData[`nikIstri${index + 1}`]}
                  onChange={(e) =>
                    handleNik({
                      ...e,
                      name: e.target ? e.target.name : `nikIstri${index + 1}`,
                    })
                  }
                />
              </Grid>
              {/* Tambahkan dropdown untuk memilih apakah alamat dan komplek sama dengan suami */}
              <Grid item xs={12} sx={{ padding: "20px" }}>
                <TextField
                  select
                  id={`samaDenganSuami${index + 1}`}
                  name={`samaDenganSuami${index + 1}`}
                  label={`Alamat istri ${index + 1}`}
                  variant="outlined"
                  size="small"
                  sx={{
                    height: "10px",
                    width: "479px",

                    "& .MuiOutlinedInput-notchedOutline": {
                      borderRadius: "8px",
                      borderWidth: "1.3px",
                      borderColor: "#252525",
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      color: "#252525", // Atur warna label
                      fontSize: "14px",
                      marginLeft: "3px",
                    },
                  }}
                  value={
                    formData[`samaDenganSuami${index + 1}`] !== undefined
                      ? formData[`samaDenganSuami${index + 1}`]
                      : false
                  }
                  onChange={(e) =>
                    handleChange({
                      target: {
                        name: `samaDenganSuami${index + 1}`,
                        value: e.target.value,
                      },
                    })
                  }
                >
                  <MenuItem value={false}>Berbeda dengan suami</MenuItem>
                  <MenuItem value={true}>Sama dengan suami</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sx={{ padding: "20px" }}>
                {!formData[`samaDenganSuami${index + 1}`] && (
                  <TextField
                    required
                    id={`alamatIstri${index + 1}`}
                    name={`alamatIstri${index + 1}`}
                    label={`Alamat Istri ${index + 1}`}
                    autoComplete="street-address"
                    variant="outlined"
                    size="small"
                    sx={{
                      height: "10px",
                      width: "479px",

                      "& .MuiOutlinedInput-notchedOutline": {
                        borderRadius: "8px",
                        borderWidth: "1.3px",
                        borderColor: "#252525",
                      },
                    }}
                    InputLabelProps={{
                      sx: {
                        color: "#252525", // Atur warna label
                        fontSize: "14px",
                        marginLeft: "3px",
                      },
                    }}
                    value={formData[`alamatIstri${index + 1}`]}
                    onChange={handleChange}
                  />
                )}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Kelengkapan Berkas</Typography>
              </Grid>
              <Grid item xs={12} sm={6} sx={{ padding: "20px" }}>
                <TextField
                  required
                  id={`statusktpIstri${index + 1}`}
                  name={`statusktpIstri${index + 1}`}
                  label={`KTP Istri ${index + 1}`}
                  autoComplete="given-name"
                  variant="outlined"
                  size="small"
                  sx={{
                    height: "10px",
                    width: "220px",

                    "& .MuiOutlinedInput-notchedOutline": {
                      borderRadius: "8px",
                      borderWidth: "1.3px",
                      borderColor: "#252525",
                    },
                  }}
                  InputLabelProps={{
                    sx: {
                      color: "#252525", // Atur warna label
                      fontSize: "14px",
                      marginLeft: "3px",
                    },
                  }}
                  value={formData[`statusktpIstri${index + 1}`]}
                  onChange={handleChange}
                />
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
      )}

      {formData.status === "berkeluarga" && (
        <React.Fragment>
          <Grid
            container
            spacing={2}
            style={{ paddingLeft: 50, paddingRight: 50, paddingTop: 25 }}
          >
            <Grid item xs={12}>
              <Typography variant="h6">Data Keluarga</Typography>
            </Grid>
            <Grid item xs={12} sx={{ padding: "20px" }}>
              <TextField
                select
                id="jumlahIstri"
                name="jumlahIstri"
                label="Jumlah Istri"
                variant="outlined"
                size="small"
                sx={{
                  height: "10px",
                  width: "220px",

                  "& .MuiOutlinedInput-notchedOutline": {
                    borderRadius: "8px",
                    borderWidth: "1.3px",
                    borderColor: "#252525",
                  },
                }}
                InputLabelProps={{
                  sx: {
                    color: "#252525", // Atur warna label
                    fontSize: "14px",
                    marginLeft: "3px",
                  },
                }}
                value={formData.jumlahIstri}
                onChange={(e) => {
                  handleChange(e);
                  handleUbahJumlahAnak(e);
                }}
              >
                {[...Array(5).keys()].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {[...Array(jumlahIstri)].map((_, index) => (
              <React.Fragment key={index}>
                <Grid item xs={12} sx={{ paddingTop: "20px" }}>
                  <Typography variant="h6">
                    Data diri Istri {index + 1}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ padding: "20px" }}>
                  <TextField
                    required
                    id={`namaIstri${index + 1}`}
                    name={`namaIstri${index + 1}`}
                    label={`Nama Istri ${index + 1}`}
                    autoComplete="given-name"
                    variant="outlined"
                    size="small"
                    sx={{
                      height: "10px",
                      width: "220px",

                      "& .MuiOutlinedInput-notchedOutline": {
                        borderRadius: "8px",
                        borderWidth: "1.3px",
                        borderColor: "#252525",
                      },
                    }}
                    InputLabelProps={{
                      sx: {
                        color: "#252525", // Atur warna label
                        fontSize: "14px",
                        marginLeft: "3px",
                      },
                    }}
                    value={formData[`namaIstri${index + 1}`]}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ padding: "20px" }}>
                  <TextField
                    required
                    id={`nikIstri${index + 1}`}
                    name={`nikIstri${index + 1}`}
                    label={`NIK Istri ${index + 1}`}
                    variant="outlined"
                    size="small"
                    sx={{
                      height: "10px",
                      width: "220px",

                      "& .MuiOutlinedInput-notchedOutline": {
                        borderRadius: "8px",
                        borderWidth: "1.3px",
                        borderColor: "#252525",
                      },
                    }}
                    InputLabelProps={{
                      sx: {
                        color: "#252525", // Atur warna label
                        fontSize: "14px",
                        marginLeft: "3px",
                      },
                    }}
                    value={formData[`nikIstri${index + 1}`]}
                    onChange={(e) =>
                      handleNik({
                        ...e,
                        name: e.target ? e.target.name : `nikIstri${index + 1}`,
                      })
                    }
                  />
                </Grid>
                {/* Tambahkan dropdown untuk memilih apakah alamat dan komplek sama dengan suami */}
                <Grid item xs={12} sx={{ padding: "20px" }}>
                  <TextField
                    select
                    id={`samaDenganSuami${index + 1}`}
                    name={`samaDenganSuami${index + 1}`}
                    label={`Alamat istri ${index + 1}`}
                    variant="outlined"
                    size="small"
                    sx={{
                      height: "10px",
                      width: "479px",

                      "& .MuiOutlinedInput-notchedOutline": {
                        borderRadius: "8px",
                        borderWidth: "1.3px",
                        borderColor: "#252525",
                      },
                    }}
                    InputLabelProps={{
                      sx: {
                        color: "#252525", // Atur warna label
                        fontSize: "14px",
                        marginLeft: "3px",
                      },
                    }}
                    value={
                      formData[`samaDenganSuami${index + 1}`] !== undefined
                        ? formData[`samaDenganSuami${index + 1}`]
                        : false
                    }
                    onChange={(e) =>
                      handleChange({
                        target: {
                          name: `samaDenganSuami${index + 1}`,
                          value: e.target.value,
                        },
                      })
                    }
                  >
                    <MenuItem value={false}>Berbeda dengan suami</MenuItem>
                    <MenuItem value={true}>Sama dengan suami</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sx={{ padding: "20px" }}>
                  {!formData[`samaDenganSuami${index + 1}`] && (
                    <TextField
                      required
                      id={`alamatIstri${index + 1}`}
                      name={`alamatIstri${index + 1}`}
                      label={`Alamat Istri ${index + 1}`}
                      autoComplete="street-address"
                      variant="outlined"
                      size="small"
                      sx={{
                        height: "10px",
                        width: "479px",

                        "& .MuiOutlinedInput-notchedOutline": {
                          borderRadius: "8px",
                          borderWidth: "1.3px",
                          borderColor: "#252525",
                        },
                      }}
                      InputLabelProps={{
                        sx: {
                          color: "#252525", // Atur warna label
                          fontSize: "14px",
                          marginLeft: "3px",
                        },
                      }}
                      value={formData[`alamatIstri${index + 1}`]}
                      onChange={handleChange}
                    />
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6">Kelengkapan Berkas</Typography>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ padding: "20px" }}>
                  <TextField
                    required
                    id={`statusktpIstri${index + 1}`}
                    name={`statusktpIstri${index + 1}`}
                    label={`KTP Istri ${index + 1}`}
                    autoComplete="given-name"
                    variant="outlined"
                    size="small"
                    sx={{
                      height: "10px",
                      width: "220px",

                      "& .MuiOutlinedInput-notchedOutline": {
                        borderRadius: "8px",
                        borderWidth: "1.3px",
                        borderColor: "#252525",
                      },
                    }}
                    InputLabelProps={{
                      sx: {
                        color: "#252525", // Atur warna label
                        fontSize: "14px",
                        marginLeft: "3px",
                      },
                    }}
                    value={formData[`statusktpIstri${index + 1}`]}
                    onChange={handleChange}
                  />
                </Grid>
              </React.Fragment>
            ))}

            <Grid item xs={12} sx={{ padding: "20px" }}>
              <TextField
                id="jumlahAnak"
                name="jumlahAnak"
                label="Jumlah Anak"
                variant="outlined"
                size="small"
                sx={{
                  height: "10px",
                  width: "220px",

                  "& .MuiOutlinedInput-notchedOutline": {
                    borderRadius: "8px",
                    borderWidth: "1.3px",
                    borderColor: "#252525",
                  },
                }}
                InputLabelProps={{
                  sx: {
                    color: "#252525", // Atur warna label
                    fontSize: "14px",
                    marginLeft: "3px",
                  },
                }}
                value={formData.jumlahAnak}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10) || 0;
                  setFormData((prevData) => ({
                    ...prevData,
                    jumlahAnak: value,
                  }));
                }}
              />
            </Grid>

            {formData.jumlahAnak > 0 && (
              <React.Fragment>
                {[...Array(formData.jumlahAnak)].map((_, index) => (
                  <Grid
                    container
                    spacing={2}
                    style={{
                      paddingLeft: 15,
                      paddingRight: 15,
                      paddingTop: 10,
                    }}
                    key={index}
                  >
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>
                        Informasi Anak {index + 1}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} sx={{ padding: "20px" }}>
                      <TextField
                        label={`Nama Anak ${index + 1}`}
                        name={`namaAnak${index + 1}`}
                        variant="outlined"
                        size="small"
                        sx={{
                          height: "10px",
                          width: "220px",

                          "& .MuiOutlinedInput-notchedOutline": {
                            borderRadius: "8px",
                            borderWidth: "1.3px",
                            borderColor: "#252525",
                          },
                        }}
                        InputLabelProps={{
                          sx: {
                            color: "#252525", // Atur warna label
                            fontSize: "14px",
                            marginLeft: "3px",
                          },
                        }}
                        value={formData[`namaAnak${index + 1}`]}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ padding: "20px" }}>
                      <TextField
                        required
                        id={`nikAnak${index + 1}`}
                        name={`nikAnak${index + 1}`}
                        label={`NIK Anak ${index + 1}`}
                        variant="outlined"
                        size="small"
                        sx={{
                          height: "10px",
                          width: "220px",

                          "& .MuiOutlinedInput-notchedOutline": {
                            borderRadius: "8px",
                            borderWidth: "1.3px",
                            borderColor: "#252525",
                          },
                        }}
                        InputLabelProps={{
                          sx: {
                            color: "#252525", // Atur warna label
                            fontSize: "14px",
                            marginLeft: "3px",
                          },
                        }}
                        value={formData[`nikAnak${index + 1}`]}
                        onChange={(e) =>
                          handleNik({
                            ...e,
                            name: e.target
                              ? e.target.name
                              : `nikAnak${index + 1}`,
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ padding: "20px" }}>
                      <TextField
                        label={`Usia Anak ${index + 1}`}
                        name={`usiaAnak${index + 1}`}
                        type="number"
                        variant="outlined"
                        size="small"
                        sx={{
                          height: "10px",
                          width: "220px",

                          "& .MuiOutlinedInput-notchedOutline": {
                            borderRadius: "8px",
                            borderWidth: "1.3px",
                            borderColor: "#252525",
                          },
                        }}
                        InputLabelProps={{
                          sx: {
                            color: "#252525", // Atur warna label
                            fontSize: "14px",
                            marginLeft: "3px",
                          },
                        }}
                        value={usiaAnak[`usiaAnak${index + 1}`] || ""}
                        onChange={(e) =>
                          handleUsiaAnakChange(index + 1, e.target.value)
                        }
                      />
                    </Grid>

                    {usiaAnak[`usiaAnak${index + 1}`] >= 17 && (
                      <React.Fragment>
                        <Grid item xs={12} sx={{ padding: "20px" }}>
                          <TextField
                            select
                            id={`samaDenganAyah${index + 1}`}
                            name={`samaDenganAyah${index + 1}`}
                            label={`Alamat Anak ${index + 1}`}
                            variant="outlined"
                            size="small"
                            sx={{
                              height: "10px",
                              width: "479px",

                              "& .MuiOutlinedInput-notchedOutline": {
                                borderRadius: "8px",
                                borderWidth: "1.3px",
                                borderColor: "#252525",
                              },
                            }}
                            InputLabelProps={{
                              sx: {
                                color: "#252525", // Atur warna label
                                fontSize: "14px",
                                marginLeft: "3px",
                              },
                            }}
                            style={{ marginTop: "10px", marginBottom: "10px" }}
                            value={
                              formData[`samaDenganAyah${index + 1}`] !==
                              undefined
                                ? formData[`samaDenganAyah${index + 1}`]
                                : false
                            }
                            onChange={(e) =>
                              handleChange({
                                target: {
                                  name: `samaDenganAyah${index + 1}`,
                                  value: e.target.value,
                                },
                              })
                            }
                          >
                            <MenuItem value={false}>
                              Berbeda dengan Ayah
                            </MenuItem>
                            <MenuItem value={true}>Sama dengan Ayah</MenuItem>
                          </TextField>
                        </Grid>
                        <Grid item xs={12} sx={{ padding: "20px" }}>
                          {!formData[`samaDenganAyah${index + 1}`] && (
                            <TextField
                              required
                              id={`alamatAnak${index + 1}`}
                              name={`alamatAnak${index + 1}`}
                              label={`Alamat Anak ${index + 1}`}
                              autoComplete="street-address"
                              variant="outlined"
                              size="small"
                              sx={{
                                height: "10px",
                                width: "479px",

                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderRadius: "8px",
                                  borderWidth: "1.3px",
                                  borderColor: "#252525",
                                },
                              }}
                              InputLabelProps={{
                                sx: {
                                  color: "#252525", // Atur warna label
                                  fontSize: "14px",
                                  marginLeft: "3px",
                                },
                              }}
                              value={formData[`alamatAnak${index + 1}` || ""]}
                              onChange={handleChange}
                            />
                          )}
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="h6">
                            Kelengkapan Berkas
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ padding: "20px" }}>
                          <TextField
                            required
                            id={`statusktpAnak${index + 1}`}
                            name={`statusktpAnak${index + 1}`}
                            label={`KTP Anak ${index + 1}`}
                            autoComplete="given-name"
                            variant="outlined"
                            size="small"
                            sx={{
                              height: "10px",
                              width: "220px",

                              "& .MuiOutlinedInput-notchedOutline": {
                                borderRadius: "8px",
                                borderWidth: "1.3px",
                                borderColor: "#252525",
                              },
                            }}
                            InputLabelProps={{
                              sx: {
                                color: "#252525", // Atur warna label
                                fontSize: "14px",
                                marginLeft: "3px",
                              },
                            }}
                            value={formData[`statusktpAnak${index + 1}`]}
                            onChange={handleChange}
                          />
                        </Grid>
                        <Grid item xs={12} sx={{ padding: "20px" }}>
                          <TextField
                            select
                            id={`statusAnak${index + 1}`}
                            name={`statusAnak${index + 1}`}
                            label={`Status Anak ${index + 1}`}
                            variant="outlined"
                            size="small"
                            sx={{
                              height: "10px",
                              width: "479px",

                              "& .MuiOutlinedInput-notchedOutline": {
                                borderRadius: "8px",
                                borderWidth: "1.3px",
                                borderColor: "#252525",
                              },
                            }}
                            InputLabelProps={{
                              sx: {
                                color: "#252525", // Atur warna label
                                fontSize: "14px",
                                marginLeft: "3px",
                              },
                            }}
                            style={{ marginTop: "1px", marginBottom: "10px" }}
                            value={formData[`statusAnak${index + 1}`] || ""}
                            onChange={(e) => {
                              handleUbahstatus(e);
                              handleChange(e);
                            }}
                          >
                            <MenuItem value="lajang">Lajang</MenuItem>
                            <MenuItem value="menikah">Menikah</MenuItem>
                            <MenuItem value="berkeluarga">Berkeluarga</MenuItem>
                          </TextField>
                        </Grid>
                      </React.Fragment>
                    )}
                  </Grid>
                ))}
              </React.Fragment>
            )}
          </Grid>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

