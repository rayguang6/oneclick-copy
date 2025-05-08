import { createClient } from '../../../../app/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

type UserCredential = {
  email: string;
  password: string;
}

type SignupResult = {
  success: boolean;
  email: string;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const users: UserCredential[] = await request.json();
    
    // Validate input
    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { error: 'Request body must be a non-empty array of users with email and password' },
        { status: 400 }
      );
    }

    // Validate each user has email and password
    for (const user of users) {
      if (!user.email || !user.password) {
        return NextResponse.json(
          { error: 'Each user must have an email and password' },
          { status: 400 }
        );
      }
    }

    // Create Supabase client
    const supabase = await createClient();
    const results: SignupResult[] = [];

    // Process each user
    for (const user of users) {
      try {
        const { error } = await supabase.auth.signUp({
          email: user.email,
          password: user.password,
        });

        if (error) {
          results.push({
            success: false,
            email: user.email,
            error: error.message
          });
        } else {
          results.push({
            success: true,
            email: user.email
          });
        }
      } catch (error) {
        results.push({
          success: false,
          email: user.email,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Generate summary stats
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    // Return the results
    return NextResponse.json({
      total: results.length,
      successful,
      failed,
      results
    });
    
  } catch (error) {
    console.error('Error processing bulk signup:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}