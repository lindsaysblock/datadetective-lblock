
export class LoadTestSimulators {
  async simulateComponentLoad(): Promise<void> {
    const elements = Array.from({ length: 100 }, (_, i) => {
      const div = document.createElement('div');
      div.textContent = `Load test element ${i}`;
      div.style.display = 'none';
      return div;
    });

    elements.forEach(el => document.body.appendChild(el));
    elements.forEach(el => el.getBoundingClientRect());
    elements.forEach(el => el.remove());
  }

  async simulateDataProcessing(): Promise<void> {
    const data = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      value: Math.random(),
      timestamp: new Date().toISOString()
    }));

    data
      .filter(item => item.value > 0.5)
      .sort((a, b) => b.value - a.value)
      .map(item => ({ ...item, processed: true }));
  }

  async simulateUIInteraction(): Promise<void> {
    const button = document.createElement('button');
    button.style.display = 'none';
    document.body.appendChild(button);

    for (let i = 0; i < 10; i++) {
      button.click();
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    button.remove();
  }

  async simulateAPICall(): Promise<void> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch('/api/health-check', {
        signal: controller.signal,
        method: 'GET'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        throw error;
      }
    } finally {
      clearTimeout(timeout);
    }
  }
}
