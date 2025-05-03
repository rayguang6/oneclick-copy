//response for fetch data
export type ActionResponse<T = null> = {
    success: boolean;
    data?: T;
    error?: {
      message: string;
      details?: Record<string, string[]>;
    };
    status?: number;
    count?: number;
  };

export type SuccessResponse<T = null> = ActionResponse<T> & { success: true };
export type ErrorResponse = ActionResponse<undefined> & { success: false };

export type APIErrorResponse = NextResponse<ErrorResponse>;
export type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;



//props for fetching pagination
export interface PaginatedSearchParams {
    page?: number;
    pageSize?: number;
    query?: string;
    filter?: string;
    sort?: string;
    userId?: string;
  }

  export interface Ad {
    tags: boolean;
    id: string;
    library_id?: string;
    started_running_on?: string;
    advertiser_profile_image?: string;
    profile_image_url?: string;
    advertiser_profile_link?: string;
    advertiser_name?: string;
    ad_text?: string;
    media_type?: string;
    media_url?: string;
    thumbnail_url?: string;
    captured_at?: string;
    created_at?: string;
    user_id?: string;
    transcription?: string;
    tags?: Tag[];
  }

  export interface Tag {
    id: string;
    name: string;
    color: string;
    created_at: string;
    updated_at?: string;
  }