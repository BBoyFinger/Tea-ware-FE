import React, { useEffect, useState } from "react";
import axios from "axios";

const LocationSelector = () => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/provinces");
        setProvinces(response.data.data); // Adjust based on the API response structure
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchProvinces();
  }, []);

  const handleProvinceChange = async (event: any) => {
    const provinceId = event.target.value;
    setSelectedProvince(provinceId);
    try {
      const response = await axios.get("http://localhost:8080/api/districts", {
        params: { province_id: provinceId },
        withCredentials: false,
      });
      setDistricts(response.data.data); // Adjust based on the API response structure
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const handleDistrictChange = async (event: any) => {
    const districtId = event.target.value;
    setSelectedDistrict(districtId);
    try {
      const response = await axios.get("http://localhost:8080/api/wards", {
        params: { district_id: districtId },
      });
      setWards(response.data.data); // Adjust based on the API response structure
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  return (
    <div>
      <h3>Select Province</h3>
      <select onChange={handleProvinceChange} value={selectedProvince}>
        <option value="" disabled>
          Select Province
        </option>
        {provinces.map((province: any) => (
          <option key={province.ProvinceID} value={province.ProvinceID}>
            {province.ProvinceName}
          </option>
        ))}
      </select>

      <h3>Select District</h3>
      <select onChange={handleDistrictChange} value={selectedDistrict}>
        <option value="" disabled>
          Select District
        </option>
        {districts.map((district: any) => (
          <option key={district.DistrictID} value={district.DistrictID}>
            {district.DistrictName}
          </option>
        ))}
      </select>

      <h3>Select Ward</h3>
      <select>
        <option value="" disabled>
          Select Ward
        </option>
        {wards.map((ward: any) => (
          <option key={ward.WardCode} value={ward.WardCode}>
            {ward.WardName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocationSelector;
