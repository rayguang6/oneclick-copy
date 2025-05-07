// @/app/lib/store/tagStore.ts
import { create } from 'zustand';
import { 
  getAllTags, 
  createTag, 
  updateTag as updateTagAction, 
  deleteTag as deleteTagAction,
  forceDeleteTagWithCascade
} from '@/lib/actions/tags.actions';

// Add caching to prevent unnecessary refetches
let cachedTags: Tag[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 30000; // 30 seconds cache

interface TagState {
  tags: Tag[];
  error: string | null;
  isInitialized: boolean;
  isLoading: boolean;
}

interface TagActions {
  initialize: () => Promise<void>;
  refreshTags: () => Promise<void>;
  addTag: (name: string, color: string) => Promise<Tag | null>;
  updateTag: (tagId: string, name: string, color: string) => Promise<void>;
  deleteTag: (tagId: string) => Promise<void>;
  reset: () => void;
}

type TagStore = TagState & TagActions;

export const useTagStore = create<TagStore>()((set, get) => ({
  tags: [],
  error: null,
  isInitialized: false,
  isLoading: false,

  reset: () => {
    set({ tags: [], error: null, isInitialized: false, isLoading: false });
    cachedTags = null;
    lastFetchTime = 0;
  },

  initialize: async () => {
    // If already initialized and not stale, use cached data
    if (get().isInitialized && 
        cachedTags && 
        (Date.now() - lastFetchTime < CACHE_DURATION)) {
      return;
    }
    
    try {
      set({ isLoading: true, error: null });
      
      // Only fetch if cache is stale or empty
      if (!cachedTags || (Date.now() - lastFetchTime >= CACHE_DURATION)) {
        const freshTags = await getAllTags();
        cachedTags = freshTags;
        lastFetchTime = Date.now();
      }
      
      set({ 
        tags: cachedTags, 
        isInitialized: true, 
        isLoading: false, 
        error: null 
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  
  refreshTags: async () => {
    try {
      set({ isLoading: true, error: null });
      const freshTags = await getAllTags();
      cachedTags = freshTags;
      lastFetchTime = Date.now();
      set({ 
        tags: freshTags, 
        isInitialized: true, 
        isLoading: false, 
        error: null 
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addTag: async (name: string, color: string) => {
    try {
      set({ isLoading: true, error: null });
      const newTag = await createTag(name, color);
      
      // Update cache and state atomically
      if (cachedTags) {
        cachedTags = [...cachedTags, newTag];
        lastFetchTime = Date.now();
      }
      
      set((state) => ({ 
        tags: [...state.tags, newTag],
        isLoading: false
      }));
      return newTag;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error; // Re-throw to allow error handling in components
    }
  },

  updateTag: async (tagId: string, name: string, color: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Call the server action
      await updateTagAction(tagId, { name, color });
      
      // Update local state only after server update succeeds
      set((state) => ({
        tags: state.tags.map(tag => 
          tag.id === tagId ? { ...tag, name, color } : tag
        ),
        isLoading: false
      }));
      
      // Update cache to match
      if (cachedTags) {
        cachedTags = cachedTags.map(tag => 
          tag.id === tagId ? { ...tag, name, color } : tag
        );
        lastFetchTime = Date.now();
      }
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error; // Re-throw to allow components to handle the error
    }
  },

  deleteTag: async (tagId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // First try the normal delete
      try {
        await deleteTagAction(tagId);
      } catch (error) {
        console.log("Regular delete failed, trying force delete with cascade:", error);
        // If normal delete fails, try the force delete
        await forceDeleteTagWithCascade(tagId);
      }
      
      // Update the UI state
      set((state) => ({
        tags: state.tags.filter((tag) => tag.id !== tagId),
        isLoading: false
      }));
      
      // Update cache
      if (cachedTags) {
        cachedTags = cachedTags.filter(tag => tag.id !== tagId);
        lastFetchTime = Date.now();
      }
    } catch (error) {
      console.error('Error deleting tag:', error);
      
      // Force refresh to ensure UI is in sync with server
      await get().refreshTags();
      
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  }
}));