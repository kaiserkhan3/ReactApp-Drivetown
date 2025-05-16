import {
  getAddedCostDataByInventoryId,
  getInventoryById,
  getInventoryByStatus,
  getNewVehicleDropdownData,
  getPossibleKeyNumber,
  getVehicleMakesList,
  getVinData,
  inventoryCUD,
} from "@/actions/inventory-actions";
import { Inventory } from "@/models/inventory";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

export const useInventory = (
  status = "Available",
  make?: string,
  year?: string,
  searchText?: string
) => {
  let params = new URLSearchParams();
  // Add parameters
  make && params.append("make", make);
  year && params.append("year", year);
  searchText && params.append("searchText", searchText);

  const queryParam = params.toString() ? "?" + params.toString() : "";

  const {
    data,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["InventoryList", status, make, year, searchText],
    queryFn: ({ pageParam }) =>
      getInventoryByStatus(status, pageParam, queryParam),
    initialPageParam: 1,
    getNextPageParam: (lastPages, allPages) => {
      return lastPages?.length ? allPages.length + 1 : undefined;
    },
  });

  return {
    data,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
  };
};

export const useRepresentative = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["Representative"],
    queryFn: getNewVehicleDropdownData,
    staleTime: 3600000,
  });

  const purchaseFrom = data?.filter(
    (f) => f.representativeType === "Purchase From"
  );

  const announcement = data?.filter(
    (f) => f.representativeType === "Announcement"
  );

  const buyers = data?.filter((f) => f.representativeType === "Buyer");

  const contractors = data?.filter(
    (f) => f.representativeType === "Contractor"
  );
  return {
    purchaseFrom,
    announcement,
    contractors,
    buyers,
    isPending,
    isError,
    error,
  };
};

export const usePossibleKey = () => {
  const { data, refetch } = useQuery({
    queryKey: ["key"],
    queryFn: getPossibleKeyNumber,
    enabled: false,
  });

  return {
    keyNo: data,
    refetch,
  };
};

export const useVehicleMake = () => {
  const { data } = useQuery({
    queryKey: ["make"],
    queryFn: getVehicleMakesList,
    staleTime: 3600000,
  });

  return {
    makeList: data,
  };
};

export const useGetInventoryById = (id: number) => {
  const { data, isFetching, error, isError, refetch } = useQuery({
    queryKey: ["inventoryById", id],
    queryFn: () => getInventoryById(id),
  });

  return {
    invData: data,
    isFetching,
    error,
    isError,
    refetch,
  };
};

export const useGetAdedCostDataById = (id: number) => {
  const { data, isFetching, error, isError, refetch } = useQuery({
    queryKey: ["AddedCostList", id],
    queryFn: () => getAddedCostDataByInventoryId(id),
  });

  return {
    addedCostData: data,
    isFetching,
    error,
    isError,
    refetch,
  };
};

export const useFetchVinData = (vin: string) => {
  const { data, refetch } = useQuery({
    queryKey: ["vinData", vin],
    queryFn: () => getVinData(vin),
    enabled: false,
  });

  return {
    vinData: data,
    getVinData: refetch,
  };
};

export const useInventoryCUD = () => {
  const { mutate, isSuccess, data, isPending, status, error, isError } =
    useMutation({
      mutationFn: (invetory: Inventory) => inventoryCUD(invetory),
    });

  return {
    upsertInventory: mutate,
    isSuccess,
    isPending,
    status,
    data,
    error,
    isError,
  };
};
