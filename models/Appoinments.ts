import { boolean } from "yup";

export interface AppointmentDto {
  appointmentId: number | undefined;
  inventoryId?: number | undefined;
  customerName?: string | undefined;
  customerAddress?: string | undefined;
  contactNo?: string | undefined;
  email?: string | undefined;
  referredBy?: string | undefined;
  appointmentDate?: Date | undefined;
  notes?: string | undefined;
  leadId?: number | undefined;
  createdById?: number | undefined;
  createdDate?: Date | undefined;
  updatedById?: number | undefined;
  updatedDate?: Date | undefined;
  action?: string | undefined;
  vehicleInfo?: string | undefined;
  sendSMS?: boolean | undefined;
  message?: string | undefined;
}

export const appointmentInitialValues: AppointmentDto = {
  appointmentId: undefined,
  inventoryId: undefined,
  customerName: undefined,
  customerAddress: undefined,
  contactNo: undefined,
  email: undefined,
  referredBy: undefined,
  appointmentDate: undefined,
  notes: undefined,
  leadId: undefined,
  createdById: undefined,
  createdDate: undefined,
  updatedById: undefined,
  updatedDate: undefined,
  action: undefined,
  vehicleInfo: undefined,
  sendSMS: undefined,
  message: undefined,
};

export const appointmentAction = {
  created: "Created",
  show: "Show",
  noShow: "NoShow",
  reScheduled: "ReScheduled",
};
