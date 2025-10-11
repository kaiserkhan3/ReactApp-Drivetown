import moment from "moment";
export function formatPhoneNumber(value: string) {
  if (!value) return value;
  const phoneNumber = value.replace(/[^\d]/g, "");
  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
}

export function unFormatPhoneNumber(value: string) {
  return value.replace(/[^\d]/g, "");
}

export function getCurrentYear() {
  return parseInt(moment().format("YYYY"));
}

export const range = (start: number, end: number) =>
  [...Array(end - start + 1).keys()].map((i) => i + start);

export const openDocumentInNewTab = (folderName: string, fileName: string) => {
  const uri = `${process.env.NEXT_PUBLIC_SHARED_FOLDER_URL!}${folderName}/${fileName}`;
  window.open(uri, "_blank");
};
