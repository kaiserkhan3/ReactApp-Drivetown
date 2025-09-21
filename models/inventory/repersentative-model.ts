export default interface RepresentativeDto {
  representativeId: number | undefined;
  representativeFirstName: string;
  representativeLastName?: string;
  representativeMobile?: string;
  representativeEmail?: string;
  representativeType: string;
}
