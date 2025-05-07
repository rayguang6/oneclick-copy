import { createClient } from "@/app/utils/supabase/server";
import handleError from "../handlers/error";

export async function getTools(params: PaginatedSearchParams): Promise<ActionResponse<{
    tools: Tool[];
  }>
  > {
  
    const supabase = await createClient()
  
    try {
  
      const tools = await supabase
        .from('tools')
        .select('*')
  
  
      return {
        success: true,
        data: {
          tools: tools.data ?? [],
        },
      };
  
    } catch (error) {
      return handleError(error) as ErrorResponse;
    }
  }