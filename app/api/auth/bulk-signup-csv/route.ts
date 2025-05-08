import { createClient } from '../../../../app/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';

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
    // Get form data from the request
    const formData = await request.formData();
    
    // Get the file from form data
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json(
        { error: 'No CSV file uploaded. Please upload a file with the key "file".' },
        { status: 400 }
      );
    }

    // Check file type (optional validation)
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { error: 'Uploaded file must be a CSV file.' },
        { status: 400 }
      );
    }

    // Read the file content
    const fileContent = await file.text();
    
    // Parse CSV content
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });

    // Map CSV records to user credentials
    const users: UserCredential[] = records.map((record: any) => ({
      email: record.email,
      password: record.password
    }));

    // Validate users have required fields
    for (const user of users) {
      if (!user.email || !user.password) {
        return NextResponse.json(
          { error: 'CSV must have "email" and "password" columns, and all rows must have values for these columns.' },
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
    console.error('Error processing bulk signup from CSV:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 