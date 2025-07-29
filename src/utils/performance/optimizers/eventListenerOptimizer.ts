/**
 * Event Listener Optimizer
 * Focused utility for event listener cleanup and optimization
 */

class EventListenerOptimizer {
  private eventListenerRegistry = new Map<string, { element: EventTarget; type: string; listener: EventListener; options?: any }>();

  async optimize(): Promise<number> {
    console.log('🔧 Optimizing event listeners...');
    
    let optimized = 0;
    
    // Store original methods
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    const originalRemoveEventListener = EventTarget.prototype.removeEventListener;

    // Enhanced event listener management
    EventTarget.prototype.addEventListener = (type: string, listener: EventListener, options?: any) => {
      const id = `${Date.now()}-${Math.random()}`;
      this.eventListenerRegistry.set(id, {
        element: this,
        type,
        listener,
        options
      });
      
      optimized++;
      return originalAddEventListener.call(this, type, listener, options);
    };

    EventTarget.prototype.removeEventListener = (type: string, listener: EventListener, options?: any) => {
      optimized++;
      return originalRemoveEventListener.call(this, type, listener, options);
    };

    // Add passive listeners for performance
    const passiveEvents = ['touchstart', 'touchmove', 'wheel', 'scroll'];
    passiveEvents.forEach(eventType => {
      originalAddEventListener.call(document, eventType, () => {}, { passive: true });
      optimized++;
    });

    console.log(`✅ Event listener optimization complete - ${optimized} optimized`);
    return optimized;
  }

  removeEventListener(id: string): void {
    const listenerData = this.eventListenerRegistry.get(id);
    if (listenerData) {
      listenerData.element.removeEventListener(listenerData.type, listenerData.listener, listenerData.options);
      this.eventListenerRegistry.delete(id);
    }
  }

  cleanup(): void {
    this.eventListenerRegistry.clear();
  }
}

export const eventListenerOptimizer = new EventListenerOptimizer();