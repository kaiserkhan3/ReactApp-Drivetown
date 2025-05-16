export interface VehicleMake {
  vehicleMakeId: number;
  vehicleMakeName: string;
}

export interface VehicleModel {
  vehicleModelId: number;
  vehicleMakeId: number;
  vehicleModelName: string;
}
