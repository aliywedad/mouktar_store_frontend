import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {

  constructor() {}

  // Store data in localStorage
  setData(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Retrieve data from localStorage
  getData(key: string): any {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;  // Return null if no data found
  }

  // Remove data from localStorage
  removeData(key: string): void {
    localStorage.removeItem(key);
  }

  // Clear all stored data
  clearData(): void {
    localStorage.clear();
  }
  clearAll(): void {
    localStorage.clear(); // Removes all stored data
  }
}
