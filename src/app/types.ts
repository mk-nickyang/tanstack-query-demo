export type Query = {
  data: { name: string }[];
  status: "loading" | "success" | "error";
  isFetching: boolean;
  private_isFetching: boolean;
  errorMsg: string;
};
