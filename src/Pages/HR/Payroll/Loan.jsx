import React, { useEffect, useState } from "react";
import { FaPen, FaPlus, FaUserSecret } from "react-icons/fa";
import { Link } from "react-router-dom";
import api from "../../../../utils/axiosConfig";
import Pagination from "../../../components/Shared/Pagination";
import { tableFormatDate } from "../../../hooks/formatDate";

const Loan = () => {
  const [advanceSalary, setAdvanceSalary] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // salary advance fetch
  useEffect(() => {
    const fetchSalaryAdvance = async () => {
      try {
        const res = await api.get(`/loan`);
        if (res.data?.status === "Success") {
          setAdvanceSalary(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching advance salary:", error);
      }
    };

    const fetchEmployee = async () => {
      try {
        const res = await api.get(`/employee`);
        if (res.data?.success) {
          setEmployee(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchSalaryAdvance();
    fetchEmployee();
  }, []);

  // pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = advanceSalary.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(advanceSalary.length / itemsPerPage);

  // helper to get employee name
  const getEmployeeName = (empId) => {
    const emp = employee.find((e) => e.id === Number(empId));
    return emp ? emp.employee_name || emp.email : empId;
  };

  return (
    <div className="p-2">
      <div className="w-[22rem] md:w-full overflow-hidden overflow-x-auto max-w-7xl mx-auto bg-white/80 backdrop-blur-md shadow-xl rounded-md p-2 py-10 md:p-4 border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-3">
            <FaUserSecret className="text-gray-800 text-xl" />
            Loan
          </h1>
          <div className="mt-3 md:mt-0 flex gap-2">
            <Link to="/tramessy/HR/Payroll/Advance-Salary-Form">
              <button className="bg-gradient-to-r from-primary to-[#075e13] text-white px-4 py-1 rounded-md shadow-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 cursor-pointer">
                <FaPlus /> Loan
              </button>
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="mt-5 overflow-x-auto rounded-md">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-200 text-primary capitalize text-xs">
              <tr>
                <th className="p-2">#</th>
                <th className="p-2">Date</th>
                <th className="p-2">Employee Name</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Salary Month</th>
                <th className="p-2">Status</th>
                <th className="p-2">Created By</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-all border border-gray-200"
                  >
                    <td className="p-2 font-bold">
                      {indexOfFirst + index + 1}
                    </td>
                    <td className="p-2">{tableFormatDate(item.created_at)}</td>
                    <td className="p-2">{getEmployeeName(item.employee_id)}</td>
                    <td className="p-2">{item.amount} ৳</td>
                    <td className="p-2">
                      {item.salary_month}
                    </td>
                    <td className="p-2">{item.status}</td>
                    <td className="p-2">
                      {(item.created_by)}
                    </td>
                    <td className="p-2">
                      <Link to={`/tramessy/HR/Payroll/update-advance/${item.id}`}>
                        <button className="text-primary hover:bg-primary hover:text-white px-2 py-1 rounded shadow-md transition-all cursor-pointer">
                          <FaPen className="text-[12px]" />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-500">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {currentItems.length > 0 && totalPages >= 1 && (
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
              maxVisible={8}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Loan;
