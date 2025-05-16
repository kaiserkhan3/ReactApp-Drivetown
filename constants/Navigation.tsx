import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import TimeToLeaveRoundedIcon from "@mui/icons-material/TimeToLeaveRounded";
import SmsRoundedIcon from "@mui/icons-material/SmsRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { Navigation } from "@toolpad/core";

export const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "MAIN",
  },
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon color="success" />,
  },
  {
    segment: "inventory",
    title: "Inventory",
    icon: <DirectionsCarIcon color="primary" />,
  },
  {
    segment: "appointments",
    title: "Appointments",
    icon: <CalendarMonthRoundedIcon color="primary" />,
  },
  {
    segment: "todolist",
    title: "Todo List",
    icon: <ListAltRoundedIcon color="primary" />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "SALES",
  },
  {
    segment: "testdrive",
    title: "Test Drive",
    icon: <TimeToLeaveRoundedIcon color="primary" />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "COMMUNICATION",
  },
  {
    segment: "smshistory",
    title: "SMS History",
    icon: <SmsRoundedIcon color="primary" />,
  },
  {
    segment: "calllog",
    title: "Call Log",
    icon: <LocalPhoneRoundedIcon color="primary" />,
  },
  {
    segment: "customers",
    title: "Customers",
    icon: <GroupRoundedIcon color="primary" />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "ADMINISTRATION",
  },
  {
    segment: "reports",
    title: "Reports",
    icon: <SettingsRoundedIcon />,
    children: [
      {
        segment: "sales",
        title: "Sales",
        icon: <DescriptionIcon />,
      },
      {
        segment: "purchase",
        title: "Purchase",
        icon: <DescriptionIcon />,
      },
      {
        segment: "inventoryreport",
        title: "Inventory",
        icon: <DescriptionIcon />,
      },
      {
        segment: "expenses",
        title: "Purchase",
        icon: <DescriptionIcon />,
      },
      {
        segment: "loginreport",
        title: "Employees LoggedIn",
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: "integrations",
    title: "Integrations",
    icon: <LayersIcon />,
  },
];
