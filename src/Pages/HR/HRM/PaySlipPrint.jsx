
// // Helper: convert number to words (English, supports up to millions)
// const numberToWords = (num) => {
//   if (num === null || num === undefined) return "";
//   if (num === 0) return "zero";
//   const a = [
//     "",
//     "one",
//     "two",
//     "three",
//     "four",
//     "five",
//     "six",
//     "seven",
//     "eight",
//     "nine",
//     "ten",
//     "eleven",
//     "twelve",
//     "thirteen",
//     "fourteen",
//     "fifteen",
//     "sixteen",
//     "seventeen",
//     "eighteen",
//     "nineteen",
//   ];
//   const b = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
//   const g = ["", "thousand", "million", "billion"];

//   const makeGroup = (n) => {
//     let str = "";
//     if (n >= 100) {
//       str += a[Math.floor(n / 100)] + " hundred";
//       n = n % 100;
//       if (n) str += " ";
//     }
//     if (n >= 20) {
//       str += b[Math.floor(n / 10)];
//       if (n % 10) str += " " + a[n % 10];
//     } else if (n > 0) {
//       str += a[n];
//     }
//     return str;
//   };

//   let i = 0;
//   let words = [];
//   while (num > 0) {
//     const chunk = num % 1000;
//     if (chunk) {
//       let chunkWords = makeGroup(chunk);
//       if (g[i]) chunkWords += " " + g[i];
//       words.unshift(chunkWords.trim());
//     }
//     num = Math.floor(num / 1000);
//     i++;
//   }
//   return words.join(" ");
// };

// export default function PaySlipPrint({ payslipData }, ref) {
//   // default fallback data if nothing provided
//   const data = payslipData || {
//     company: {
//       name: "M/S AJ Enterprise",
//       addressLine1: "Razzak Plaza, 11th Floor, Room No: J-12",
//       addressLine2: "2 Shahid Tajuddin Sarani, Moghbazar, Dhaka-1217, Bangladesh",
//     },
//     employeeId: "AJBD-E10092018",
//     employeeName: "Md. Jubel",
//     designation: "Sr. Executive (Ops)",
//     monthYear: "1-Nov-2023",
//     earnings: [
//       { label: "Basic", amount: 5500 },
//       { label: "House Rent", amount: 1500 },
//       { label: "Medical", amount: 1500 },
//       { label: "Conveyance", amount: 500 },
//       { label: "Allowance", amount: 0 },
//       { label: "Bonus", amount: 0 },
//     ],
//     deductions: [
//       { label: "Advance", amount: 0 },
//       { label: "Loan", amount: 1000 },
//       { label: "Tax", amount: 0 },
//     ],
//     paidBy: "Cash", // or "Cheque"
//   };

//   const totalEarnings = data.earnings.reduce((s, e) => s + Number(e.amount || 0), 0);
//   const totalDeductions = data.deductions.reduce((s, d) => s + Number(d.amount || 0), 0);
//   const netSalary = totalEarnings - totalDeductions;

//   return (
//     <div ref={ref} className="max-w-3xl mx-auto p-6">
//       <div className="border-2 border-gray-300 p-6 shadow-sm">
//         {/* Header */}
//         <div className="flex items-start justify-between mb-4">
//           <div className="flex items-center space-x-3">
//             <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500 rounded">
//               {/* simple logo mark */}
//               <svg viewBox="0 0 100 100" className="w-10 h-10 text-white" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M10 80 L40 20 L70 80 Z" fill="white" />
//               </svg>
//             </div>
//             <div>
//               <h2 className="text-xl font-bold">{data.company.name}</h2>
//               <div className="text-xs">{data.company.addressLine1}</div>
//               <div className="text-xs">{data.company.addressLine2}</div>
//             </div>
//           </div>
//           <div className="text-right">
//             <div className="text-2xl font-semibold">Salary Pay Slip</div>
//           </div>
//         </div>

//         {/* main table area */}
//         <div className="border-t border-b border-gray-300">
//           <div className="grid grid-cols-3 gap-x-4 text-sm">
//             <div className="p-3 border-r border-gray-200">
//               <div className="font-medium">Employee ID</div>
//               <div>{data.employeeId}</div>
//             </div>
//             <div className="p-3 border-r border-gray-200">
//               <div className="font-medium">Employee Name</div>
//               <div>{data.employeeName}</div>
//             </div>
//             <div className="p-3">
//               <div className="font-medium">Month/Year</div>
//               <div>{data.monthYear}</div>
//             </div>
//           </div>

//           <div className="grid grid-cols-3 gap-x-4 text-sm border-t border-gray-200">
//             <div className="p-3 border-r border-gray-200">
//               <div className="font-medium">Designation</div>
//               <div>{data.designation}</div>
//             </div>
//             <div className="p-3 border-r border-gray-200"></div>
//             <div className="p-3"></div>
//           </div>
//         </div>

//         {/* Earnings / Deductions table mimic */}
//         <div className="mt-4">
//           <div className="grid grid-cols-2 gap-4">
//             {/* Earnings */}
//             <div className="border border-gray-300">
//               <div className="bg-gray-100 px-3 py-2 font-semibold">Earnings</div>
//               <div className="p-3">
//                 <table className="w-full text-sm table-fixed">
//                   <tbody>
//                     {data.earnings.map((e, idx) => (
//                       <tr key={idx} className="odd:bg-white even:bg-gray-50">
//                         <td className="py-2">{e.label}</td>
//                         <td className="py-2 text-right font-medium">{Number(e.amount).toLocaleString()}</td>
//                       </tr>
//                     ))}
//                     <tr className="border-t">
//                       <td className="py-2 font-semibold">Total Addition</td>
//                       <td className="py-2 text-right font-semibold">{totalEarnings.toLocaleString()}</td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Deductions */}
//             <div className="border border-gray-300">
//               <div className="bg-gray-100 px-3 py-2 font-semibold">Deductions</div>
//               <div className="p-3">
//                 <table className="w-full text-sm table-fixed">
//                   <tbody>
//                     {data.deductions.map((d, idx) => (
//                       <tr key={idx} className="odd:bg-white even:bg-gray-50">
//                         <td className="py-2">{d.label}</td>
//                         <td className="py-2 text-right font-medium">{Number(d.amount).toLocaleString()}</td>
//                       </tr>
//                     ))}
//                     <tr className="border-t">
//                       <td className="py-2 font-semibold">Total Deductions</td>
//                       <td className="py-2 text-right font-semibold">{totalDeductions.toLocaleString()}</td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>

//           {/* Net salary row */}
//           <div className="mt-4 border border-gray-300">
//             <div className="p-3 grid grid-cols-3 items-center">
//               <div className="col-span-2">
//                 <div className="text-sm font-medium">Net Salary</div>
//                 <div className="text-lg font-semibold">{netSalary.toLocaleString()}</div>
//               </div>
//               <div className="text-right">
//                 <div className="text-sm font-medium">Salary in Words:</div>
//                 <div className="text-xs italic">{numberToWords(netSalary)} only</div>
//               </div>
//             </div>
//           </div>

//           {/* Paid by and signatures */}
//           <div className="mt-4 flex items-center justify-between text-sm">
//             <div className="flex items-center space-x-3">
//               <label className="inline-flex items-center">
//                 <input type="checkbox" checked={data.paidBy === "Cash"} readOnly className="mr-2" />
//                 Cash
//               </label>
//               <label className="inline-flex items-center">
//                 <input type="checkbox" checked={data.paidBy === "Cheque"} readOnly className="mr-2" />
//                 Cheque
//               </label>
//             </div>
//             <div className="flex items-center gap-8">
//               <div className="text-center">
//                 <div className="h-6 border-b w-40"></div>
//                 <div className="text-xs">Employee Signature</div>
//               </div>
//               <div className="text-center">
//                 <div className="h-6 border-b w-40"></div>
//                 <div className="text-xs">Authorized</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* footer small */}
//         <div className="mt-4 text-xs text-gray-500 text-center">This is a system generated payslip and does not require signature if presented digitally.</div>
//       </div>
//     </div>
//   );
// }


// Helper: convert number to words (English, supports up to millions)
const numberToWords = (num) => {
  if (num === null || num === undefined) return ""
  if (num === 0) return "zero"
  const a = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ]
  const b = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]
  const g = ["", "thousand", "million", "billion"]

  const makeGroup = (n) => {
    let str = ""
    if (n >= 100) {
      str += a[Math.floor(n / 100)] + " hundred"
      n = n % 100
      if (n) str += " "
    }
    if (n >= 20) {
      str += b[Math.floor(n / 10)]
      if (n % 10) str += " " + a[n % 10]
    } else if (n > 0) {
      str += a[n]
    }
    return str
  }

  let i = 0
  const words = []
  while (num > 0) {
    const chunk = num % 1000
    if (chunk) {
      let chunkWords = makeGroup(chunk)
      if (g[i]) chunkWords += " " + g[i]
      words.unshift(chunkWords.trim())
    }
    num = Math.floor(num / 1000)
    i++
  }
  return words.join(" ")
}
import logo from "../../../assets/AJ_Logo.png"
export default function PaySlipPrint({ payslipData }, ref) {
  const data = payslipData || {
    employeeId: "AJBD-E10092018",
    employeeName: "Md.Jubel",
    designation: "Sr. Executive (Ops)",
    monthYear: "1-Nov-2023",
    earnings: {
      basic: 5500,
      houseRent: 1500,
      medical: 1500,
      convance: 500,
      allowance: 0,
      bonus: 0,
      totalAddition: 8000,
    },
    deductions: {
      advance: 0,
      loan: 1000,
      tax: 0,
      totalDeductions: 1000,
    },
    netSalary: 7000,
  }

  return (
    <div ref={ref} className="max-w-4xl mx-auto bg-white p-8 font-sans text-sm">
      {/* Header Section */}
      <div className="border-2 border-gray-700">
        {/* Company Header */}
        <div className="flex items-center justify-between p-4">
          <div className="">
            {/* Logo */}
            <img src={logo} alt="" />
            <div className="text-xs text-secondary">
              <div className="font-bold">M/S A J ENTERPRISE</div>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-secondary mb-2">M/S AJ Enterprise</h1>
            <div className="text-xs text-gray-700">
              <div>Razzak Plaza, 11th Floor, Room No: J-12,</div>
              <div>2 Sahid Tajuddin Sarani, Moghbazar, Dhaka-1217, Bangladesh</div>
            </div>
          </div>
          <div className="w-16"></div> {/* Spacer for balance */}
        </div>

        {/* Pay Slip Title */}
        <div className="text-center py-3 px-28">
          <h2 className="text-xl font-bold italic border-b-2 border-gray-700">Salary Pay Slip</h2>
        </div>

        {/* table info */}
        <div className="border border-gray-700 mx-10">
          {/* Employee Information */}
          <div className="border-b border-black">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="border-r border-black p-2 font-semibold bg-gray-100 w-32">Employee ID</td>
                  <td className="border-r border-black p-2 w-40">{data.employeeId}</td>
                  <td className="border-r border-black p-2 font-semibold bg-gray-100 w-32">Employee Name</td>
                  <td className="p-2">{data.employeeName}</td>
                </tr>
                <tr className="border-t border-black">
                  <td className="border-r border-black p-2 font-semibold bg-gray-100">Designation</td>
                  <td className="border-r border-black p-2">{data.designation}</td>
                  <td className="border-r border-black p-2 font-semibold bg-gray-100">Month/Year</td>
                  <td className="p-2">{data.monthYear}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Earnings and Deductions */}
          <div className="border-b border-black">
            <table className="w-full">
              <tbody>
                <tr>
                  <td colSpan={2} className="border-r border-black p-2 text-center font-bold bg-gray-100 w-1/4">Earnings</td>
                  {/* <td className="border-r border-black p-2 text-center font-bold bg-gray-100 w-1/4"></td> */}
                  <td colSpan={2} className=" p-2 text-center font-bold bg-gray-100 w-1/4">Deductions</td>
                  {/* <td className="p-2 text-center font-bold bg-gray-100 w-1/4"></td> */}
                </tr>
                <tr className="border-t border-black">
                  <td className="border-r border-black p-2 font-semibold">Basic</td>
                  <td className="border-r border-black p-2 text-right">{data.earnings.basic}</td>
                  <td className="border-r border-black p-2 font-semibold">Advance</td>
                  <td className="p-2 text-right">{data.deductions.advance}</td>
                </tr>
                <tr className="border-t border-black">
                  <td className="border-r border-black p-2 font-semibold">House Rent</td>
                  <td className="border-r border-black p-2 text-right">{data.earnings.houseRent}</td>
                  <td className="border-r border-black p-2 font-semibold rounded-full border  mx-2 text-center">
                    Loan
                  </td>
                  <td className="p-2 text-right">{data.deductions.loan}</td>
                </tr>
                <tr className="border-t border-black">
                  <td className="border-r border-black p-2 font-semibold">Medical</td>
                  <td className="border-r border-black p-2 text-right">{data.earnings.medical}</td>
                  <td className="border-r border-black p-2 font-semibold rounded-full border mx-2 text-center">
                    Tax
                  </td>
                  <td className="p-2 text-right">{data.deductions.tax}</td>
                </tr>
                <tr className="border-t border-black">
                  <td className="border-r border-black p-2 font-semibold">Convance</td>
                  <td className="border-r border-black p-2 text-right">{data.earnings.convance}</td>
                  <td className="border-r border-black p-2"></td>
                  <td className="p-2"></td>
                </tr>
                <tr className="border-t border-black">
                  <td className="border-r border-black p-2 font-semibold">Allowance</td>
                  <td className="border-r border-black p-2 text-right">{data.earnings.allowance}</td>
                  <td className="border-r border-black p-2"></td>
                  <td className="p-2"></td>
                </tr>
                <tr className="border-t border-black">
                  <td className="border-r border-black p-2 font-semibold">Bonus</td>
                  <td className="border-r border-black p-2 text-right">{data.earnings.bonus}</td>
                  <td className="border-r border-black p-2"></td>
                  <td className="p-2"></td>
                </tr>
                <tr className="border-t border-black bg-gray-100">
                  <td className="border-r border-black p-2 font-bold">Total Addition</td>
                  <td className="border-r border-black p-2 text-right font-bold"> {data.earnings.totalAddition}</td>
                  <td className="border-r border-black p-2 font-bold">Total Deductions</td>
                  <td className="p-2 text-right font-bold">{data.deductions.totalDeductions}.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Net Salary */}
          <div className="">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="border-r border-black p-2 font-bold bg-gray-100 w-1/4">Net Salary</td>
                  <td className="border-r border-black p-2 text-center font-bold text-lg"> {data.netSalary} </td>
                  <td className="p-2"></td>
                </tr>
                <tr className="border-t border-black">
                  <td className="border-r border-black p-2 font-bold bg-gray-100">Salary in Words:</td>
                  <td className="p-2 font-semibold">{numberToWords(data.netSalary).toUpperCase()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* Payment Method and Signatures */}
          <div className="p-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="mb-2 font-semibold">Salary Paid by:</div>
                <div className="flex gap-8">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" defaultChecked />
                    <span>Cash</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>Cheque</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <div>
                <div className="mb-2">Employee Signature</div>
                <div className="border-b border-black w-64 h-8"></div>
              </div>
              <div>
                <div className="mb-2">Authorized</div>
                <div className="border-b border-black w-64 h-8"></div>
              </div>
            </div>
          </div>
      </div>
    </div>
  )
}
