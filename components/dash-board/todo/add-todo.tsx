import { getUserShortInfohook, useUserData } from "@/hooks/useUserData";
import { BookmarkDto } from "@/models/inventory/models";
import { FormikHelpers, useFormik } from "formik";
import React, { ChangeEvent, useEffect, useState } from "react";
import { todoInitialState } from "./todo-initial-state";
import { todoSchema } from "@/Schemas";
import { getBookmarkByIdQuery, useBookmarkCud } from "@/hooks/useBookmarkhooks";
import moment from "moment";
import { useStoreDispatch } from "@/app/store/hook";
import { updateIsAddTodoVisibleFlag } from "@/app/store/modal-slice";
import { object } from "yup";
import { ImTarget } from "react-icons/im";

type AddTodoProps = {
  id?: number;
};

export const AddTodo = ({ id }: AddTodoProps) => {
  const { userId } = useUserData();
  const { data } = getUserShortInfohook();
  const { bookMark, refetch } = getBookmarkByIdQuery(id!);
  const { upsertBookmark, isError } = useBookmarkCud();

  const { values, setValues, handleChange, handleSubmit, errors, touched } =
    useFormik<BookmarkDto>({
      initialValues:
        bookMark ||
        Object.assign(todoInitialState, {
          targetDate: moment().add(1, "days").format("YYYY-MM-DD HH:mm:ss"),
        }),
      validationSchema: todoSchema,
      enableReinitialize: true,
      onSubmit: (values, actions) => onSubmit(values, actions),
    });

  const dispatch = useStoreDispatch();

  const radioBtnChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    handleChange(event);
    const { name, value } = event.target;

    setValues((prevState) => {
      let obj =
        name === "isCompleted"
          ? {
              [name as keyof BookmarkDto]: value === "1" ? true : false,
            }
          : { [name as keyof BookmarkDto]: value };
      return { ...prevState, ...obj };
    });
  };

  const onSubmit = (
    values: BookmarkDto,
    actions: FormikHelpers<BookmarkDto>
  ) => {
    values.targetDate = moment.utc(values.targetDate).format();
    if (values.bookmarkId) {
      values.updatedById = userId;
      values.updatedDate = moment().utc().format();
    } else {
      values.createdById = userId;
      values.createdDate = moment().utc().format();
    }
    console.log("Values", values);
    upsertBookmark(values);
    dispatch(updateIsAddTodoVisibleFlag({ isAddTodoVisible: false }));
  };
  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id]);

  return (
    <div className="card">
      <div className="card-header">
        <h1 className="card-title fs-5">
          {values.bookmarkId ? "Edit" : "Add"} TODO
        </h1>
        <button
          type="button"
          className="btn-close"
          onClick={() =>
            dispatch(updateIsAddTodoVisibleFlag({ isAddTodoVisible: false }))
          }
        ></button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card-body">
          <div className="m-3">
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1">
                Task
              </span>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                autoComplete="off"
                placeholder="Enter Task"
                aria-label="task"
                aria-describedby="Task"
                value={values.name}
                onChange={handleChange}
              />
              {errors?.name && touched.name && (
                <p className="text-danger ms-2">{errors.name}</p>
              )}
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text">Description</span>
              <textarea
                className="form-control"
                name="description"
                id="description"
                aria-label="With textarea"
                value={values.description}
                onChange={handleChange}
              ></textarea>
              {errors?.description && touched.description && (
                <p className="text-danger ms-2">{errors.description}</p>
              )}
            </div>
            <div
              className="btn-group mb-3"
              role="group"
              aria-label="Basic radio toggle button group"
            >
              <span className="input-group-text pe-3">Select Priority</span>
              {["High", "Medium", "Low"].map((item) => (
                <React.Fragment key={item}>
                  <input
                    type="radio"
                    className="btn-check"
                    name="priority"
                    id={item}
                    autoComplete="off"
                    value={item}
                    onChange={radioBtnChangeHandler}
                    checked={values.priority === item}
                  />
                  <label className="btn btn-outline-primary" htmlFor={item}>
                    {item}
                  </label>
                </React.Fragment>
              ))}
              {errors?.priority && touched.priority && (
                <p className="text-danger ms-2">{errors.priority}</p>
              )}
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text">Target Date</span>
              <input
                type="date"
                className="form-control"
                name="targetDate"
                id="targetDate"
                value={
                  values.bookmarkId
                    ? moment(values.targetDate).utc().format("YYYY-MM-DD")
                    : moment().add(1, "days").utc().format("YYYY-MM-DD")
                }
                onChange={radioBtnChangeHandler}
              />
              {errors?.targetDate && touched.targetDate && (
                <p className="text-danger ms-2">{errors.targetDate}</p>
              )}
            </div>

            <div className="mb-3">
              {data &&
                data.map((item) => (
                  <div
                    className="form-check form-check-inline"
                    key={item.userId}
                  >
                    <input
                      className="form-check-input"
                      type="radio"
                      name="userId"
                      id={item.userName}
                      value={item.userId}
                      onChange={radioBtnChangeHandler}
                      checked={values.userId == item.userId}
                    />
                    <label className="form-check-label" htmlFor={item.userName}>
                      {item.userName}
                    </label>
                  </div>
                ))}
              {errors?.userId && touched.userId && (
                <p className="text-danger ms-2">{errors.userId}</p>
              )}
            </div>
            {values.bookmarkId && (
              <>
                <div className="mb-3">
                  {[
                    { title: "Completed", value: "1" },
                    { title: "Pending", value: "0" },
                  ].map((item) => (
                    <div
                      className="form-check form-check-inline"
                      key={item.title}
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        name="isCompleted"
                        id={item.title}
                        value={item.value}
                        onChange={radioBtnChangeHandler}
                        checked={item.value == (values.isCompleted ? "1" : "0")}
                      />
                      <label className="form-check-label" htmlFor={item.title}>
                        {item.title}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">Comments</span>
                  <textarea
                    className="form-control"
                    name="comments"
                    id="comments"
                    value={values.comments}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="card-footer" style={{ textAlign: "right" }}>
          <button
            type="button"
            className="btn btn-secondary me-3"
            onClick={() =>
              dispatch(updateIsAddTodoVisibleFlag({ isAddTodoVisible: false }))
            }
          >
            Close
          </button>
          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};
