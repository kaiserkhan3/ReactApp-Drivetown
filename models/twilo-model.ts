export interface TwiloMessageDto {
  body: string;
  from: string;
  to: string;
  status: string;
  dateCreated: Date;
}

export interface ReplySMSDto {
  toPhoneNumber: string;
  body: string;
}
