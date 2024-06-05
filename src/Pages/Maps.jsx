import React, { useState, useEffect } from "react";
import "./maps.css";
import axios from "axios";
import TombolTambahSurat from "../Components/Surat/TombolTambahSurat";
import TombolTambahWarga from "../Components/Maps/TombolTambahWarga.jsx";
import SideBar from "../Components/sideBar/SideBar.jsx";
import TombolLogout from "../Components/Logout/tombolLogout";
import { Button, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import background from "../icons/maps3.png";
import markerIcon from "../icons/placeholder.png";

const Maps = () => {
  const [data, setData] = useState([]);
  const [surat, setSurat] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMarkerData, setSelectedMarkerData] = useState(null);

  const handleMarkerClick = (item) => {
    setSelectedMarkerData(item);
  };

  const handleSidebarClose = () => {
    setSelectedMarkerData(null);
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/get_saved_data?search=${searchInput}`
      );
      setSearchResults(response.data.savedData);
    } catch (error) {
      console.error("Error searching data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await axios.get(
          "http://127.0.0.1:5000/get_saved_data"
        );
        setData(responseData.data.savedData);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (name) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/delete_data/${name}`);

      // Update data after deletion
      const responseData = await axios.get(
        "http://127.0.0.1:5000/get_saved_data"
      );
      setData(responseData.data.savedData);

      // Update searchResults if the deleted item is present
      setSearchResults((prevResults) =>
        prevResults.filter((item) => item.name !== name)
      );
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  useEffect(() => {
    const getSavedFileName = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5000/get_saved_file_name"
        );
        const formattedData = {};

        response.data.history.forEach((item) => {
          const { fileNames, nama } = item;

          // Pastikan nama tersebut belum ada dalam formattedData
          if (!formattedData[nama]) {
            formattedData[nama] = { fileNames };
          } else {
            formattedData[nama].fileNames.push(...fileNames);
          }
        });

        setSurat(formattedData);
        console.log("Formatted Data:", formattedData);
      } catch (error) {
        console.error("Error: ", error);
      }
    };
    getSavedFileName();
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="app-container">
      <div className="sidebar-container">
        <SideBar
          selectedMarkerData={selectedMarkerData}
          surat={surat}
          onClose={handleSidebarClose}
          hapus={handleDelete}
        />
      </div>

      <div className="search-bar-container">
        <TextField
          label="Nama Penduduk"
          variant="outlined"
          value={searchInput}
          onChange={handleSearchInputChange}
          onKeyDown={handleKeyDown}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon
                  onClick={handleSearch}
                  style={{ cursor: "pointer" }}
                />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{
            shrink: !!searchInput, // Mengatur shrink ke true jika ada nilai dalam searchInput
          }}
        />
      </div>

      <div className="map-container">
        <TombolLogout />
        <TombolTambahWarga />
        <TombolTambahSurat />

        <div className="image-container">
          <img
            src={background}
            style={{ height: "100vh", width: "100%", objectFit: "cover" }} // ubah tinggi menjadi 80vh
            alt="Map"
          />
          {searchResults.length > 0
            ? searchResults.map((item) => {
                const left = item.coordinates ? `${item.coordinates.lng}%` : 0;
                const top = item.coordinates ? `${item.coordinates.lat}%` : 0;

                console.log("Left:", left); // Tampilkan nilai left di konsol
                console.log("Top:", top);

                return (
                  <div
                    key={item._id}
                    className="custom-marker"
                    style={{
                      left: `${item.coordinates.lng}%`,
                      top: `calc(${item.coordinates.lat > 30 ? item.coordinates.lat + 30 : item.coordinates.lat}%)`,
                      transform: "translate(-50%, -100%) ",
                      zoom: 2,
                    }}
                    onClick={() => handleMarkerClick(item)}
                  >
                    <img
                      src={markerIcon}
                      alt="Marker Icon"
                      className="custom-marker-icon"
                    />
                  </div>
                );
              })
            : data.map((item) => {
                const left = item.coordinates ? `${item.coordinates.lng}%` : 0;
                const top = item.coordinates ? `${item.coordinates.lat}%` : 0;

                console.log("Left:", left); // Tampilkan nilai left di konsol
                console.log("Top:", top);

                return (
                  <div
                    key={item._id}
                    className="custom-marker"
                    style={{
                      left: `${item.coordinates.lng}% `,
                      top: `calc(${item.coordinates.lat > 30 ? item.coordinates.lat + 30 : item.coordinates.lat}%)`,
                      transform: "translate(-50%, -100%)",
                    }}
                    onClick={() => handleMarkerClick(item)}
                  >
                    <img
                      src={markerIcon}
                      alt="Marker Icon"
                      className="custom-marker-icon"
                    />
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
};

export default Maps;
