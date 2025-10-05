import { useEffect, useMemo, useRef, useState } from 'react';
import { FaPlus } from "react-icons/fa6"
import { FaFileExcel, FaFilePdf, FaFilter, FaPrint, FaTruck } from "react-icons/fa"
import { useReactToPrint } from 'react-to-print';
import Pagination from '../../../components/Shared/Pagination';
import { BiEdit, BiPrinter } from "react-icons/bi"
import toast from 'react-hot-toast';
import api from '../../../../utils/axiosConfig';
import PaySlipPrint from '../HRM/PaySlipPrint';
const SalarySheet = () => {
 const [employees, setEmployees] = useState([]);
  const [salaryAdvances, setSalaryAdvances] = useState([]);
  const [attendences, setAttendences] = useState([]);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const printRef = useRef();
  const [selectedSlip, setSelectedSlip] = useState(null);

  // Fetch all API data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, salaryRes, attRes] = await Promise.all([
          api.get('/employee'),
          api.get('/salaryAdvanced'),
          api.get('/attendence')
        ]);

        setEmployees(empRes.data.data || []);
        setSalaryAdvances(salaryRes.data.data || []);
        setAttendences(attRes.data.data || []);
      } catch (err) {
        toast.error("Failed to fetch data");
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // Merge data for salary sheet
  useEffect(() => {
    if (employees.length === 0) return;
    console.log(employees, "em")

    const merged = employees.map((emp, index) => {
      const empSalary = salaryAdvances.find(s => s.employee_id == emp.id) || {};
      const empAttend = attendences.find(a => a.employee_id == emp.id) || {};

      const basic = emp.basic ? Number(emp.basic) : "";
      const rent = emp.house_rent ? Number(emp.house_rent) : "";
      const conv = emp.conv ? Number(emp.conv) : "";
      const medical = emp.medical ? Number(emp.medical) : "";
      const allowance = emp.allowan ? Number(emp.allowan) : "";
      const total = [basic, rent, conv, medical, allowance].reduce((acc, v) => acc + (v || 0), 0);
      const advance = empSalary.amount ? Number(empSalary.amount) : 0;
      const netPay = total - advance;

      return {
        empId: emp.id,
        name: emp.email,
        designation: emp.designation || "",
        days: empAttend.working_day || "",
        basic,
        rent,
        conv,
        medical,
        allowance,
        total,
        bonus: 0,
        advance,
        deduction: 0,
        netPay
      };
    });

    setData(merged);
  }, [employees, salaryAdvances, attendences]);

  const filteredData = useMemo(() => {
    return data.filter(row => row.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [data, searchTerm]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const grandTotal = useMemo(() => data.reduce((sum, row) => sum + (row.total || 0), 0), [data]);
  const grandNetPay = useMemo(() => data.reduce((sum, row) => sum + (row.netPay || 0), 0), [data]);

const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Salary Sheet",
    onAfterPrint: () => {
      console.log("[v0] Print completed, clearing selected slip")
      setSelectedSlip(null)
    },
  })

  const handlePrintClick = (item) => {
    console.log("[v0] Print button clicked for:", item.name)
    setSelectedSlip(item)
    // Give React time to render the component before printing
    setTimeout(() => {
      if (printRef.current) {
        console.log("[v0] Triggering print")
        handlePrint()
      } else {
        console.error("[v0] Print ref is null")
      }
    }, 100)
  }


  return (
    <div className='p-2'>
      <div className="w-[24rem] md:w-full max-w-7xl overflow-hidden overflow-x-auto mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        {/* Header */}
        <div className="md:flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-3">
            {/* <FaTruck className="text-gray-800 text-2xl" /> */}
            Salary Sheet
          </h1>
          <div className="mt-3 md:mt-0 flex gap-2">
            {/* <Link to="/tramessy/AddSallaryExpenseForm">
            <button onClick={() => showModal()} className="bg-primary text-white px-4 py-1 rounded-md shadow-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 cursor-pointer">
              <FaPlus /> Add
            </button>
            </Link> */}
            <button
              onClick={() => setShowFilter((prev) => !prev)} // Toggle filter
              className=" text-primary border border-primary px-4 py-1 rounded-md shadow-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <FaFilter /> Filter
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <div className="flex flex-wrap text-gray-700 gap-2">

            {/* <button
              // onClick={exportCSV}
              className="flex items-center gap-2 py-2 px-5 hover:bg-primary bg-white shadow hover:text-white rounded transition-all duration-300 cursor-pointer"
            >
              <FiFileText size={16} />
              CSV
            </button> */}
            <button
              // onClick={exportExcel}
              className="flex items-center gap-2 py-1 px-3 hover:bg-primary bg-white shadow  hover:text-white rounded transition-all duration-300 cursor-pointer"
            >
              <FaFileExcel className="" />
              Excel
            </button>

            <button
              // onClick={exportPDF}
              className="flex items-center gap-2 py-1 px-3 hover:bg-primary bg-white shadow  hover:text-white rounded transition-all duration-300 cursor-pointer"
            >
              <FaFilePdf className="" />
              PDF
            </button>

            <button
              // onClick={printTable}
              className="flex items-center gap-2 py-1 px-3 hover:bg-primary bg-white shadow hover:text-white rounded transition-all duration-300 cursor-pointer"
            >
              <FaPrint className="" />
              Print
            </button>
          </div>

          <div className=" gap-2">
            {/* <span className="text-sm font-medium text-gray-700">Search:</span> */}
            <input
              type="text"
              className="px-3 py-2 border border-gray-300 rounded-md text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/*  Clear button */}
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
                className="absolute right-12 top-[11.3rem] -translate-y-1/2 text-gray-400 hover:text-red-500 text-sm"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Conditional Filter Section */}
        {showFilter && (
          <div className="md:flex gap-5 border border-gray-300 rounded-md p-5 my-5 transition-all duration-300 pb-5">
            <div className="relative w-full">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Start date"
                className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
              />
            </div>

            <div className="relative w-full">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="End date"
                className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
              />
            </div>
            <div className="mt-3 md:mt-0 flex gap-2">
              <button
                onClick={() => {
                  setCurrentPage(1)
                  setStartDate("")
                  setEndDate("")
                  setShowFilter(false)
                }}
                className="bg-primary text-white px-4 py-1 md:py-0 rounded-md shadow-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <FaFilter /> Clear
              </button>
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-400 text-xs">
            <thead>

              {/* Sub header row for SL numbers - merged for names */}
              <tr className=" text-black text-center">
                <th className="border border-gray-400 px-2 py-1" rowSpan={2}>SL</th>
                <th className="border border-gray-400 px-2 py-1" colSpan={1} rowSpan={2}>
                  Name &<br />Designation
                </th>
                <th className="border border-gray-400 px-2 py-1" rowSpan={3}>Working<br />DAY</th>
                <th className="border border-gray-400 px-2 py-1" rowSpan={3}>Designation</th>
                <th className="border border-gray-400 px-2 py-1 " colSpan={6} >
                  E A R N I N G S
                </th>
                <th className="border border-gray-400 px-2 py-1 " colSpan={3}>
                  D E D U C T I O N
                </th>
                <th className="border border-gray-400 px-2 py-1">By CEO</th>
                <th className="border border-gray-400 px-2 py-1">Net Pay Half</th>
                <th className="border border-gray-400 px-2 py-1">Action</th>
              </tr>
              {/* Main header row */}
              <tr className=" text-black text-center">
                <th className="border border-gray-400 px-2 py-1">Basic</th>
                <th className="border border-gray-400 px-2 py-1">H/Rent</th>
                <th className="border border-gray-400 px-2 py-1">Conv</th>
                <th className="border border-gray-400 px-2 py-1">Medical</th>
                <th className="border border-gray-400 px-2 py-1">Allowan Ce/Ot</th>
                <th className="border border-gray-400 px-2 py-1 ">Total</th>
                <th className="border border-gray-400 px-2 py-1">Bonus</th>
                <th className="border border-gray-400 px-2 py-1">Advance</th>
                <th className="border border-gray-400 px-2 py-1">Total</th>
                <th className="border border-gray-400 px-2 py-1"></th>
                <th className="border border-gray-400 px-2 py-1 "></th>
                <th className="border border-gray-400 px-2 py-1 "></th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((row, i) => (
                <tr key={i} className="text-center hover:bg-gray-100">
                  <td className="border border-gray-400 px-2 py-1">{i + 1}</td>
                  <td className="border border-gray-400 px-2 py-1 text-left">{row.name}</td>
                  <td className="border border-gray-400 px-2 py-1">{row.days}</td>
                  <td className="border border-gray-400 px-2 py-1">{row.designation}</td>
                  <td className="border border-gray-400 px-2 py-1">{row.basic.toLocaleString()}</td>
                  <td className="border border-gray-400 px-2 py-1">{row.rent.toLocaleString()}</td>
                  <td className="border border-gray-400 px-2 py-1">{row.conv.toLocaleString()}</td>
                  <td className="border border-gray-400 px-2 py-1">{row.medical.toLocaleString()}</td>
                  <td className="border border-gray-400 px-2 py-1">{row.allowance.toLocaleString()}</td>
                  <td className="border border-gray-400 px-2 py-1 font-semibold">
                    {row.total.toLocaleString()}
                  </td>
                  <td className="border border-gray-400 px-2 py-1">{row.bonus.toLocaleString()}</td>
                  <td className="border border-gray-400 px-2 py-1">{row.advance.toLocaleString()}</td>
                  <td className="border border-gray-400 px-2 py-1">{row.deduction.toLocaleString()}</td>
                  <td className="border border-gray-400 px-2 py-1">C</td>
                  <td className="border border-gray-400 px-2 py-1  font-bold">
                    {row.netPay.toLocaleString()}
                  </td>
                  <td className="border border-gray-400 px-2 py-1 action_column flex items-center gap-2">
                    <button
                      onClick={() => {
                        // setSelectedSlip(row);
                        handlePrintClick(row);
                      }}
                      className="flex items-center w-full px-3 py-1 text-sm text-gray-700 bg-white shadow rounded"
                    >
                      <BiPrinter className="mr-1 h-4 w-4" />
                      PaySlip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className=" font-bold text-center">
                <td className="border border-gray-400 px-2 py-1" colSpan={9}>
                  Grand Total
                </td>
                <td className="border border-gray-400 px-2 py-1">
                  {grandTotal.toLocaleString()}
                </td>
                <td className="border border-gray-400 px-2 py-1" colSpan={4}></td>
                <td className="border border-gray-400 px-2 py-1">
                  {grandNetPay.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
          {/* pagination */}
          {currentItems.length > 0 && totalPages >= 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
              maxVisible={8}
            />
          )}
        </div>
        {/* Hidden Component for Printing */}
              <div style={{ display: "none" }} >
                {selectedSlip && 
                <div ref={printRef}><PaySlipPrint  data={selectedSlip} /></div>
                }
              </div>
      </div>
    </div>

  );
};

export default SalarySheet;