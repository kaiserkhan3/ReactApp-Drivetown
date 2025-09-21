import {
  appointmentCud,
  getAppointmentById,
  getAppointments,
  getVehiclesForDropDown,
} from "@/actions/appointments-action";
import { AppointmentDto } from "@/models/Appoinments";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAppointments = (month: number, year: number) => {
  const { data, refetch } = useQuery({
    queryKey: ["Appointments", month, year],
    queryFn: () => getAppointments(month, year),
    enabled: true,
    staleTime: 600000,
  });

  return {
    appointmentsData: data,
    refetch,
  };
};

export const useGetVehicleDataForDropDown = () => {
  const { data, refetch } = useQuery({
    queryKey: ["VehiclesDropDowndata"],
    queryFn: () => getVehiclesForDropDown(),
    enabled: true,
    staleTime: 600000,
  });

  return {
    vehiclesDataForDropdown: data,
    refetch,
  };
};

export const useGetAppointmentById = (appointmentId: number) => {
  const { data, refetch } = useQuery({
    queryKey: ["AppintmentById", appointmentId],
    queryFn: () => getAppointmentById(appointmentId),
    enabled: false,
  });

  return {
    appointmentData: data,
    refetch,
  };
};

export const useAppointmentCud = (month?: number, year?: number) => {
  const queryClient = useQueryClient();
  const { mutate, isSuccess, data, isPending, status, error, isError } =
    useMutation({
      mutationFn: (data: AppointmentDto) => appointmentCud(data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["Appointments", month, year],
        });
      },
    });

  return {
    upsertAppoinment: mutate,
    isSuccess,
    isPending,
    status,
    data,
    error,
    isError,
  };
};
