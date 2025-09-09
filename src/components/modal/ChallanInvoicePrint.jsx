// import React, { forwardRef } from "react";

// const ChallanInvoicePrint = forwardRef(({ data }, ref) => {
//   const {
//     voucherNo,
//     receiver,
//     address,
//     truckNo,
//     dln,
//     loadingPoint,
//     unloadingPoint,
//     rent,
//     loadingDemurrage,
//     inTime,
//     outTime,
//     totalDay,
//     totalDemurrage,
//     others,
//   } = data;

//   // Function to convert numbers to words
//   const numberToWords = (num) => {
//     const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
//     const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
//     const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

//     function convertLessThanOneThousand(num) {
//       if (num === 0) return '';
//       if (num < 10) return ones[num];
//       if (num < 20) return teens[num - 10];
//       if (num < 100) {
//         return tens[Math.floor(num / 10)] + ' ' + ones[num % 10];
//       }
//       return ones[Math.floor(num / 100)] + ' Hundred ' + convertLessThanOneThousand(num % 100);
//     }

//     if (num === 0) return 'Zero';
//     let result = '';
//     if (num >= 10000000) {
//       result += convertLessThanOneThousand(Math.floor(num / 10000000)) + ' Crore ';
//       num %= 10000000;
//     }
//     if (num >= 100000) {
//       result += convertLessThanOneThousand(Math.floor(num / 100000)) + ' Lakh ';
//       num %= 100000;
//     }
//     if (num >= 1000) {
//       result += convertLessThanOneThousand(Math.floor(num / 1000)) + ' Thousand ';
//       num %= 1000;
//     }
//     result += convertLessThanOneThousand(num);
//     return result.trim() + ' Taka Only';
//   };

//   const totalAmount = (parseFloat(rent) || 0) +
//     // (parseFloat(loadingDemurrage) || 0) +
//     (parseFloat(totalDemurrage) || 0) +
//     (parseFloat(others) || 0);

//   // Get current date
//   const currentDate = new Date().toLocaleDateString('en-GB', {
//     day: 'numeric',
//     month: 'short',
//     year: 'numeric'
//   });

//   return (
//     <div ref={ref} className="text-sm p-8 bg-white w-[810px] h-[1000px] text-black font-sans mx-auto">
//       <div className="text-center mb-2">
//         <h2 className="text-2xl font-bold text-primary">লাকসাম পরিবহন সংস্থা</h2>
//         <h3 className="font-semibold text-blue-900">LAKSHAM PORIBOHAN SONGSTHA</h3>
//         <div className="text-md font-semibold">
//           Transport Contractor & Commission Agent all over Bangladesh<br />
//           <span className="font-semibold">Dhaka Office:</span> Union Office (4th Floor), Tejgaon, Dhaka-1208<br />
//           <span>📞</span> 01717 314747, 01797 394658, 01615 314747<br />
//           📧 lpsongstha@gmail.com
//         </div>
//         <button className="bg-primary px-3 py-2 rounded-full text-white my-4">Voucher</button>
//       </div>

//       <div className="flex justify-between mb-2 border-b border-black pb-2">
//         <div>
//           <span className="font-semibold">Voucher no:</span> {voucherNo}
//         </div>
//         <div>
//           <span className="font-semibold">Date:</span> {currentDate}
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-2 mb-4 space-y-3">
//         <div className="space-y-2">
//           <p><strong className="mr-3">Sender:</strong>Laksham Poribohan Songstha</p>
//           <p><strong className="mr-3">Address:</strong> Union Office (4th Floor), Tejgaon, Dhaka</p>
//         </div>
//         <div className="space-y-2">
//           <p><strong>Receiver:</strong><span className="border-b border-dotted ml-3">{receiver}</span></p>
//           <p><strong>Address:</strong><span className="border-b border-dotted ml-3"> {address}</span></p>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-2 mb-4 border border-primary p-2">
//         <p><strong className="mr-3">Truck no:</strong><span className="border-b border-dotted ml-3"> {truckNo}</span></p>
//         <p><strong className="mr-3">D/L no:</strong> <span className="border-b border-dotted ml-3"> {dln}</span></p>
//       </div>

//       {/* Invoice-like layout with Description & Amount */}
//       <div className="border border-primary mt-5">
//         <div className="grid grid-cols-2 border-b border-primary">
//           <p className="text-center font-semibold text-lg p-2 border-r border-primary">Description</p>
//           <p className="text-center font-semibold text-lg p-2">Amount</p>
//         </div>

//         <div className="grid grid-cols-2  border-primary">
//           <div className="p-2 border-r border-primary">
//             <strong>Loading Point:</strong> <span className="border-b border-dotted ">{loadingPoint}</span>
//           </div>
//           <div className="p-2"></div>
//         </div>

//         <div className="grid grid-cols-2  border-primary">
//           <div className="p-2 border-r border-primary">
//             <strong>Unloading Point:</strong> <span className="border-b border-dotted">{unloadingPoint}</span>
//           </div>
//           <div className="p-2"></div>
//         </div>

//         <div className="grid grid-cols-2  border-primary">
//           <div className="p-2 border-r border-primary"><strong>Rent:</strong></div>
//           <div className="p-2">{rent}</div>
//         </div>

//         <div className="grid grid-cols-2  border-primary">
//           <div className="p-2 border-r border-primary"><strong>Loading Demurrage:</strong></div>
//           <div className="p-2">{loadingDemurrage}</div>
//         </div>

//         <div className="grid grid-cols-2  border-primary">
//           <div className="p-2 border-r border-primary">
//             <strong>In Time:</strong> <span className="border-b border-dotted">{inTime}</span>
//           </div>
//           <div className="p-2"></div>
//         </div>

//         <div className="grid grid-cols-2 border-primary">
//           <div className="p-2 border-r border-primary">
//             <strong>Out Time:</strong> <span className="border-b border-dotted">{outTime}</span>
//           </div>
//           <div className="p-2"></div>
//         </div>

//         <div className="grid grid-cols-2  border-primary">
//           <div className="p-2 border-r border-primary">
//             <strong>Total Day:</strong> <span className="border-b border-dotted">{totalDay}</span>
//           </div>
//           <div className="p-2"></div>
//         </div>

//         <div className="grid grid-cols-2  border-primary">
//           <div className="p-2 border-r border-primary"><strong>Total Demurrage:</strong></div>
//           <div className="p-2">{totalDemurrage}</div>
//         </div>

//         <div className="grid grid-cols-2">
//           <div className="p-2 border-r border-primary"><strong>Others:</strong> {others}</div>
//           <div className="p-2">
//             <strong>Total:</strong> {totalAmount}
//           </div>
//         </div>
//       </div>

//       <p className="mt-4"><strong>In words:</strong> {numberToWords(totalAmount)}</p>

//       <div className="flex justify-between mt-10">
//         <div><p className="text-medium">Received by</p></div>
//         <div><p className="text-medium text-center">Signature from<br />Laksham Poribohan Songstha</p></div>
//       </div>
//     </div>
//   );
// });

// export default ChallanInvoicePrint;


// import { forwardRef } from "react"

// const ChallanInvoicePrint = forwardRef(({ data }, ref) => {
//   const {
//     voucherNo = "4669",
//     receiver = "বাড্ডা, ঢেকার বাংলাদেশ লিমিটেড",
//     address = "হেমায়েত উদ্দিন রোড ঢাকা-১২০৫ ভোজ ০৮২৩০৪৯৪০৪",
//     truckNo = "DM-TA-11-6756",
//     loadingPoint = "৭৫৪৪ এক্সপ্রেস এক্সপ্রেস",
//     unloadingPoint = "আগারগাঁও",
//     goods = "11 packet of synthetic organic pigment BLUE 15:8",
//     rent,
//     others,
//   } = data

//   // Get current date in Bengali format
//   const currentDate = "০১/০৬/২০২৩"

//   return (
//     <div ref={ref} className="text-sm p-6 bg-white w-[800px] min-h-[600px] text-black font-sans mx-auto border">
//       {/* Header Section */}
//       <div className="flex items-start justify-between mb-4">
//         <div className="flex items-center gap-3">
//           {/* AJ Logo */}
//           <div className="w-12 h-12 bg-cyan-500 flex items-center justify-center text-white font-bold text-xl">AJ</div>
//           <div>
//             <h1 className="text-xl font-bold text-cyan-600">মেসার্স এজে এন্টারপ্রাইজ</h1>
//             <p className="text-xs">
//               ঠিকানা: নাজিরাল প্রাজা ১২৫৮ নং, তৃতীয় তলা, কক্ষ নং, পশ্চিম তেজগাঁও বাজার, তেজগাঁও, ঢাকা।
//               <br />
//               মোবাইল নং: ০১৭১৭-৩১৪৭৪৭, ০১৭৯৭-৩৯৪৬৫৮ ০১৬১৫-৭২৪৯১৭
//             </p>
//           </div>
//         </div>
//         <div className="text-right">
//           <div className="text-xs">
//             চালান নং: <span className="font-bold">{voucherNo}</span>
//           </div>
//         </div>
//       </div>

//       {/* Truck Challan Header */}
//       <div className="text-center mb-4">
//         <div className="inline-block bg-cyan-500 text-white px-6 py-2 rounded">ট্রাক চালান</div>
//         <div className="text-right mt-2">
//           <span>তারিখ: {currentDate}</span>
//         </div>
//       </div>

//       {/* Form Fields */}
//       <div className="space-y-2 mb-4">
//         <div className="flex">
//           <span className="w-16">প্রাপক:</span>
//           <span className="border-b border-dotted flex-1 ml-2">{receiver}</span>
//           <span className="ml-8">ট্রাক নং:</span>
//           <span className="border-b border-dotted ml-2 w-32">{truckNo}</span>
//         </div>

//         <div className="flex">
//           <span className="w-16">বিবরণ:</span>
//           <span className="border-b border-dotted flex-1 ml-2">{address}</span>
//           <span className="ml-8">চালকের নাম:</span>
//           <span className="border-b border-dotted ml-2 w-32">০১৮৭১-১০৮৫৮৪</span>
//         </div>

//         <div className="flex">
//           <span className="w-16">প্রেরক:</span>
//           <span className="border-b border-dotted flex-1 ml-2">{loadingPoint}</span>
//           <span className="ml-8">লাইসেন্স নং:</span>
//           <span className="border-b border-dotted ml-2 w-32">০১৮৭১-১০৮৫৮৪</span>
//         </div>

//         <div className="flex">
//           <span className="w-16">বিবরণ:</span>
//           <span className="border-b border-dotted flex-1 ml-2">{unloadingPoint}</span>
//           <span className="ml-8">রুট:</span>
//           <span className="border-b border-dotted ml-2 w-32">০১৮৭১-১০৮৫৮৪</span>
//         </div>
//       </div>

//       {/* Main Content Table */}
//       <div className="flex gap-4 mb-6">
//         {/* Left Side - Goods Description */}
//         <div className="flex-1 border border-black">
//           <div className="border-b border-black p-2 bg-gray-50">
//             <strong>মালামালের বিবরণ: (কোটি/বস্তা/বাক্স/কেজি)</strong>
//           </div>
//           <div className="p-4 min-h-[120px]">
//             <div className="mb-2">
//               <strong>জমাদার,</strong>
//             </div>
//             <div className="mb-2">
//               <strong>সর্বমোট মালামাল:</strong>
//             </div>
//             <div className="mt-4">
//               <div className="handwriting-style">{goods}</div>
//               <div className="text-xs text-gray-600 mt-1">Berger Paints Bangladesh Limited</div>
//             </div>
//           </div>
//         </div>

//         {/* Right Side - Cost Breakdown */}
//         <div className="w-48 border border-black">
//           <div className="border-b border-black">
//             <div className="grid grid-cols-2 text-center font-bold bg-gray-50">
//               <div className="border-r border-black p-1">বিবরণ</div>
//               <div className="p-1">টাকা</div>
//             </div>
//           </div>

//           <div className="text-xs">
//             <div className="grid grid-cols-2 border-b border-gray-300">
//               <div className="border-r border-black p-1">মালামাল ভাড়া</div>
//               <div className="p-1"></div>
//             </div>
//             <div className="grid grid-cols-2 border-b border-gray-300">
//               <div className="border-r border-black p-1">খালি গাড়ি ভাড়া</div>
//               <div className="p-1"></div>
//             </div>
//             <div className="grid grid-cols-2 border-b border-gray-300">
//               <div className="border-r border-black p-1">ট্রিপ ভাড়া</div>
//               <div className="p-1">৮</div>
//             </div>
//             <div className="grid grid-cols-2 border-b border-gray-300">
//               <div className="border-r border-black p-1">লেবার ভাড়া</div>
//               <div className="p-1">৮</div>
//             </div>
//             <div className="grid grid-cols-2 border-b border-gray-300">
//               <div className="border-r border-black p-1">মেরামত ভাড়া</div>
//               <div className="p-1"></div>
//             </div>
//             <div className="grid grid-cols-2 border-b border-gray-300">
//               <div className="border-r border-black p-1">অন্যান্য</div>
//               <div className="p-1"></div>
//             </div>
//             <div className="grid grid-cols-2 border-b border-gray-300">
//               <div className="border-r border-black p-1">মোট ভাড়া</div>
//               <div className="p-1"></div>
//             </div>
//             <div className="grid grid-cols-2 border-b border-gray-300">
//               <div className="border-r border-black p-1">অগ্রিম</div>
//               <div className="p-1"></div>
//             </div>
//             <div className="grid grid-cols-2">
//               <div className="border-r border-black p-1">বাকি</div>
//               <div className="p-1"></div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Section */}
//       <div className="text-xs mb-4">
//         <p>
//           <strong>বি: দ্র:</strong> উপরিউক্ত মাল পরিবহনের পৌঁছানো দায়িত্ব ট্রাক চালকের। গাড়ীতে মালিকের উপস্থিতি ছাড়া পরিবহন সংস্থা দায়ী নয়
//           কোন ক্ষতির জন্য।
//         </p>
//         <p className="mt-1">গাড়ীর চালক ৭ সপ্তাহের মধ্যে অবশ্যই বিল পরিশোধ মাধ্যমে চালান ট্রাকমেট কর্তৃপক্ষের নিকট জমা দিতে হবে।</p>
//       </div>

//       {/* Signature Section */}
//       <div className="flex justify-between items-end mt-8">
//         <div className="text-center">
//           <div className="w-32 h-16 border border-black mb-2"></div>
//           <div className="text-xs">চালকের স্বাক্ষর/মালিকের স্বাক্ষর</div>
//         </div>

//         <div className="text-center">
//           <div className="mb-2">
//             <div className="text-xs">তারিখ: ২৩.০৬.০৬</div>
//             <div className="text-xs">Email Time: ................</div>
//           </div>
//         </div>

//         <div className="text-center">
//           <div className="text-lg font-bold mb-2">Shadib</div>
//           <div className="text-xs">
//             মালিকানা:
//             <br />
//             মেসার্স এজে এন্টারপ্রাইজ
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// })

// ChallanInvoicePrint.displayName = "ChallanInvoicePrint"

// export default ChallanInvoicePrint


import { forwardRef } from "react"

import logo from "../../assets/AJ_Logo.png"

const ChallanInvoicePrint = forwardRef(({ data }, ref) => {
  console.log(data)
  const {
    voucherNo,
    receiver,
    address,
    truckNo,
    driverName,
    licenseNo,
    loadingPoint,
    unloadingPoint,
    productDetails,
    route,
    rent
  } = data

  // Get current date
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div
      ref={ref}
      className="text-sm p-4 bg-white w-[250mm] min-h-[297mm] text-black font-sans mx-auto"
    >
      <div className="flex items-center justify-center mb-3">
        <div className="flex items-center gap-3">
          <div>
            <img src={logo} alt="" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-cyan-600 mb-1 text-center">মেসার্স এজে এন্টারপ্রাইজ</h1>
            <p className="text-xs leading-tight text-center">
              অফিস: রাজ্জাক প্লাজা ১২ তম তলা, রুম নং: জে-১২, শহিদ তাজউদ্দিন, মগবাজার,  ঢাকা।
              <br />
              মোবাইল নং- ০১৮৭২-১২১৮৬২, ০১৮৬৬৭৩৪৩১৪
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="text-sm">
          চালান নং: <span className="font-bold">{voucherNo}</span>
        </div>
        <div className="bg-cyan-500 text-white px-4 py-1 rounded text-sm font-bold">ট্রাক চালান</div>
        <div className="text-sm">
          তারিখ: <span className="font-bold">{currentDate}</span>
        </div>
      </div>

      <div className="border border-gray-700 mb-4">
        <div className="grid grid-cols-2 gap-0">
          {/* Left Column */}
          <div className="border-r border-gray-700 p-2 space-y-2">
            <div className="flex items-center">
              <span className="w-12 text-sm">প্রাপক:</span>
              <span className="flex-1 border-b border-gray-700 pb-1 ml-2 text-sm">{receiver}</span>
            </div>
            <div className="flex items-center">
              <span className="w-12 text-sm">বিবরণ:</span>
              <span className="flex-1 border-b border-gray-700 pb-1 ml-2 text-sm">{address}</span>
            </div>
            <div className="flex items-center">
              <span className="w-12 text-sm">প্রেরক:</span>
              <span className="flex-1 border-b border-gray-700 pb-1 ml-2 text-sm">{loadingPoint}</span>
            </div>
            <div className="flex items-center">
              <span className="w-12 text-sm">বিবরণ:</span>
              <span className="flex-1 border-b border-gray-700 pb-1 ml-2 text-sm">{unloadingPoint}</span>
            </div>
          </div>

          {/* Right Column */}
          <div className="p-2 space-y-2">
            <div className="flex items-center">
              <span className="w-16 text-sm">ট্রাক নং:</span>
              <span className="flex-1 border-b border-gray-700 pb-1 ml-2 text-sm">{truckNo}</span>
            </div>
            <div className="flex items-center">
              <span className="w-16 text-sm">চালকের নাম:</span>
              <span className="flex-1 border-b border-gray-700 pb-1 ml-2 text-sm">{driverName}</span>
            </div>
            <div className="flex items-center">
              <span className="w-16 text-sm">লাইসেন্স নং:</span>
              <span className="flex-1 border-b border-gray-700 pb-1 ml-2 text-sm">{licenseNo}</span>
            </div>
            <div className="flex items-center">
              <span className="w-16 text-sm">রুট:</span>
              <span className="flex-1 border-b border-gray-700 pb-1 ml-2 text-sm">{loadingPoint}</span> to
              <span className="flex-1 border-b border-gray-700 pb-1 ml-2 text-sm">{unloadingPoint}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-0 mb-4 border border-gray-700">
        <div className="w-16 border-r border-gray-700">
          <div className="border-b border-gray-700 bg-gray-50">
            <div className=" text-center text-sm font-bold">
              <div className=" p-2">সংখ্যা</div>
            </div>
          </div>

          <div className="text-xs">
            <div className=" min-h-[24px]">
              <div className=" p-1 flex items-center"></div>
            </div>
          </div>
        </div>
        {/* Left Side - Goods Description */}
        <div className="flex-1 border-r border-gray-700">
          <div className="border-b border-gray-700 p-2 bg-gray-50 text-sm font-bold">
            মালামালের বিবরণ: (কোটি/বস্তা/বাক্স/কেজি)
          </div>
          <div className="p-3 min-h-[200px]">
            <div className="mb-3 text-sm">
              <strong>জনাব,</strong>
            </div>
            <div className="mb-4 text-sm">
              <strong>সর্বমোট মালামাল:</strong>
            </div>
            <div className="mt-6 text-gray-900">
              <div className="text-sm font-medium">{productDetails}</div>
              <div className="text-xs text-gray-900 mt-3">জনাব,</div>
              <div className="text-xs mt-2">চালান অনুযায়ী মাল বুঝিয়া লইয়া রিসিভিং/বাকি ভাড়া ................... টাকা দিয়ে দিবেন।</div>
            </div>
          </div>
        </div>

        {/* Right Side - Cost Breakdown Table */}

        <div className="w-72">
          <div className="border-b border-gray-700 bg-gray-50">
            <div className="grid grid-cols-3 text-center text-sm font-bold">
              <div className="border-r border-gray-700 p-2">পরিমাণ</div>
              <div className="border-r border-gray-700 p-2">বিবরণ</div>
              <div className="p-2">টাকা</div>
            </div>
          </div>

          <div className="text-xs">
            {[
              { col1: "মালসহ ওজন", col2: "" },
              { col1: "", col2: "" },
              { col1: "খালি গাড়ি ওজন", col2: "" },
              { col1: "", col2: "ট্রাক ভাড়া" },
              { col1: "মোট মাল এর ওজন", col2: "অতিরিক্ত ভাড়া" },
              { col1: "", col2: "কমিশন" },
              { col1: "", col2: "মোট টাকা", col3: `${rent}` },
              { col1: "", col2: "অগ্রিম" },
              { col1: "", col2: "বাকি" },
            ].map((row, index) => (
              <div
                key={index}
                className="grid grid-cols-3 border-b border-gray-300 min-h-[24px]"
              >
                <div className="border-r border-gray-700 p-1 flex items-center">
                  {row.col1}
                </div>
                <div className="border-r border-gray-700 p-1 flex items-center">
                  {row.col2}
                </div>
                <div className="p-1 flex items-center">{row.col3}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="text-xs mb-4 leading-relaxed">
        <p className="mb-2">
          <strong>বি: দ্র:</strong> উপরিউক্ত মাল পরিবহনের পৌঁছানো দায়িত্ব ট্রাক চালকের। গাড়ীতে মালিকের উপস্থিতি ছাড়া পরিবহন সংস্থা দায়ী নয়
          কোন ক্ষতির জন্য।
        </p>
        <p>গাড়ীর চালক ৭ সপ্তাহের মধ্যে অবশ্যই বিল পরিশোধ মাধ্যমে চালান ট্রাকমেট কর্তৃপক্ষের নিকট জমা দিতে হবে।</p>
      </div>

      {/* Signature Section */}
      <div className="flex justify-between items-end mt-8">
        <div className="text-center">
          <div className="w-44 h-16 border border-gray-700 mb-2 bg-white"></div>
          <div className="text-xs">চালকের স্বাক্ষর/মালিকের স্বাক্ষর</div>
        </div>

        {/* <div className="text-center text-xs">
          <div className="mb-2">তারিখ: ২৩.০৬.০৬</div>
           <div className="border-b border-dotted">In Time:{startDate}</div>
          <div className="border-b border-dotted">Exit Time: {endDate}</div>
        </div> */}

        <div className="text-center">
          <div className="flex">
            <div className="text-right">
              <div className="text-xs">
                স্বাক্ষর: লোডিং প্রতিনিধি:
              </div>
              <div className="text-xs">
                ম্যানেজার:
              </div>
            </div>
            <div className="text-lg font-bold mb-2 border border-gray-700 w-56 h-16"></div>
          </div>
          <div className="text-xs">
            পক্ষে: মেসার্স এজে এন্টারপ্রাইজ
          </div>
        </div>
      </div>
    </div>
  )
})

ChallanInvoicePrint.displayName = "ChallanInvoicePrint"

export default ChallanInvoicePrint


