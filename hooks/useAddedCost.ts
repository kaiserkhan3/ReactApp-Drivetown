import {
  deleteAddedCostImage,
  upsertAddedCost,
} from "@/actions/added-cost-actions";
import { AddedCostImageDto } from "@/models/inventory/addedcost.model";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAddedCostCUD = (inventoryId: number) => {
  const queryClient = useQueryClient();
  const { mutate, isSuccess, data, isPending, status, error, isError } =
    useMutation({
      mutationFn: ({
        formData,
        operation,
      }: {
        formData: FormData;
        operation: string;
      }) => upsertAddedCost(operation, formData),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["AddedCostList", inventoryId],
        });
      },
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
