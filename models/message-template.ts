export interface ITemplate {
  id: number;
  actionName: string;
  messageTemplate: string;
  isActive: boolean;
  createdById: number;
  createdDate: Date | undefined;
  updatedById: number;
  updatedDate: Date | undefined;
  templateType: string;
}

export interface ISMSTemplateDto {
  new: ITemplate;
  show: ITemplate;
  noShow: ITemplate;
  reScheduled: ITemplate;
  vehicleSold: ITemplate;
  registerationDone: ITemplate;
  licensePlateDispath: ITemplate;
}

export const initialSMSTemplateValues: ISMSTemplateDto = {
  new: {} as ITemplate,
  show: {} as ITemplate,
  noShow: {} as ITemplate,
  reScheduled: {} as ITemplate,
  vehicleSold: {} as ITemplate,
  registerationDone: {} as ITemplate,
  licensePlateDispath: {} as ITemplate,
};

export const templateTypes = {
  new: "new",
  show: "show",
  noShow: "noShow",
  reScheduled: "reScheduled",
  vehicleSold: "vehicleSold",
  registerationDone: "registerationDone",
  licensePlateDispath: "licensePlateDispath",
};
