// Analytics utilities for production
class Analytics {
  constructor() {
    this.isEnabled = process.env.NODE_ENV === 'production';
    this.events = [];
    this.sessionId = this.generateSessionId();
    this.userId = null;
  }

  // Generate unique session ID
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Set user ID for tracking
  setUserId(userId) {
    this.userId = userId;
  }

  // Track page views
  trackPageView(pageName, pagePath) {
    if (!this.isEnabled) return;
    
    const event = {
      type: 'page_view',
      pageName,
      pagePath,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId,
      url: window.location.href,
      referrer: document.referrer,
    };
    
    this.events.push(event);
    this.logEvent('Page View', pageName);
  }

  // Track user actions
  trackAction(action, category = 'User Action', label = null, value = null) {
    if (!this.isEnabled) return;
    
    const event = {
      type: 'action',
      action,
      category,
      label,
      value,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId,
      url: window.location.href,
    };
    
    this.events.push(event);
    this.logEvent(action, category, label);
  }

  // Track todo operations
  trackTodoOperation(operation, todoId, metadata = {}) {
    if (!this.isEnabled) return;
    
    const event = {
      type: 'todo_operation',
      operation, // 'create', 'update', 'delete', 'complete', 'incomplete'
      todoId,
      metadata,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId,
    };
    
    this.events.push(event);
    this.logEvent('Todo Operation', operation, todoId);
  }

  // Track authentication events
  trackAuthEvent(event, method = 'email', success = true, error = null) {
    if (!this.isEnabled) return;
    
    const authEvent = {
      type: 'auth_event',
      event, // 'login', 'logout', 'signup', 'password_reset'
      method,
      success,
      error: error?.message || null,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId,
    };
    
    this.events.push(authEvent);
    this.logEvent('Auth Event', event, method, success);
  }

  // Track theme changes
  trackThemeChange(theme) {
    if (!this.isEnabled) return;
    
    const event = {
      type: 'theme_change',
      theme,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId,
    };
    
    this.events.push(event);
    this.logEvent('Theme Change', theme);
  }

  // Track performance metrics
  trackPerformance(metric, value, unit = 'ms') {
    if (!this.isEnabled) return;
    
    const event = {
      type: 'performance',
      metric,
      value,
      unit,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId,
    };
    
    this.events.push(event);
    this.logEvent('Performance', metric, `${value}${unit}`);
  }

  // Track errors
  trackError(error, context = {}) {
    if (!this.isEnabled) return;
    
    const errorEvent = {
      type: 'error',
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name,
      },
      context,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId,
      url: window.location.href,
    };
    
    this.events.push(errorEvent);
    this.logEvent('Error', error.message, context);
  }

  // Track user engagement
  trackEngagement(action, duration = null, metadata = {}) {
    if (!this.isEnabled) return;
    
    const event = {
      type: 'engagement',
      action,
      duration,
      metadata,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId,
    };
    
    this.events.push(event);
    this.logEvent('Engagement', action, duration ? `${duration}ms` : null);
  }

  // Track feature usage
  trackFeatureUsage(feature, action, metadata = {}) {
    if (!this.isEnabled) return;
    
    const event = {
      type: 'feature_usage',
      feature,
      action,
      metadata,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId,
    };
    
    this.events.push(event);
    this.logEvent('Feature Usage', feature, action);
  }

  // Log event to console in development
  logEvent(action, category, label, value) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] ${action}${category ? ` - ${category}` : ''}${label ? ` - ${label}` : ''}${value ? ` - ${value}` : ''}`);
    }
  }

  // Get analytics summary
  getSummary() {
    const summary = {
      sessionId: this.sessionId,
      userId: this.userId,
      totalEvents: this.events.length,
      eventTypes: this.getEventTypeCounts(),
      sessionDuration: this.getSessionDuration(),
      timestamp: new Date().toISOString(),
    };
    
    return summary;
  }

  // Get event type counts
  getEventTypeCounts() {
    const counts = {};
    this.events.forEach(event => {
      counts[event.type] = (counts[event.type] || 0) + 1;
    });
    return counts;
  }

  // Get session duration
  getSessionDuration() {
    if (this.events.length === 0) return 0;
    
    const firstEvent = this.events[0];
    const lastEvent = this.events[this.events.length - 1];
    
    return new Date(lastEvent.timestamp) - new Date(firstEvent.timestamp);
  }

  // Export events for external analytics services
  exportEvents() {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      events: this.events,
      summary: this.getSummary(),
    };
  }

  // Clear all events
  clear() {
    this.events = [];
  }

  // Send events to external service (implement based on your analytics provider)
  async sendToExternalService() {
    if (!this.isEnabled || this.events.length === 0) return;
    
    try {
      // Example: Send to Google Analytics, Mixpanel, etc.
      // const response = await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(this.exportEvents()),
      // });
      
      console.log('Analytics data sent to external service');
      this.clear(); // Clear after successful send
    } catch (error) {
      console.error('Failed to send analytics data:', error);
    }
  }
}

// Create singleton instance
export const analytics = new Analytics();

// React hook for analytics
export const useAnalytics = () => {
  return {
    trackPageView: (pageName, pagePath) => analytics.trackPageView(pageName, pagePath),
    trackAction: (action, category, label, value) => analytics.trackAction(action, category, label, value),
    trackTodoOperation: (operation, todoId, metadata) => analytics.trackTodoOperation(operation, todoId, metadata),
    trackAuthEvent: (event, method, success, error) => analytics.trackAuthEvent(event, method, success, error),
    trackThemeChange: (theme) => analytics.trackThemeChange(theme),
    trackError: (error, context) => analytics.trackError(error, context),
    trackEngagement: (action, duration, metadata) => analytics.trackEngagement(action, duration, metadata),
    trackFeatureUsage: (feature, action, metadata) => analytics.trackFeatureUsage(feature, action, metadata),
  };
};

// Utility functions
export const trackPageView = (pageName, pagePath) => analytics.trackPageView(pageName, pagePath);
export const trackAction = (action, category, label, value) => analytics.trackAction(action, category, label, value);
export const trackTodoOperation = (operation, todoId, metadata) => analytics.trackTodoOperation(operation, todoId, metadata);
export const trackAuthEvent = (event, method, success, error) => analytics.trackAuthEvent(event, method, success, error);
export const trackThemeChange = (theme) => analytics.trackThemeChange(theme);
export const trackError = (error, context) => analytics.trackError(error, context);

export default analytics;
