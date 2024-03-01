import React, { useState, useEffect } from "react";
import "./maps.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Polygon } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon, divIcon, point } from "leaflet";
import axios from "axios";
import TombolTambahSurat from "../Components/Surat/TombolTambahSurat";
import TombolTambahWarga from "../Components/Maps/TombolTambahWarga.jsx";
import TombolLogout from "../Components/Logout/tombolLogout";
import { Button, InputAdornment, TextField } from "@mui/material";
import SideBar from "../Components/sideBar/SideBar.jsx";
import SearchIcon from "@mui/icons-material/Search";

const customIcon = new Icon({
  iconUrl: require("../icons/placeholder.png"),
  iconSize: [38, 38],
});

const createClusterCustomIcon = function (cluster) {
  return new divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: point(33, 33, true),
  });
};

const Maps = () => {
  const [data, setData] = useState([]);
  const [surat, setSurat] = useState([]);
  const [multiPolygon, setMultiPolygon] = useState([]);
  const purpleOptions = { color: "purple" };
  const [selectedMarkerData, setSelectedMarkerData] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);

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

  const handleMarkerClick = (item) => {
    setSelectedMarkerData(item);
  };

  const handleSidebarClose = () => {
    setSelectedMarkerData(null);
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
          onKeyDown={handleKeyDown} // Add this line to handle key events
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
        />
      </div>

      <div className="map-container">
        <TombolLogout />
        <TombolTambahWarga />
        <TombolTambahSurat />

        <MapContainer center={[-7.0053677, 107.6368018]} zoom={19}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MarkerClusterGroup
            chunkedLoading
            iconCreateFunction={createClusterCustomIcon}
          >
            {searchResults.length > 0
              ? searchResults.map((item) => (
                  <Marker
                    key={item._id}
                    position={
                      item.coordinates
                        ? [item.coordinates.lat, item.coordinates.lng]
                        : [0, 0]
                    }
                    icon={customIcon}
                    eventHandlers={{ click: () => handleMarkerClick(item) }}
                  ></Marker>
                ))
              : data.map((item) => (
                  <Marker
                    key={item._id}
                    position={
                      item.coordinates
                        ? [item.coordinates.lat, item.coordinates.lng]
                        : [0, 0]
                    }
                    icon={customIcon}
                    eventHandlers={{ click: () => handleMarkerClick(item) }}
                  ></Marker>
                ))}
          </MarkerClusterGroup>

          <Polygon pathOptions={purpleOptions} positions={multiPolygon} />
        </MapContainer>
      </div>
    </div>
  );
};

export default Maps;
