// app/api/deepseek/route.ts
import { LLM_MAX_TOKENS } from '@/constants/constant';
import { NextResponse } from 'next/server';
export async function POST(request: Request) {
  const requestId = `req_${Math.random().toString(36).slice(2,7)}`;
  
  try {
    // Parse request
    const { prompt, systemPrompt, projectContext, stream = true } = await request.json();
    
    // Enhanced debugging logs
    console.log('===== DEEPSEEK API PAYLOAD =====');
    console.log('System Prompt:', systemPrompt || 'NOT PROVIDED');
    console.log('User Prompt:', prompt);
    console.log('Project Context:', JSON.stringify(projectContext, null, 2));
    console.log('===============================');
    
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Prepare the user prompt - keeping this extremely simple
    const userPrompt = projectContext 
      ? `Project: ${JSON.stringify(projectContext)}\n\n${prompt}`
      : prompt;

    // Call Deepseek API
    const apiKey = process.env.DEEPSEEK_API_KEY!;
    
    // If streaming is requested
    if (stream) {
      // Create a streaming response
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();
      
      // Create streaming response
      const streamResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'X-Request-ID': requestId
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: LLM_MAX_TOKENS,
          stream: true // Enable streaming
        })
      });

      if (!streamResponse.ok) {
        console.error(`[${requestId}] API error: ${streamResponse.status}`);
        return NextResponse.json({ error: 'API error' }, { status: streamResponse.status });
      }

      // Create a TransformStream to process the incoming stream
      const transformStream = new TransformStream({
        async transform(chunk, controller) {
          try {
            const decoded = decoder.decode(chunk);
            
            // Each line of the SSE stream starts with "data: "
            const lines = decoded.split('\n').filter(line => line.trim() !== '');
            
            for (const line of lines) {
              // Skip non-data lines and "[DONE]" messages
              if (!line.startsWith('data:')) continue;
              
              const data = line.slice(5); // remove "data: " prefix
              if (data.trim() === '[DONE]') continue;
              
              try {
                const parsedData = JSON.parse(data);
                const content = parsedData.choices[0]?.delta?.content || '';
                if (content) {
                  // Send the content chunk
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                }
              } catch (e) {
                console.error('Error parsing SSE data:', e);
              }
            }
          } catch (error) {
            console.error('Error in transform stream:', error);
            controller.error(error);
          }
        }
      });

      // Pipe the response from Deepseek through our transform stream
      const body = streamResponse.body;
      if (!body) {
        return NextResponse.json({ error: 'No response body from API' }, { status: 500 });
      }

      const reader = body.getReader();
      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) {
                controller.close();
                break;
              }
              controller.enqueue(value);
            }
          } catch (error) {
            controller.error(error);
          }
        }
      });

      const responseStream = readableStream.pipeThrough(transformStream);

      console.log('responseStream', responseStream);
      
      
      return new Response(responseStream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        }
      });
    } else {
      // Non-streaming request (original behavior)
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'X-Request-ID': requestId
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: LLM_MAX_TOKENS 
        })
      });

      if (!response.ok) {
        console.error(`[${requestId}] API error: ${response.status}`);
        return NextResponse.json({ error: 'API error' }, { status: response.status });
      }

      const data = await response.json();
      return NextResponse.json({ output: data.choices[0].message.content });
    }
  } catch (err: any) {
    console.error(`[${requestId}] Error:`, err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}