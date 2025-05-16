import classes from "./ThreeDotsLoader.module.css";
export default function ThreeDotLoader() {
  return (
    <div
      className="d-flex w-full  justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div className={classes.ldsEllipsis}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
