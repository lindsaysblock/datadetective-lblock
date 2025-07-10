
// Simple unstructured data parser for text files
export const parseUnstructuredData = (text: string): { success: boolean; data?: Record<string, any>[]; error?: string } => {
  try {
    // Try to parse as JSON first
    const jsonData = JSON.parse(text);
    if (Array.isArray(jsonData)) {
      return { success: true, data: jsonData };
    } else if (typeof jsonData === 'object' && jsonData !== null) {
      return { success: true, data: [jsonData] };
    }
  } catch {
    // Not JSON, try to parse as simple key-value pairs
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length === 0) {
      return { success: false, error: 'Empty text data' };
    }
    
    // Simple parsing for key-value pairs
    const data: Record<string, any>[] = [];
    let currentItem: Record<string, any> = {};
    
    for (const line of lines) {
      if (line.includes(':')) {
        const [key, ...valueParts] = line.split(':');
        const value = valueParts.join(':').trim();
        currentItem[key.trim()] = value;
      } else if (line.trim() === '' && Object.keys(currentItem).length > 0) {
        data.push(currentItem);
        currentItem = {};
      }
    }
    
    if (Object.keys(currentItem).length > 0) {
      data.push(currentItem);
    }
    
    if (data.length === 0) {
      return { success: false, error: 'Could not parse unstructured data' };
    }
    
    return { success: true, data };
  }
  
  return { success: false, error: 'Unknown data format' };
};
