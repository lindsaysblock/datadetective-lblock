
import { ParsedData } from '../dataParser';
import { analyzeData } from './dataAnalyzer';

export const parseJSON = async (file: File): Promise<ParsedData> => {
  console.log('Parsing JSON file');
  
  const text = await file.text();
  
  let data;
  try {
    data = JSON.parse(text);
  } catch (error) {
    throw new Error('Invalid JSON format');
  }
  
  if (Array.isArray(data)) {
    if (data.length === 0) {
      throw new Error('JSON array is empty');
    }
    console.log(`JSON contains ${data.length} items`);
  } else if (typeof data === 'object' && data !== null) {
    data = [data];
    console.log('Converted single JSON object to array');
  } else {
    throw new Error('JSON must contain an object or array of objects');
  }
  
  const validData = data.filter(item => typeof item === 'object' && item !== null);
  if (validData.length === 0) {
    throw new Error('No valid objects found in JSON data');
  }
  
  const allKeys = new Set<string>();
  validData.forEach(item => {
    Object.keys(item).forEach(key => allKeys.add(key));
  });
  
  const headers = Array.from(allKeys);
  console.log('JSON headers:', headers);
  
  return analyzeData(headers, validData);
};
