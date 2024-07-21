import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorsService {

  constructor() { }

  getRandomColor(): string {
    const colors = [
      '#FF355E',
      '#FD5B78',
      '#FF6037',
      '#FFCC33',
      '#CCFF00',
      '#66FF66',
      '#AAF0D1',
      '#50BFE6',
      '#FF6EFF',
      '#EE34D2',
      '#FF00CC',
      '#FF00CC'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

}
