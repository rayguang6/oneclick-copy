import { createClient } from '@/app/utils/supabase/server';
import OpenAI from 'openai';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Downloads a video file from a URL
 */
async function downloadVideo(url: string): Promise<string> {
  const tempDir = path.join(process.cwd(), 'tmp');
  
  // Create temp directory if it doesn't exist
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  const videoPath = path.join(tempDir, `video-${Date.now()}.mp4`);
  
  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream',
    });

    const writer = fs.createWriteStream(videoPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(videoPath));
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('Error downloading video:', error);
    throw error;
  }
}

/**
 * Extracts audio from a video file
 */
async function extractAudio(videoPath: string): Promise<string> {
  const audioPath = videoPath.replace('.mp4', '.mp3');
  
  try {
    // Use ffmpeg to extract audio
    await execPromise(`ffmpeg -i "${videoPath}" -q:a 0 -map a "${audioPath}" -y`);
    return audioPath;
  } catch (error) {
    console.error('Error extracting audio:', error);
    throw error;
  }
}

/**
 * Transcribes audio using Whisper API
 */
async function transcribeAudio(audioPath: string): Promise<string> {
  try {
    const response = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: "whisper-1",
      response_format: "text",
    });
    
    return response.toString();
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  } finally {
    // Clean up the audio file
    try {
      fs.unlinkSync(audioPath);
    } catch (e) {
      console.error('Error deleting audio file:', e);
    }
  }
}

/**
 * Main function to process a video and get transcript
 */
export async function getWhisperTranscript(videoUrl: string): Promise<string> {
  try {
    // Download the video
    const videoPath = await downloadVideo(videoUrl);
    
    // Extract audio
    const audioPath = await extractAudio(videoPath);
    
    // Transcribe audio
    const transcript = await transcribeAudio(audioPath);
    
    // Clean up video file
    try {
      fs.unlinkSync(videoPath);
    } catch (e) {
      console.error('Error deleting video file:', e);
    }
    
    return transcript;
  } catch (error) {
    console.error('Error in whisper transcript process:', error);
    throw error;
  }
}