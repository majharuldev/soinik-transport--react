
import axios from "axios";
import { FormProvider, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import BtnSubmit from "../components/Button/BtnSubmit";
import { InputField, SelectField } from "../components/Form/FormFields";
import useRefId from "../hooks/useRef";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/axiosConfig";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const AddRentVehicleForm = () => {
  const { t } = useTranslation();
  const { id } = useParams(); // id for update
  const navigate = useNavigate();
  const methods = useForm();
  const { handleSubmit, reset, watch, setValue } = methods;

  const selectedCategory = watch("vehicle_category");
  const generateRefId = useRefId();

  const vehicleSizes = {
    pickup: ["0.5 Ton", "1 Ton", "1.5 Ton", "2 Ton", "3 Ton", "7 Feet", "9 Feet",
  ],

  covered_van: [ "10 Feet", "12 Feet", "14 Feet", "16 Feet", "18 Feet", "20 Feet", "23 Feet",
  ],

  open_truck: [ "3 Ton", "5 Ton", "7 Ton",  "10 Ton",  "15 Ton",  "20 Ton",
  ],

  trailer: [  "20 Feet",   "23 Feet",  "32 Feet",  "40 Feet", "45 Feet",
  ],

  freezer_van: [ "1 Ton", "3 Ton",  "5 Ton", "10 Ton",
  ],
};

  const sizeOptions =
    selectedCategory && vehicleSizes[selectedCategory]
      ? vehicleSizes[selectedCategory].map((size) => ({
          value: size.toLowerCase().replace(" ", "_"),
          label: size,
        }))
      : [];

  // Fetch existing vehicle for update
  useEffect(() => {
    if (id) {
      api
        .get(`/rentVehicle/${id}`)
        .then((res) => {
          if (res.data.success) {
            const data = res.data.data;
            for (const key in data) {
              setValue(key, data[key]);
            }
          }
        })
        .catch((err) => {
          console.error(err);
          // toast.error("Failed to load vehicle data");
        });
    }
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      const payload = { ...data };

    // ref_id only generate if not in update mode
    if (!id) {
      payload.ref_id = generateRefId();
    }

      const response = id
        ? await api.put(`/rentVehicle/${id}`, payload)
        : await api.post(`/rentVehicle`, payload);

      const resData = response.data;

      if (resData.success) {
        toast.success(`Rent vehicle ${id ? "updated" : "added"} successfully!`);
        reset();
        navigate("/tramessy/RentList");
      } else {
        toast.error(t("Server Error:") + (resData.message || t("Unknown issue")));
      }
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response?.data?.message || error.message || t("Unknown error");
      toast.error(t("Server Error:") + errorMessage);
    }
  };

  return (
    <div className="mt-5 p-2">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="mx-auto p-6 rounded-md shadow border-t-2 border-primary">
        <h3 className="pb-4 text-primary font-semibold ">
          {id ? t("Update Rent Vehicle") : t("Add Rent Vehicle")}
        </h3>
        <FormProvider {...methods} className="">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* Vehicle Info */}
            <div className="border border-gray-300 p-3 md:p-5 rounded-md">
              <div className="mt-5 md:mt-1 md:flex justify-between gap-3">
                <div className="mt-2 md:mt-0 w-full relative">
                  <InputField
                    name="vehicle_name_model"
                    label={`${t("Vehicle")} ${t("Name")}`}
                    required
                  />
                </div>
                <div className="mt-2 md:mt-0 w-full relative">
                  <InputField
                    name="vendor_name"
                    label={`${t("Vendor")}/${t("Driver")} ${t("Name")}`}
                    required
                  />
                </div>
              </div>
              <div className="md:flex justify-between gap-3">
                <div className="w-full relative">
                  <SelectField
                    name="vehicle_category"
                    label={`${t("Vehicle")} ${t("Category")}`}
                    required
                    options={[
                      { value: "pickup", label: "Pickup" },
                      { value: "covered_van", label: "Covered Van" },
                      { value: "open_truck", label: "Open Truck" },
                      { value: "trailer", label: "Trailer" },
                      { value: "freezer_van", label: "Freezer Van" },
                      { value: "Oil Tanker", label: "Oil Tanker" },
                    ]}
                  />
                </div>
                <div className="relative w-full">
                  <SelectField
                    name="vehicle_size_capacity"
                    label={`${t("Vehicle")} ${t("Size")}`}
                    required
                    options={[
                      { value: "", label: `${t("Vehicle")} ${t("Size")} ${t("Select")}...` },
                      ...sizeOptions,
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Registration Info */}
            <div className="border border-gray-300 p-5 rounded-md">
              <h5 className="text-primary font-semibold text-center pb-5">
                <span className="py-2 border-b-2 border-primary">
                  {t("Transport")} {t("Registration Number")}
                </span>
              </h5>
              <div className="md:flex justify-between gap-3">
                <div className="relative w-full">
                  <InputField
                    name="registration_number"
                    label={t("Registration Number")}
                    required
                  />
                </div>
                <div className="relative mt-2 md:mt-0 w-full">
                  <SelectField
                    name="registration_serial"
                    label={t("Registration Serial")}
                    required
                    options={[
                      { value: "Ta", label: "Ta" },
                      { value: "Tha", label: "Tha" },
                      { value: "Da", label: "Da" },
                      { value: "Dha", label: "Dha" },
                      { value: "Na", label: "Na" },
                      { value: "M", label: "M" },
                      { value: "Sh", label: "Sh" },
                    ]}
                  />
                </div>
                <div className="w-full">
                  <SelectField
                    name="registration_zone"
                    label={t("Registration Zone")}
                    required
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
            </div>

            <div className="w-[50%]">
              <SelectField
                name="status"
                label={t("Status")}
                required
                options={[
                  { value: "Active", label: t("Active") },
                  { value: "Inactive", label: t("Inactive") },
                ]}
              />
            </div>

            {/* Submit Button */}
            <div className="text-left">
              <BtnSubmit>{id ? t("Update") : t("Submit")}</BtnSubmit>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default AddRentVehicleForm;
