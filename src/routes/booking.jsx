// import { createFileRoute } from "@tanstack/react-router";
// import { useState } from "react";
// import {
//   ArrowRight,
//   CheckCircle2,
//   Home,
//   Building2,
//   Sofa,
//   Box,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { toast } from "sonner";
// import { axiosInstance } from "@/lib/axios";

// export const Route = createFileRoute("/booking")({
//   component: Booking,
// });

// const services = [
//   { id: "Home Shifting", icon: Home },
//   { id: "Office Relocation", icon: Building2 },
//   { id: "Furniture Moving", icon: Sofa },
//   { id: "Packing Services", icon: Box },
// ];

// function Booking() {
//   const [service, setService] = useState("Home Shifting");
//   const [loading, setLoading] = useState(false);
//   const [submitted, setSubmitted] = useState(false);

//   const [formData, setFormData] = useState({
//     fullName: "",
//     phoneNumber: "",
//     pickupAddress: "",
//     dropAddress: "",
//     movingDate: "",
//     estimatedItems: "",
//   });

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       setLoading(true);

//       const res = await axiosInstance.post("/booking/create", {
//         serviceType: service,
//         ...formData,
//       });

//       toast.success(
//         res.data.message || "Booking created successfully"
//       );

//       setSubmitted(true);

//       setFormData({
//         fullName: "",
//         phoneNumber: "",
//         pickupAddress: "",
//         dropAddress: "",
//         movingDate: "",
//         estimatedItems: "",
//       });
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//         "Failed to create booking"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (submitted) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
//           <h1 className="text-3xl font-bold mt-4">
//             Booking Confirmed
//           </h1>
//           <p className="text-gray-500 mt-2">
//             Your booking has been submitted successfully.
//           </p>

//           <Button
//             className="mt-6"
//             onClick={() => setSubmitted(false)}
//           >
//             Create Another Booking
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <main className="bg-gray-50 min-h-screen py-10 px-4">
//       <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">

//         <h1 className="text-3xl font-bold mb-6">
//           Book Your Move
//         </h1>

//         <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
//           {services.map((item) => {
//             const Icon = item.icon;

//             return (
//               <button
//                 key={item.id}
//                 type="button"
//                 onClick={() => setService(item.id)}
//                 className={`p-4 border rounded-lg transition
//                   ${service === item.id
//                     ? "border-blue-500 bg-blue-50"
//                     : "border-gray-200"
//                   }`}
//               >
//                 <Icon className="h-6 w-6 mx-auto mb-2" />
//                 <span className="text-sm font-medium">
//                   {item.id}
//                 </span>
//               </button>
//             );
//           })}
//         </div>

//         <form onSubmit={onSubmit} className="space-y-4">

//           <Input
//             name="fullName"
//             placeholder="Full Name"
//             value={formData.fullName}
//             onChange={handleChange}
//             required
//           />

//           <Input
//             name="phoneNumber"
//             placeholder="Phone Number"
//             value={formData.phoneNumber}
//             onChange={handleChange}
//             required
//           />

//           <Input
//             name="pickupAddress"
//             placeholder="Pickup Address"
//             value={formData.pickupAddress}
//             onChange={handleChange}
//             required
//           />

//           <Input
//             name="dropAddress"
//             placeholder="Drop Address"
//             value={formData.dropAddress}
//             onChange={handleChange}
//             required
//           />

//           <Input
//             type="date"
//             name="movingDate"
//             value={formData.movingDate}
//             onChange={handleChange}
//             required
//           />

//           <Input
//             name="estimatedItems"
//             placeholder="Estimated Items"
//             value={formData.estimatedItems}
//             onChange={handleChange}
//           />

//           <Button
//             type="submit"
//             disabled={loading}
//             className="w-full"
//           >
//             {loading ? "Submitting..." : "Submit Booking"}
//             <ArrowRight className="ml-2 h-4 w-4" />
//           </Button>

//         </form>

//       </div>
//     </main>
//   );
// }

// export default Booking;




// src/routes/booking.tsx (UPDATED with price calculation)
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Home,
  Building2,
  Sofa,
  Box,
  IndianRupee,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";

export const Route = createFileRoute("/booking")({
  component: Booking,
});

const services = [
  { id: "Home Shifting", icon: Home, basePrice: 500 },
  { id: "Office Relocation", icon: Building2, basePrice: 1000 },
  { id: "Furniture Moving", icon: Sofa, basePrice: 300 },
  { id: "Packing Services", icon: Box, basePrice: 200 },
];

function Booking() {
  const navigate = useNavigate();
  const [service, setService] = useState("Home Shifting");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [distance, setDistance] = useState(10);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    pickupAddress: "",
    dropAddress: "",
    movingDate: "",
    estimatedItems: "",
  });

  useEffect(() => {
    const selected = services.find(s => s.id === service);
    const price = (selected?.basePrice || 0) + (distance * 5);
    setCalculatedPrice(price);
  }, [service, distance]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast.error('Please login first');
        navigate({ to: '/login' });
        return;
      }

      const res = await axiosInstance.post("/booking/create", {
        serviceType: service,
        price: calculatedPrice,
        ...formData,
      }, {
        headers: { 'x-user-id': userId }
      });

      toast.success("Booking created successfully!");
      setSubmitted(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
          <h1 className="text-3xl font-bold mt-4">Booking Confirmed!</h1>
          <p className="text-gray-500 mt-2">Estimated Price: AED {calculatedPrice}</p>
          <p className="text-gray-500">A driver will be assigned shortly.</p>
          <Button className="mt-6" onClick={() => navigate({ to: '/Customer' })}>
            View My Bookings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-6">Book Your Move</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {services.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setService(item.id)}
                className={`p-4 border rounded-lg transition
                  ${service === item.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                  }`}
              >
                <Icon className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium">{item.id}</span>
                <span className="text-xs text-gray-500 block mt-1">
                  From AED {item.basePrice}
                </span>
              </button>
            );
          })}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Estimated Price:</span>
            <span className="text-2xl font-bold text-blue-600">AED {calculatedPrice}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            *Includes base service + distance (AED 5/km)
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <Input
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          <Input
            name="pickupAddress"
            placeholder="Pickup Address"
            value={formData.pickupAddress}
            onChange={handleChange}
            required
          />
          <Input
            name="dropAddress"
            placeholder="Drop Address"
            value={formData.dropAddress}
            onChange={handleChange}
            required
          />
          <Input
            type="date"
            name="movingDate"
            value={formData.movingDate}
            onChange={handleChange}
            required
          />
          <Input
            name="estimatedItems"
            placeholder="Estimated Items (e.g., 2BR apartment)"
            value={formData.estimatedItems}
            onChange={handleChange}
          />

          <Input
            type="range"
            min="1"
            max="50"
            value={distance}
            onChange={(e) => setDistance(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>Distance: {distance} km</span>
            <span>+AED {distance * 5}</span>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Booking..." : "Confirm Booking"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </div>
    </main>
  );
}