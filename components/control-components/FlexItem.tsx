import classes from "./FlexItem.module.css";
type DFlexRowProps = {
  children: React.ReactNode;
};
export default function FlexItem({ children }: DFlexRowProps) {
  return <div className={`${classes.flexItem}`}>{children}</div>;
}
