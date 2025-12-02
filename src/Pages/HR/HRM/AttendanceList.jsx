// import { useEffect, useState } from "react";
// import { FaCheck } from "react-icons/fa";
// import { FaEye, FaPen, FaPlus, FaUserSecret } from "react-icons/fa6";
// import { IoCloseOutline, IoCloseSharp } from "react-icons/io5";
// import { Link } from "react-router-dom";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import autoTable from "jspdf-autotable";
// import Pagination from "../../../components/Shared/Pagination";
// import api from "../../../../utils/axiosConfig";
// import { tableFormatDate } from "../../../hooks/formatDate";

// const AttendanceList = () => {
//   const [employee, setEmployee] = useState([]);
//   const [attendanceList, setAttendanceList] = useState([]);
//   const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
// const [totalPages, setTotalPages] = useState(1);

//  useEffect(() => {
//     api.get(`/employee`)
//       .then((response) => {
//         setEmployee(response.data.data);
//         setTotalPages(Math.ceil(empData.length / 10));
//       })
//       .catch((error) => console.error("Error fetching employee data:", error));

//     api.get(`/attendence`) // spelling check করো, backend এ attendence না attendance?
//       .then((response) => {
//         setAttendanceList(response.data.data);
//       })
//       .catch((error) => console.error("Error fetching attendance data:", error));
//   }, []);

//   const handleViewClick = (id) => {
//     setSelectedEmployeeId(id === selectedEmployeeId ? null : id);
//   };

//   const selectedEmployee = employee.find(
//     (e) => String(e.id) === String(selectedEmployeeId)
//   );

//   const attendanceData = attendanceList.filter(
//     (att) => att.employee_id === String(selectedEmployeeId)
//   );

//   const totalPresent = attendanceData.filter((a) => a.present === "1").length;
//   const totalAbsent = attendanceData.filter((a) => a.absent === "1").length;

//   const itemsPerPage = 10;
// const startIndex = (currentPage - 1) * itemsPerPage;
// const endIndex = startIndex + itemsPerPage;
// const paginatedEmployees = employee.slice(startIndex, endIndex);

//   // print table
//   const printTable = () => {
//     const printContent = document.getElementById("print-section").innerHTML;
//     const newWindow = window.open("", "", "width=900,height=600");
//     newWindow.document.write(`
//       <html>
//         <head>
//           <title>Attendance Report</title>
//           <style>
//             @media print {
//               table, th, td {
//                 border: 1px solid black !important;
//                 border-collapse: collapse !important;
//               }
//               th, td {
//                 padding: 6px;
//                 text-align: left;
//               }
//             }
//           </style>
//         </head>
//         <body>
//           ${printContent}
//         </body>
//       </html>
//     `);
//     newWindow.document.close();
//     newWindow.focus();
//     newWindow.print();
//   };

//   // export PDF
//   const exportPDF = () => {
//     if (!selectedEmployee || attendanceData.length === 0) {
//       alert("No data to export.");
//       return;
//     }

//     const doc = new jsPDF("landscape");
//     doc.setFontSize(16);
//     doc.text("Attendance Report", 14, 20);

//     doc.setFontSize(12);
//     doc.text(`Employee: ${selectedEmployee.full_name}`, 14, 30);

//     const rows = attendanceData.map((att, index) => [
//       index + 1,
//       att.date,
//       att.present === "1" ? "1" : "-",
//       att.absent === "1" ? "1" : "-",
//     ]);

//     // Add total row at the end
//     rows.push([
//       "", // SL
//       "Total",
//       totalPresent.toString().padStart(2, "0"),
//       totalAbsent.toString().padStart(2, "0"),
//     ]);

//     autoTable(doc, {
//       head: [["SL", "Date", "Present", "Absent"]],
//       body: rows,
//       startY: 40,
//       theme: "grid",
//       styles: { halign: "center" },

//       // No background fill color in header
//       headStyles: {
//         fillColor: "#CDCDCD", // disables background color
//         textColor: 0,
//         fontStyle: "bold",
//       },

//       didParseCell: (data) => {
//         if (data.row.index === rows.length - 1) {
//           data.cell.styles.fontStyle = "bold";
//         }
//       },
//     });

//     doc.save("attendance_report.pdf");
//   };

//   return (
//     <div className=" p-2">
//       <div className="w-[22rem] md:w-full overflow-hidden overflow-x-auto max-w-7xl mx-auto bg-white/80 backdrop-blur-md shadow-xl rounded-md p-2 py-10 md:p-4 border border-gray-200">
//         <div className="flex items-center justify-between mb-6">
//           <h1 className="text-xl text-gray-800 font-bold flex items-center gap-3">
//             <FaUserSecret className="text-gray-800 text-xl" />
//             Attendance List
//           </h1>
//           <div className="mt-3 md:mt-0 flex gap-2">
//             <Link to="/tramessy/HR/Attendance/AttendanceForm">
//               <button className="bg-gradient-to-r from-primary to-[#085011] text-white px-4 py-1 rounded-md shadow-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 cursor-pointer">
//                 <FaPlus /> Attendance
//               </button>
//             </Link>
//           </div>
//         </div>

//         <div className="mt-5 overflow-x-auto rounded-xl">
//           <table className="min-w-full text-sm text-left">
//             <thead className="bg-gray-200 text-primary capitalize text-xs">
//               <tr>
//                 <th className="p-2">SL.</th>
//                 <th className="p-2">Name</th>
//                 <th className="p-2">Join Date</th>
//                 <th className="p-2">Working Day</th>
//                 <th className="p-2">Action</th>
//               </tr>
//             </thead>
//             <tbody className="text-gray-700">
//               {  employee.length === 0 ?(
//                 <tr>
//                   <td colSpan="8" className="text-center p-4 text-gray-500">
//                     No Employee Attendence found
//                   </td>
//                   </tr>
//               )
//               :
//               (paginatedEmployees.map((emp, index) => (
//                 <tr
//                   key={emp.id}
//                   className="hover:bg-gray-50 transition-all border border-gray-200"
//                 >
//                   <td className="p-2 font-bold">{index + 1}</td>
//                   <td className="p-2">{emp.full_name}</td>
//                   <td className="p-2">{tableFormatDate(emp.join_date)}</td>
//                   <td className="p-2">{emp.working_day}</td>
//                   <td className="p-2">
//                     <div className="flex gap-1">
//                       <Link>
//                         <button className="text-primary hover:bg-primary hover:text-white px-2 py-1 rounded shadow-md transition-all cursor-pointer">
//                           <FaPen className="text-[12px]" />
//                         </button>
//                       </Link>
//                       <button
//                         onClick={() => handleViewClick(emp.id)}
//                         className="text-primary hover:bg-primary hover:text-white px-2 py-1 rounded shadow-md transition-all cursor-pointer"
//                       >
//                         <FaEye className="text-[12px]" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               )))
//               }
//             </tbody>
//           </table>
//         </div>
//         {/* pagination */}
//         {employee.length > 0 && totalPages >= 1 && (
//         <Pagination
//           currentPage={currentPage}
//           totalPages={totalPages}
//           onPageChange={(page) => setCurrentPage(page)}
//           maxVisible={8} 
//         />
//       )}
//       </div>

//       {/* Modal */}
//       {selectedEmployeeId && (
//         <div className="fixed inset-0 bg-[#00000065] flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-5 max-w-3xl w-full relative overflow-x-auto shadow-2xl border border-gray-300">
//             <button
//               onClick={() => setSelectedEmployeeId(null)}
//               className="absolute top-2 right-2 text-white bg-red-500 hover:text-white hover:bg-primary rounded-md w-5 h-5 flex items-center justify-center transition-all cursor-pointer"
//             >
//               <IoCloseSharp />
//             </button>

//             <div className="md:flex justify-between items-center mb-2">
//               <h2 className="text-lg font-bold text-primary">
//                 Employee Name: {selectedEmployee?.full_name || "N/A"}
//               </h2>
//               <div className="flex gap-1 md:gap-3 text-primary font-semibold rounded-md pr-5">
//                 <button
//                   onClick={exportPDF}
//                   className="py-2 px-5 hover:bg-primary bg-gray-200 hover:text-white rounded-md transition-all duration-300 cursor-pointer"
//                 >
//                   PDF
//                 </button>
//                 <button
//                   onClick={printTable}
//                   className="py-2 px-5 hover:bg-primary bg-gray-200 hover:text-white rounded-md transition-all duration-300 cursor-pointer"
//                 >
//                   Print
//                 </button>
//               </div>
//             </div>

//             <div id="print-section">
//               <div className="mb-4 text-center hidden print:block">
//                 <h2 className="text-xl font-bold">Attendance Report</h2>
//                 <p className="text-md">
//                   Employee: {selectedEmployee?.full_name || "N/A"}
//                 </p>
//               </div>
//               <table className="min-w-full text-sm text-left text-gray-900 mt-2">
//                 <thead className="capitalize text-sm">
//                   <tr>
//                     <th className="border border-gray-700 px-2 py-1">SL.</th>
//                     <th className="border border-gray-700 px-2 py-1">Date</th>
//                     {/* <th className="border border-gray-700 px-2 py-1">
//                       Employee Name
//                     </th> */}
//                     <th className="border border-gray-700 px-2 py-1 text-center">
//                       Present
//                     </th>
//                     <th className="border border-gray-700 px-2 py-1 text-center">
//                       Absent
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="font-semibold">
//                   {attendanceData.map((att, index) => (
//                     <tr
//                       key={att.id}
//                       className="hover:bg-gray-50 transition-all"
//                     >
//                       <td className="border border-gray-700 p-1 font-bold">
//                         {index + 1}.
//                       </td>
//                       <td className="border border-gray-700 p-1">{att.date}</td>
//                       {/* <td className="border border-gray-700 p-1">
//                         {selectedEmployee?.full_name || "N/A"}
//                       </td> */}
//                       <td className="border border-gray-700 p-1 text-center">
//                         {att.present === "1" ? (
//                           <span className="text-green-600">
//                             <FaCheck />
//                           </span>
//                         ) : (
//                           "-"
//                         )}
//                       </td>
//                       <td className="border border-gray-700 p-1 text-center">
//                         {att.absent === "1" ? (
//                           <span className="text-red-600">
//                             <IoCloseOutline />
//                           </span>
//                         ) : (
//                           "-"
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//                 <tfoot>
//                   <tr className="font-bold">
//                     <td
//                       colSpan={2}
//                       className="border border-black px-2 py-1 text-right"
//                     >
//                       Total
//                     </td>
//                     <td className="border border-black px-2 py-1 text-center">
//                       {totalPresent.toString().padStart(2, "0")}
//                     </td>
//                     <td className="border border-black px-2 py-1 text-center">
//                       {totalAbsent.toString().padStart(2, "0")}
//                     </td>
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AttendanceList;


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

const AttendanceList = () => {
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
      toast.success("Attendence deleted successfully", {
        position: "top-right",
        autoClose: 3000,
      });

      setIsOpen(false);
      setSelectedAttendanceId(null);
    } catch (error) {
      console.error("Delete error:", error.response || error);
      toast.error("There was a problem deleting!", {
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
        <title>Attendance Report</title>
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

        <div class="header">
          <h2>M/S A J ENTERPRISE</h2>
          <div>Razzak Plaza, 11th Floor, Room J-12<br/>Moghbazar, Dhaka-1217</div>
        </div>

        <h3 style="text-align:center;">Attendance Report</h3>

        <table>
          <thead>
            <tr>
              <th>SL</th>
              <th>Date</th>
              <th>Employee Name</th>
              <th>Working Day</th>
              <th>Month</th>
              <th>Created By</th>
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
            Attendance List
          </h1>
          <div className="mt-3 md:mt-0 flex gap-2">
            <Link to="/tramessy/HR/payroll/AttendanceForm">
              <button className="bg-gradient-to-r from-primary to-[#085011] text-white px-4 py-1 rounded-md shadow-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 cursor-pointer">
                <FaPlus /> Attendance
              </button>
            </Link>
          </div>
        </div>
        {/* export */}
        <div className="md:flex justify-between items-center">
          <div className="flex gap-1 md:gap-3 text-gray-700 font-semibold rounded-md">
            <button
              onClick={exportExcel}
              className="py-1 px-5 hover:bg-primary bg-white hover:text-white rounded shadow transition-all duration-300 cursor-pointer"
            >
              Excel
            </button>
            <button
              onClick={printTable}
              className="py-1 px-5 hover:bg-primary bg-white hover:text-white rounded shadow transition-all duration-300 cursor-pointer"
            >
              Print
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
              placeholder="Search by Product ..."
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
                <th className="p-2">SL.</th>
                <th className="p-2">Date</th>
                <th className="p-2">Employee Name</th>
                <th className="p-2">Working Day</th>
                <th className="p-2">Month</th>
                <th className="p-2">Create By</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {currentAttedence.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-500">
                    No Employee Attendance found
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

      {/* Modal */}
      {selectedEmployeeId && (
        <div className="fixed inset-0 bg-[#00000065] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-5 max-w-3xl w-full relative overflow-x-auto shadow-2xl border border-gray-300">
            <button
              onClick={() => setSelectedEmployeeId(null)}
              className="absolute top-2 right-2 text-white bg-red-500 hover:text-white hover:bg-primary rounded-md w-5 h-5 flex items-center justify-center transition-all cursor-pointer"
            >
              <IoCloseSharp />
            </button>

            <div className="md:flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold text-primary">
                Employee Name: {selectedEmployee?.full_name || "N/A"}
              </h2>
              <div className="flex gap-1 md:gap-3 text-primary font-semibold rounded-md pr-5">
                <button
                  onClick={exportPDF}
                  className="py-2 px-5 hover:bg-primary bg-gray-200 hover:text-white rounded-md transition-all duration-300 cursor-pointer"
                >
                  PDF
                </button>
                <button
                  onClick={printTable}
                  className="py-2 px-5 hover:bg-primary bg-gray-200 hover:text-white rounded-md transition-all duration-300 cursor-pointer"
                >
                  Print
                </button>
              </div>
            </div>

            <div id="print-section">
              <div className="mb-4 text-center hidden print:block">
                <h2 className="text-xl font-bold">Attendance Report</h2>
                <p className="text-md">
                  Employee: {selectedEmployee?.full_name || "N/A"}
                </p>
              </div>
              <table className="min-w-full text-sm text-left text-gray-900 mt-2">
                <thead className="capitalize text-sm">
                  <tr>
                    <th className="border border-gray-700 px-2 py-1">SL.</th>
                    <th className="border border-gray-700 px-2 py-1">Date</th>
                    <th className="border border-gray-700 px-2 py-1 text-center">
                      Present
                    </th>
                    <th className="border border-gray-700 px-2 py-1 text-center">
                      Absent
                    </th>
                  </tr>
                </thead>
                <tbody className="font-semibold">
                  {attendanceData.map((att, index) => (
                    <tr key={att.id} className="hover:bg-gray-50 transition-all">
                      <td className="border border-gray-700 p-1 font-bold">
                        {index + 1}.
                      </td>
                      <td className="border border-gray-700 p-1">{att.date}</td>
                      <td className="border border-gray-700 p-1 text-center">
                        {att.present === "1" ? (
                          <span className="text-green-600">
                            <FaCheck />
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="border border-gray-700 p-1 text-center">
                        {att.absent === "1" ? (
                          <span className="text-red-600">
                            <IoCloseOutline />
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-bold">
                    <td colSpan={2} className="border border-black px-2 py-1 text-right">
                      Total
                    </td>
                    <td className="border border-black px-2 py-1 text-center">
                      {totalPresent.toString().padStart(2, "0")}
                    </td>
                    <td className="border border-black px-2 py-1 text-center">
                      {totalAbsent.toString().padStart(2, "0")}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

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
                Are you sure you want to delete this Customer?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={toggleModal}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-primary hover:text-white cursor-pointer"
                >
                  No
                </button>
                <button
                  onClick={() => handleDelete(selectedAttendanceId)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 cursor-pointer"
                >
                  Yes
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
