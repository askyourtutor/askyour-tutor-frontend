// Production Security & Console Management
// Provides environment-based security controls and console management

export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// Environment flags
export const ENABLE_CONSOLE_LOGS = import.meta.env.VITE_ENABLE_CONSOLE === 'true' || isDevelopment;
export const ENABLE_DEV_TOOLS = import.meta.env.VITE_ENABLE_DEV_TOOLS === 'true' || isDevelopment;
export const STRICT_PRODUCTION = import.meta.env.VITE_STRICT_PRODUCTION === 'true';

// Console management
class ConsoleManager {
  private originalConsole: Console;

  constructor() {
    this.originalConsole = { ...console };
    this.initializeConsole();
  }

  private initializeConsole() {
    if (!ENABLE_CONSOLE_LOGS && isProduction) {
      // Disable all console methods in production
      console.log = () => {};
      console.warn = () => {};
      console.error = () => {};
      console.info = () => {};
      console.debug = () => {};
      console.trace = () => {};
      console.group = () => {};
      console.groupEnd = () => {};
      console.table = () => {};
      console.time = () => {};
      console.timeEnd = () => {};
      console.count = () => {};
      console.clear = () => {};
    }
  }

  // Safe logging methods that respect environment settings
  public safeLog(...args: unknown[]) {
    if (ENABLE_CONSOLE_LOGS) {
      this.originalConsole.log(...args);
    }
  }

  public safeWarn(...args: unknown[]) {
    if (ENABLE_CONSOLE_LOGS) {
      this.originalConsole.warn(...args);
    }
  }

  public safeError(...args: unknown[]) {
    if (ENABLE_CONSOLE_LOGS) {
      this.originalConsole.error(...args);
    }
  }

  public safeDebug(...args: unknown[]) {
    if (ENABLE_CONSOLE_LOGS && isDevelopment) {
      this.originalConsole.debug(...args);
    }
  }
}

export const consoleManager = new ConsoleManager();

// Production security measures
export class ProductionSecurity {
  private static instance: ProductionSecurity;
  private devToolsDetected = false;

  constructor() {
    if (isProduction && STRICT_PRODUCTION) {
      this.initializeSecurityMeasures();
    }
  }

  public static getInstance(): ProductionSecurity {
    if (!ProductionSecurity.instance) {
      ProductionSecurity.instance = new ProductionSecurity();
    }
    return ProductionSecurity.instance;
  }

  private initializeSecurityMeasures() {
    this.disableContextMenu();
    this.disableKeyboardShortcuts();
    this.disableTextSelection();
    this.disableDragAndDrop();
    this.detectDevTools();
    this.disableF12();
    this.preventSourceViewing();
  }

  private disableContextMenu() {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      return false;
    });
  }

  private disableKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+Shift+C
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    });
  }

  private disableTextSelection() {
    document.addEventListener('selectstart', (e) => {
      e.preventDefault();
      return false;
    });

    document.addEventListener('dragstart', (e) => {
      e.preventDefault();
      return false;
    });
  }

  private disableDragAndDrop() {
    document.addEventListener('drop', (e) => {
      e.preventDefault();
      return false;
    });

    document.addEventListener('dragover', (e) => {
      e.preventDefault();
      return false;
    });
  }

  private disableF12() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'F12') {
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
        return false;
      }
    });
  }

  private preventSourceViewing() {
    // Prevent viewing page source
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        return false;
      }
    });
  }

  private detectDevTools() {
    // DevTools detection using various methods
    let devtools = false;

    // Method 1: Console detection
    const devToolsChecker = () => {
      if (!devtools) {
        const threshold = 160;
        if (
          window.outerHeight - window.innerHeight > threshold ||
          window.outerWidth - window.innerWidth > threshold
        ) {
          devtools = true;
          this.onDevToolsDetected();
        }
      }
    };

    // Method 2: Console.log timing
    const consoleChecker = () => {
      const start = performance.now();
      console.log('%c', '');
      const end = performance.now();
      if (end - start > 100) {
        devtools = true;
        this.onDevToolsDetected();
      }
    };

    // Run checks periodically
    if (!this.devToolsDetected) {
      setInterval(() => {
        devToolsChecker();
        consoleChecker();
      }, 1000);
    }
  }

  private onDevToolsDetected() {
    if (!this.devToolsDetected) {
      this.devToolsDetected = true;
      // Just mark as detected, don't show blocking message
      // All the security restrictions are still active
    }
  }

  // Method to temporarily allow dev tools (for authorized developers)
  public allowDevTools(duration: number = 300000) { // 5 minutes default
    if (isDevelopment) {
      this.devToolsDetected = false;
      setTimeout(() => {
        this.devToolsDetected = false;
      }, duration);
    }
  }
}

// Initialize security in production
if (isProduction && STRICT_PRODUCTION) {
  ProductionSecurity.getInstance();
}

// Export utilities
export const secureLog = consoleManager.safeLog.bind(consoleManager);
export const secureWarn = consoleManager.safeWarn.bind(consoleManager);
export const secureError = consoleManager.safeError.bind(consoleManager);
export const secureDebug = consoleManager.safeDebug.bind(consoleManager);