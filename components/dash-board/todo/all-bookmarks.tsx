"use client";

import {
  getAllBookmarksList,
  useDeleteBookmarkFromAllTodos,
} from "@/hooks/useBookmarkhooks";
import { todoTabs } from "@/models/inventory/enum";
import moment from "moment";
import Link from "next/link";
import { SetStateAction, useState } from "react";
import { AddTodo } from "./add-todo";
import { useStoreDispatch, useStoreSelector } from "@/app/store/hook";
import DialogModal from "@/components/control-components/DialogModal";
import {
  updateIsAddTodoVisibleFlag,
  updateIsViewAllTodosVisibleFlag,
} from "@/app/store/modal-slice";
import { Dispatch } from "@reduxjs/toolkit";

type AllBookmarksProps = {
  setTodoId: React.Dispatch<React.SetStateAction<number | undefined>>;
};

export const AllBookmarks = ({ setTodoId }: AllBookmarksProps) => {
  const { data } = getAllBookmarksList();
  const { deleteTodo } = useDeleteBookmarkFromAllTodos();
  const [activeTab, setActiveTab] = useState<string>(todoTabs.pending);
  const modalVisible = useStoreSelector(
    (state) => state.modal.isAddTodoVisible
  );
  const dispatch = useStoreDispatch();

  const eidtClickHandler = (bookmarkId: number) => {
    dispatch(updateIsAddTodoVisibleFlag({ isAddTodoVisible: true }));
    setTodoId(bookmarkId);
  };

  const setModalPopUpHandler = (bookmarkId?: number | undefined) => {
    dispatch(updateIsAddTodoVisibleFlag({ isAddTodoVisible: true }));
    setTodoId(bookmarkId);
  };

  return (
    <>
      <div className="card" style={{ minHeight: "50vh", width: "70vw" }}>
        <div className="card-header">
          <h1 className="card-title fs-5">All TODOS</h1>
          <div className="card-actions">
            <button
              className="btn btn-sm btn-primary"
              onClick={() => setModalPopUpHandler(undefined)}
            >
              <i className="bi bi-plus-lg"></i> Add Task
            </button>
          </div>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() =>
              dispatch(
                updateIsViewAllTodosVisibleFlag({
                  isViewAllTodosVisible: false,
                })
              )
            }
          ></button>
        </div>
        <div className="card-body">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${activeTab === todoTabs.pending ? "active" : ""}`}
                aria-current="page"
                onClick={() => setActiveTab(todoTabs.pending)}
              >
                {todoTabs.pending}
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link ${activeTab === todoTabs.completed ? "active" : ""}`}
                onClick={() => setActiveTab(todoTabs.completed)}
              >
                {todoTabs.completed}
              </button>
            </li>
          </ul>
          <div className="inventory-list">
            <div
              className="inventory-table-container"
              style={{ maxHeight: "60vh", overflow: "auto" }}
            >
              <table className="inventory-table table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Task</th>
                    <th>Description</th>
                    <th>Target Date</th>
                    <th>IsCompleted</th>
                    <th>Priority</th>
                    <th>Comments</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data
                      .filter(
                        (f) =>
                          f.isCompleted ===
                          (activeTab === todoTabs.completed ? true : false)
                      )
                      .map((row, index) => (
                        <tr key={row.bookmarkId}>
                          <td>{index + 1}</td>
                          <td>{row.name}</td>
                          <td>{row.description}</td>
                          <td>
                            {moment(row.targetDate).format(
                              "DD-MMM-dddd, h:mm A"
                            )}
                          </td>
                          <td>{row.isCompleted ? "Completed" : "Pending"}</td>
                          <td>
                            <div
                              className={`todo-priority ${row.priority.toLocaleLowerCase()}`}
                            >
                              {row.priority}
                            </div>
                          </td>
                          <td>{row.comments}</td>
                          <td>
                            <div className="todo-actions">
                              <button
                                className="btn btn-sm btn-icon"
                                title="View"
                                // data-bs-toggle="modal"
                                // data-bs-target={`#${targetId}`}
                                onClick={() =>
                                  eidtClickHandler(row.bookmarkId!)
                                }
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-icon"
                                title="Delete"
                                onClick={() => {
                                  deleteTodo(row.bookmarkId!);
                                }}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
