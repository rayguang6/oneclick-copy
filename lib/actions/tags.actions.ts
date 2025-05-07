'use server';

import { createClient } from '@/app/utils/supabase/server';
import { getLoggedInUser } from './auth.actions';
import { Tag } from '@/app/types/global';

interface AdTagJoinResponse {
  id: string;
  ad_id: string;
  tag_id: string;
  tags: Tag;
}

/**
 * Get all tags ordered by name for the current user
 */
export async function getAllTags(): Promise<Tag[]> {
  const supabase = await createClient();
  const user = await getLoggedInUser();
  
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('user_id', user.id)
    .order('name');
  
  if (error) {
    console.error('Error fetching all tags:', error);
    throw error;
  }
  return data || [];
}

/**
 * Get all tags for a specific ad
 */
export async function getTagsForAd(adId: string, userId: string): Promise<Tag[]> {
  const supabase = await createClient();
  const fallbackuser = await getLoggedInUser();

  const userID = userId || fallbackuser.id;
  
  // First verify the ad exists and belongs to the user
  const { data: adData, error: adError } = await supabase
    .from('facebook_ads')
    .select('id')
    .eq('id', adId)
    .eq('user_id', userID )
    .single();

  if (adError) {
    console.error('Error verifying ad ownership:', adError);
    throw adError;
  }

  if (!adData) {
    console.error('Ad not found or no access:', adId);
    return [];
  }

  // Then fetch the tags
  const { data, error } = await supabase
    .from('ad_tags')
    .select(`
      id,
      ad_id,
      tag_id,
      tags (
        id,
        name,
        color,
        created_at
      )
    `)
    .eq('ad_id', adId);
  
  if (error) {
    console.error('Error fetching tags for ad:', error);
    throw error;
  }

  const joinedData = data as unknown as AdTagJoinResponse[];
  const tags = joinedData?.map(item => item.tags).filter(Boolean) || [];
  return tags;
}

/**
 * Get all tags for a specific ad with support for admin user override
 * This version allows fetching tags for ads not owned by the current user
 */
export async function getTagsForAdWithOwner(adId: string, ownerId: string): Promise<Tag[]> {
  const supabase = await createClient();
  
  // First verify the ad exists and belongs to the specified owner
  const { data: adData, error: adError } = await supabase
    .from('facebook_ads')
    .select('id')
    .eq('id', adId)
    .eq('user_id', ownerId)
    .single();

  if (adError) {
    console.error('Error verifying ad ownership:', adError);
    throw adError;
  }

  if (!adData) {
    console.error('Ad not found or no access:', adId);
    return [];
  }

  // Then fetch the tags
  const { data, error } = await supabase
    .from('ad_tags')
    .select(`
      id,
      ad_id,
      tag_id,
      tags (
        id,
        name,
        color,
        created_at
      )
    `)
    .eq('ad_id', adId);
  
  if (error) {
    console.error('Error fetching tags for ad:', error);
    throw error;
  }

  const joinedData = data as unknown as AdTagJoinResponse[];
  const tags = joinedData?.map(item => item.tags).filter(Boolean) || [];
  return tags;
}

/**
 * Create a new tag
 */
export async function createTag(name: string, color: string): Promise<Tag> {
  const supabase = await createClient();
  const user = await getLoggedInUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  // Normalize the tag name (trim and check for duplicates)
  const normalizedName = name.trim();
  
  // Check for existing tag with the same name
  const { data: existingTag, error: checkError } = await supabase
    .from('tags')
    .select('id')
    .eq('user_id', user.id)
    .ilike('name', normalizedName)
    .maybeSingle();
    
  if (checkError) {
    console.error('Error checking for existing tag:', checkError);
    throw checkError;
  }
  
  if (existingTag) {
    throw new Error('A tag with this name already exists');
  }
  
  // Create new tag
  const { data, error } = await supabase
    .from('tags')
    .insert([{ name: normalizedName, color, user_id: user.id }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating tag:', error);
    throw error;
  }
  
  return data;
}

/**
 * Update an existing tag
 */
export async function updateTag(id: string, updates: Partial<Tag>): Promise<void> {
  const supabase = await createClient();
  const user = await getLoggedInUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  // If name is being updated, check for duplicates
  if (updates.name) {
    const normalizedName = updates.name.trim();
    
    // Check for existing tag with the same name (excluding this tag)
    const { data: existingTag, error: checkError } = await supabase
      .from('tags')
      .select('id')
      .eq('user_id', user.id)
      .not('id', 'eq', id)
      .ilike('name', normalizedName)
      .maybeSingle();
      
    if (checkError) {
      console.error('Error checking for existing tag:', checkError);
      throw checkError;
    }
    
    if (existingTag) {
      throw new Error('A tag with this name already exists');
    }
    
    // Update the normalized name
    updates.name = normalizedName;
  }
  
  const { error } = await supabase
    .from('tags')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id);
  
  if (error) {
    console.error('Error updating tag:', error);
    throw error;
  }
}

/**
 * Delete a tag
 */
export async function deleteTag(id: string): Promise<void> {
  const supabase = await createClient();
  const user = await getLoggedInUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  try {
    // Start a transaction using RPC if available, or do it manually
    
    // Step 1: Verify the tag belongs to the user
    const { data: tagData, error: tagError } = await supabase
      .from('tags')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
      
    if (tagError || !tagData) {
      throw new Error('Tag not found or no access');
    }
    
    // Step 2: Delete all ad_tags relations
    const { error: adTagsError } = await supabase
      .from('ad_tags')
      .delete()
      .eq('tag_id', id);
    
    if (adTagsError) {
      console.error('Error deleting tag relations:', adTagsError);
      throw adTagsError;
    }
    
    // Step 3: Delete the tag itself
    const { error: deleteError } = await supabase
      .from('tags')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
      
    if (deleteError) {
      console.error('Error deleting tag:', deleteError);
      throw deleteError;
    }
  } catch (error) {
    console.error('Error in deleteTag:', error);
    throw error;
  }
}

/**
 * Force delete a tag with manual cascade - used as a fallback
 */
export async function forceDeleteTagWithCascade(id: string): Promise<void> {
  console.log(`Attempting to force delete tag with ID: ${id}`);
  const supabase = await createClient();
  const user = await getLoggedInUser();
  
  if (!user) {
    console.error('Delete tag failed: No user found');
    throw new Error('Authentication required');
  }
  
  // Execute direct deletion with manual cascading
  try {
    // First verify ownership
    const { data: tagCheck, error: tagCheckError } = await supabase
      .from('tags')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();
      
    if (tagCheckError || !tagCheck) {
      console.error('Error verifying tag ownership:', tagCheckError);
      throw new Error('Tag not found or no access');
    }
    
    // Step 1: Delete all ad_tags relationships first
    console.log(`Deleting all ad_tags for tag ${id}`);
    const { error: adTagsError } = await supabase
      .from('ad_tags')
      .delete()
      .eq('tag_id', id);
    
    if (adTagsError) {
      console.error('Error deleting tag relations:', adTagsError);
      throw adTagsError;
    }
    console.log('Successfully deleted all ad_tags relationships');
    
    // Step 2: Delete the tag itself
    console.log(`Deleting tag ${id}`);
    const { error: tagError } = await supabase
      .from('tags')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
      
    if (tagError) {
      console.error('Error deleting tag:', tagError);
      throw tagError;
    }
    
    console.log('Tag deleted with manual cascade');
  } catch (error) {
    console.error('Failed to force delete tag:', error);
    throw error;
  }
  
  // Verify tag was actually deleted
  const { data: verifyData, error: verifyError } = await supabase
    .from('tags')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id);
  
  if (verifyError) {
    console.error('Error verifying tag deletion:', verifyError);
  } else {
    console.log(`Verification result: tag ${id} ${verifyData?.length ? 'still exists' : 'successfully deleted'}`);
    if (verifyData && verifyData.length > 0) {
      console.warn('WARNING: Tag still exists in database after force deletion attempt!');
      throw new Error('Tag could not be deleted from the database');
    } else {
      console.log('Tag force-deleted successfully and verified');
    }
  }
}

/**
 * Add a tag to an ad
 */
export async function tagAd(adId: string, tagId: string): Promise<void> {
  const supabase = await createClient();
  const user = await getLoggedInUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  // First verify the ad exists and belongs to the user
  const { data: adData, error: adError } = await supabase
    .from('facebook_ads')
    .select('id')
    .eq('id', adId)
    .eq('user_id', user.id)
    .single();

  if (adError || !adData) {
    console.error('Error verifying ad ownership:', adError);
    throw new Error('Cannot tag ad: no access or ad not found');
  }

  // Verify tag belongs to user
  const { data: tagData, error: tagError } = await supabase
    .from('tags')
    .select('id')
    .eq('id', tagId)
    .eq('user_id', user.id)
    .single();

  if (tagError || !tagData) {
    throw new Error('Tag not found or no access');
  }

  // Check if the tag is already applied to avoid duplicates
  const { data: existingTag, error: checkError } = await supabase
    .from('ad_tags')
    .select('id')
    .eq('ad_id', adId)
    .eq('tag_id', tagId)
    .maybeSingle();
    
  if (checkError) {
    console.error('Error checking for existing tag relation:', checkError);
    throw checkError;
  }
  
  // If tag already exists, we're done
  if (existingTag) {
    return;
  }

  // Create the tag relationship
  const { error } = await supabase
    .from('ad_tags')
    .insert([{ ad_id: adId, tag_id: tagId }]);
  
  if (error) {
    console.error('Error tagging ad:', error);
    throw error;
  }
}

/**
 * Remove a tag from an ad
 */
export async function untagAd(adId: string, tagId: string): Promise<void> {
  const supabase = await createClient();
  const user = await getLoggedInUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  // Verify ownership of both ad and tag before untagging
  const { data: adData, error: adError } = await supabase
    .from('facebook_ads')
    .select('id')
    .eq('id', adId)
    .eq('user_id', user.id)
    .single();

  if (adError || !adData) {
    throw new Error('Ad not found or no access');
  }

  const { data: tagData, error: tagError } = await supabase
    .from('tags')
    .select('id')
    .eq('id', tagId)
    .eq('user_id', user.id)
    .single();

  if (tagError || !tagData) {
    throw new Error('Tag not found or no access');
  }

  const { error } = await supabase
    .from('ad_tags')
    .delete()
    .match({ ad_id: adId, tag_id: tagId });
  
  if (error) {
    console.error('Error removing tag from ad:', error);
    throw error;
  }
}

/**
 * Get all ad IDs that have a specific tag
 */
export async function getAdsByTag(tagId: string): Promise<string[]> {
  const supabase = await createClient();
  const user = await getLoggedInUser();
  
  if (!user) {
    console.error('No user found');
    return [];
  }
  
  // First verify tag belongs to user
  const { data: tagData, error: tagError } = await supabase
    .from('tags')
    .select('id')
    .eq('id', tagId)
    .eq('user_id', user.id)
    .single();

  if (tagError || !tagData) {
    console.error('Error verifying tag ownership:', tagError);
    return [];
  }
  
  try {
    // Get all ads with this tag
    const { data, error } = await supabase
      .from('ad_tags')
      .select('ad_id')
      .eq('tag_id', tagId);
    
    if (error) {
      console.error('Error fetching ads by tag:', error);
      return [];
    }
    
    // Make sure we're returning valid UUID strings
    return (data || []).map(item => item.ad_id as string).filter(Boolean);
  } catch (error) {
    console.error('Error in getAdsByTag:', error);
    return [];
  }
}

/**
 * Get all tags for a specific user ID
 * This is used for showing admin user tags in the tag selector
 */
export async function getTagsForUser(userId: string): Promise<Tag[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('user_id', userId)
    .order('name');
  
  if (error) {
    console.error('Error fetching tags for user:', error);
    throw error;
  }
  return data || [];
}