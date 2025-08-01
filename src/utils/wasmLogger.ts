/**
 * WASM API Logging Utilities
 * 
 * This module provides logging utilities for debugging WASM API calls
 */

interface LogEntry {
  timestamp: string;
  method: string;
  inputs: any;
  outputs?: any;
  error?: any;
  duration?: number;
}

const logHistory: LogEntry[] = [];

/**
 * Create a logged version of any async function
 */
export function logApiCall<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  methodName: string
): T {
  return (async (...args: any[]) => {
    const startTime = performance.now();
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      method: methodName,
      inputs: args
    };

    console.log(`🔧 [WASM] Calling ${methodName}`, {
      inputs: args,
      timestamp: entry.timestamp
    });

    try {
      const result = await fn(...args);
      const duration = performance.now() - startTime;
      
      entry.outputs = result;
      entry.duration = duration;
      
      console.log(`✅ [WASM] ${methodName} completed`, {
        outputs: result,
        duration: `${duration.toFixed(2)}ms`,
        timestamp: entry.timestamp
      });
      
      logHistory.push(entry);
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      entry.error = error;
      entry.duration = duration;
      
      console.error(`❌ [WASM] ${methodName} failed`, {
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack
        } : error,
        duration: `${duration.toFixed(2)}ms`,
        timestamp: entry.timestamp,
        inputs: args
      });
      
      logHistory.push(entry);
      throw error;
    }
  }) as T;
}

/**
 * Create a logged version of any sync function
 */
export function logSyncCall<T extends (...args: any[]) => any>(
  fn: T,
  methodName: string
): T {
  return ((...args: any[]) => {
    const startTime = performance.now();
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      method: methodName,
      inputs: args
    };

    console.log(`🔧 [WASM] Calling ${methodName}`, {
      inputs: args,
      timestamp: entry.timestamp
    });

    try {
      const result = fn(...args);
      const duration = performance.now() - startTime;
      
      entry.outputs = result;
      entry.duration = duration;
      
      console.log(`✅ [WASM] ${methodName} completed`, {
        outputs: result,
        duration: `${duration.toFixed(2)}ms`,
        timestamp: entry.timestamp
      });
      
      logHistory.push(entry);
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      entry.error = error;
      entry.duration = duration;
      
      console.error(`❌ [WASM] ${methodName} failed`, {
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack
        } : error,
        duration: `${duration.toFixed(2)}ms`,
        timestamp: entry.timestamp,
        inputs: args
      });
      
      logHistory.push(entry);
      throw error;
    }
  }) as T;
}

/**
 * Get the complete log history
 */
export function getLogHistory(): LogEntry[] {
  return [...logHistory];
}

/**
 * Clear the log history
 */
export function clearLogHistory(): void {
  logHistory.length = 0;
  console.log('🗑️ [WASM] Log history cleared');
}

/**
 * Export logs as JSON for debugging
 */
export function exportLogs(): string {
  const exportData = {
    exported: new Date().toISOString(),
    totalEntries: logHistory.length,
    logs: logHistory
  };
  
  console.log('📤 [WASM] Exporting logs:', exportData);
  return JSON.stringify(exportData, null, 2);
}

/**
 * Log basic information about the current session
 */
export function logSessionInfo(): void {
  console.log('ℹ️ [WASM] Session Info:', {
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    logHistorySize: logHistory.length,
    wasmSupported: typeof WebAssembly !== 'undefined',
    location: window.location.href
  });
}

// Initialize session logging
if (typeof window !== 'undefined') {
  logSessionInfo();
}