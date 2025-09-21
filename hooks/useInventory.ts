import {
  deleteInventoryFile,
  getAddedCostDataByInventoryId,
  getInventoryById,
  getInventoryByStatus,
  getInventoryCountByOnlineStatus,
  getInventoryFiles,
  getNewVehicleDropdownData,
  getPossibleKeyNumber,
  getVehicleMakesList,
  getVinData,
  inventoryCUD,
  uploadInventoryDocuments,
} from "@/actions/inventory-actions";
import {
  createOrUpdateRepresentative,
  getRepresentativeInfoById,
} from "@/actions/representative-actions";
import { Inventory, RepresentativeDto } from "@/models/inventory";
import { DeleteFile, InventoryDocs } from "@/models/inventory/models";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useInventory = (
  status = "Available",
  make?: string,
  year?: string,
  searchText?: string,
  onlineStatus?: string
) => {
  let params = new URLSearchParams();
  // Add parameters
  make && params.append("make", make);
  year && params.append("year", year);
  searchText && params.append("searchText", searchText);
  onlineStatus && params.append("onlineStatus", onlineStatus);

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
    queryKey: ["InventoryList", status, make, year, searchText, onlineStatus],
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

export const useRepresentativeinfById = (id: number) => {
  const { data, refetch } = useQuery({
    queryKey: ["representativeinfo", id],
    queryFn: () => getRepresentativeInfoById(id),
    enabled: false,
  });

  return {
    data,
    refetch,
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

  const refferedBy = data?.filter((f) => f.representativeType === "Sold By");
  return {
    purchaseFrom,
    announcement,
    contractors,
    refferedBy,
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

export const useGetInventoryCountsByOnlineStatus = () => {
  const { data, isFetching, error, isError, refetch } = useQuery({
    queryKey: ["inventoryCountsByOnlineStatus"],
    queryFn: () => getInventoryCountByOnlineStatus(),
    staleTime: 600000,
  });

  return {
    invCountByOnlineStatus: data,
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

export const useCreateOrUpdateRepresentativeHook = () => {
  const queryClient = useQueryClient();
  const { mutate, isSuccess, data, isPending, status, error, isError } =
    useMutation({
      mutationFn: (data: RepresentativeDto) =>
        createOrUpdateRepresentative(data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["Representative"],
        });
      },
    });

  return {
    upsertRepresentative: mutate,
    isSuccess,
    isPending,
    status,
    data,
    error,
    isError,
  };
};

export const useUploadDocuments = () => {
  const { mutate, isSuccess, data, isPending, status, error, isError } =
    useMutation({
      mutationFn: (formData: any) => uploadInventoryDocuments(formData),
      onSuccess: (data) => {
        // Handle successful mutation, data contains the response from the server
        return data;
      },
      onError: (error) => {
        // Handle error
        console.error("Mutation error:", error);
      },
    });

  return {
    uploadInvDocuments: mutate,
    isSuccess,
    isPending,
    status,
    data,
    error,
    isError,
  };
};

export const useGetInventoryFiles = (inventoryDocs: InventoryDocs) => {
  const { mutate, isSuccess, data, isPending, status } = useMutation({
    mutationFn: () => getInventoryFiles(inventoryDocs),
  });
  return {
    filesData: data,
    getFilesData: mutate,
    getFilesSuccess: isSuccess,
    isPending,
  };
};

export const useDeleteInventoryFiles = () => {
  const { mutate, isPending, data, isSuccess } = useMutation({
    mutationFn: (data: DeleteFile) => deleteInventoryFile(data),
  });

  return {
    deleteFile: mutate,
    isDeleteFilePending: isPending,
    fileData: data,
    isSuccess,
  };
};
