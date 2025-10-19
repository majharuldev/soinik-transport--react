import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaEye, FaFilter, FaPen, FaPrint, FaTrashAlt } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { FiFilter } from "react-icons/fi";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { HiCurrencyBangladeshi } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { format, parseISO, isAfter, isBefore, isEqual } from "date-fns";
import Pagination from "../../components/Shared/Pagination";
import api from "../../../utils/axiosConfig";
import DatePicker from "react-datepicker";
import { tableFormatDate } from "../../hooks/formatDate";
import { IoMdClose } from "react-icons/io";
import toast from "react-hot-toast";

const CashDispatch = () => {
  const [account, setAccount] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const printRef = useRef();

  // delete modal
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFundTransferId, setSelectedFundTransferId] = useState(null);
  const toggleModal = () => setIsOpen(!isOpen);
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  // Fetch office data
  useEffect(() => {
    api
      .get(`/fundTransfer`)
      .then((response) => {
        if (response.data.status = "Success") {
          const data = response.data.data;
          setAccount(data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching account data:", error);
        setLoading(false);
      });
  }, []);

  // filtered search by date
  // const filteredAccounts = useMemo(() => {
  //   return account.filter((item) => {
  //     if (!item.date) return false;
  //     // Convert API date string safely to Date
  //     const itemDate = new Date(item.date);
  //     if (isNaN(itemDate)) return false;

  //     // If only startDate is set
  //     if (startDate && !endDate) {
  //       return (
  //         itemDate.toDateString() === startDate.toDateString()
  //       );
  //     }

  //     // If only endDate is set
  //     if (!startDate && endDate) {
  //       return (
  //         itemDate.toDateString() === endDate.toDateString()
  //       );
  //     }

  //     // If both are set (range)
  //     if (startDate && endDate) {
  //       return (
  //         (isAfter(itemDate, startDate) || isEqual(itemDate, startDate)) &&
  //         (isBefore(itemDate, endDate) || isEqual(itemDate, endDate))
  //       );
  //     }

  //     // No filter → include all
  //     return true;
  //   });
  // }, [account, startDate, endDate]);
  const filteredAccounts = useMemo(() => {
  return account.filter((item) => {
    const itemDate = new Date(item.date);
    if (isNaN(itemDate)) return false;

    // Date filtering
    if (startDate && !endDate) {
      if (itemDate.toDateString() !== startDate.toDateString()) return false;
    }
    if (!startDate && endDate) {
      if (itemDate.toDateString() !== endDate.toDateString()) return false;
    }
    if (startDate && endDate) {
      if (
        !(isAfter(itemDate, startDate) || isEqual(itemDate, startDate)) ||
        !(isBefore(itemDate, endDate) || isEqual(itemDate, endDate))
      ) {
        return false;
      }
    }

    // Text search (by name, branch, type, etc.)
    const search = searchTerm.toLowerCase();
    if (search) {
      return (
        item?.person_name?.toLowerCase().includes(search) ||
        item?.branch_name?.toLowerCase().includes(search) ||
        item?.type?.toLowerCase().includes(search) ||
        item?.bank_name?.toLowerCase().includes(search)
      );
    }

    return true;
  });
}, [account, startDate, endDate, searchTerm]);

const handlePrint = () => {
  const originalContent = document.body.innerHTML;
  const printContent = printRef.current.innerHTML;

  document.body.innerHTML = printContent;
  window.print();
  document.body.innerHTML = originalContent;
  window.location.reload(); // Force re-render after printing
}


  // total amount calculation
  const totalAmount = useMemo(() => {
    return filteredAccounts.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [filteredAccounts]);

  // delete by id
  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/fundTransfer/${id}`);

      // Remove driver from local list
      setAccount((prev) => prev.filter((account) => account.id !== id));
      toast.success("Fund Transfer deleted successfully", {
        position: "top-right",
        autoClose: 3000,
      });

      setIsOpen(false);
      setSelectedFundTransferId(null);
    } catch (error) {
      console.error("Delete error:", error.response || error);
      toast.error("There was a problem deleting!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // pagination
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCash = filteredAccounts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);

  if (loading) return <p className="text-center mt-16">Loading...</p>;
  return (
    <div className="p-2">
      <div className="w-[22rem] md:w-full overflow-hidden overflow-x-auto max-w-7xl mx-auto bg-white/80 backdrop-blur-md shadow-xl rounded-md p-2 py-10 md:p-4 border border-gray-200">
        <div className="md:flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-3">
            <HiCurrencyBangladeshi className="text-gray-800 text-2xl" />
            Fund Transfer
          </h1>
          <div className="mt-3 md:mt-0 flex gap-2">
            <div className="md:mt-0 flex gap-2">
              <button
                onClick={() => setShowFilter((prev) => !prev)}
                className="border border-primary text-primary px-4 py-1 rounded-md shadow-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <FaFilter /> Filter
              </button>
            </div>
            <Link to="/tramessy/account/CashDispatchForm">
              <button className="bg-gradient-to-r from-primary to-[#115e15] text-white px-4 py-1 rounded-md shadow-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 cursor-pointer">
                <FaPlus /> Dispatch
              </button>
            </Link>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 py-1 px-4 hover:bg-primary bg-white shadow hover:text-white rounded-md transition-all duration-300 cursor-pointer"
          >
            <FaPrint className="" />
            Print
          </button>
           {/* search */}
          <div className="mt-3 md:mt-0">
            {/* <span className="text-primary font-semibold pr-3">Search: </span> */}
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              placeholder="Search list..."
              className="lg:w-60 border border-gray-300 rounded-md outline-none text-xs py-2 ps-2 pr-5"
            />
            {/*  Clear button */}
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
                className="absolute right-5 top-[5.7rem] -translate-y-1/2 text-gray-400 hover:text-red-500 text-sm"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        {/* filter */}
        {showFilter && (
          <div className="md:flex items-center gap-5 justify-between border border-gray-300 rounded-md p-5 my-5 transition-all duration-300 pb-5">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="dd/MM/yyyy"
              placeholderText="DD/MM/YYYY"
              locale="en-GB"
              className="!w-full p-2 border border-gray-300 rounded text-sm appearance-none outline-none"
              isClearable
            />

            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              dateFormat="dd/MM/yyyy"
              placeholderText="DD/MM/YYYY"
              locale="en-GB"
              className="!w-full p-2 border border-gray-300 rounded text-sm appearance-none outline-none"
              isClearable
            />


            <div className=" ">
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                  setShowFilter(false);
                }}
                className="bg-gradient-to-r from-primary to-primary text-white px-4 py-1.5 rounded-md shadow-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <FiFilter /> Clear
              </button>
            </div>
          </div>
        )}

        <div className="mt-5 overflow-x-auto rounded-md">
          <table ref={printRef} className="min-w-full text-sm text-left">
            <thead className="bg-gray-200 text-primary capitalize text-xs">
              <tr>
                <th className="px-2 py-4">SL</th>
                <th className="px-2 py-4">Date</th>
                <th className="px-2 py-4">Branch</th>
                <th className="px-2 py-4">PersonName</th>
                <th className="px-2 py-4">Type</th>
                <th className="px-2 py-4">Amount</th>
                <th className="px-2 py-4">Bank Name</th>
                {/* <th className="p-2">Ref</th> */}
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {currentCash.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center p-4 text-gray-500">
                    No cash found
                  </td>
                </tr>
              )
                : (currentCash?.map((dt, i) => (
                  <tr
                    key={i}
                    className="hover:bg-gray-50 transition-all border border-gray-200"
                  >
                    <td className="p-2 font-bold">{indexOfFirstItem + i + 1}</td>
                    {tableFormatDate(dt.date)}
                    <td className="p-2">{dt.branch_name}</td>
                    <td className="p-2">{dt.person_name}</td>
                    <td className="p-2">{dt.type}</td>
                    <td className="p-2">{dt.amount}</td>
                    <td className="p-2">{dt.bank_name}</td>
                    {/* <td className="p-2">{dt.ref}</td> */}
                    <td className="p-2 action_column">
                      <div className="flex gap-1">
                        <Link to={`/tramessy/account/update-CashDispatch/${dt.id}`}>
                          <button className="text-primary hover:bg-primary hover:text-white px-2 py-1 rounded shadow-md transition-all cursor-pointer">
                            <FaPen className="text-[12px]" />
                          </button>
                        </Link>
                        {/* <button className="text-primary hover:bg-primary hover:text-white px-2 py-1 rounded shadow-md transition-all cursor-pointer">
                        <FaEye className="text-[12px]" />
                      </button>*/}
                        <button
                          onClick={() => {
                            setSelectedFundTransferId(dt.id);
                            setIsOpen(true);
                          }}
                          className="text-red-500 hover:text-white hover:bg-red-600 px-2 py-1 rounded shadow-md transition-all cursor-pointer"
                        >
                          <FaTrashAlt className="text-[12px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )))
              }
            </tbody>
            {currentCash.length > 0 && (
              <tfoot className="bg-gray-100 font-bold">
                <tr>
                  <td colSpan="5" className="p-2 text-right">Total:</td>
                  <td className="p-2">{totalAmount}</td>
                  <td colSpan="2"></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
        {/* pagination */}
        {currentCash.length > 0 && totalPages >= 1 && (
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
                  onClick={() => handleDelete(selectedFundTransferId)}
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

export default CashDispatch;
