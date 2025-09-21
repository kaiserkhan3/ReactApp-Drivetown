import { AppointmentDto } from "@/models/Appoinments";
import { baseUrl } from "./added-cost-actions";

export const getAppointments = async (month: number, year: number) => {
  let result: AppointmentDto[] = [];
  const response = await fetch(
    baseUrl + `api/Appointments?month=${month}&year=${year}`
  );
  if (response.ok) {
    return (result = (await response.json()) as AppointmentDto[]);
  }
  return result;
};

export const getVehiclesForDropDown = async () => {
  let result: { inventoryId: number; vehicleInfo: string }[] = [];
  const response = await fetch(baseUrl + `api/Appointments/dropdownvalues`);
  if (response.ok) {
    return (result = (await response.json()) as {
      inventoryId: number;
      vehicleInfo: string;
    }[]);
  }
  return result;
};

export const getAppointmentById = async (appointmentId: number) => {
  let result: AppointmentDto = {} as AppointmentDto;
  const response = await fetch(
    baseUrl + `api/Appointments/appoinmentbyid/${appointmentId}`
  );
  if (response.ok) {
    return (result = (await response.json()) as AppointmentDto);
  }
  return result;
};

export const appointmentCud = async (data: AppointmentDto) => {
  let result: AppointmentDto = {} as AppointmentDto;
  const response = await fetch(baseUrl + `api/Appointments/appointmentcud`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    result = (await response.json()) as AppointmentDto;
  }

  return result;
};
