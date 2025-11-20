/**
 * Load ElevenLabs script globally (once per session)
 * This ensures the script is ready before any chatbot widget needs it
 */

let scriptLoaded = false;
let scriptLoading = false;
let loadPromise: Promise<void> | null = null;

export const loadElevenLabsScript = (): Promise<void> => {
  // If already loaded, return resolved promise
  if (scriptLoaded) {
    return Promise.resolve();
  }

  // If currently loading, return the existing promise
  if (scriptLoading && loadPromise) {
    return loadPromise;
  }

  // Start loading
  scriptLoading = true;
  loadPromise = new Promise((resolve, reject) => {
    // Check if script already exists in DOM
    const existingScript = document.querySelector('script[src*="convai-widget-embed"]');
    if (existingScript) {
      scriptLoaded = true;
      scriptLoading = false;
      resolve();
      return;
    }

    // Create and load script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed@latest/dist/index.js';
    script.async = true;
    script.type = 'text/javascript';

    script.onload = () => {
      scriptLoaded = true;
      scriptLoading = false;
      console.log('✅ ElevenLabs script loaded globally');
      resolve();
    };

    script.onerror = () => {
      scriptLoading = false;
      loadPromise = null;
      reject(new Error('Failed to load ElevenLabs script'));
    };

    document.body.appendChild(script);
  });

  return loadPromise;
};


