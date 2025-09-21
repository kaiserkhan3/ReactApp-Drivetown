import { BreadCrumb } from "./bread-crumb";
import { DisplayUserInfo } from "./display-user-info";

type PageHeaderProps = {
  children?: React.ReactNode;
};

export const PageHeaderCommon = ({ children }: PageHeaderProps) => {
  return (
    <div className="page-header">
      <BreadCrumb />
      <div className="header-actions">
        {children || null}

        <div className="dropdown">
          <DisplayUserInfo />
        </div>
      </div>
    </div>
  );
};
