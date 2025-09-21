import {
  deleteAddedCostImage,
  upsertAddedCost,
} from "@/actions/added-cost-actions";
import { AddedCostImageDto } from "@/models/inventory/addedcost.model";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAddedCostCUD = () => {
  const { mutate, isSuccess, data, isPending, status, error, isError } =
    useMutation({
      mutationFn: ({
        formData,
        operation,
      }: {
        formData: FormData;
        operation: string;
      }) => upsertAddedCost(operation, formData),
    });

  return {
    upsertAddedCostCUD: mutate,
    isSuccess,
    isPending,
    status,
    data,
    error,
    isError,
  };
};

export const useDeleteAddedCostImage = () => {
  const { mutate } = useMutation({
    mutationFn: (value: AddedCostImageDto) => deleteAddedCostImage(value),
  });
  return {
    deleteAddedCostImage: mutate,
  };
};
