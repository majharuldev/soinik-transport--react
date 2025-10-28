
// import React, { useContext, useEffect, useState } from "react";
// import { FormProvider, useForm } from "react-hook-form";
// import BtnSubmit from "../../../components/Button/BtnSubmit";
// import { InputField, SelectField } from "../../../components/Form/FormFields";
// import toast from "react-hot-toast";
// import api from "../../../../utils/axiosConfig";
// import { AuthContext } from "../../../providers/AuthProvider";
// import { useNavigate, useParams } from "react-router-dom";

// const RequisitionForm = () => {
//   const methods = useForm();
//   const { handleSubmit, reset, control, setValue } = methods;
//   const [employees, setEmployees] = useState([]);
//   const [userName, setUserName] = useState("");
//   const { user } = useContext(AuthContext);
//   const userId = user?.id;
//   const { id } = useParams();
//   const navigate = useNavigate()

//   console.log(employees, "employee")

//   // Fetch employees & user info
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [empRes, userRes] = await Promise.all([
//           api.get(`/employee`),
//           api.get(`/user/${userId}`),
//         ]);

//         if (empRes.data?.data) setEmployees(empRes.data.data);
//         if (userRes.data?.name) setUserName(userRes.data.name);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//       }
//     };
//     fetchData();
//   }, [userId]);

//   // Fetch existing advance salary (for edit mode)
//   useEffect(() => {
//     if (id) {
//       const fetchAdvanceSalary = async () => {
//         try {
//           const res = await api.get(`/salaryAdvanced/${id}`);
//           const data = res.data?.data;
//           if (data) {
//             setValue("employee_id", data.employee_id);
//             setValue("amount", data.amount);
//             setValue("salary_month", data.salary_month);
//             setValue("status", data.status);
//             setValue("created_by", data.created_by);
//           }
//         } catch (err) {
//           console.error("Error fetching salary data:", err);
//           toast.error("Failed to load advance salary info!");
//         }
//       };
//       fetchAdvanceSalary();
//     }
//   }, [id, id, setValue]);

//   // Submit handler (Add or Update)
//  const onSubmit = async (data) => {
//   const payload = {
//     employee_id: data.employee_id,
//     amount: data.amount,
//     salary_month: data.salary_month,
//     status: data.status,
//     created_by: userName,
//   };

//   try {
//     const res = id
//       ? await api.put(`/salaryAdvanced/${id}`, payload)
//       : await api.post(`/salaryAdvanced`, payload)

//     // Success check
//     if (res?.data?.status === "Success") {
//       toast.success(
//         id
//           ? "Advance Salary Updated Successfully!"
//           : "Advance Salary Added Successfully!"
//       );
//       reset();
//       navigate("/tramessy/HR/Payroll/Advance-Salary");
//       return;
//     }

//     // API returned something other than success
//     toast.error(res?.data?.message || "Something went wrong!");
//   } catch (err) {
//     // Prevent duplicate toast if response exists
//     if (!err.response) {
//       toast.error("Failed to submit advance salary!");
//     }
//     console.error("Error submitting form:", err);
//   }
// };

//   return (
//     <div className="p-2">
//       <FormProvider {...methods}>
//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="mx-auto p-6 border-t-2 border-primary rounded-md shadow space-y-4 max-w-3xl bg-white"
//         >
//           <h3 className="pb-4 text-primary font-semibold text-lg">
//             {id
//               ? "Edit Advance Requisition Information"
//               : "Add Advance Requisition Information"}
//           </h3>

//           {/* Employee + Amount */}
//           <div className="md:flex justify-between gap-3">
//            <div className="w-full">
//               <label className="block text-sm font-medium mb-1">
//                 Select Employee <span className="text-red-500">*</span>
//               </label>
//               <select
//                 {...methods.register("employee_id", { required: "Employee is required" })}
//                 className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-primary focus:border-primary"
//               >
//                 <option value="">Select Employee</option>
//                 {employees.map((emp) => (
//                   <option key={emp.id} value={emp.id}>
//                     {emp.employee_name || emp.email}
//                   </option>
//                 ))}
//               </select>
//               {methods.formState.errors.employee_id && (
//                 <p className="text-xs text-red-500 mt-1">
//                   {methods.formState.errors.employee_id.message}
//                 </p>
//               )}
//             </div>
//             <div className="w-full">
//               <InputField
//                 name="amount"
//                 label="Advance Amount"
//                 type="number"
//                 required
//               />
//             </div>
//           </div>

//           {/* Salary Month + Status */}
//           <div className="md:flex justify-between gap-3">
//             <div className="w-full">
//               <InputField
//                 name="salary_month"
//                 label="Salary Month (YYYY-MM)"
//                 placeholder="2025-09"
//                 required
//               />
//             </div>
//             <div className="w-full">
//               <SelectField
//                 name="status"
//                 label="Status"
//                 required
//                 options={[
//                   { label: "Paid", value: "Paid" },
//                   { label: "Pending", value: "Pending" },
//                 ]}
//               />
//             </div>
//           </div>

//           {/* Created By (auto-filled) */}
//           <div className="md:flex justify-between gap-3">
//             <div className="w-full hidden">
//               <InputField
//                 name="created_by"
//                 label="Created By"
//                 value={userName}
//                 readOnly
//               />
//             </div>
//           </div>

//           {/* Submit */}
//           <BtnSubmit> {id ? "Update" : "Submit"}</BtnSubmit>
//         </form>
//       </FormProvider>
//     </div>
//   );
// };

// export default RequisitionForm;


import React, { useContext, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import BtnSubmit from "../../../components/Button/BtnSubmit";
import TextAreaField, { InputField } from "../../../components/Form/FormFields";
import toast from "react-hot-toast";
import api from "../../../../utils/axiosConfig";
import { AuthContext } from "../../../providers/AuthProvider";
import { useNavigate, useParams } from "react-router-dom";

const RequisitionForm = () => {
  const methods = useForm();
  const { handleSubmit, reset, setValue } = methods;
  const [employees, setEmployees] = useState([]);
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get(`/employee`);
        if (res.data?.success) setEmployees(res.data.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  // Fetch existing requisition (edit mode)
  useEffect(() => {
    if (id) {
      const fetchRequisition = async () => {
        try {
          const res = await api.get(`/requestion/${id}`);
          const data = res.data?.data;
          if (data) {
            setValue("employee_id", data.employee_id);
            setValue("date", data.date);
            setValue("purpose", data.purpose);
            setValue("amount", data.amount);
            setValue("remarks", data.remarks);
          }
        } catch (err) {
          console.error("Error fetching requisition:", err);
          toast.error("Failed to load requisition info!");
        }
      };
      fetchRequisition();
    }
  }, [id, setValue]);

  // Submit handler
  const onSubmit = async (data) => {
    const payload = {
      user_id: user?.id,
      employee_id: data.employee_id,
      date: data.date,
      purpose: data.purpose,
      amount: data.amount,
      remarks: data.remarks,
    };

    try {
      const res = id
        ? await api.put(`/requestion/${id}`, payload)
        : await api.post(`/requestion`, payload);

      if (res.data?.success) {
        toast.success(
          id
            ? "Requisition Updated Successfully!"
            : "Requisition Added Successfully!"
        );
        reset();
        navigate("/tramessy/HR/advance-requisition");
      } else {
        toast.error(res?.data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error submitting requisition:", error);
      toast.error("Failed to submit requisition!");
    }
  };

  return (
    <div className="p-2">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto p-6 border-t-2 border-primary rounded-md shadow space-y-4 max-w-3xl bg-white"
        >
          <h3 className="pb-4 text-primary font-semibold text-lg">
            {id ? "Edit Requisition" : "Add Requisition"}
          </h3>

          {/* Employee + Date */}
          <div className="md:flex justify-between gap-3">
            <div className="w-full">
              <label className="block text-sm font-medium mb-1">
                Select Employee <span className="text-red-500">*</span>
              </label>
              <select
                {...methods.register("employee_id", {
                  required: "Employee is required",
                })}
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-primary focus:border-primary"
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.employee_name || emp.email}
                  </option>
                ))}
              </select>
              {methods.formState.errors.employee_id && (
                <p className="text-xs text-red-500 mt-1">
                  {methods.formState.errors.employee_id.message}
                </p>
              )}
            </div>
            <div className="w-full">
              <InputField name="date" label="Date" type="date" required />
            </div>
          </div>

          {/* Purpose + Amount */}
          <div className="md:flex justify-between gap-3">
            <div className="w-full">
              <InputField name="purpose" label="Purpose" required />
            </div>
            <div className="w-full">
              <InputField
                name="amount"
                label="Amount"
                type="number"
                required
              />
            </div>
          </div>

          {/* Remarks */}
          <TextAreaField name="remarks" label="Remarks" rows={3} />

          {/* Submit */}
          <BtnSubmit>{id ? "Update" : "Submit"}</BtnSubmit>
        </form>
      </FormProvider>
    </div>
  );
};

export default RequisitionForm;
