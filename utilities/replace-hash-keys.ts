export const replaceHashKeys = (
  template: string,
  customerName: string,
  user: string,
  vehicle: string,
  appoinmentDate: string
) => {
  return template
    .replace("#customerName", customerName)
    .replace("#vehicle", vehicle)
    .replace("#appoinmentDate", appoinmentDate)
    .replace("#address", "10440 Gulf Fwy, Houston, TX 77034")
    .replace("#phone", "(281) 800-1101")
    .replace("#user", user);
};
