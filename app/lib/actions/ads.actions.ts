

import { createClient } from "@/app/utils/supabase/server";
import { getLoggedInUser } from "./auth.actions";
import { cache } from "react";


export async function getAds(
    params: PaginatedSearchParams,
    userId: string
  ): Promise<ActionResponse<{
    ads: Ad[];
    isNext: boolean;
  }>> {
   
    const { page = 1, pageSize = 10, query, filter } = params;
    const skip = (Number(page) - 1) * pageSize;
    const limit = Number(pageSize);

    const supabase = await createClient();
        
    try {
            //   const totalAds = await supabase.from("facebook_ads").count("*");
            
        let queryBuilder = supabase.from('facebook_ads')
        .select(`
            *,
            ad_tags (
            tags (
                id, name, color
            )
            )
        `, { count: "exact" })
        .eq("user_id", userId)
        .range(skip, skip + pageSize - 1)


      if (query) {
        //search query for ad_text and advertiser_name
        queryBuilder = queryBuilder.or(`ad_text.ilike.%${query}%,advertiser_name.ilike.%${query}%`)
      }
  
      switch (filter) {
        case "video":
          queryBuilder = queryBuilder.eq("ad_type", "video")
          break
        case "image":
          queryBuilder = queryBuilder.eq("ad_type", "image")
          break
        case "newest":
          queryBuilder = queryBuilder.order("created_at", { ascending: false })
          break
        case "oldest":
          queryBuilder = queryBuilder.order("created_at", { ascending: true })
          break
        default:
          queryBuilder = queryBuilder.order("created_at", { ascending: false })
          break
      }

      const { data, count, error } = await queryBuilder;

      if (error) {
        return {
          success: false,
          error: { message: error.message },
          status: 500,
        };
      }

      const ads = (data ?? []).map((ad: any) => ({
        ...ad,
        tags: ad.ad_tags?.map((link: any) => link.tags) ?? [],
      }));
  
      const isNext = (count ?? 0) > skip + ads.length;
  
      return {
        success: true,
        data: { ads: ads as Ad[], isNext },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: (error as Error).message || "Something went wrong",
        },
        status: 500,
      };
    }
  }
