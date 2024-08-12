import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'highlight-correct',
  templateUrl: './highlight-correct.component.html',
  styleUrls: ['./highlight-correct.component.css']
})
export class HighlightCorrectComponent implements OnInit {
  private _selectors: { word: string, isSelected: boolean, isCorrect: boolean }[] | null = null;

  @Input()
  set selectors(value: { word: string, isSelected: boolean, isCorrect: boolean }[] | null) {
    this._selectors = value;
    console.log('Options received:', this._selectors);
  }

  get selectors(): { word: string, isSelected: boolean, isCorrect: boolean }[] | null {
    return this._selectors;
  }

  constructor() {}

  ngOnInit(): void {
    console.log(this._selectors);
  }

  selectorsKeys(): string[] {
    return this._selectors ? this._selectors.map(selector => selector.word) : [];
  }

  toggleSelection(index: number): void {
    if (this._selectors && this._selectors[index]) {
      const item = this._selectors[index];
      if (item) {
       
        if (item.isSelected) {
          item.isCorrect = !item.isCorrect;
        }
        
      }
    }
  }
  
}
