"use client";
import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { AddTodo } from "./add-todo";
import { TodoList } from "./todo-list";
import { useStoreDispatch, useStoreSelector } from "@/app/store/hook";
import DialogModal from "@/components/control-components/DialogModal";
import { updateIsAddTodoVisibleFlag } from "@/app/store/modal-slice";
export const TodoContainer = () => {
  const [todoId, setTodoId] = useState<number | undefined>(undefined);
  const targetId = "modalFromActiveTodoList";
  const modalVisible = useStoreSelector(
    (state) => state.modal.isAddTodoVisible
  );
  const dispatch = useStoreDispatch();

  const setModalPopUpHandler = (bookmarkId?: number | undefined) => {
    dispatch(updateIsAddTodoVisibleFlag({ isAddTodoVisible: true }));
    setTodoId(bookmarkId);
  };

  return (
    <>
      {modalVisible && (
        <DialogModal top={"10rem"}>
          <AddTodo id={todoId} />
        </DialogModal>
      )}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Todo List</h5>
          <div className="card-actions">
            <button
              className="btn btn-sm btn-primary"
              onClick={() => setModalPopUpHandler()}
            >
              <i className="bi bi-plus-lg"></i> Add Task
            </button>
          </div>
        </div>
        <div className="card-body p-0">
          <TodoList modalPopup={setModalPopUpHandler} setTodoId={setTodoId} />
        </div>
      </div>
    </>
  );
};
