# Security System Documentation

## Overview
This application implements a comprehensive security system with environment-based controls for console logging and developer tools access.

## Features

### 🔧 Environment-Based Console Control
- **Development**: Full console access with detailed logging
- **Production**: Console disabled by default for security
- **Override**: Environment variables allow fine-tuned control

### 🛡️ Production Security Measures
- **Context Menu Blocking**: Prevents right-click access to developer tools
- **Keyboard Shortcut Blocking**: Disables F12, Ctrl+Shift+I, Ctrl+U, etc.
- **Text Selection Prevention**: Blocks text selection and drag/drop
- **DevTools Detection**: Monitors for developer tools usage
- **Source Viewing Prevention**: Blocks view source attempts

### 🎛️ Environment Variables

#### Console & Developer Tools
```env
# Console logging control
VITE_ENABLE_CONSOLE=true/false    # Force enable/disable console logs

# Developer tools access
VITE_ENABLE_DEV_TOOLS=true/false  # Force enable/disable dev tools

# Maximum security mode
VITE_STRICT_PRODUCTION=true/false # Enable all security measures

# Debug authentication flows
VITE_DEBUG_AUTH=true/false        # Show detailed auth logging
```

## Usage Examples

### Development Environment
```env
# .env.development
VITE_ENABLE_CONSOLE=true
VITE_ENABLE_DEV_TOOLS=true
VITE_STRICT_PRODUCTION=false
VITE_DEBUG_AUTH=true
```
**Result**: Full console access, all dev tools available, detailed logging

### Production Environment
```env
# .env.production
VITE_ENABLE_CONSOLE=false
VITE_ENABLE_DEV_TOOLS=false
VITE_STRICT_PRODUCTION=true
VITE_DEBUG_AUTH=false
```
**Result**: Console disabled, dev tools blocked, maximum security active

### Staging/Testing Environment
```env
# .env.staging
VITE_ENABLE_CONSOLE=true
VITE_ENABLE_DEV_TOOLS=true
VITE_STRICT_PRODUCTION=false
VITE_DEBUG_AUTH=false
```
**Result**: Console available for debugging, but auth logging minimal

## Security Features in Detail

### 1. Console Management
```typescript
// Secure logging methods
secureLog('Message');    // Respects VITE_ENABLE_CONSOLE
secureWarn('Warning');   // Logs only when allowed
secureError('Error');    // Always logs errors (configurable)
secureDebug('Debug');    // Development only
```

### 2. DevTools Detection
- **Window Size Monitoring**: Detects when dev tools open (changes window dimensions)
- **Console Timing**: Monitors console.log execution time (dev tools slow it down)
- **Periodic Checks**: Runs detection every second when security is active

### 3. Keyboard & Mouse Protection
```typescript
// Blocked shortcuts:
F12                    // Developer Tools
Ctrl+Shift+I          // Developer Tools  
Ctrl+Shift+J          // Console
Ctrl+Shift+C          // Element Inspector
Ctrl+U                // View Source
Right Click            // Context Menu
```

### 4. Emergency Access (Development)
```typescript
// Temporarily allow dev tools for authorized developers
ProductionSecurity.getInstance().allowDevTools(300000); // 5 minutes
```

## API Integration

### Enhanced Error Handling
```typescript
// API errors are categorized and logged appropriately
try {
  const data = await apiFetch('/api/endpoint');
} catch (error) {
  if (error instanceof ApiError) {
    // Expected errors (like 401) are handled silently in production
    // Unexpected errors are logged based on environment settings
  }
}
```

### Expected vs Unexpected Errors
- **Expected 401s**: Silent handling (auth/refresh, auth/me)
- **Unexpected 401s**: Logged with context
- **Server Errors (5xx)**: Always logged
- **Network Errors**: Development logging only

## Security Levels

### Level 1: Basic (Development Default)
- Console enabled
- Dev tools accessible
- No restrictions
- Full debugging available

### Level 2: Restricted (Staging)
- Console selectively enabled
- Dev tools accessible
- Minimal restrictions
- Limited debugging

### Level 3: Maximum (Production Default)
- Console disabled
- Dev tools blocked
- All restrictions active
- No debugging exposed

## Configuration Examples

### Quick Setup Commands

**Enable Development Mode:**
```bash
echo "VITE_ENABLE_CONSOLE=true" > .env.local
echo "VITE_ENABLE_DEV_TOOLS=true" >> .env.local
echo "VITE_DEBUG_AUTH=true" >> .env.local
```

**Enable Production Mode:**
```bash
echo "VITE_ENABLE_CONSOLE=false" > .env.local
echo "VITE_ENABLE_DEV_TOOLS=false" >> .env.local  
echo "VITE_STRICT_PRODUCTION=true" >> .env.local
```

**Reset to Environment Defaults:**
```bash
rm .env.local
```

## Troubleshooting

### Console Not Working
1. Check `VITE_ENABLE_CONSOLE` setting
2. Verify environment mode (dev vs prod)
3. Confirm security system initialization

### Dev Tools Blocked
1. Check `VITE_ENABLE_DEV_TOOLS` setting
2. Verify `VITE_STRICT_PRODUCTION` is false
3. Use emergency access method if needed

### Authentication Logging
1. Set `VITE_DEBUG_AUTH=true` in development
2. Check console for `[Auth]` prefixed messages
3. Verify development mode is active

## Best Practices

1. **Never enable console in production** unless absolutely necessary
2. **Always use strict security for public deployments**
3. **Test security measures in staging environment**
4. **Use emergency access sparingly and temporarily**
5. **Monitor for security bypass attempts**
6. **Keep environment files secure and not committed to repo**

## Migration Guide

### From Previous Version
1. Update API calls to use secure logging functions
2. Add security initialization to main.tsx
3. Configure environment variables
4. Test in both development and production modes

### Environment Variable Migration
```diff
# Old
- VITE_DEBUG_AUTH=true

# New
+ VITE_ENABLE_CONSOLE=true
+ VITE_ENABLE_DEV_TOOLS=true
+ VITE_STRICT_PRODUCTION=false
+ VITE_DEBUG_AUTH=true
```