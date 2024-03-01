import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Typography as MuiTypography, MenuItem } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { DivIcon } from "leaflet";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faMapMarker } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
    fotoKTP: null,
    fotoKK: null,
    fotoHome: null,
    fotoHome2: null,
    fotoDiri: null,
    coordinates: { lat: -7.0053677, lng: 107.6368018 },
    status: "", // Dropdown untuk status pernikahan
    namaIstri: [""], // Nama istri
    nikIstri: [""], // NIK istri
    ktpIstri: [],
    samaDenganSuami: {},
    samaDenganAyah: {},
    namaAnak: [""], // Nama anak
    nikAnak: [""], // NIK anak
    usiaAnak: [""], // Usia anak
    ktpAnak: [],
    statusAnak: [""],
    alamatAnak: [""],
    alamatIstri: [""],
    jumlahAnak: [""],
    jumlahIstri: [""],
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const initialCoordinatesRef = useRef(null);
  const navigate = useNavigate();

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

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      handleNext();
      // Handle kesuksesan, misalnya redirect atau tindakan lainnya
    } else {
      console.error("Failed to save data");
      // Handle kegagalan, misalnya menampilkan pesan kesalahan kepada pengguna
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar
        position="absolute"
        color="default"
        elevation={0}
        sx={{
          position: "relative",
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      ></AppBar>
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <form
          id="dataForm"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <Paper
            variant="outlined"
            sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 }, borderRadius: 3 }}
          >
            <Typography
              component="h1"
              variant="h4"
              align="center"
              sx={{ my: 4 }}
            >
              Form Tambah Warga
            </Typography>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography variant="h5" textAlign={"center"} sx={{ my: 4 }}>
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
              <React.Fragment>
                {isMapReady && (
                  // Hanya merender peta jika koordinat sudah tersedia
                  <AddressForm
                    formData={formData}
                    setFormData={setFormData}
                    setIsFormValid={setIsFormValid}
                  />
                )}

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
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, ml: 1 }}
                    disabled={!isFormValid}
                    style={{ textTransform: "none" }}
                  >
                    {activeStep === steps.length - 1 ? "Kirim" : "Next"}
                  </Button>
                </Box>
              </React.Fragment>
            )}
          </Paper>
          <Copyright />
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

  const [istriArray, setIstriArray] = useState([]);
  const [jumlahIstri, setJumlahIstri] = useState(0);
  const [multiPolygon, setMultiPolygon] = useState([]);
  const purpleOptions = { color: "purple" };

  useEffect(() => {
    const fetchMultiPolygon = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5000/get_multipolygon"
        );
        setMultiPolygon(response.data.multiPolygon);
      } catch (error) {
        console.error("Error fetching multiPolygon:", error);
      }
    };

    fetchMultiPolygon();
  }, []);

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
  // Fungsi untuk menambah istri ke dalam array

  // Fungsi untuk meng-handle perubahan data istri
  const handleIstriChange = (index, key, value) => {
    setIstriArray((prevIstriArray) => {
      const newIstriArray = [...prevIstriArray];
      // Pastikan array istri sudah diinisialisasi sebelum diakses menggunakan index
      if (!newIstriArray[index]) {
        newIstriArray[index] = {};
      }
      newIstriArray[index][key] = value;
      return newIstriArray;
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

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setFormData((prevData) => ({
      ...prevData,
      coordinates: { lat, lng },
    }));
  };

  const handleZoomEnd = (e) => {
    // Ambil koordinat marker saat ini
    const { lat, lng } = formData.coordinates;
    setFormData((prevData) => ({
      ...prevData,
      coordinates: { lat, lng },
    }));
  };

  const handleMaritalStatusChange = (e) => {
    const maritalStatus = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      maritalStatus,
      spouse: maritalStatus === "married" ? { name: "", children: [] } : null,
    }));
  };

  const handleSpouseChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      spouse: {
        ...prevData.spouse,
        [name]: value,
      },
    }));
  };

  const handleChildrenCountChange = (e) => {
    const childrenCount = parseInt(e.target.value, 10) || 0;
    setFormData((prevData) => ({
      ...prevData,
      spouse: {
        ...prevData.spouse,
        children: Array.from({ length: childrenCount }, () => ({ name: "" })),
      },
    }));
  };

  const [tampilkanFormIstri, setTampilkanFormIstri] = useState(false);
  const [jumlahAnak, setJumlahAnak] = useState(0);
  const [usiaAnak, setUsiaAnak] = useState({});

  const handleUbahJumlahAnak = (e) => {
    const jumlahAnak = parseInt(e.target.value, 10);
    setJumlahAnak(jumlahAnak);
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

  const handleCommentChange = (index, value) => {
    const updatedComments = [...formData.additionalComments];
    updatedComments[index] = value;
    setFormData({ ...formData, additionalComments: updatedComments });
  };

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="name"
            name="name"
            label="Nama"
            fullWidth
            autoComplete="given-name"
            variant="standard"
            value={formData.name}
            onChange={handleChange}
            error={!!errorMessages.name}
            helperText={errorMessages.name}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="nik"
            name="nik"
            label="NIK"
            fullWidth
            variant="standard"
            value={formData.nik}
            onChange={handleNik}
            error={!!errorMessages.nik}
            helperText={errorMessages.nik}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="ttl"
            name="ttl"
            label="Tempat Tanggal Lahir"
            fullWidth
            variant="standard"
            value={formData.ttl}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="job"
            name="job"
            label="Pekerjaan"
            fullWidth
            variant="standard"
            value={formData.job}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="address"
            name="address"
            label="Alamat Lengkap"
            fullWidth
            autoComplete="address"
            variant="standard"
            value={formData.address}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            id="blok"
            name="blok"
            label="Blok Rumah"
            fullWidth
            variant="standard"
            value={formData.blok}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            id="no"
            name="no"
            label="Nomor Rumah"
            fullWidth
            variant="standard"
            value={formData.no}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            id="lastEdu"
            name="lastEdu"
            label="Pendidikan Terakhir"
            fullWidth
            variant="standard"
            value={formData.lastEdu}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="taxNumber"
            name="taxNumber"
            label="Nomor PBB"
            fullWidth
            variant="standard"
            value={formData.taxNumber}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="bpjsNumber"
            name="bpjsNumber"
            label="Nomor BPJS"
            fullWidth
            variant="standard"
            value={formData.bpjsNumber}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Data Kendaraan</Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="numberOfVehicles"
            name="numberOfVehicles"
            label="Jumlah Kendaraan"
            fullWidth
            variant="standard"
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
                <Grid item xs={12} sm={6}>
                  <TextField
                    id={`vehicleType${index}`}
                    name={`vehicleType${index}`}
                    label={`Jenis Kendaraan ${index + 1}`}
                    fullWidth
                    variant="standard"
                    value={formData[`vehicleType${index}`]}
                    onChange={(e) => handleChange(e, `vehicleType${index}`)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id={`vehicleNumber${index}`}
                    name={`vehicleNumber${index}`}
                    label={`Nomor Kendaraan ${index + 1}`}
                    fullWidth
                    variant="standard"
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
        <Grid item xs={12}>
          <TextField
            id="numberOfComments"
            name="numberOfComments"
            label="Jumlah Keterangan Tambahan"
            fullWidth
            variant="standard"
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
              <Grid item xs={12} key={index}>
                <TextField
                  id={`additionalComment${index}`}
                  name={`additionalComment${index}`}
                  label={`Keterangan Tambahan ${index + 1}`}
                  fullWidth
                  variant="standard"
                  value={formData[`additionalComment${index}`]}
                  onChange={(e) => handleChange(e, `additionalComment${index}`)}
                />
              </Grid>
            ))}
          </React.Fragment>
        )}
        <Grid item xs={12} sm={6}>
          <label htmlFor="fotoKK">
            <MuiTypography>Foto Kartu Keluarga</MuiTypography>
          </label>
          <input
            type="file"
            id="fotoKK"
            name="fotoKK"
            accept="image/*"
            onChange={(e) => handleChange(e, "fotoKK")}
            style={{ display: "none" }}
          />
          <label htmlFor="fotoKK">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
            >
              <MuiTypography>Masukkan Foto</MuiTypography>
            </Button>
          </label>
          {formData.fotoKK &&
            formData.fotoKK.name && ( // Pengecekan formData.fotoKK.name
              <Typography
                variant="body2"
                color="text.secondary"
                style={{ marginLeft: "10px" }}
              >
                File terpilih: {formData.fotoKK.name}
              </Typography>
            )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <label htmlFor="fotoKTP">
            <MuiTypography>Foto Kartu Tanda Penduduk</MuiTypography>
          </label>
          <input
            type="file"
            id="fotoKTP"
            name="fotoKTP"
            accept="image/*"
            onChange={(e) => handleChange(e, "fotoKTP")}
            style={{ display: "none" }}
          />
          <label htmlFor="fotoKTP">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
            >
              <MuiTypography>Masukkan Foto</MuiTypography>
            </Button>
          </label>
          {formData.fotoKTP && (
            <Typography
              variant="body2"
              color="text.secondary"
              style={{ marginLeft: "10px" }}
            >
              File terpilih:
              {formData.fotoKTP.name}
            </Typography>
          )}
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
        <Grid item xs={12} style={{ textAlign: "center" }}>
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
                File terpilih: {formData.fotoKK.name}
              </Typography>
            )}
        </Grid>

        <Grid item xs={12}>
          <Typography>Tentukan Pinpoint Rumah</Typography>
          <MapContainer
            center={[formData.coordinates.lat, formData.coordinates.lng]}
            zoom={18}
            style={{ height: "300px", width: "100%" }}
            onClick={handleMapClick}
            onZoomEnd={handleZoomEnd}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker
              position={[formData.coordinates.lat, formData.coordinates.lng]}
              icon={
                new DivIcon({
                  className: "custom-div-icon",
                  html: '<div><i class="fas fa-map-marker-alt fa-5x" alt="Marker Location"></i></div>',
                  iconSize: [10, 0],
                  iconAnchor: [22, 40],
                  popupAnchor: [0, -40],
                })
              }
              draggable={true} // Aktifkan opsi draggable
              eventHandlers={{
                dragend: (e) => {
                  const marker = e.target;
                  const position = marker.getLatLng();
                  setFormData((prevData) => ({
                    ...prevData,
                    coordinates: { lat: position.lat, lng: position.lng },
                  }));
                },
              }}
            >
              <Popup>Pilihan lokasi anda</Popup>
            </Marker>
            <Polygon pathOptions={purpleOptions} positions={multiPolygon} />
          </MapContainer>
        </Grid>

        <Grid item xs={12}>
          <TextField
            select
            id="status"
            name="status"
            label="Status Pernikahan"
            fullWidth
            variant="standard"
            style={{ marginTop: "15px", marginBottom: "10px" }}
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

        {formData.status === "menikah" && (
          <Grid item xs={12}>
            <TextField
              required
              id="jumlahIstri"
              name="jumlahIstri"
              label="Jumlah Istri"
              fullWidth
              variant="standard"
              value={formData.jumlahIstri}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10) || 0;
                setFormData((prevData) => ({
                  ...prevData,
                  jumlahIstri: value,
                }));
              }}
            />

            {formData.jumlahIstri > 0 && (
              <React.Fragment>
                {[...Array(formData.jumlahIstri)].map((_, index) => (
                  <Grid container spacing={2} key={index}>
                    <Grid item xs={12}>
                      <Typography variant="h6">
                        Data diri Istri {index + 1}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        id={`namaIstri${index + 1}`}
                        name={`namaIstri${index + 1}`}
                        label={`Nama Istri ${index + 1}`}
                        fullWidth
                        autoComplete="given-name"
                        variant="standard"
                        value={formData[`namaIstri${index + 1}`]}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        id={`nikIstri${index + 1}`}
                        name={`nikIstri${index + 1}`}
                        label={`NIK Istri ${index + 1}`}
                        fullWidth
                        variant="standard"
                        value={formData[`nikIstri${index + 1}`]}
                        onChange={(e) => {
                          handleChange(e);
                        }}
                      />
                    </Grid>
                    {/* Tambahkan dropdown untuk memilih apakah alamat dan komplek sama dengan suami */}
                    <Grid item xs={12}>
                      <TextField
                        select
                        id={`samaDenganSuami${index + 1}`}
                        name={`samaDenganSuami${index + 1}`}
                        label={`Alamat istri ${index + 1}`}
                        fullWidth
                        variant="standard"
                        style={{ marginTop: "10px", marginBottom: "10px" }}
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
                    <Grid item xs={12}>
                      {!formData[`samaDenganSuami${index + 1}`] && (
                        <TextField
                          required
                          id={`alamatIstri${index + 1}`}
                          name={`alamatIstri${index + 1}`}
                          label={`Alamat Istri ${index + 1}`}
                          fullWidth
                          autoComplete="street-address"
                          variant="standard"
                          value={formData[`alamatIstri${index + 1}` || ""]}
                          onChange={handleChange}
                        />
                      )}
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      style={{ marginTop: "5px", marginBottom: "10px" }}
                    >
                      <label htmlFor={`ktpIstri${index + 1}`}>
                        <MuiTypography>Foto Kartu Tanda Penduduk</MuiTypography>
                      </label>
                      <input
                        type="file"
                        id={`ktpIstri${index + 1}`}
                        name={`ktpIstri${index + 1}`}
                        accept="image/*"
                        onChange={(e) =>
                          handleChange(e, `ktpIstri${index + 1}`)
                        }
                        style={{ display: "none" }}
                      />
                      <label htmlFor={`ktpIstri${index + 1}`}>
                        <Button
                          variant="outlined"
                          component="span"
                          startIcon={<CloudUploadIcon />}
                        >
                          <MuiTypography>Masukkan Foto</MuiTypography>
                        </Button>
                      </label>

                      {formData[`ktpIstri${index + 1}`] && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          style={{ marginLeft: "10px" }}
                        >
                          File terpilih: {formData[`ktpIstri${index + 1}`].name}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                ))}
              </React.Fragment>
            )}
          </Grid>
        )}

        {formData.status === "berkeluarga" && (
          <React.Fragment>
            <Grid item xs={12}>
              <TextField
                required
                id="jumlahIstri"
                name="jumlahIstri"
                label="Jumlah Istri"
                fullWidth
                variant="standard"
                value={formData.jumlahIstri}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10) || 0;
                  setFormData((prevData) => ({
                    ...prevData,
                    jumlahIstri: value,
                  }));
                }}
              />

              {formData.jumlahIstri > 0 && (
                <React.Fragment>
                  {[...Array(formData.jumlahIstri)].map((_, index) => (
                    <Grid container spacing={2} key={index}>
                      <Grid item xs={12}>
                        <Typography variant="h6">
                          Data diri Istri {index + 1}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          required
                          id={`namaIstri${index + 1}`}
                          name={`namaIstri${index + 1}`}
                          label={`Nama Istri ${index + 1}`}
                          fullWidth
                          autoComplete="given-name"
                          variant="standard"
                          value={formData[`namaIstri${index + 1}`]}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          required
                          id={`nikIstri${index + 1}`}
                          name={`nikIstri${index + 1}`}
                          label={`NIK Istri ${index + 1}`}
                          fullWidth
                          variant="standard"
                          value={formData[`nikIstri${index + 1}`]}
                          onChange={(e) =>
                            handleNik({
                              ...e,
                              name: e.target
                                ? e.target.name
                                : `nikIstri${index + 1}`,
                            })
                          }
                        />
                      </Grid>
                      {/* Tambahkan dropdown untuk memilih apakah alamat dan komplek sama dengan suami */}
                      <Grid item xs={12}>
                        <TextField
                          select
                          id={`samaDenganSuami${index + 1}`}
                          name={`samaDenganSuami${index + 1}`}
                          label={`Alamat istri ${index + 1}`}
                          fullWidth
                          variant="standard"
                          style={{ marginTop: "10px", marginBottom: "10px" }}
                          value={
                            formData[`samaDenganSuami${index + 1}`] !==
                            undefined
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
                          <MenuItem value={false}>
                            Berbeda dengan suami
                          </MenuItem>
                          <MenuItem value={true}>Sama dengan suami</MenuItem>
                        </TextField>
                      </Grid>
                      <Grid item xs={12}>
                        {!formData[`samaDenganSuami${index + 1}`] && (
                          <TextField
                            required
                            id={`alamatIstri${index + 1}`}
                            name={`alamatIstri${index + 1}`}
                            label={`Alamat Istri ${index + 1}`}
                            fullWidth
                            autoComplete="street-address"
                            variant="standard"
                            value={formData[`alamatIstri${index + 1}`]}
                            onChange={handleChange}
                          />
                        )}
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        style={{ marginTop: "5px", marginBottom: "10px" }}
                      >
                        <label htmlFor={`ktpIstri${index + 1}`}>
                          <MuiTypography>
                            Foto Kartu Tanda Penduduk
                          </MuiTypography>
                        </label>
                        <input
                          type="file"
                          id={`ktpIstri${index + 1}`}
                          name={`ktpIstri${index + 1}`}
                          accept="image/*"
                          onChange={(e) =>
                            handleChange(e, `ktpIstri${index + 1}`)
                          }
                          style={{ display: "none" }}
                        />
                        <label htmlFor={`ktpIstri${index + 1}`}>
                          <Button
                            variant="outlined"
                            component="span"
                            startIcon={<CloudUploadIcon />}
                          >
                            <MuiTypography>Masukkan Foto</MuiTypography>
                          </Button>
                        </label>

                        {formData[`ktpIstri${index + 1}`] && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            style={{ marginLeft: "10px" }}
                          >
                            File terpilih:{" "}
                            {formData[`ktpIstri${index + 1}`].name}
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  ))}
                </React.Fragment>
              )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                id="jumlahAnak"
                name="jumlahAnak"
                label="Jumlah Anak"
                fullWidth
                variant="standard"
                value={formData.jumlahAnak}
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

            {/* Tampilkan formulir anak-anak sesuai dengan jumlahnya */}
            {[...Array(jumlahAnak)].map((_, index) => (
              <React.Fragment key={index}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Informasi Anak {index + 1}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label={`Nama Anak ${index + 1}`}
                    fullWidth
                    name={`namaAnak${index + 1}`}
                    variant="standard"
                    value={formData[`namaAnak${index + 1}`]}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id={`nikAnak${index + 1}`}
                    name={`nikAnak${index + 1}`}
                    label={`NIK Anak ${index + 1}`}
                    fullWidth
                    variant="standard"
                    value={formData[`nikAnak${index + 1}`]}
                    onChange={(e) =>
                      handleNik({
                        ...e,
                        name: e.target ? e.target.name : `nikAnak${index + 1}`,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label={`Usia Anak ${index + 1}`}
                    fullWidth
                    name={`usiaAnak${index + 1}`}
                    type="number"
                    variant="standard"
                    value={usiaAnak[`usiaAnak${index + 1}`] || ""}
                    onChange={(e) =>
                      handleUsiaAnakChange(index + 1, e.target.value)
                    }
                  />
                </Grid>

                {usiaAnak[`usiaAnak${index + 1}`] >= 17 && (
                  <React.Fragment>
                    <Grid item xs={12}>
                      <TextField
                        select
                        id={`samaDenganAyah${index + 1}`}
                        name={`samaDenganAyah${index + 1}`}
                        label={`Alamat Anak ${index + 1}`}
                        fullWidth
                        variant="standard"
                        style={{ marginTop: "10px", marginBottom: "10px" }}
                        value={
                          formData[`samaDenganAyah${index + 1}`] !== undefined
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
                        <MenuItem value={false}>Berbeda dengan Ayah</MenuItem>
                        <MenuItem value={true}>Sama dengan Ayah</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      {!formData[`samaDenganAyah${index + 1}`] && (
                        <TextField
                          required
                          id={`alamatAnak${index + 1}`}
                          name={`alamatAnak${index + 1}`}
                          label={`Alamat Anak ${index + 1}`}
                          fullWidth
                          autoComplete="street-address"
                          variant="standard"
                          value={formData[`alamatAnak${index + 1}` || ""]}
                          onChange={handleChange}
                        />
                      )}
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      style={{ marginTop: "5px", marginBottom: "0px" }}
                    >
                      <label htmlFor={`ktpAnak${index + 1}`}>
                        <MuiTypography>Foto Kartu Tanda Penduduk</MuiTypography>
                      </label>
                      <input
                        type="file"
                        id={`ktpAnak${index + 1}`}
                        name={`ktpAnak${index + 1}`}
                        accept="image/*"
                        onChange={(e) => handleChange(e, `ktpAnak${index + 1}`)}
                        style={{ display: "none" }}
                      />
                      <label htmlFor={`ktpAnak${index + 1}`}>
                        <Button
                          variant="outlined"
                          component="span"
                          startIcon={<CloudUploadIcon />}
                        >
                          <MuiTypography>Masukkan Foto</MuiTypography>
                        </Button>
                      </label>

                      {formData[`ktpAnak${index + 1}`] && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          style={{ marginLeft: "10px" }}
                        >
                          File terpilih: {formData[`ktpAnak${index + 1}`].name}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        select
                        id={`statusAnak${index + 1}`}
                        name={`statusAnak${index + 1}`}
                        label={`Status Anak ${index + 1}`}
                        fullWidth
                        variant="standard"
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
              </React.Fragment>
            ))}
          </React.Fragment>
        )}
      </Grid>
    </React.Fragment>
  );
}
function Copyright() {
  return (
    <MuiTypography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://www.instagram.com/alfikriangelo/">
        Selamat Tahun Baru
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </MuiTypography>
  );
}

const steps = ["Tambah Warga"];
