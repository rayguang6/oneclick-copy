import { ROUTES } from "@/constants/routes";

import { fetchHandler } from "./handlers/fetch";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

export const api = {
  ai: {
    getAnswer: (
      prompt: string,
      framework: string,
      projectContext?: string
    ): APIResponse<string> =>
      fetchHandler(`${API_BASE_URL}/deepseek/`, {
        method: "POST",
        body: JSON.stringify({ prompt, framework, projectContext }),
      }),
  },
};
