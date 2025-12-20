import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaTruck, FaPlus, FaPen, FaEye, FaTrashAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";
// export
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import Pagination from "../components/Shared/Pagination";
import api from "../../utils/axiosConfig";
import { tableFormatDate } from "../hooks/formatDate";
import { useTranslation } from "react-i18next";
const CarList = () => {
  const { t } = useTranslation();
  const [vehicles, setVehicle] = useState([]);
  const [loading, setLoading] = useState(true);
  // get single car info by id
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedCar, setselectedCar] = useState(null);
  // delete modal
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  // search
  const [searchTerm, setSearchTerm] = useState("");
  const toggleModal = () => setIsOpen(!isOpen);
  useEffect(() => {
    api
      .get(`/vehicle`)
      .then((response) => {
      
          setVehicle(response.data);
       
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching driver data:", error);
        setLoading(false);
      });
  }, []);
  // delete by id
  const handleDelete = async (id) => {
  try {
    const response = await api.delete(`/vehicle/${id}`);

    // Axios er jonno check
    if (response.status === 200) {
      // UI update
      setVehicle((prev) => prev.filter((item) => item.id !== id));
      toast.success("Vehicle deleted successfully", {
        position: "top-right",
        autoClose: 3000,
      });

      setIsOpen(false);
      setSelectedDriverId(null);
    } else {
      throw new Error("Delete request failed");
    }
  } catch (error) {
    console.error("Delete error:", error);
    toast.error("There was a problem deleting!", {
      position: "top-right",
      autoClose: 3000,
    });
  }
};

// loading page
  if (loading) return <p className="text-center mt-16">{t("Vehicle")} {t("Loading")}...</p>;

const exportExcel = (vehicles) => {
  if (!vehicles || vehicles.length === 0) {
    alert("No vehicle data found!");
    return;
  }

  //  Excel-ready mapping
  const excelData = filteredCarList.map((dt, index) => ({
    SL: index + 1,
    Driver: dt.driver_name,
    Vehicle: dt.vehicle_name,
    Category: dt.vehicle_category,
    Size: dt.vehicle_size,
    Registration_Zone: dt.reg_zone,
    Registration_Serial: dt.reg_serial,
    Registration_Number: dt.reg_no,
    Status: dt.status,
    Insurance_Date: dt.insurance_date !== "null" ? dt.insurance_date : "",
    Reg_Date: dt.reg_date,
    Tax_Date: dt.tax_date,
    Route_Per_Date: dt.route_per_date,
    Fitness_Date: dt.fitness_date,
    Fuel_Capacity: dt.fuel_capcity ? Number(dt.fuel_capcity) : 0,
  }));

  // Total row (Fuel Capacity-এর জন্য)
  const totalRow = {
    SL: "TOTAL",
    Fuel_Capacity: excelData.reduce((sum, row) => sum + (row.Fuel_Capacity || 0), 0),
  };
  excelData.push(totalRow);

  //  Excel create & download
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Vehicles Data");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(data, "vehicles_data.xlsx");
};


const printTable = () => {
  const tableHeader = `
    <thead>
      <tr>
        <th>${t("SL.")}</th>
        <th>${t("Driver")} ${t("Name")}</th>
        <th>${t("Vehicle")} ${t("Name")}</th>
        <th>${t("Vehicle")} ${t("Category")}</th>
        <th>${t("Vehicle Size")}</th>
        <th>${t("Vehicle No")}</th>
        <th>${t("Status")}</th>
      </tr>
    </thead>
  `;

  const tableRows = filteredCarList.map((v, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${v.driver_name}</td>
      <td>${v.vehicle_name}</td>
      <td>${v.vehicle_category}</td>
      <td>${v.vehicle_size}</td>
      <td>${v.reg_zone} ${v.reg_serial} ${v.reg_no}</td>
      <td>${v.status}</td>
    </tr>
  `).join("");

  const printContent = `
    <table border="1" cellspacing="0" cellpadding="6" style="width:100%;border-collapse:collapse;">
      ${tableHeader}
      <tbody>${tableRows}</tbody>
    </table>
  `;

  const WinPrint = window.open("", "", "width=900,height=650");
  WinPrint.document.write(`
    <html>
    <head>
      <title>Vehicle Report</title>
      <style>
        body { font-family: Arial, sans-serif; }

        .print-header {
          display: table-header-group;
        }

        .header {
          width: 100%;
          border-bottom: 2px solid #000;
          padding-bottom: 10px;
          margin-bottom: 5px;
          text-align: center;
        }

        .header-title h1 {
          margin: 0;
          font-size: 22px;
          font-weight: bold;
        }

        .addr { font-size: 12px; color: #444; }

        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #000; padding: 5px; }

        thead th {
          background: #11375B !important;
          color: white !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .content { display: table-row-group; }

      </style>
    </head>

    <body>

      <div class="content">
        ${printContent}
      </div>

    </body>
    </html>
  `);

  WinPrint.document.close();
  WinPrint.focus();
  WinPrint.print();
  WinPrint.close();
};

  
  const handleViewCar = async (id) => {
    try {
      const response = await api.get(
        `/vehicle/${id}`
      );
        setselectedCar(response.data);
        setViewModalOpen(true);
    } catch (error) {
      console.error("View error:", error);
      toast.error("Vehicle information could not be loaded.");
    }
  };
  // search
  const filteredCarList = vehicles.filter((vehicle) => {
    const term = searchTerm.toLowerCase();
    return (
      vehicle.vehicle_name?.toLowerCase().includes(term) ||
      vehicle.driver_name?.toLowerCase().includes(term) ||
      vehicle.vehicle_category?.toLowerCase().includes(term) ||
      vehicle.size?.toLowerCase().includes(term) ||
      vehicle.registration_number?.toLowerCase().includes(term) ||
      vehicle.registration_serial?.toLowerCase().includes(term) ||
      vehicle.registration_zone?.toLowerCase().includes(term) ||
      vehicle.registration_date?.toLowerCase().includes(term) ||
      vehicle.text_date?.toLowerCase().includes(term) ||
      vehicle.road_permit_date?.toLowerCase().includes(term) ||
      vehicle.fitness_date?.toLowerCase().includes(term)
    );
  });
  // pagination
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVehicles = filteredCarList.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCarList.length / itemsPerPage);
 
  return (
    <main className="p-2">
      <Toaster />
      <div className="w-sm md:w-full overflow-hidden overflow-x-auto max-w-7xl mx-auto bg-white/80 backdrop-blur-md shadow-xl rounded-xl p-2 md:p-4 py-10 border border-gray-200">
        {/* Header */}
        <div className="md:flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-3">
            <FaTruck className="text-gray-800 text-2xl" />
            {t("vehicles")} {t("Information")}
          </h1>
          <div className="mt-3 md:mt-0 flex gap-2">
            <Link to="/tramessy/AddCarForm">
              <button className="bg-gradient-to-r from-primary to-[#115e15] text-white px-4 py-1 rounded-md shadow-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 cursor-pointer">
                <FaPlus /> {t("Vehicle")}
              </button>
            </Link>
          </div>
        </div>
        {/* export */}
        <div className="md:flex justify-between items-center">
          <div className="flex gap-1 md:gap-3 text-gary-700 font-medium rounded-md">
            <button
              onClick={exportExcel}
              className="py-1 px-5 hover:bg-primary bg-white hover:text-white rounded shadow-sm transition-all duration-300 cursor-pointer"
            >
              {t("Excel")}
            </button>
            {/* <button
              onClick={exportPDF}
              className="py-1 px-5 hover:bg-primary bg-white hover:text-white rounded shadow-sm transition-all duration-300 cursor-pointer"
            >
              PDF
            </button> */}
            <button
              onClick={printTable}
              className="py-1 px-5 hover:bg-primary bg-white hover:text-white rounded shadow-sm transition-all duration-300 cursor-pointer"
            >
              {t("Print")}
            </button>
          </div>
          {/* search */}
          <div className="mt-3 md:mt-0">
            {/* <span className="text-primary font-semibold pr-3">Search: </span> */}
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={`${t("Vehicle")} ${t("search")}...`}
              className="border border-gray-300 rounded-md outline-none text-xs py-2 ps-2 pr-5 lg:w-60"
            />
            {/*  Clear button */}
    {searchTerm && (
      <button
        onClick={() => {
          setSearchTerm("");
          setCurrentPage(1);
        }}
        className="absolute right-8 top-[5.5rem] -translate-y-1/2 text-gray-400 hover:text-red-500 text-sm"
      >
        ✕
      </button>
    )}
          </div>
        </div>

        {/* Table */}
        <div className="mt-5 overflow-x-auto rounded-md">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-200 text-primary capitalize text-xs">
              <tr className="">
                <th className="p-2">{t("SL")}</th>
                <th className="p-2">{t("Driver")} {t("Name")}</th>
                <th className="p-2">{t("Vehicle")} {t("Name")}</th>
                <th className="p-2">{t("Vehicle")} {t("Category")}</th>
                <th className="p-2">{t("Vehicle")} {t("Size")}</th>
                <th className="p-2">{t("Vehicle No")}</th>
                {/* <th className="px-2 py-3">Trip</th> */}
                {/* <th className="px-2 py-3">Registration No</th> */}
                <th className="p-2">{t("Status")}</th>
                <th className="p-2 action_column">{t("Action")}</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 ">
              {
                currentVehicles.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center p-4 text-gray-500">
                   {t("No vehicles found")}
                  </td>
                  </tr>
                )
              :(currentVehicles?.map((vehicle, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-all border border-gray-200"
                >
                  <td className="p-2 font-bold">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="p-2">{vehicle.driver_name}</td>
                  <td className="p-2">{vehicle.vehicle_name}</td>
                  <td className="p-2">{vehicle.vehicle_category}</td>
                  <td className="p-2">{vehicle.vehicle_size}</td>
                  <td className="p-2">
                    {vehicle.reg_zone} - {vehicle.reg_serial}{" "}
                    {vehicle.reg_no}
                  </td>
                  {/* <td className="px-2 py-4">0</td> */}
                  {/* <td className="px-2 py-4">{vehicle.registration_number}</td> */}
                  <td className="p-2">
                    <span className={` px-3 py-1 rounded-md text-xs font-semibold ${vehicle.status==="Active"? "text-green-400": "text-red-400"}`}>
                      {vehicle?.status}
                    </span>
                  </td>
                  <td className="p-2 action_column">
                    <div className="flex gap-1">
                      <Link to={`/tramessy/UpdateCarForm/${vehicle.id}`}>
                        <button className="text-primary hover:bg-primary hover:text-white px-2 py-1 rounded shadow-md transition-all cursor-pointer">
                          <FaPen className="text-[12px]" />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleViewCar(vehicle.id)}
                        className="text-primary hover:bg-primary hover:text-white px-2 py-1 rounded shadow-md transition-all cursor-pointer"
                      >
                        <FaEye className="text-[12px]" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedDriverId(vehicle.id);
                          setIsOpen(true);
                        }}
                        className="text-red-900 hover:text-white hover:bg-red-900 px-2 py-1 rounded shadow-md transition-all cursor-pointer"
                      >
                        <FaTrashAlt className="text-[12px]" />
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
        {/* pagination */}
    {currentVehicles.length > 0 && totalPages >= 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
          maxVisible={8} 
        />
      )}
      </div>
      
      {/* Delete modal */}
      <div className="flex justify-center items-center">
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-[#000000ad] z-50">
            <div className="relative bg-white rounded-lg shadow-lg p-6 w-72 max-w-sm border border-gray-300">
              <button
                onClick={toggleModal}
                className="text-2xl absolute top-2 right-2 text-white bg-red-500 hover:bg-red-700 cursor-pointer rounded-sm"
              >
                <IoMdClose />
              </button>
              <div className="flex justify-center mb-4 text-red-500 text-4xl">
                <FaTrashAlt />
              </div>
              <p className="text-center text-gray-700 font-medium mb-6">
                {t("Do you want to delete the car?")}
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={toggleModal}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-primary hover:text-white cursor-pointer"
                >
                  {t("No")}
                </button>
                <button
                  onClick={() => handleDelete(selectedDriverId)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 cursor-pointer"
                >
                  {t("Yes")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* get car information by id */}
      {viewModalOpen && selectedCar && (
        <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-[#000000ad] z-50">
          <div className="w-4xl p-5 bg-gray-100 rounded-xl mt-10">
            <h3 className="text-primary font-semibold">{t("Vehicle")} {t("Information")}</h3>
            <div className="mt-5">
              <ul className="flex border border-gray-300">
                <li className="w-[428px] flex text-gray-700 font-semibold text-sm px-3 py-2 border-r border-gray-300">
                  <p className="w-48">{t("Driver")} {t("Name")}</p>{" "}
                  <p>{selectedCar.driver_name}</p>
                </li>
                <li className="w-[428px] flex text-gray-700 font-semibold text-sm px-3 py-2">
                  <p className="w-48">{t("Vehicle")} {t("Name")}</p>{" "}
                  <p>{selectedCar.vehicle_name}</p>
                </li>
              </ul>
              <ul className="flex border-b border-r border-l border-gray-300">
                <li className="w-[428px] flex text-gray-700 font-semibold text-sm px-3 py-2 border-r border-gray-300">
                  <p className="w-48">{t("Vehicle")} {t("Category")}</p>{" "}
                  <p>{selectedCar.vehicle_category}</p>
                </li>
                <li className="w-[428px] flex text-gray-700 font-semibold text-sm px-3 py-2">
                  <p className="w-48">{t("Vehicle")} {t("Size")}</p>{" "}
                  <p>{selectedCar.vehicle_size}</p>
                </li>
              </ul>
              <ul className="flex border-b border-r border-l border-gray-300">
                <li className="w-[428px] flex text-gray-700 font-semibold text-sm px-3 py-2 border-r border-gray-300">
                  <p className="w-48">{t("Registration Number")}</p>{" "}
                  <p>{selectedCar.reg_no}</p>
                </li>
                <li className="w-[428px] flex text-gray-700 font-semibold text-sm px-3 py-2">
                  <p className="w-48">{t("Registration Serial")}</p>{" "}
                  <p>{selectedCar.reg_serial}</p>
                </li>
              </ul>
              <ul className="flex border-b border-r border-l border-gray-300">
                <li className="w-[428px] flex text-gray-700 font-semibold text-sm px-3 py-2 border-r border-gray-300">
                  <p className="w-48">{t("Registration Zone")}</p>{" "}
                  <p>{selectedCar.reg_zone}</p>
                </li>
                <li className="w-[428px] flex text-gray-700 font-semibold text-sm px-3 py-2">
                  <p className="w-48">{t("Registration Expired Date")}</p>{" "}
                  <p>{tableFormatDate(selectedCar.reg_date)}</p>
                </li>
              </ul>
              <ul className="flex border-b border-r border-l border-gray-300">
                <li className="w-[428px] flex text-gray-700 font-semibold text-sm px-3 py-2 border-r border-gray-300">
                  <p className="w-48">{t("Tax Expired Date")}</p>{" "}
                  <p>{tableFormatDate(selectedCar.tax_date )|| "N/A"}</p>
                </li>
                <li className="w-[428px] flex text-gray-700 font-semibold text-sm px-3 py-2">
                  <p className="w-48">{t("Road Permit Expired Date")}</p>{" "}
                  <p>{tableFormatDate(selectedCar.route_per_date)}</p>
                </li>
              </ul>
              <ul className="flex border-b border-r border-l border-gray-300">
                <li className="w-[428px] flex text-gray-700 font-semibold text-sm px-3 py-2 border-r border-gray-300">
                  <p className="w-48">{t("Fitness Expired Date")}</p>{" "}
                  <p>{tableFormatDate(selectedCar.fitness_date)}</p>
                </li>
                <li className="w-[428px] flex text-gray-700 font-semibold text-sm px-3 py-2 border-r border-gray-300">
                  <p className="w-48">{t("Insurance Expired Date")}</p>{" "}
                  <p>{tableFormatDate(selectedCar.insurance_date)}</p>
                </li>
              </ul>
              <ul className="flex border-b border-r border-l border-gray-300">
                <li className="w-[428px] flex text-gray-700 font-semibold text-sm px-3 py-2 border-r border-gray-300">
                  <p className="w-48">{t("Fuel Capacity")}</p>{" "}
                  <p>{selectedCar.fuel_capcity}</p>
                </li>
                <li className="w-[428px] flex text-gray-700 font-semibold text-sm px-3 py-2 border-r border-gray-300">
                  <p className="w-48"></p>{" "}
                  <p></p>
                </li>
              </ul>
              <div className="flex justify-end mt-10">
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="text-white bg-primary py-1 px-2 rounded-md cursor-pointer hover:bg-primary/80"
                >
                  {t("Close")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default CarList;
