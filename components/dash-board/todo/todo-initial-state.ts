import { BookmarkDto } from "@/models/inventory/models";

export const todoInitialState: BookmarkDto = {
  bookmarkId: undefined,
  description: "",
  isCompleted: false,
  name: "",
  priority: "",
  targetDate: undefined,
  comments: "",
  isRead: false,
  userId: undefined,
  createdById: undefined,
  createdDate: undefined,
  updatedById: undefined,
  updatedDate: undefined,
};
