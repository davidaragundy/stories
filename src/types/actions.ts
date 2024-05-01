export type ActionResponse = {
  ok: boolean;
  messages: string[];
};

export interface UploadedFilesResponse {
  id: string;
  type: "image" | "video";
  url: string;
}
