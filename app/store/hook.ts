import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import { AppDispatch, RootState } from "./store";

type DispatchFunction = () => AppDispatch;

export const useStoreDispatch: DispatchFunction = useDispatch;

export const useStoreSelector: TypedUseSelectorHook<RootState> = useSelector;
