"use client";
import {
  getActiveBookmarksList,
  useDeleteTodoFromActiveTodos,
} from "@/hooks/useBookmarkhooks";
import moment from "moment";
import { AllBookmarks } from "./all-bookmarks";
import DialogModal from "@/components/control-components/DialogModal";
import { useStoreDispatch, useStoreSelector } from "@/app/store/hook";
import { updateIsViewAllTodosVisibleFlag } from "@/app/store/modal-slice";

type TodoListProps = {
  modalPopup?: (bookmarkId: number) => void;

  setTodoId: React.Dispatch<React.SetStateAction<number | undefined>>;
};

export const TodoList = ({ modalPopup, setTodoId }: TodoListProps) => {
  const { data, refetch } = getActiveBookmarksList();
  const { deleteTodo } = useDeleteTodoFromActiveTodos();
  const modalVisible = useStoreSelector(
    (state) => state.modal.isViewAllTodosVisible
  );
  const dispatch = useStoreDispatch();
  return (
    <>
      <ul className="todo-list">
        {data &&
          data.map((item) => (
            <li className="todo-item" key={item.bookmarkId}>
              <div className="todo-content">
                <span className="todo-title">{item.name}</span>
                <small title={item.description} style={{ fontSize: "0.7rem" }}>
                  {item.description.slice(0, 50)}...
                </small>
                <span className="todo-date">
                  {moment(item.targetDate).format("DD-MMM-dddd, h:mm A")}
                </span>
              </div>
              <div className={`todo-priority ${item.priority.toLowerCase()}`}>
                {item.priority}
              </div>
              <div className="todo-actions">
                <button
                  className="btn btn-sm btn-icon"
                  title="View"
                  onClick={() => modalPopup!(item.bookmarkId!)}
                >
                  <i className="bi bi-pencil"></i>
                </button>
                <button
                  className="btn btn-sm btn-icon"
                  title="Delete"
                  onClick={() => {
                    deleteTodo(item.bookmarkId!);
                    setTimeout(() => refetch(), 500);
                  }}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </li>
          ))}
      </ul>
      <p style={{ textAlign: "right", padding: "10px" }}>
        <button
          className="link-success link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover p-1"
          style={{ border: 0 }}
          onClick={() =>
            dispatch(
              updateIsViewAllTodosVisibleFlag({ isViewAllTodosVisible: true })
            )
          }
        >
          View All
        </button>
      </p>
      {modalVisible && (
        <DialogModal top={"5rem"}>
          <AllBookmarks setTodoId={setTodoId} />/
        </DialogModal>
      )}
    </>
  );
};
