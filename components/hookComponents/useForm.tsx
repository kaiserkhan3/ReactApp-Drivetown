"use client";
import { makeStyles } from "@mui/styles";
import React, { useState } from "react";

export const useForm = <T,>(initialFormValues: T) => {
  const [values, setValues] = useState(initialFormValues);

  const handleOnchange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  return {
    values,
    setValues,
    handleOnchange,
  };
};

const useStyles = makeStyles(() => ({
  root: {
    "& .MuiFormControl-root": {
      width: "80%",
      margin: "10px",
    },
  },
}));

export const Form = ({ children }: { children: React.ReactNode }) => {
  const classes = useStyles();
  return <form className={classes.root}>{children}</form>;
};
