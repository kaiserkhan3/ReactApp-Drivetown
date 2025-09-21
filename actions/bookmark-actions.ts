import { BookmarkDto } from "@/models/inventory/models";
import { baseUrl } from "./added-cost-actions";

export const getActiveBookMarks = async () => {
  let result: BookmarkDto[] = [];
  const response = await fetch(baseUrl + `api/Bookmark/activebookmarks`);
  if (response.ok) {
    return (result = (await response.json()) as BookmarkDto[]);
  }
  return result;
};

export const getAllBookMarks = async () => {
  let result: BookmarkDto[] = [];
  const response = await fetch(baseUrl + `api/Bookmark/allbookmarks`);
  if (response.ok) {
    return (result = (await response.json()) as BookmarkDto[]);
  }
  return result;
};

export const getBookmarkById = async (id: number) => {
  let result: BookmarkDto = {} as BookmarkDto;
  const response = await fetch(baseUrl + `api/Bookmark/bookmarkbyid/${id}`);
  if (response.ok) {
    return (result = (await response.json()) as BookmarkDto);
  }
  return result;
};

export const bookmarkCud = async (bookmarkDto: BookmarkDto) => {
  let result: BookmarkDto = {} as BookmarkDto;
  const response = await fetch(baseUrl + `api/Bookmark/bookmarkcud`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookmarkDto),
  });
  if (response.ok) {
    return (result = (await response.json()) as BookmarkDto);
  }
  return result;
};

export const deleteBookMark = async (bookmarkId: number) => {
  let result: string = "";
  const response = await fetch(
    baseUrl + `api/Bookmark/deletetodo/${bookmarkId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "text/plain",
      },
    }
  );
  if (response.ok) {
    result = (await response.json()) as string;
    return result;
  }
  return result;
};
