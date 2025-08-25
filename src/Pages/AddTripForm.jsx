
import { InputField, SelectField } from "../components/Form/FormFields";
import BtnSubmit from "../components/Button/BtnSubmit";
import { FormProvider, useForm } from "react-hook-form";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import { FiCalendar } from "react-icons/fi";
import useRefId from "../hooks/useRef";
import { useNavigate, useParams } from "react-router-dom";

const AddTripForm = () => {
  const { id } = useParams(); // Get trip ID from URL params for update
  const dateRef = useRef(null);
  const methods = useForm();
  const { watch, handleSubmit, reset, register, setValue, control } = methods;
  const selectedCustomer = watch("customer");
  const selectedTransport = watch("transport_type");
  const selectedLoadPoint = watch("load_point");
  const selectedUnloadPoint = watch("unload_point");
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false); 
  const [isFixedRateCustomer, setIsFixedRateCustomer] = useState(false);

  // State for rates
  const [rates, setRates] = useState([]);
  const [isRateFound, setIsRateFound] = useState(false);

  // Fetch trip data if ID exists (for update)
  useEffect(() => {
    if (id) {
      setIsEditing(true);
      fetchTripData(id);
    }
  }, [id]);

  // Function to fetch trip data for editing
  const [tripData, setTripData] = useState(null);
  // const fetchTripData = async (tripId) => {
  //   try {
  //     const response = await axios.get(
  //       `${import.meta.env.VITE_BASE_URL}/api/trip/show/${tripId}`
  //     );
  //     const tripData = response.data.data;
  //     setTripData(tripData);
  //     // Set form values with fetched data
  //     Object.keys(tripData).forEach(key => {
  //       setValue(key, tripData[key]);
  //     });
      
  //     // toast.success("Trip data loaded successfully!");
  //   } catch (error) {
  //     console.error("Error fetching trip data:", error);
  //     toast.error("Failed to load trip data");
  //   }
  // };

  // Fetch rates from API
  
  const fetchTripData = async (tripId) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/trip/show/${tripId}`
    );
    const tripData = response.data.data;
    setTripData(tripData);

    // Initialize form values, converting "null" or null to 0 for expense fields
    const expenseFields = [
      "driver_commission",
      "road_cost",
      "labor",
      "parking_cost",
      "night_guard",
      "toll_cost",
      "feri_cost",
      "police_cost",
      "chada",
      "fuel_cost",
      "callan_cost",
      "others_cost",
      "total_exp",
      "advance",
      "due_amount",
      "total_rent", 
      "no_of_trip", 
      "per_truck_rent",
    ];

    const defaultValues = {
      ...tripData,
      // Set default 0 for expense fields if null or "null"
      ...Object.fromEntries(
        expenseFields.map(field => [
          field,
          tripData[field] === "null" || tripData[field] === null
            ? 0
            : parseFloat(tripData[field]) || 0,
        ])
      ),
    };

    // Set form values
    Object.keys(defaultValues).forEach(key => {
      setValue(key, defaultValues[key], { shouldValidate: true });
    });

    // toast.success("Trip data loaded successfully!");
  } catch (error) {
    console.error("Error fetching trip data:", error);
    toast.error("Failed to load trip data");
  }
};

  const [unloadpoints, setUnloadpoints] = useState([]);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/api/rate/list`)
      .then((response) => response.json())
      .then((data) => {setRates(data.data);
        setUnloadpoints(data.data.map(rate => rate.unload_point));
      })
      .catch((error) => console.error("Error fetching rates:", error));
  }, []);
    const unloadpointOptions = unloadpoints.map((unloadpoint) => ({
    value: unloadpoint,
    label: unloadpoint,
  }));



  // Calculate total_rent for Honda
const noOfTrip = watch("no_of_trip") || 0;
const perTruckRent = watch("per_truck_rent") || 0;
useEffect(() => {
  if (selectedCustomer === "Honda") {
    const total = Number(noOfTrip) * Number(perTruckRent);
    setValue("total_rent", Number(total.toFixed(2)), { shouldValidate: true });
  }
}, [noOfTrip, perTruckRent, selectedCustomer, setValue]);
  useEffect(() => {
  if (selectedLoadPoint && selectedUnloadPoint && rates.length > 0) {
    const foundRate = rates.find(
      (rate) =>
        rate.load_point === selectedLoadPoint &&
        rate.unload_point === selectedUnloadPoint
    );
    console.log("Rate Found:", foundRate, "Customer:", selectedCustomer);
    if (foundRate) {
      if (selectedCustomer === "Honda") {
        const rateValue = parseFloat(foundRate.rate) || 0;
        setValue("per_truck_rent", Number(rateValue.toFixed(2)), { shouldValidate: true });
        const total = Number(noOfTrip) * rateValue;
        setValue("total_rent", Number(total.toFixed(2)), { shouldValidate: true });
      } else {
        const rateValue = parseFloat(foundRate.rate) || 0;
        setValue("total_rent", Number(rateValue.toFixed(2)), { shouldValidate: true });
      }
      setIsRateFound(true);
    } else if (!isEditing) {
      if (selectedCustomer === "Honda") {
        setValue("per_truck_rent", "", { shouldValidate: true });
        setValue("total_rent", Number((Number(noOfTrip) * 0).toFixed(2)), { shouldValidate: true });
      } else {
        setValue("total_rent", "", { shouldValidate: true });
      }
      setIsRateFound(false);
    }
    console.log("Form Values:", methods.getValues());
  }
}, [selectedLoadPoint, selectedUnloadPoint, rates, selectedCustomer, noOfTrip, setValue, isEditing]);



  // select customer from api
  const [customers, setCustomers] = useState([]);
  const [loadpoint, setLoadpoint] = useState([]);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/api/customer/list`)
      .then((response) => response.json())
      .then((data) => {
        setCustomers(data.data);
        setLoadpoint(data.data)
      })
      .catch((error) => console.error("Error fetching customer data:", error));
  }, []);

  const customerOptions = customers.map((customer) => ({
    value: customer.customer_name,
    label: customer.customer_name,
  }));

  const loadpointOptions = loadpoint.map((load) => ({
    value: load.customer_name,
    label: load.customer_name,
  }));

  // Watch customer selection and check if it's fixed rate
  useEffect(() => {
    if (selectedCustomer && customers.length > 0) {
      const customer = customers.find(c => c.customer_name === selectedCustomer);
      if (customer) {
        const isFixed = customer.rate === "Fixed";
        setIsFixedRateCustomer(isFixed);
      }
    }
  }, [selectedCustomer, customers]);

   // select customer from api
  const [branch, setBranch] = useState([]);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/api/office/list`)
      .then((response) => response.json())
      .then((data) =>{ setBranch(data.data)})
      .catch((error) => console.error("Error fetching customer data:", error));
  }, []);

  const branchOptions = branch.map((branch) => ({
    value: branch.branch_name,
    label: branch.branch_name,
  }));

  // select Vehicle No. from api
  const [vehicle, setVehicle] = useState([]);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/api/vehicle/list`)
      .then((response) => response.json())
      .then((data) => setVehicle(data.data))
      .catch((error) => console.error("Error fetching vehicle data:", error));
  }, []);
  const vehicleOptions = vehicle.map((dt) => ({
    value: `${dt.registration_zone} ${dt.registration_serial} ${dt.registration_number} `,
    label: `${dt.registration_zone} ${dt.registration_serial} ${dt.registration_number} `,
  }));
  // select vendor Vehicle No. from api
  const [vendorVehicle, setVendorVehicle] = useState([]);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/api/rent/list`)
      .then((response) => response.json())
      .then((data) => setVendorVehicle(data.data))
      .catch((error) => console.error("Error fetching vehicle data:", error));
  }, []);
  const vendorVehicleOptions = vendorVehicle.map((dt) => ({
    value: `${dt.registration_zone} ${dt.registration_serial} ${dt.registration_number} `,
    label: `${dt.registration_zone} ${dt.registration_serial} ${dt.registration_number} `,
  }));
  // select own driver from api
  const [drivers, setDrivers] = useState([]);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/api/driver/list`)
      .then((response) => response.json())
      .then((data) => setDrivers(data.data))
      .catch((error) => console.error("Error fetching driver data:", error));
  }, []);
  const ownDriverOptions = drivers.map((driver) => ({
    value: driver.driver_name,
    label: driver.driver_name,
    contact: driver.driver_mobile,
  }));
  // select vendor from api
  const [vendor, setVendor] = useState([]);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/api/vendor/list`)
      .then((response) => response.json())
      .then((data) => setVendor(data.data))
      .catch((error) => console.error("Error fetching vendor data:", error));
  }, []);
  const vendorOptions = vendor.map((dt) => ({
    value: dt.vendor_name,
    label: dt.vendor_name,
  }));
  // select vendor driver from api
  const [vendorDriver, setVendorDrivers] = useState([]);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/api/rent/list`)
      .then((response) => response.json())
      .then((data) => setVendorDrivers(data.data))
      .catch((error) =>
        console.error("Error fetching vendor driver data:", error)
      );
  }, []);
  const vendorDriverOptions = vendorDriver.map((dt) => ({
    value: dt.vendor_name,
    label: dt.vendor_name,
    contact: dt.mobile,
  }));

  

// Calculate total expense for own_transport
const expenseFields = watch([
  "driver_commission",
  "road_cost",
  "labor",
  "parking_cost",
  "night_guard",
  "toll_cost",
  "feri_cost",
  "police_cost",
  "chada",
  "fuel_cost",
  "callan_cost",
  "others_cost",
]);

useEffect(() => {
  if (selectedTransport === "own_transport") {
    const total = expenseFields.reduce((sum, value) => {
      // Handle "null" string, null, or invalid values
      const num = value === "null" || value === null ? 0 : parseFloat(value) || 0;
      return sum + num;
    }, 0);

    // Set total_exp with 2 decimal places
    setValue("total_exp", Number(total.toFixed(2)), { shouldValidate: true });
  }
}, [selectedTransport, ...expenseFields, setValue]);

// Preserve total_exp for vendor_transport when editing
useEffect(() => {
  if (isEditing && tripData && selectedTransport === "vendor_transport") {
    const totalExp = tripData.total_exp === "null" || tripData.total_exp === null
      ? 0
      : parseFloat(tripData.total_exp) || 0;
    setValue("total_exp", totalExp, { shouldValidate: true });
  }
}, [selectedTransport, isEditing, tripData, setValue]);

// Calculate due_amount
const totalExp = watch("total_exp") || 0;
const advance = watch("advance") || 0;

useEffect(() => {
  const dueAmount = Number(totalExp) - Number(advance);
  setValue("due_amount", dueAmount >= 0 ? Number(dueAmount.toFixed(2)) : 0, {
    shouldValidate: true,
  });
}, [totalExp, advance, setValue]);


   // When transport type changes, preserve the total_exp value for vendor transport
  // useEffect(() => {
  //   if (isEditing && tripData && selectedTransport === "vendor_transport") {
  //     // If editing and switching to vendor transport, preserve the saved total_exp
  //     setValue("total_exp", parseFloat(tripData.total_exp) || "");
  //   }
  // }, [selectedTransport, isEditing, tripData, setValue]);

  // calculate Total Expense of honda
  // const noOfTrip = watch("no_of_trip") || 0;
  // const perTruckRent = watch("per_truck_rent") || 0;
  // const totalRentHonda = Number(noOfTrip) * Number(perTruckRent);
  // useEffect(() => {
  //   const total = Number(noOfTrip) * Number(perTruckRent);
  //   setValue("total_rent", total || 0);
  // }, [noOfTrip, perTruckRent, setValue]);

  // Watch the total_exp and advance fields
// const totalExp = watch("total_exp") || 0;
// const advance = watch("advance") || 0;


// Calculate due_amount whenever total_exp or advance changes
// useEffect(() => {
//   const dueAmount = Number(totalExp) - Number(advance);
//   setValue("due_amount", dueAmount >= 0 ? dueAmount : 0); 
// }, [totalExp, advance, setValue]);

  // post data on server
  const generateRefId = useRefId();

  const onSubmit = async (data) => {
    try {
      const tripFormData = new FormData();
      
      // Append form fields
      for (const key in data) {
        tripFormData.append(key, data[key]);
      }
      
      if (isEditing) {
        // Update existing trip
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/trip/update/${id}`,
          tripFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Trip updated successfully!", { position: "top-right" });
        navigate("/tramessy/TripList");
      } else {
        // Create new trip
        const refId = generateRefId();
        tripFormData.append("ref_id", refId);
        
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/trip/create`,
          tripFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Trip submitted successfully!", { position: "top-right" });
        reset();
      }
      
      // navigate("/tramessy/TripList");
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response?.data?.message || error.message || "Unknown error";
      toast.error("Server issue: " + errorMessage);
    }
  };
  
  return (
    <div className="md:p-2">
      <Toaster position="top-center" reverseOrder={false} />
      <h3 className="px-6 py-2 bg-primary text-white font-semibold rounded-t-md">
        {isEditing ? "Update Trip" : "Add Trip"}
      </h3>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3 mx-auto bg-gray-100 rounded-md shadow"
        >
          <div className="border border-gray-300 p-3 md:p-5 rounded-b-md">
            <h5 className="text-3xl font-bold text-center text-[#EF9C07]">
              {selectedCustomer}
            </h5>
            {/* Common Input Fields */}
            <div>
              <div className="border border-gray-300 p-5 rounded-md mt-3">
                <h5 className="text-primary font-semibold text-center pb-5">
                  <span className="py-2 border-b-2 border-primary">
                    Customer and Destination
                  </span>
                </h5>
                <div className="mt-5 md:flex justify-between gap-3">
                  <div className="w-full">
                    <InputField
                      name="date"
                      label="Date"
                      type="date"
                      required={isEditing ? false : true}
                      inputRef={(e) => {
                        register("date").ref(e);
                        dateRef.current = e;
                      }}
                      icon={
                        <span
                          className="py-[11px] absolute right-0 px-3 top-[22px] transform -translate-y-1/2 bg-primary rounded-r"
                          onClick={() => dateRef.current?.showPicker?.()}
                        >
                          <FiCalendar className="text-white cursor-pointer" />
                        </span>
                      }
                    />
                  </div>
                  {/* Customer Dropdown */}
                  <div className="w-full relative">                    
                    <SelectField
                      name="customer"
                      label="Customer"
                      required={isEditing ? false : true}
                      options={customerOptions}
                      control={control}
                      isCreatable={false} 
                    />
                  </div>
                  
                  <div className="w-full relative">
                    <SelectField
                      name="branch_name"
                      label="Branch"
                      required={isEditing ? false : true}
                      options={branchOptions}
                      control={control}
                      isCreatable={false}
                    />
                  </div>
                </div>
                <div className="mt-5 md:mt-1 md:flex justify-between gap-3">
                  <div className="w-full relative">
                    <SelectField
                      name="load_point"
                      label="Load Point"
                      required={isEditing ? false : true}
                      options={loadpointOptions}
                      control={control}
                       isCreatable={true}
                    />
                  </div>
                  <div className="w-full relative">
                    {/* <SelectField
                      name="unload_point"
                      label="Unload Point"
                      required={isEditing ? false : true}
                      options={unloadpointOptions}
                      control={control}
                       isCreatable={true}
                    /> */}
                    <div className="w-full relative">
      <SelectField
        name="unload_point"
        label="Unload Point"
        required={isEditing ? false : true}
        options={unloadpointOptions}
        control={control}
        isCreatable={!isFixedRateCustomer} 
      />
    </div>
                  </div>
                  {selectedCustomer!=="Honda" && <div className="w-full">
                    <InputField
                      name="total_rent"
                      label="Total Rent/Bill Amount"
                      type="number"
                      required={isEditing ? false : true}
                      readOnly={isRateFound}
                      className={isRateFound ? "bg-gray-100" : ""}
                    />
                    {/* {isRateFound && (
                      <p className="text-xs text-green-600 mt-1">
                        Rate automatically calculated from database
                      </p>
                    )} */}
                  </div>}
                </div>
              </div>
            </div>

            {/* Conditionally Show Yamaha Fields */}
            {selectedCustomer === "Yamaha" && (
              <div className="">
                <div className="border border-gray-300 p-5 rounded-md mt-3">
                  <h5 className="text-primary font-semibold text-center pb-5">
                    <span className="py-2 border-b-2 border-primary">
                      Transport and Driver section
                    </span>
                  </h5>
                  <div className="mt-5 md:mt-1 md:flex justify-between gap-3">
                    <div className="w-full relative">
                      <SelectField
                        name="transport_type"
                        label="Transport Type"
                        required={isEditing ? false : true}
                        options={[
                          { value: "own_transport", label: "Own Transport" },
                          {
                            value: "vendor_transport",
                            label: "Vendor Transport",
                          },
                        ]}
                        isCreatable={false}
                      />
                    </div>
                    {selectedTransport === "vendor_transport" ? (
                      <div className="w-full">
                        <SelectField
                          name="vendor_name"
                          label="Vendor Name"
                          required={isEditing ? false : true}
                          options={vendorOptions}
                          control={control}
                          isCreatable={false}
                        />
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="w-full">
                      {selectedTransport === "own_transport" ? (
                        <SelectField
                          name="vehicle_no"
                          label="Vehicle No."
                          required={isEditing ? false : true}
                          options={vehicleOptions}
                          control={control}
                          isCreatable={false}
                        />
                      ) : selectedTransport === "vendor_transport" ? (
                        <SelectField
                          name="vehicle_no"
                          label="Vehicle No."
                          required={isEditing ? false : true}
                          options={vendorVehicleOptions}
                          control={control}
                        />
                      ) : (
                        <SelectField
                          name="vehicle_no"
                          label="Vehicle No."
                          defaultValue={"Please select transport first"}
                          required={isEditing ? false : true}
                          options={[
                            {
                              label: "Please select transport first",
                              value: "",
                              disabled: true,
                            },
                          ]}
                          control={control}
                        />
                      )}
                    </div>
                  </div>
                  <div className="mt-5 md:mt-1 md:flex justify-between gap-3">
                    <div className="w-full">
                      {selectedTransport === "own_transport" ? (
                        <SelectField
                          name="driver_name"
                          label="Driver Name"
                          required={isEditing ? false : true}
                          control={control}
                          options={ownDriverOptions}
                          onSelectChange={(selectedOption) => {
                            setValue(
                              "driver_mobile",
                              selectedOption?.contact || ""
                            );
                          }}
                          isCreatable={false}
                        />
                      ) : selectedTransport === "vendor_transport" ? (
                        <SelectField
                          name="driver_name"
                          label="Driver Name"
                          required={isEditing ? false : true}
                          control={control}
                          options={vendorDriverOptions}
                        />
                      ) : (
                        <SelectField
                          name="driver_name"
                          label="Driver Name"
                          required={isEditing ? false : true}
                          control={control}
                          options={[
                            {
                              label: "Please select transport first",
                              value: "",
                              disabled: true,
                            },
                          ]}
                        />
                      )}
                    </div>
                    <div className="w-full">
                      <InputField
                        name="driver_mobile"
                        label="Driver Mobile"
                        type="number"
                        required={isEditing ? false : true}
                      />
                    </div>
                    <div className="w-full">
                      <InputField name="challan" label="Challan" required={isEditing ? false : true} />
                    </div>
                  </div>
                </div>
                <div className="border border-gray-300 p-5 rounded-md mt-3">
                  <h5 className="text-primary font-semibold text-center pb-5">
                    <span className="py-2 border-b-2 border-primary">
                      Product and Expense
                    </span>
                  </h5>
                  <div className="mt-5 md:mt-1 md:flex justify-between gap-3">
                    <div className="w-full">
                      <InputField name="model_no" label="Model No." required={isEditing ? false : true} />
                    </div>
                    <div className="w-full">
                      <InputField
                        name="quantity"
                        label="NoOfUnit"
                        type="number"
                        required={isEditing ? false : true}
                      />
                    </div>
                  </div>

                  <div className="mt-5 md:mt-1 md:flex justify-between gap-3">
                    <div className="w-[50%]">
                      <InputField
                        name="body_fare"
                        label="Body Fare"
                        type="number"
                        required={isEditing ? false : true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Conditionally Show Hatim Fields */}
            {(selectedCustomer === "Hatim Pubail" ||
              selectedCustomer === "Hatim Rupgonj") && (
              <div className="border border-gray-300 p-5 rounded-md mt-3">
                <h5 className="text-primary font-semibold text-center pb-5">
                  <span className="py-2 border-b-2 border-primary">
                    Transport and Driver section
                  </span>
                </h5>
                <div className="mt-5 md:mt-1 md:flex justify-between gap-3">
                  <div className="w-full relative">
                    <SelectField
                      name="transport_type"
                      label="Transport Type"
                      required={isEditing ? false : true}
                      options={[
                        { value: "own_transport", label: "Own Transport" },
                        {
                          value: "vendor_transport",
                          label: "Vendor Transport",
                        },
                      ]}
                      isCreatable={false}
                      control={control}
                    />
                  </div>
                  {selectedTransport === "vendor_transport" ? (
                    <div className="w-full">
                      <SelectField
                        name="vendor_name"
                        label="Vendor Name"
                        required={isEditing ? false : true}
                        options={vendorOptions}
                        control={control}
                        isCreatable={false}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="w-full">
                    {selectedTransport === "own_transport" ? (
                      <SelectField
                        name="vehicle_no"
                        label="Vehicle No."
                        required={isEditing ? false : true}
                        options={vehicleOptions}
                        control={control}
                        isCreatable={false}
                      />
                    ) : selectedTransport === "vendor_transport" ? (
                      <SelectField
                        name="vehicle_no"
                        label="Vehicle No."
                        required={isEditing ? false : true}
                        options={vendorVehicleOptions}
                        control={control}
                      />
                    ) : (
                      <SelectField
                        name="vehicle_no"
                        label="Vehicle No."
                        required={isEditing ? false : true}
                        options={[
                          {
                            label: "Please select transport first",
                            value: "",
                            disabled: true,
                          },
                        ]}
                        control={control}
                      />
                    )}
                  </div>
                </div>
                <div className="mt-5 md:mt-1 md:flex justify-between gap-3">
                  <div className="w-full">
                    {selectedTransport === "own_transport" ? (
                      <SelectField
                        name="driver_name"
                        label="Driver Name"
                        required={isEditing ? false : true}
                        control={control}
                        options={ownDriverOptions}
                        onSelectChange={(selectedOption) => {
                          setValue(
                            "driver_mobile",
                            selectedOption?.contact || ""
                          );
                        }}
                        isCreatable={false}
                      />
                    ) : selectedTransport === "vendor_transport" ? (
                      <SelectField
                        name="driver_name"
                        label="Driver Name"
                        required={isEditing ? false : true}
                        control={control}
                        options={vendorDriverOptions}
                      />
                    ) : (
                      <SelectField
                        name="driver_name"
                        label="Driver Name"
                        required={isEditing ? false : true}
                        control={control}
                        options={[
                          {
                            label: "Please select transport first",
                            value: "",
                            disabled: true,
                          },
                        ]}
                      />
                    )}
                  </div>
                  <div className="w-full">
                    <InputField
                      name="driver_mobile"
                      label="Driver Mobile"
                      type="number"
                      required={isEditing ? false : true}
                    />
                  </div>
                  <div className="w-full">
                    <InputField name="challan" label="Challan" required={isEditing ? false : true} />
                  </div>
                  <div className="w-full">
                    <InputField name="goods" label="Goods" required={isEditing ? false : true} />
                  </div>
                </div>
                <div className="mt-5 md:mt-1 md:flex justify-between gap-3">
                  <div className="w-full">
                    <InputField
                      name="distribution_name"
                      label="Distribution Name"
                      required={isEditing ? false : true}
                    />
                  </div>
                  <div className="w-full">
                    <InputField name="remarks" label="Remarks" required={isEditing ? false : true} />
                  </div>
                </div>
              </div>
            )}

            {/* Conditionally Show Suzuki Fields */}
            {selectedCustomer === "Suzuki" && (
              <div className="border border-gray-300 p-5 rounded-md mt-3">
                <div className="mt-5 md:mt-1 md:flex justify-between gap-3">
                  <div className="w-full relative">
                    <SelectField
                      name="transport_type"
                      label="Transport Type"
                      required={isEditing ? false : true}
                      options={[
                        { value: "own_transport", label: "Own Transport" },
                        {
                          value: "vendor_transport",
                          label: "Vendor Transport",
                        },
                      ]}
                      isCreatable={false}
                    />
                  </div>
                  {selectedTransport === "vendor_transport" ? (
                    <div className="w-full">
                      <SelectField
                        name="vendor_name"
                        label="Vendor Name"
                        required={isEditing ? false : true}
                        options={vendorOptions}
                        control={control}
                        isCreatable={false}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="w-full">
                    <InputField
                      name="dealer_name"
                      label="Dealer Name"
                      required={isEditing ? false : true}
                    />
                  </div>
                </div>
                <div className="mt-5 md:mt-1 md:flex justify-between gap-3">
                  <div className="w-full">
                    {selectedTransport === "own_transport" ? (
                      <SelectField
                        name="vehicle_no"
                        label="Vehicle No."
                        required={isEditing ? false : true}
                        options={vehicleOptions}
                        control={control}
                        isCreatable={false}
                      />
                    ) : selectedTransport === "vendor_transport" ? (
                      <SelectField
                        name="vehicle_no"
                        label="Vehicle No."
                        required={isEditing ? false : true}
                        options={vendorVehicleOptions}
                        control={control}
                      />
                    ) : (
                      <SelectField
                        name="vehicle_no"
                        label="Vehicle No."
                        defaultValue={"Please select transport first"}
                        required={isEditing ? false : true}
                        options={[
                          {
                            label: "Please select transport first",
                            value: "",
                            disabled: true,
                          },
                        ]}
                        control={control}
                      />
                    )}
                  </div>
                  <div className="w-full">
                    {selectedTransport === "own_transport" ? (
                      <SelectField
                        name="driver_name"
                        label="Driver Name"
                        required={isEditing ? false : true}
                        control={control}
                        options={ownDriverOptions}
                        onSelectChange={(selectedOption) => {
                          setValue(
                            "driver_mobile",
                            selectedOption?.contact || ""
                          );
                        }}
                        isCreatable={false}
                      />
                    ) : selectedTransport === "vendor_transport" ? (
                      <SelectField
                        name="driver_name"
                        label="Driver Name"
                        required={isEditing ? false : true}
                        control={control}
                        options={vendorDriverOptions}
                      />
                    ) : (
                      <SelectField
                        name="driver_name"
                        label="Driver Name"
                        required={isEditing ? false : true}
                        control={control}
                        options={[
                          {
                            label: "Please select transport first",
                            value: "",
                            disabled: true,
                          },
                        ]}
                      />
                    )}
                  </div>
                  <div className="w-full">
                    <InputField name="do_si" label="Do(SI)" required={isEditing ? false : true} />
                  </div>
                  <div className="w-full">
                    <InputField name="co_u" label="CO(U)" required={isEditing ? false : true} />
                  </div>
                </div>
                <div className="mt-5 md:mt-1 md:flex justify-between gap-3">
                  <div className="w-full">
                    <InputField
                      name="quantity"
                      label="Bike/Quantity"
                      type="number"
                      required={isEditing ? false : true}
                    />
                  </div>
                  <div className="w-full">
                    <InputField name="masking" label="Masking" required={isEditing ? false : true} />
                  </div>
                  <div className="w-full">
                    <InputField
                      name="unload_charge"
                      label="Unload Charge"
                      type="number"
                      required={isEditing ? false : true}
                    />
                  </div>
                </div>
                <div className="mt-5 md:mt-1 md:flex justify-between gap-3">
                  <div className="w-[50%]">
                    <InputField
                      name="extra_fare"
                      label="Extra Fare"
                      type="number"
                      required={isEditing ? false : true}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Conditionally Show Honda Fields */}
            {selectedCustomer === "Honda" && (
              <div className="border border-gray-300 p-5 rounded-md mt-3">
                <div className="mt-5 md:mt-1 md:flex justify-between gap-3">
                  <div className="w-full relative">
                    <SelectField
                      name="transport_type"
                      label="Transport Type"
                      required={isEditing ? false : true}
                      options={[
                        { value: "own_transport", label: "Own Transport" },
                        {
                          value: "vendor_transport",
                          label: "Vendor Transport",
                        },
                      ]}
                      isCreatable={false}
                    />
                  </div>
                  {selectedTransport === "vendor_transport" ? (
                    <div className="w-full">
                      <SelectField
                        name="vendor_name"
                        label="Vendor Name"
                        required={isEditing ? false : true}
                        options={vendorOptions}
                        control={control}
                        isCreatable={false}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="w-full">
                    <InputField
                      name="dealer_name"
                      label="Dealer Name"
                      required={isEditing ? false : true}
                    />
                  </div>
                </div>
                <div className="mt-5 md:mt-1 md:flex justify-between gap-3">
                  <div className="w-full">
                    {selectedTransport === "own_transport" ? (
                      <SelectField
                        name="vehicle_no"
                        label="Vehicle No."
                        required={isEditing ? false : true}
                        options={vehicleOptions}
                        control={control}
                        isCreatable={false}
                      />
                    ) : selectedTransport === "vendor_transport" ? (
                      <SelectField
                        name="vehicle_no"
                        label="Vehicle No."
                        required={isEditing ? false : true}
                        options={vendorVehicleOptions}
                        control={control}
                      />
                    ) : (
                      <SelectField
                        name="vehicle_no"
                        label="Vehicle No."
                        defaultValue={"Please select transport first"}
                        required={isEditing ? false : true}
                        options={[
                          {
                            label: "Please select transport first",
                            value: "",
                            disabled: true,
                          },
                        ]}
                        control={control}
                      />
                    )}
                  </div>
                  <div className="w-full">
                    {selectedTransport === "own_transport" ? (
                      <SelectField
                        name="driver_name"
                        label="Driver Name"
                        required={isEditing ? false : true}
                        control={control}
                        options={ownDriverOptions}
                        onSelectChange={(selectedOption) => {
                          setValue(
                            "driver_mobile",
                            selectedOption?.contact || ""
                          );
                        }}
                        isCreatable={false}
                      />
                    ) : selectedTransport === "vendor_transport" ? (
                      <SelectField
                        name="driver_name"
                        label="Driver Name"
                        required={isEditing ? false : true}
                        control={control}
                        options={vendorDriverOptions}
                      />
                    ) : (
                      <SelectField
                        name="driver_name"
                        label="Driver Name"
                        required={isEditing ? false : true}
                        control={control}
                        options={[
                          {
                            label: "Please select transport first",
                            value: "",
                            disabled: true,
                          },
                        ]}
                      />
                    )}
                  </div>
                  <div className="w-full">
                    <InputField
                      name="driver_mobile"
                      label="Driver Mobile"
                      type="number"
                      required={isEditing ? false : true}
                    />
                  </div>
                </div>
                <div className="mt-5 md:mt-1 md:flex justify-between gap-3">
                  <div className="w-full">
                    <InputField name="do_si" label="DO(SI)" required={isEditing ? false : true} />
                  </div>
                  <div className="w-full">
                    <InputField name="no_of_trip" label="No of Trip" required={isEditing ? false : true} />
                  </div>
                  <div className="w-full">
                    <InputField
                      name="quantity"
                      label="Quantity"
                      type="number"
                      required={isEditing ? false : true}
                    />
                  </div>
                </div>
                <div className="mt-5 md:mt-1 md:flex justify-between gap-3">
                  <div className="w-full">
                    <InputField
                      name="vehicle_mode"
                      label="Vehicle Mode"
                      required={isEditing ? false : true}
                    />
                  </div>
                  {/* <div className="w-full">
                    <InputField
                      name="per_truck_rent"
                      label="Per Truck Rent"
                      type="number"
                      required={isEditing ? false : true}
                    />
                  </div> */}
                  <div className="w-full">
        <InputField
          name="per_truck_rent"
          label="Per Truck Rent"
          type="number"
          required={isEditing ? false : true}
          readOnly={isRateFound}
          className={isRateFound ? "bg-gray-100" : ""}
        />
      </div>
                  <div className="w-full">
                    <InputField
                      name="total_rent"
                      label="Total Rent/Bill Amount"
                      type="number"
                      required={isEditing ? false : true}
                      readOnly
                      // defaultValue={totalRentHonda}
                      // value={totalRentHonda}
                    />
                  </div>
                  {/* <div className="w-full">
                    <InputField name="vat" label="Vat" type="number" required={isEditing ? false : true} />
                  </div> */}
                </div>
              </div>
            )}
            {/* Conditionally Show Guest Fields */}
            {selectedCustomer === "Guest" && (
              <div className="border border-gray-300 p-5 rounded-md mt-3">
                <div className="mt-5 md:mt-1 md:flex justify-between gap-3">
                  <div className="w-full relative">
                    <SelectField
                      name="transport_type"
                      label="Transport Type"
                      required={isEditing ? false : true}
                      options={[
                        { value: "own_transport", label: "Own Transport" },
                        {
                          value: "vendor_transport",
                          label: "Vendor Transport",
                        },
                      ]}
                      isCreatable={false}
                    />
                  </div>
                  <div className="w-full">
                    {selectedTransport === "own_transport" ? (
                      <SelectField
                        name="vehicle_no"
                        label="Vehicle No."
                        required={isEditing ? false : true}
                        options={vehicleOptions}
                        control={control}
                        isCreatable={false}
                      />
                    ) : selectedTransport === "vendor_transport" ? (
                      <SelectField
                        name="vehicle_no"
                        label="Vehicle No."
                        required={isEditing ? false : true}
                        options={vendorVehicleOptions}
                        control={control}
                      />
                    ) : (
                      <SelectField
                        name="vehicle_no"
                        label="Vehicle No."
                        defaultValue={"Please select transport first"}
                        required={isEditing ? false : true}
                        options={[
                          {
                            label: "Please select transport first",
                            value: "",
                            disabled: true,
                          },
                        ]}
                        control={control}
                      />
                    )}
                  </div>
                </div>
                <div className="mt-5 md:mt-1 md:flex justify-between gap-3">
                  <div className="w-[50%]">
                    {selectedTransport === "own_transport" ? (
                      <SelectField
                        name="driver_name"
                        label="Driver Name"
                        required={isEditing ? false : true}
                        control={control}
                        options={ownDriverOptions}
                        onSelectChange={(selectedOption) => {
                          setValue(
                            "driver_mobile",
                            selectedOption?.contact || ""
                          );
                        }}
                        isCreatable={false}
                      />
                    ) : selectedTransport === "vendor_transport" ? (
                      <SelectField
                        name="driver_name"
                        label="Driver Name"
                        required={isEditing ? false : true}
                        control={control}
                        options={vendorDriverOptions}
                      />
                    ) : (
                      <SelectField
                        name="driver_name"
                        label="Driver Name"
                        required={isEditing ? false : true}
                        control={control}
                        options={[
                          {
                            label: "Please select transport first",
                            value: "",
                            disabled: true,
                          },
                        ]}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
            {/* transport type input field */}
            {selectedTransport === "own_transport" && (
              <div className="border border-gray-300 p-5 rounded-md mt-5">
                <div className="mt-5 md:mt-1 md:flex justify-between gap-3">
                  <div className="w-full">
                    <InputField
                      name="driver_adv"
                      label="Driver Advance"
                      required={isEditing ? false : true}
                      type="number"
                    />
                  </div>
                  <div className="w-full">
                    <InputField
                      name="driver_commission"
                      label="Driver Commission"
                      required={isEditing ? false : true}
                      type="number"
                    />
                  </div>
                  <div className="w-full">
                    <InputField
                      name="labor"
                      label="Labour Cost"
                      type="number"
                    />
                  </div>
                  <div className="w-full">
                    <InputField
                      name="parking_cost"
                      label="Parking Cost"
                      type="number"
                    />
                  </div>
                </div>
                <div className="mt-5 md:mt-1 md:flex justify-between gap-3">
                  <div className="w-full">
                    <InputField
                      name="night_guard"
                      label="Night Guard Cost"
                      type="number"
                    />
                  </div>
                  <div className="w-full">
                    <InputField
                      name="toll_cost"
                      label="Toll Cost"
                      type="number"
                    />
                  </div>
                  <div className="w-full">
                    <InputField
                      name="feri_cost"
                      label="Feri Cost"
                      type="number"
                    />
                  </div>
                  <div className="w-full">
                    <InputField
                      name="police_cost"
                      label="Police Cost"
                      type="number"
                    />
                  </div>
                </div>
                <div className="mt-5 md:mt-1 md:flex justify-between gap-3">
                  <div className="w-full">
                    <InputField name="chada" label="Chada" type="number" />
                  </div>
                  {/* <div className="w-full">
          <InputField
            name="fuel_cost"
            label="Fuel Cost"
            type="number"
          />
        </div> */}
        <div className="w-full">
          <InputField
            name="callan_cost"
            label="Callan Cost"
            type="number"
          />
        </div>
        <div className="w-full">
          <InputField
            name="others_cost"
            label="Others Cost"
            type="number"
          />
        </div>

                  <div className="w-full">
                    <InputField
                    type="number"
                      name="total_exp"
                      label="Total Expense"
                      readOnly
                      // defaultValue={totalExpense}
                      // value={totalExpense || 0}
                      required={isEditing ? false : true}
                    />
                  </div>
                </div>
              </div>
            )}
            {selectedTransport === "vendor_transport" && (
              <div className="border border-gray-300 p-5 rounded-md mt-5 md:mt-3 md:flex justify-between gap-3">
                <div className="w-full">
                  <InputField
                    name="total_exp"
                    label="Trip Rent"
                    required={isEditing ? false : true}
                    type="number"
                  />
                </div>
                <div className="w-full">
                  <InputField
                    name="advance"
                    label="Advance"
                    type="number"
              required={isEditing ? false : true}
                  />
                </div>
                <div className="w-full">
                  <InputField
                    name="due_amount"
                    label="Due Amount"
                    type="number"
                    required={isEditing ? false : true}
                    readOnly
                  />
                </div>
              </div>
            )}
            {/* Submit Button */}
            <div className="text-left p-5">
              <BtnSubmit>{isEditing ? "Update Trip" : "Submit"}</BtnSubmit>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default AddTripForm;
