"use server";

import { ZodError, ZodSchema } from "zod";
import { createClient } from "@/app/utils/supabase/server";
import { UnauthorizedError, ValidationError } from "../http-errors";

type ActionOptions<T> = {
  params?: T;
  schema?: ZodSchema<T>;
  authorize?: boolean;
};

type ActionResult<T> = {
  params?: T;
  supabase: Awaited<ReturnType<typeof createClient>>;
  user?: any; // Type this properly based on your user model
};

// Reusable action function
async function action<T>({
  params,
  schema,
  authorize = false,
}: ActionOptions<T>): Promise<ActionResult<T> | Error> {
  // 1. Validate the schema if provided
  if (schema && params) {
    try {
      schema.parse(params);
    } catch (error) {
      if (error instanceof ZodError) {
        return new ValidationError(
          error.flatten().fieldErrors as Record<string, string[]>
        );
      } else {
        return new Error("Schema validation failed");
      }
    }
  }

  // 2. Create Supabase client - using your existing function
  const supabase = await createClient();
  
  // 3. Authorize if required
  let user = null;
  if (authorize) {
    const { data, error } = await supabase.auth.getUser();
    
    if (error || !data.user) {
      return new UnauthorizedError();
    }
    
    user = data.user;
  }

  // 4. Return everything needed for the action
  return { params, supabase, user };
}

export default action;