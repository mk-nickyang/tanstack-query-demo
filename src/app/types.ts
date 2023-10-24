export type Query = {
  data: { name: string }[];
  status: "loading" | "success" | "error";
  isFetching: boolean;
  errorMsg: string;
};
