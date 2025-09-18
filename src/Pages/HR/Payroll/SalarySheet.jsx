import { useEffect, useMemo, useRef, useState } from 'react';
import { FaPlus } from "react-icons/fa6"
import { FaFileExcel, FaFilePdf, FaFilter, FaPrint, FaTruck } from "react-icons/fa"
import { FiFileText, FiX } from "react-icons/fi"
import dayjs from 'dayjs';
import { useReactToPrint } from 'react-to-print';
import Pagination from '../../../components/Shared/Pagination';
import { BiEdit, BiPrinter } from "react-icons/bi"
import PaySlipPrint from '../HRM/PaySlipPrint';
import toast from 'react-hot-toast';
import api from '../../../../utils/axiosConfig';
const data = [
  {
    sl: 1,
    name: "Juwel Shil",
    designation: "Asst. Manager (Ops)",
    days: 30,
    basic: 9500,
    rent: 5000,
    conv: 2000,
    medical: 2000,
    allowance: 1000,
    ot: 0,
    total: 18500,
    bonus: 0,
    advance: 0,
    deduction: 0,
    netPay: 18500,
  },
  {
    sl: 2,
    name: "MD. Tareq Hossain",
    designation: "Executive (Ops)",
    days: 30,
    basic: 8000,
    rent: 4000,
    conv: 1000,
    medical: 1000,
    allowance: 0,
    ot: 0,
    total: 14000,
    bonus: 0,
    advance: 0,
    deduction: 0,
    netPay: 14000,
  },
  {
    sl: 3,
    name: "Md. Jubayer",
    designation: "SR. Executive (Ops)",
    days: 30,
    basic: 6500,
    rent: 2500,
    conv: 2000,
    medical: 1000,
    allowance: 0,
    ot: 0,
    total: 12000,
    bonus: 0,
    advance: 2000,
    deduction: 0,
    netPay: 10000,
  },
  {
    sl: 4,
    name: "MD. Sohail",
    designation: "SR. Executive (Ops)",
    days: 30,
    basic: 8500,
    rent: 3500,
    conv: 1000,
    medical: 1000,
    allowance: 0,
    ot: 0,
    total: 14000,
    bonus: 0,
    advance: 5000,
    deduction: 0,
    netPay: 9000,
  },
  {
    sl: 5,
    name: "MD. Samshu Haque",
    designation: "Executive (Ops)",
    days: 30,
    basic: 5500,
    rent: 1500,
    conv: 1000,
    medical: 1000,
    allowance: 0,
    ot: 0,
    total: 9000,
    bonus: 0,
    advance: 0,
    deduction: 0,
    netPay: 9000,
  },
  {
    sl: 6,
    name: "MD. JOSIM",
    designation: "JS. Executive (Ops)",
    days: 30,
    basic: 5500,
    rent: 1500,
    conv: 1000,
    medical: 1000,
    allowance: 1200,
    ot: 0,
    total: 10200,
    bonus: 0,
    advance: 0,
    deduction: 0,
    netPay: 10200,
  },
];

const SalarySheet = () => {
  const [expenses, setExpenses] = useState([])
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const printRef = useRef()
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    date: "",
    paid_to: "",
    pay_amount: "",
    payment_category: "",
    branch_name: "",
    remarks: "",
  })
  const [errors, setErrors] = useState({})
  // Date filter state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState(null)
  const printSlipRef = useRef();
  const salaryCategories = [
    "Salary",
    "Advance"
  ];

  //   //   branch api
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await api.get(`/office`);
        // if (response.data.status === "Success") {
          setBranches(response.data);
        // }
      } catch (err) {
        console.error("Error fetching branches:", err);
        toast.error("Failed to load branch list");
      }
    };

    fetchBranches();
  }, []);


  // Fetch employees when component mounts
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setEmployeesLoading(true);
        const response = await api.get(`/employee`);
        // if (response.data.status === "Success") {
          setEmployees(response.data);
        // }
      } catch (err) {
        console.error("Error fetching employees:", err);
        toast.error("Failed to load employee list");
      } finally {
        setEmployeesLoading(false);
      }
    };

    fetchEmployees();
    // fetchExpenses();
  }, []);
  // modal show handler
  const showModal = async (record = null) => {
    if (record) {
      try {
        const res = await api.get(`/expense/${record.id}`)
        const data = res.data
        setFormData({
          date: data?.date || "",
          paid_to: data?.paid_to || "",
          pay_amount: data?.pay_amount || "",
          payment_category: data?.payment_category || "",
          branch_name: data?.branch_name || "",
          remarks: data?.remarks || "",
        })
        setEditingId(record.id)
      } catch (err) {
        // showToast("ডেটা লোড করতে সমস্যা হয়েছে", "error")
        console.log("error show modal")
      }
    } else {
      setFormData({
        date: "",
        paid_to: "",
        pay_amount: "",
        payment_category: "",
        branch_name: "",
        remarks: "",
      })
      setEditingId(null)
    }
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setFormData({
      date: "",
      paid_to: "",
      pay_amount: "",
      payment_category: "",
      branch_name: "",
      remarks: "",
    })
    setEditingId(null)
    setIsModalVisible(false)
    setErrors({})
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    try {
      const response = await api.get(`/expense`)
      const allExpenses = response.data || [];
      const salaryExpenses = allExpenses.filter(expense =>
        expense.payment_category === 'Salary' || expense.payment_category === "Advance"
      );

      setExpenses(salaryExpenses);
      setLoading(false)
    } catch (err) {
      console.log("Data feching issue", "error")
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.date) newErrors.date = "Date is required"
    if (!formData.paid_to) newErrors.paid_to = "Recipient is required"
    if (!formData.pay_amount) newErrors.pay_amount = "Amount is required"
    if (!formData.branch_name) newErrors.branch_name = "Branch Name is required"
    if (!formData.payment_category) newErrors.payment_category = "Category is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        date: dayjs(formData.date).format("YYYY-MM-DD"),
      }

      if (editingId) {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/expense/update/${editingId}`, payload)
        toast.success("Expense Data Update successful")
      } else {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/expense/save`, payload)
        toast.success("Epense Added successful")
      }

      handleCancel()
      fetchExpenses()
    } catch (err) {
      console.error(err)
      toast.error("Operation failed", "error")
    } finally {
      setIsSubmitting(false);
    }
  }

  const filteredData = data.filter((item) => {
    const itemDate = dayjs(item.date).format("YYYY-MM-DD");

    const matchesSearch = [item.paid_to, item.pay_amount, item.payment_category, item.remarks, item.branch_name]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Date filter logic
    let matchesDate = true;
    if (startDate && !endDate) {
      // only start date dile oi ekta tarikh er data
      matchesDate = itemDate === dayjs(startDate).format("YYYY-MM-DD");
    } else if (startDate && endDate) {
      // start + end dile range filter
      matchesDate =
        itemDate >= dayjs(startDate).format("YYYY-MM-DD") &&
        itemDate <= dayjs(endDate).format("YYYY-MM-DD");
    }

    return matchesSearch && matchesDate;
  })

  // challan print func
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Invoice Print",
    onAfterPrint: () => {
      console.log("Print completed")
      setSelectedSlip(null)
    },
    onPrintError: (error) => {
      console.error("Print error:", error)
    },
  })

  const handlePrintClick = (item) => {
    const formatted = {
      date: item.date,
      branch: item.branch_name,
    }

    setSelectedSlip(formatted)

    // Use setTimeout to ensure the component is rendered before printing
    setTimeout(() => {
      handlePrint()
    }, 100)
  }

  const grandTotal = useMemo(() => data.reduce((sum, row) => sum + row.total, 0), []);
  const grandNetPay = useMemo(() => data.reduce((sum, row) => sum + row.netPay, 0), []);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredExpense = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
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
            {/* <Link to="/tramessy/AddSallaryExpenseForm"> */}
            <button onClick={() => showModal()} className="bg-primary text-white px-4 py-1 rounded-md shadow-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 cursor-pointer">
              <FaPlus /> Add
            </button>
            {/* </Link> */}
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
              {data.map((row, i) => (
                <tr key={i} className="text-center hover:bg-gray-100">
                  <td className="border border-gray-400 px-2 py-1">{row.sl}</td>
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
                      onClick={() => showModal(row)}
                      className="flex items-center gap-1 px-2 py-2 text-xs border border-gray-300 rounded bg-white hover:bg-gray-50 transition-colors"
                    >
                      <BiEdit size={12} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSlip(row);
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
          {filteredExpense.length > 0 && totalPages >= 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
              maxVisible={8}
            />
          )}
        </div>
        {/* Hidden Component for Printing */}
              {/* <div style={{ display: "none" }} > */}
                {selectedSlip && <PaySlipPrint ref={printRef} data={selectedSlip} />}
              {/* </div> */}
      </div>
    </div>

  );
};

export default SalarySheet;