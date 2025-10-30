import { projectId } from './supabase/info';

export const checkServerHealth = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-05166478/health`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.log('Server health check failed (expected in development):', error.message);
    return false;
  }
};

export const testServerConnection = async () => {
  console.log('Testing server connection...');
  const isHealthy = await checkServerHealth();
  if (isHealthy) {
    console.log('✅ Server health status: OK');
  } else {
    console.log('⚠️ Server not available - Using demo mode with fallback data');
  }
  return isHealthy;
};