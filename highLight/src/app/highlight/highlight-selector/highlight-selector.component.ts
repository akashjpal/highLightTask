import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'highlight-selector',
  templateUrl: './highlight-selector.component.html',
  styleUrls: ['./highlight-selector.component.css']
})
export class HighlightSelectorComponent implements OnInit {
  private _selectors: { word: string, isSelected: boolean, isCorrect: boolean }[] | null = null;

  @Input()
  set selectors(value: { word: string, isSelected: boolean, isCorrect: boolean }[] | null) {
    this._selectors = value;
    console.log('Options received:', this._selectors);
  }

  get selectors(): { word: string, isSelected: boolean, isCorrect: boolean }[] | null {
    return this._selectors;
  }

  @Output() options: EventEmitter<{ word: string, isSelected: boolean, isCorrect: boolean }[] | null> = new EventEmitter<{ word: string, isSelected: boolean, isCorrect: boolean }[] | null>();

  constructor() {}

  ngOnInit(): void {
    
  }

  toggleSelection(index: number): void {
    if (this._selectors && this._selectors[index]) {
      const item = this._selectors[index];
      item.isSelected = !item.isSelected;
      if (!item.isSelected) {
        item.isCorrect = false; 
      }
      this.options.emit(this._selectors);
    }
  }
}
