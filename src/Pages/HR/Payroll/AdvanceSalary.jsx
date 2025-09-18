import React from "react";
import { FaPlus, FaUserSecret } from "react-icons/fa";
import { Link } from "react-router-dom";
import Pagination from "../../../components/Shared/Pagination";

const AdvanceSalary = () => {
  return (
    <div className=" p-2">
      <div className="w-[22rem] md:w-full overflow-hidden overflow-x-auto max-w-7xl mx-auto bg-white/80 backdrop-blur-md shadow-xl rounded-md p-2 py-10 md:p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-3">
            <FaUserSecret className="text-gray-800 text-xl" />
            Advance Salary
          </h1>
          <div className="mt-3 md:mt-0 flex gap-2">
            <Link to="/tramessy/HR/Payroll/Advance-Salary-Form">
              <button className="bg-gradient-to-r from-primary to-[#075e13] text-white px-4 py-1 rounded-md shadow-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 cursor-pointer">
                <FaPlus /> Advance
              </button>
            </Link>
          </div>
        </div>
        <div className="mt-5 overflow-x-auto rounded-md">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-200 text-primary capitalize text-xs">
              <tr>
                <th className="p-2">#</th>
                <th className="p-2">Name</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Salary Month</th>
                {/* <th className="px-2 py-3">Action</th> */}
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr className="hover:bg-gray-50 transition-all border border-gray-200">
                <td className="p-2 font-bold">01</td>
                <td className="p-2">Korim Ali</td>
                <td className="p-2">10,000</td>
                <td className="p-2">5 April 2025</td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* pagination */}
        {/* {advance.length > 0 && totalPages >= 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
          maxVisible={8} 
        />
      )} */}
      </div>
    </div>
  );
};

export default AdvanceSalary;
