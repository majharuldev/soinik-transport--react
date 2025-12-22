import { useEffect, useState } from "react";
import { FaCheck, FaTrashAlt } from "react-icons/fa";
import { FaEye, FaPen, FaPlus, FaUserSecret } from "react-icons/fa6";
import { IoCloseOutline, IoCloseSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import Pagination from "../../../components/Shared/Pagination";
import api from "../../../../utils/axiosConfig";
import { tableFormatDate } from "../../../hooks/formatDate";
import { IoMdClose } from "react-icons/io";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const AttendanceList = () => {
  const {t} = useTranslation();
  const [employee, setEmployee] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  // delete modal
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAttendanceId, setSelectedAttendanceId] = useState(null);
  const toggleModal = () => setIsOpen(!isOpen);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const empRes = await api.get(`/employee`);
        const empData = empRes.data.data || [];
        setEmployee(empData);
        const attRes = await api.get(`/attendence`);
        const attData = attRes.data.data || [];
        setAttendanceList(attData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleViewClick = (id) => {
    setSelectedEmployeeId(id === selectedEmployeeId ? null : id);
  };

  // delete by id
  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/attendence/${id}`);

      // Remove driver from local list
      setAttendanceList((prev) => prev.filter((account) => account.id !== id));
      toast.success(t("Attendence deleted successfully"), {
        position: "top-right",
        autoClose: 3000,
      });

      setIsOpen(false);
      setSelectedAttendanceId(null);
    } catch (error) {
      console.error(t("Delete error:"), error.response || error);
      toast.error(t("There was a problem deleting!"), {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  
  // helper to get employee name
  const getEmployeeName = (empId) => {
    const emp = employee.find((e) => (e.id) === Number(empId));
    return emp ? emp.employee_name || emp.email : empId;
  };


   // Search filter
  const filteredAttendance = attendanceList.filter((item) => {
    const empName = getEmployeeName(item.employee_id).toLowerCase();
    const month = item.month?.toLowerCase() || "";
    const date = tableFormatDate(item.created_at).toLowerCase();
    const term = searchTerm.toLowerCase();
    return empName.includes(term) || month.includes(term) || date.includes(term);
  });

  // pagination
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAttedence = filteredAttendance.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredAttendance.length / itemsPerPage);

  // Excel Export
  const exportExcel = () => {
    if (filteredAttendance.length === 0) {
      toast.error("No data to export!");
      return;
    }

    const data = filteredAttendance.map((att, index) => ({
      SL: index + 1,
      Date: tableFormatDate(att.created_at),
      Employee: getEmployeeName(att.employee_id),
      "Working Day": att.working_day,
      Month: att.month,
      "Created By": att.created_by,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, "attendance_list.xlsx");
  };

  // Print
  // Print
const printTable = () => {

  const win = window.open("", "", "width=900,height=650");

  const tableRows = filteredAttendance
    .map(
      (att, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${tableFormatDate(att.created_at)}</td>
          <td>${getEmployeeName(att.employee_id)}</td>
          <td>${att.working_day}</td>
          <td>${att.month}</td>
          <td>${att.created_by}</td>
        </tr>
      `
    )
    .join("");

  win.document.write(`
    <html>
      <head>
        <title>-</title>
        <style>
          body { font-family: Arial, sans-serif; }

          .header {
            width: 100%;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            margin-bottom: 5px;
            text-align: center;
          }

          table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 10px; }
          th, td { border: 1px solid #333; padding: 6px; text-align: left; }
          th {
            background-color: #f2f2f2;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        </style>
      </head>

      <body>

        <h3 style="text-align:center;">${t("Attendance")} ${t("Report")}</h3>

        <table>
          <thead>
            <tr>
              <th>${t("SL.")}</th>
              <th>${t("Date")}</th>
              <th>${t("Employee")} ${t("Name")}</th>
              <th>${t("Working Day")}</th>
              <th>${t("Month")}</th>
              <th>${t("Created By")}</th>
            </tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>

      </body>
    </html>
  `);

  win.document.close();
  win.focus();
  win.print();
};


  return (
    <div className="p-2">
      <div className="w-[22rem] md:w-full overflow-hidden overflow-x-auto max-w-7xl mx-auto bg-white/80 backdrop-blur-md shadow-xl rounded-md p-2 py-10 md:p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl text-gray-800 font-bold flex items-center gap-3">
            <FaUserSecret className="text-gray-800 text-xl" />
            {t("Attendance")} {t("list")}
          </h1>
          <div className="mt-3 md:mt-0 flex gap-2">
            <Link to="/tramessy/HR/payroll/AttendanceForm">
              <button className="bg-gradient-to-r from-primary to-[#085011] text-white px-4 py-1 rounded-md shadow-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 cursor-pointer">
                <FaPlus /> {t("Attendance")}
              </button>
            </Link>
          </div>
        </div>
        {/* export */}
        <div className="md:flex justify-between items-center">
          <div className="flex gap-1 md:gap-3 text-gray-700 font-medium rounded-md">
            <button
              onClick={exportExcel}
              className="py-1 px-5 hover:bg-primary bg-white hover:text-white rounded shadow transition-all duration-300 cursor-pointer"
            >
              {t("Excel")}
            </button>
            <button
              onClick={printTable}
              className="py-1 px-5 hover:bg-primary bg-white hover:text-white rounded shadow transition-all duration-300 cursor-pointer"
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
              placeholder={`${t("search")}...`}
              className="lg:w-60 border border-gray-300 rounded-md outline-none text-xs py-2 ps-2 pr-5"
            />
            {/*  Clear button */}
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
                className="absolute right-5 top-[5.5rem] -translate-y-1/2 text-gray-400 hover:text-red-500 text-sm"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        <div className="mt-5 overflow-x-auto rounded-xl">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-200 text-primary capitalize text-xs">
              <tr>
                <th className="p-2">{t("SL.")}</th>
                <th className="p-2">{t("Date")}</th>
                <th className="p-2">{t("Employee")} {t("Name")}</th>
                <th className="p-2">{t("Working Day")}</th>
                <th className="p-2">{t("Month")}</th>
                <th className="p-2">{t("Created By")}</th>
                <th className="p-2">{t("Action")}</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {currentAttedence.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-500">
                    {t("No Employee Attendance found")}
                  </td>
                </tr>
              ) : (
                currentAttedence.map((emp, index) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-gray-50 transition-all border border-gray-200"
                  >
                    <td className="p-2 font-bold">{index + 1}</td>
                    <td className="p-2">{tableFormatDate(emp.created_at)}</td>
                    <td className="p-2">{getEmployeeName(emp.employee_id)}</td>
                    <td className="p-2">{emp.working_day}</td>
                    <td className="p-2">{emp.month}</td>
                    <td className="p-2">{emp.created_by}</td>
                    <td className="p-2">
                      <div className="flex gap-1">
                        <Link to={`/tramessy/HR/Payroll/update-attendence/${emp.id}`}>
                          <button className="text-primary hover:bg-primary hover:text-white px-2 py-1 rounded shadow-md transition-all cursor-pointer">
                            <FaPen className="text-[12px]" />
                          </button>
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedAttendanceId(emp.id);
                            setIsOpen(true);
                          }}
                          className="text-red-500 hover:text-white hover:bg-red-600 px-2 py-1 rounded shadow-md transition-all cursor-pointer"
                        >
                          <FaTrashAlt className="text-[12px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {currentAttedence.length > 0 && totalPages >= 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            maxVisible={8}
          />
        )}
      </div>

      {/* Delete Modal */}
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
                {t("Are you sure you want to delete?")}
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={toggleModal}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-primary hover:text-white cursor-pointer"
                >
                  {t("No")}
                </button>
                <button
                  onClick={() => handleDelete(selectedAttendanceId)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 cursor-pointer"
                >
                  {t("Yes")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceList;
