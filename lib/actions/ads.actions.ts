import { createClient } from "@/app/utils/supabase/server";
import { getLoggedInUser } from "./auth.actions";
import { cache } from "react";
import { Ad } from "@/app/types/global";
import { PaginatedSearchParams } from "@/app/types/global";
import { ActionResponse } from "@/app/types/global";


export async function getAds(
  params: PaginatedSearchParams,
  userId: string
): Promise<ActionResponse<{
  ads: Ad[];
  count: number;
  isNext: boolean;
}>> {
  const { page = 1, pageSize = 10, query, filter } = params;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  const supabase = await createClient();

  try {
    let queryBuilder = supabase
      .from('facebook_ads')
      .select(`
        *,
        ad_tags (
          tag_id,
          tags (
            id, name, color
          )
        )
      `, { count: 'exact' })
      .eq('user_id', userId)
      .range(skip, skip + limit - 1);

    // 🔍 Search by ad text or advertiser name
    if (query) {
      queryBuilder = queryBuilder.or(`ad_text.ilike.%${query}%,advertiser_name.ilike.%${query}%`);
    }

    // 🏷️ Filter by tag ID (using filter param)
    if (filter) {
      queryBuilder = queryBuilder
        .eq('ad_tags.tag_id', filter)
        .not('ad_tags', 'is', null);
    }

    // ⏳ Default sort
    queryBuilder = queryBuilder.order('created_at', { ascending: false });

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
      tags: ad.ad_tags?.map((link: any) => link.tags).filter(Boolean) ?? [],
    }));

    const isNext = (count ?? 0) > skip + ads.length;

    return {
      success: true,
      data: {
        ads: ads as Ad[],
        count: count ?? 0,
        isNext,
      },
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

