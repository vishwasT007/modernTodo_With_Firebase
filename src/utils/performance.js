// Performance monitoring utilities for production
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = new Map();
    this.isEnabled = process.env.NODE_ENV === 'production';
  }

  // Start timing a performance metric
  startTiming(name) {
    if (!this.isEnabled) return;
    
    this.metrics.set(name, {
      startTime: performance.now(),
      endTime: null,
      duration: null,
    });
  }

  // End timing a performance metric
  endTiming(name) {
    if (!this.isEnabled) return;
    
    const metric = this.metrics.get(name);
    if (!metric) return;
    
    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;
    
    // Log slow operations
    if (metric.duration > 1000) {
      console.warn(`Slow operation detected: ${name} took ${metric.duration.toFixed(2)}ms`);
    }
    
    return metric.duration;
  }

  // Measure component render time
  measureRender(componentName, renderFunction) {
    if (!this.isEnabled) return renderFunction();
    
    this.startTiming(`render_${componentName}`);
    const result = renderFunction();
    this.endTiming(`render_${componentName}`);
    return result;
  }

  // Measure async operations
  async measureAsync(name, asyncFunction) {
    if (!this.isEnabled) return await asyncFunction();
    
    this.startTiming(name);
    try {
      const result = await asyncFunction();
      this.endTiming(name);
      return result;
    } catch (error) {
      this.endTiming(name);
      throw error;
    }
  }

  // Monitor memory usage
  monitorMemory() {
    if (!this.isEnabled || !performance.memory) return;
    
    const memory = performance.memory;
    const memoryUsage = {
      used: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
      total: Math.round(memory.totalJSHeapSize / 1024 / 1024), // MB
      limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024), // MB
    };
    
    // Warn if memory usage is high
    if (memoryUsage.used / memoryUsage.limit > 0.8) {
      console.warn('High memory usage detected:', memoryUsage);
    }
    
    return memoryUsage;
  }

  // Monitor network performance
  monitorNetwork() {
    if (!this.isEnabled || !navigator.connection) return;
    
    const connection = navigator.connection;
    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData,
    };
  }

  // Get performance summary
  getSummary() {
    const summary = {
      metrics: Object.fromEntries(this.metrics),
      memory: this.monitorMemory(),
      network: this.monitorNetwork(),
      timestamp: new Date().toISOString(),
    };
    
    return summary;
  }

  // Clear all metrics
  clear() {
    this.metrics.clear();
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export const usePerformanceMonitor = (componentName) => {
  const startRender = () => performanceMonitor.startTiming(`render_${componentName}`);
  const endRender = () => performanceMonitor.endTiming(`render_${componentName}`);
  
  return { startRender, endRender };
};

// Utility functions
export const measureAsync = (name, fn) => performanceMonitor.measureAsync(name, fn);
export const measureRender = (name, fn) => performanceMonitor.measureRender(name, fn);
export const startTiming = (name) => performanceMonitor.startTiming(name);
export const endTiming = (name) => performanceMonitor.endTiming(name);

// Web Vitals monitoring
export const measureWebVitals = () => {
  if (!this.isEnabled) return;
  
  // Measure Largest Contentful Paint (LCP)
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log('LCP:', lastEntry.startTime);
  }).observe({ entryTypes: ['largest-contentful-paint'] });

  // Measure First Input Delay (FID)
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      console.log('FID:', entry.processingStart - entry.startTime);
    });
  }).observe({ entryTypes: ['first-input'] });

  // Measure Cumulative Layout Shift (CLS)
  let clsValue = 0;
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    });
    console.log('CLS:', clsValue);
  }).observe({ entryTypes: ['layout-shift'] });
};

export default performanceMonitor;
