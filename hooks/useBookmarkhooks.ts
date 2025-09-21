import {
  bookmarkCud,
  deleteBookMark,
  getActiveBookMarks,
  getAllBookMarks,
  getBookmarkById,
} from "@/actions/bookmark-actions";
import { BookmarkDto } from "@/models/inventory/models";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
const cacheTime = 10 * 60 * 1000;

export const getActiveBookmarksList = () => {
  const { data, refetch } = useQuery({
    queryKey: ["ActiveBookMarks"],
    queryFn: getActiveBookMarks,
  });

  return {
    data,
    refetch,
  };
};

export const getAllBookmarksList = () => {
  const { data } = useQuery({
    queryKey: ["AllBookMarks"],
    queryFn: getAllBookMarks,
  });

  return {
    data,
  };
};

export const getBookmarkByIdQuery = (id?: number) => {
  const { data, refetch } = useQuery({
    queryKey: ["bookmark", id],
    queryFn: () => getBookmarkById(id!),
    enabled: false,
    staleTime: cacheTime,
  });

  return {
    bookMark: data,
    refetch,
  };
};

export const useBookmarkCud = () => {
  const queryClient = useQueryClient();
  const { mutate, isSuccess, data, isPending, status, error, isError } =
    useMutation({
      mutationFn: (data: BookmarkDto) => bookmarkCud(data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["ActiveBookMarks"],
        });
      },
    });

  return {
    upsertBookmark: mutate,
    isSuccess,
    isPending,
    status,
    data,
    error,
    isError,
  };
};

export const useDeleteTodoFromActiveTodos = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (bookmarkId: number) => deleteBookMark(bookmarkId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ActiveBookMarks"],
      });
    },
  });

  return {
    deleteTodo: mutate,
  };
};

export const useDeleteBookmarkFromAllTodos = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (bookmarkId: number) => deleteBookMark(bookmarkId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["AllBookMarks"],
      });
    },
  });

  return {
    deleteTodo: mutate,
  };
};
