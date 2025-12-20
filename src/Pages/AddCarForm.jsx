import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FiCalendar } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import BtnSubmit from "../components/Button/BtnSubmit";
import { InputField, SelectField } from "../components/Form/FormFields";
import useRefId from "../hooks/useRef";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/axiosConfig";
import { useTranslation } from "react-i18next";

const AddCarForm = () => {
  const {t} = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const methods = useForm();
  const { handleSubmit, register, reset, control, watch } = methods;
  const registrationDateRef = useRef(null);
  const taxDateRef = useRef(null);
  const roadPermitRef = useRef(null);
  const fitnessDateRef = useRef(null);
  const insuranceDateRef = useRef(null);
   const dateRef = useRef(null);
  // select driver from api
  const [drivers, setDrivers] = useState([]);
  useEffect(() => {
  const fetchDrivers = async () => {
    try {
      const response = await api.get("/driver"); 
       const activeDrivers = response.data.filter(
        (driver) => driver.status?.toLowerCase() === "active"
      );
      setDrivers(activeDrivers);
    } catch (error) {
      console.error("Error fetching driver data:", error);
    }
  };

  fetchDrivers();
}, []);
const driverOptions = drivers.map((driver) => ({
  value: driver.driver_name,
  label: driver.driver_name,
}));

 // select helper from api
  const [helpers, setHelpers] = useState([]);
  useEffect(() => {
  const fetchHelpers = async () => {
    try {
      const response = await api.get("/helper"); 
       const activeHelpers = response.data.data.filter(
        (helper) => helper.status === "Active"
      );
      setHelpers(activeHelpers);
    } catch (error) {
      console.error("Error fetching helper data:", error);
    }
  };

  fetchHelpers();
}, []);
const helperOptions = helpers.map((helper) => ({
  value: helper.helper_name,
  label: helper.helper_name,
}));
   const selectedCategory = watch("vehicle_category");
const vehicleSizes = {
  pickup: [t("1 Ton"), t("2 Ton"), (t("3 Ton")), t("7 Feet"), t("9 Feet")],
  covered_van: [t("12 Feet"), t("14 Feet"), t("16 Feet"), t("18 Feet"), t("20 Feet"), t("23 Feet")],
  open_truck: [t("3 Ton"), t("5 Ton"), t("10 Ton"), t("15 Ton"), t("30 Ton")],
  trailer: [t("20 Feet"), t("23 Feet"), t("40 Feet"), t("30 Ton")],
  freezer_van: [t("1 Ton"), t("3 Ton"), t("5 Ton"), t("10 Ton")],
  "Oil Tanker": [t("5,000 Litre"), t("10,000 Litre"), t("15,000 Litre"), t("20,000 Litre")],
};
// সিলেক্ট করা ক্যাটাগরির জন্য সাইজ লিস্ট বানানো
  const sizeOptions =
    selectedCategory && vehicleSizes[selectedCategory]
      ? vehicleSizes[selectedCategory].map((size) => ({
          value: size.toLowerCase().replace(" ", "_"),
          label: size,
        }))
      : [];

      // যদি Update হয় → API থেকে পুরোনো ডেটা এনে reset করা
  useEffect(() => {
    const formatDateSafely = (value) => {
  if (!value || value === "null" || value === "0000-00-00") return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
};
    if (id) {
      const fetchVehicle = async () => {
        try {
          const response = await api.get(`/vehicle/${id}`);
          const vehicle = response.data;
          // সব date ফিল্ডকে format করো
         const formattedData = {
          ...vehicle,
          reg_date: formatDateSafely(vehicle.reg_date),
          tax_date: formatDateSafely(vehicle.tax_date),
          route_per_date: formatDateSafely(vehicle.route_per_date),
          fitness_date: formatDateSafely(vehicle.fitness_date),
          insurance_date: formatDateSafely(vehicle.insurance_date),
          date: formatDateSafely(vehicle.date),
        };

        reset(formattedData);
        } catch (error) {
          console.error("Error fetching vehicle data:", error);
        }
      };
      fetchVehicle();
    }
  }, [ id, reset]);

  // add & update vehicle
  const generateRefId = useRefId();
   const onSubmit = async (data) => {
    try {
      let response;
      if (!id) {
        const formData = new FormData();
        for (const key in data) {
          formData.append(key, data[key]);
        }
        formData.append("ref_id", generateRefId());

        response = await api.post(`/vehicle`, formData);
        toast.success(t("Vehicle added successfully!"));
      } else if (id) {
        response = await api.put(`/vehicle/${id}`, data);
        toast.success(t("Vehicle updated successfully!"));
      }

      reset();
      navigate("/tramessy/CarList");
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response?.data?.message || error.message || t("Unknown error");
      toast.error(t("Server error:") + errorMessage);
    }
  };

  return (
    <FormProvider {...methods} className="">
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 md:p-2">
        <Toaster position="top-center" reverseOrder={false} />  
        <div className="mx-auto p-6  rounded-md shadow-md border-t-2 border-primary">
           <h3 className="pt-1 pb-4 text-primary font-semibold rounded-t-md">
          {id ? t("Update Vehicle Information ") : t("Add Vehicle Information")}
        </h3>
          {/* Vehicle & Driver Name */}
          <div className="md:flex justify-between gap-3">
            <div className="w-full">
                <InputField
                  name="date"
                  label={t("Date")}
                  type="date"
                  required={id? false:true}
                  inputRef={(e) => {
                    register("date").ref(e)
                    dateRef.current = e
                  }}
                 
                />
              </div>
            <div className="w-full">
              <InputField name="vehicle_name" label={`${t("Vehicle")} ${t("Name")}`} required={id? false:true} />
            </div>
            <div className="relative mt-2 md:mt-0 w-full">
              <SelectField
                name="driver_name"
                label={`${t("Driver")} ${t("Name")}`}
                required={id? false:true}
                options={driverOptions}
                control={control}
              />
            </div>
            <div className="relative mt-2 md:mt-0 w-full">
              <SelectField
                name="helper_name"
                label={`${t("Helper")} ${t("Name")}`}
                required={id? false:true}
                options={helperOptions}
                control={control}
              />
            </div>
          </div>

          {/* Category & Size */}
          <div className="md:flex justify-between gap-3">
            <div className="w-full relative">
              <SelectField
                name="vehicle_category"
                label={`${t("Vehicle")} ${t("Category")}`}
                required={id? false:true}
                options={[
                  // { value: "", label: "Select Vehicle category..." },
                  { value: "pickup", label: t("Pickup") },
                  { value: "covered_van", label: t("Covered Van") },
                  { value: "open_truck", label: t("Open Truck") },
                  { value: "trailer", label: t("Trailer") },
                  { value: "freezer_van", label: t("Freezer Van") },
                  { value: "Oil Tanker", label: t("Oil Tanker") },
                ]}
           
              />
            </div>
            <div className="relative w-full">
        <SelectField
          name="vehicle_size"
          label={t("Vehicle Size")}
          required={id? false:true}
          options={[
            { value: "", label: `${t("Vehicle Size")} ${t("Select")}...` },
            ...sizeOptions,
          ]}
        />
      </div>
            <div className="w-full">
              <InputField name="fuel_capcity" label={t("Fuel Capacity")} required={false} />
            </div>
          </div>

          {/* Registration Number & Serial */}
          <div className="md:flex justify-between gap-3">
            <div className="w-full">
              <InputField
                name="reg_no"
                label={t("Registration Number")}
                required={id? false:true}
              />
            </div>
            <div className="mt-2 md:mt-0 w-full">
              <SelectField
                name="reg_serial"
                label={t("Registration Serial")}
                required={id? false:true}
                options={[
                  { value: "KA", label: (t("KA")) },
                  { value: "KHA", label: t("KHA") },
                  { value: "GA", label: t("GA") },
                  { value: "GHA", label: t("GHA") },
                  { value: "CHA", label: t("CHA") },
                  { value: "JA", label: t("JA") },
                  { value: "JHA", label: t("JHA") },
                  { value: "TA", label: t("TA") },
                  { value: "THA", label: t("THA") },
                  { value: "DA", label: t("DA") },
                  { value: "DHA", label: t("DHA") },
                  { value: "NA", label: t("NA") },
                  { value: "PA", label: t("PA") },
                  { value: "FA", label: t("FA") },
                  { value: "BA", label: t("BA") },
                  { value: "MA", label: t("MA") },
                  { value: "SHA", label: t("SHA") },
                  { value: "LA", label: t("LA") },
                  { value: "RA", label: t("RA") },
                  { value: "HA", label: t("HA") },
                ]}
              />
            </div>
            <div className="relative w-full">
              <SelectField
                name="reg_zone"
                label={t("Registration Zone")}
                required={id? false:true}
                options={[
                  { value: "", label: `${t("Registration Zone")} ${t("Select")}...` },
                  { value: "Dhaka Metro", label: t("Dhaka Metro") },
                  { value: "Chatto Metro", label: t("Chatto Metro") },
                  { value: "Sylhet Metro", label: t("Sylhet Metro") },
                  { value: "Rajshahi Metro", label: t("Rajshahi Metro") },
                  { value: "Khulna Metro", label: t("Khulna Metro") },
                  { value: "Rangpur Metro", label: t("Rangpur Metro") },
                  { value: "Barisal Metro", label: t("Barisal Metro") },
                  { value: "Dhaka", label: t("Dhaka") },
                  { value: "Narayanganj", label: t("Narayanganj") },
                  { value: "Gazipur", label: t("Gazipur") },
                  { value: "Tangail", label: t("Tangail") },
                  { value: "Manikgonj", label: t("Manikgonj") },
                  { value: "Munshigonj", label: t("Munshigonj") },
                  { value: "Faridpur", label: t("Faridpur") },
                  { value: "Rajbari", label: t("Rajbari") },
                  { value: "Narsingdi", label: t("Narsingdi") },
                  { value: "Kishoreganj", label: t("Kishoreganj") },
                  { value: "Shariatpur", label: t("Shariatpur") },
                  { value: "Gopalganj", label: t("Gopalganj") },
                  { value: "Madaripur", label: t("Madaripur") },
                  { value: "Chittagong", label: t("Chittagong") },
                  { value: "Comilla", label: t("Comilla") },
                  { value: "Feni", label: t("Feni") },
                  { value: "Brahmanbaria", label: t("Brahmanbaria") },
                  { value: "Noakhali", label: t("Noakhali") },
                  { value: "Chandpur", label: t("Chandpur") },
                  { value: "Laxmipur", label: t("Laxmipur") },
                  { value: "Bandarban", label: t("Bandarban") },
                  { value: "Rangamati", label: t("Rangamati") },
                  { value: "CoxsBazar", label: t("CoxsBazar") },
                  { value: "Khagrachari", label: t("Khagrachari") },
                  { value: "Barisal", label: t("Barisal") },
                  { value: "Barguna", label: t("Barguna") },
                  { value: "Bhola", label: t("Bhola") },
                  { value: "Patuakhali", label: t("Patuakhali") },
                  { value: "Pirojpur", label: t("Pirojpur") },
                  { value: "Jhalokati", label: t("Jhalokati") },
                  { value: "Khulna", label: t("Khulna") },
                  { value: "Kushtia", label: t("Kushtia") },
                  { value: "Jashore", label: t("Jashore") },
                  { value: "Chuadanga", label: t("Chuadanga") },
                  { value: "Satkhira", label: t("Satkhira") },
                  { value: "Bagerhat", label: t("Bagerhat") },
                  { value: "Meherpur", label: t("Meherpur") },
                  { value: "Jhenaidah", label: t("Jhenaidah") },
                  { value: "Norail", label: t("Norail") },
                  { value: "Magura", label: t("Magura") },
                  { value: "Rangpur", label: t("Rangpur") },
                  { value: "Panchagarh", label: t("Panchagarh") },
                  { value: "Thakurgaon", label: t("Thakurgaon") },
                  { value: "Kurigram", label: t("Kurigram") },
                  { value: "Dinajpur", label: t("Dinajpur") },
                  { value: "Nilphamari", label: t("Nilphamari") },
                  { value: "Lalmonirhat", label: t("Lalmonirhat") },
                  { value: "Gaibandha", label: t("Gaibandha") },
                  { value: "Rajshahi", label: t("Rajshahi") },
                  { value: "Pabna", label: t("Pabna") },
                  { value: "Bagura", label: t("Bagura") },
                  { value: "Joypurhat", label: t("Joypurhat") },
                  { value: "Nouga", label: t("Nouga") },
                  { value: "Natore", label: t("Natore") },
                  { value: "Sirajganj", label: t("Sirajganj") },
                  { value: "Chapainawabganj", label: t("Chapainawabganj") },
                  { value: "Sylhet", label: t("Sylhet") },
                  { value: "Habiganj", label: t("Habiganj") },
                  { value: "Moulvibazar", label: t("Moulvibazar") },
                  { value: "Sunamganj", label: t("Sunamganj") },
                  { value: "Mymensingh", label: t("Mymensingh") },
                  { value: "Netrokona", label: t("Netrokona") },
                  { value: "Jamalpur", label: t("Jamalpur") },
                  { value: "Sherpur", label: t("Sherpur") },
                ]}
              />
            </div>
          </div>

          {/* Registration Zone */}
          <div className="md:flex justify-between gap-3">
            {/* Registration Date */}
            <div className="relative w-full">
              <InputField
                name="reg_date"
                label={t("Registration Expired Date")}
                type="date"
                required={false}
                inputRef={(e) => {
                  register("reg_date").ref(e);
                  registrationDateRef.current = e;
                }}
                icon={
                  <span
                    className="py-[11px] absolute right-0 px-3 top-[22px] transform -translate-y-1/2 rounded-r"
                    onClick={() => registrationDateRef.current?.showPicker?.()}
                  >
                    <FiCalendar className="text-gray-700 cursor-pointer" />
                  </span>
                }
              />
            </div>

            {/* Tax Expiry Date */}
            <div className="mt-2 md:mt-0 w-full">
              <InputField
                name="tax_date"
                label={t("Tax Expired Date")}
                type="date"
                required={false}
                inputRef={(e) => {
                  register("tax_date").ref(e);
                  taxDateRef.current = e;
                }}
                icon={
                  <span
                    className="py-[11px] absolute right-0 px-3 top-[22px] transform -translate-y-1/2  rounded-r"
                    onClick={() => taxDateRef.current?.showPicker?.()}
                  >
                    <FiCalendar className="text-gray-700 cursor-pointer" />
                  </span>
                }
              />
            </div>
            <div className="w-full">
              <InputField
                name="route_per_date"
                label={t("Road Permit Expired Date")}
                type="date"
                required={ false}
                inputRef={(e) => {
                  register("route_per_date").ref(e);
                  roadPermitRef.current = e;
                }}
                icon={
                  <span
                    className="py-[11px] absolute right-0 px-3 top-[22px] transform -translate-y-1/2  rounded-r"
                    onClick={() => roadPermitRef.current?.showPicker?.()}
                  >
                    <FiCalendar className="text-gray-700 cursor-pointer" />
                  </span>
                }
              />
              <label className="text-gray-700 text-sm font-semibold"></label>
            </div>
          </div>

          {/* Road Permit & Fitness Date & Status */}
          <div className="md:flex justify-between gap-3">
            <div className="mt-2 md:mt-0 w-full">
              <InputField
                name="fitness_date"
                label={t("Fitness Expired Date")}
                type="date"
                required={false}
                inputRef={(e) => {
                  register("fitness_date").ref(e);
                  fitnessDateRef.current = e;
                }}
                icon={
                  <span
                    className="py-[11px] absolute right-0 px-3 top-[22px] transform -translate-y-1/2  rounded-r"
                    onClick={() => fitnessDateRef.current?.showPicker?.()}
                  >
                    <FiCalendar className="text-gray-700 cursor-pointer" />
                  </span>
                }
              />
            </div>
            <div className="mt-2 md:mt-0 w-full">
              <InputField
                name="insurance_date"
                label={t("Insurance Expired Date")}
                type="date"
                required={false}
                inputRef={(e) => {
                  register("insurance_date").ref(e);
                  insuranceDateRef.current = e;
                }}
                icon={
                  <span
                    className="py-[11px] absolute right-0 px-3 top-[22px] transform -translate-y-1/2  rounded-r"
                    onClick={() => insuranceDateRef.current?.showPicker?.()}
                  >
                    <FiCalendar className="text-gray-700 cursor-pointer" />
                  </span>
                }
              />
            </div>

            <div className="w-full relative">
              <SelectField
                name="status"
                label={t("Status")}
                required={id? false:true}
                options={[
                  { value: "Active", label: t("Active") },
                  { value: "Inactive", label: t("Inactive") },
                ]}
              />
            </div>
          </div>

          <div className="text-left">
            <BtnSubmit>{t("Submit")}</BtnSubmit>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default AddCarForm;
