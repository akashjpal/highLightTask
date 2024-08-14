import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'highlight-correct',
  templateUrl: './highlight-correct.component.html',
  styleUrls: ['./highlight-correct.component.css']
})
export class HighlightCorrectComponent implements OnInit {
  private _selectors: { word: string, isSelected: boolean, isCorrect: boolean }[] | null = null;

  @Input()
  set selectors(value: { word: string, isSelected: boolean, isCorrect: boolean }[] | null) {
    if(this._selectors !== value){
    this._selectors = value;
    console.log('Options received at correct side:', this._selectors);
    }
  }

  get selectors(): { word: string, isSelected: boolean, isCorrect: boolean }[] | null {
    return this._selectors;
  }

  @Output() options: EventEmitter<{ word: string, isSelected: boolean, isCorrect: boolean }[] | null> = new EventEmitter<{ word: string, isSelected: boolean, isCorrect: boolean }[] | null>();


  constructor() {}

  ngOnInit(): void {
    console.log("Recieved at correct");
    console.log(this._selectors);
  }


  toggleSelection(index: number): void {
    console.log(this._selectors)
    if (this._selectors && this._selectors[index]) {
      const item = this._selectors[index];
       
        if (item && item.isSelected) {
          item.isCorrect = !item.isCorrect;
        }
      this.options.emit(this._selectors);
    }
  }
  
}
