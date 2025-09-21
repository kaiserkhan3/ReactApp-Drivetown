import { Inventory } from "@/models/inventory";
import { ChangeEvent } from "react";

export const SwitchCol = ({
  children,
  colSpan,
}: {
  children: React.ReactNode;
  colSpan?: number;
}) => {
  return <div className={`col-${colSpan || 6}`}>{children}</div>;
};

export const SwitchRow = ({
  children,
  numberOfCols,
}: {
  children: React.ReactNode;
  numberOfCols?: number;
}) => {
  return (
    <div className={`row row-cols-${numberOfCols || 2} mb-3`}>{children}</div>
  );
};

type VehicleOngoingDetailsProps = {
  values: Inventory;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
  titleSwitchHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  switchHandler: (
    event: ChangeEvent<HTMLInputElement>,
    controlName: string
  ) => void;
};
const colSpan1 = 9;
const colSpan2 = 3;

export default function VehicleOngoingDetails({
  values,
  titleSwitchHandler,
  switchHandler,
}: VehicleOngoingDetailsProps) {
  const getSwitchValue = (value: boolean | string) => {
    if (!value) return 0;
    if (typeof value === "boolean") {
      return value ? 1 : 0;
    }
    if (typeof value === "string") {
      return value === "Here" ? 1 : 0;
    }
    return 0;
  };

  return (
    <div className="card shadow-lg" style={{ width: "20rem" }}>
      <div className="card-body">
        <h5 className="card-title bg-warning p-2 text-center mb-3 text-white rounded">
          Vehicle ongoing details
        </h5>

        <SwitchRow>
          <SwitchCol colSpan={colSpan1}>
            <label htmlFor="isInspection">Inspection</label>
          </SwitchCol>
          <SwitchCol colSpan={colSpan2}>
            <div className="form-check form-switch text-center">
              <input
                className="form-check-input"
                type="checkbox"
                id="isInspection"
                name="isInspection"
                defaultValue={getSwitchValue(values.isInspection!) || 0}
                checked={values.isInspection === true}
                onChange={(e) => switchHandler(e, "isInspection")}
              />
            </div>
          </SwitchCol>
        </SwitchRow>
        <SwitchRow>
          <SwitchCol colSpan={colSpan1}>
            <label htmlFor="isOnline">IsOnline</label>
          </SwitchCol>
          <SwitchCol colSpan={colSpan2}>
            <div className="form-check form-switch text-center">
              <input
                className="form-check-input"
                type="checkbox"
                id="isOnline"
                name="isOnline"
                defaultValue={getSwitchValue(values.isOnline!) || 0}
                checked={values.isOnline === true}
                onChange={(e) => switchHandler(e, "isOnline")}
              />
            </div>
          </SwitchCol>
        </SwitchRow>
        <SwitchRow>
          <SwitchCol colSpan={colSpan1}>
            <label htmlFor="title">Title</label>
          </SwitchCol>
          <SwitchCol colSpan={colSpan2}>
            <div className="form-check form-switch text-center">
              <input
                className="form-check-input"
                type="checkbox"
                id="title"
                name="title"
                defaultValue={getSwitchValue(values.title!) || 0}
                checked={values?.title === "Here"}
                onChange={titleSwitchHandler}
              />
            </div>
          </SwitchCol>
        </SwitchRow>
        {(values?.status === "Sold" || values?.isWholeSale) && (
          <>
            <SwitchRow>
              <SwitchCol colSpan={colSpan1}>
                <label htmlFor="isRegistration">Registration Done</label>
              </SwitchCol>
              <SwitchCol colSpan={colSpan2}>
                <div className="form-check form-switch text-center">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="isRegistration"
                    name="isOnline"
                    defaultValue={getSwitchValue(values.isRegistration!) || 0}
                    checked={values.isRegistration === true}
                    onChange={(e) => switchHandler(e, "isRegistration")}
                  />
                </div>
              </SwitchCol>
            </SwitchRow>
            <SwitchRow>
              <SwitchCol colSpan={colSpan1}>
                <label htmlFor="isLicensePlate">License Plate Delivered</label>
              </SwitchCol>
              <SwitchCol colSpan={colSpan2}>
                <div className="form-check form-switch text-center">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="isLicensePlate"
                    name="isLicensePlate"
                    defaultValue={getSwitchValue(values.isLicensePlate!) || 0}
                    checked={values.isLicensePlate === true}
                    onChange={(e) => switchHandler(e, "isLicensePlate")}
                  />
                </div>
              </SwitchCol>
            </SwitchRow>
          </>
        )}
        <SwitchRow>
          <SwitchCol colSpan={colSpan1}>
            <label htmlFor="isWholeSale">Whole Sale</label>
          </SwitchCol>
          <SwitchCol colSpan={colSpan2}>
            <div className="form-check form-switch text-center">
              <input
                className="form-check-input"
                type="checkbox"
                id="isWholeSale"
                name="isWholeSale"
                defaultValue={getSwitchValue(values.isWholeSale!) || 0}
                checked={values.isWholeSale === true}
                onChange={(e) => switchHandler(e, "isWholeSale")}
              />
            </div>
          </SwitchCol>
        </SwitchRow>
        <SwitchRow>
          <SwitchCol colSpan={colSpan1}>
            <label htmlFor="isRepairShop">Work Shop</label>
          </SwitchCol>
          <SwitchCol colSpan={colSpan2}>
            <div className="form-check form-switch text-center">
              <input
                className="form-check-input"
                type="checkbox"
                id="isRepairShop"
                name="isRepairShop"
                defaultValue={getSwitchValue(values.isRepairShop!) || 0}
                checked={values?.isRepairShop === true}
                onChange={(e) => switchHandler(e, "isRepairShop")}
              />
            </div>
          </SwitchCol>
        </SwitchRow>
      </div>
    </div>
  );
}
