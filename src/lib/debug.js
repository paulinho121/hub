export const logDebug = (context, message, data = null) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${context}] ${message}`;
  
  if (data) {
    console.log(logMessage, data);
  } else {
    console.log(logMessage);
  }

  // Store in window for console access during runtime debugging
  if (typeof window !== 'undefined') {
    if (!window._debugLogs) window._debugLogs = [];
    window._debugLogs.push({ timestamp, context, message, data });
  }
};