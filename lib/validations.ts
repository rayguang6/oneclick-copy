import { z } from "zod";

export const GetProjectSchema = z.object({
    projectId: z.string().min(1, "Project ID is required"),
  });