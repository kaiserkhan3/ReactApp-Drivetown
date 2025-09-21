import AppointmentsScheduler from "@/components/appointments/appoinemnt-schedular";
import ThreeDotLoader from "@/components/loading-control/Three-dots-loader/ThreeDotsLoader";
import { Suspense } from "react";

export default function Appoinments() {
  return (
    <Suspense fallback={<ThreeDotLoader />}>
      <AppointmentsScheduler />
    </Suspense>
  );
}
