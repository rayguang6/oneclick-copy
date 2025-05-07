type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
};

type SuccessResponse<T = null> = ActionResponse<T> & { success: true };
type ErrorResponse = ActionResponse<undefined> & { success: false };

type APIErrorResponse = NextResponse<ErrorResponse>;
type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

//props for fetching pagination
interface PaginatedSearchParams {
  page?: number;
  pageSize?: number;
  query?: string;
  filter?: string;
  sort?: string;
  userId?: string;
}

interface Ad {
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

interface Tag {
  id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at?: string;
}

interface Project {
  id: string
  user_id: string
  created_at: string
  updated_at: string
  name: string 
  industry: string,
  guru_details: string,
  audience: string,
  painpoints: string,
  product: string,
  usp: string,
  competitor: string,
  student_transformation: string,
  case_study: string;
}


interface Tool {
  id: string;
  title: string;
  slug: string;
  icon: string;
  description: string;
}

interface Framework{
  id: string
  tool_id: string
  name: string
  description: string
  system_prompt: string
  image: string
  is_default: boolean
  created_at: string
}

interface Conversation {
  id: string;
  user_id: string;
  project_id: string;
  tool_id: string;
  framework: string;
  title: string;
  project_context?: any; // JSONB from database
  created_at: string;
  updated_at: string;
}
