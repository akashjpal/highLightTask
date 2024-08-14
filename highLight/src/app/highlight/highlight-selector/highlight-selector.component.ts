import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

interface WordState {
  word: string;
  isSelected: boolean;
  isCorrect: boolean;
}


@Component({
  selector: 'highlight-selector',
  templateUrl: './highlight-selector.component.html',
  styleUrls: ['./highlight-selector.component.css']
})
export class HighlightSelectorComponent implements OnInit {
  private _selectors: { word: string, isSelected: boolean, isCorrect: boolean }[] | null = null;
  private _concateWord:true|false = false;

  @Input()
  set selectors(value: { word: string, isSelected: boolean, isCorrect: boolean }[] | null) {
    this._selectors = value;
    console.log('Options received:', this._selectors);
  }

  get selectors(): { word: string, isSelected: boolean, isCorrect: boolean }[] | null {
    return this._selectors;
  }

  @Input()
  set concateWord(value:true|false){
    this._concateWord = value;
  }
  get concateWord():true|false{
    return this._concateWord;
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
      // only apply to word, not other than that keep in mind.
      if(this.concateWord){
        this.updateSelectors();
      }
      this.options.emit(this._selectors);
    }
  }

  // custom selection
  onOptionClick(index: number): void {
    if (this.selectors) {
      this.selectors[index].isSelected = !this.selectors[index].isSelected;
      this.options.emit(this.selectors);
    }
  }

  updateSelectors(): void {
    if (!this._selectors) { return; }
  
    let newSelectors: WordState[] = [];
    let currentGroup: WordState[] = [];
  
    for (let wordState of this._selectors) {
      if (wordState.isSelected) {
        // If the word is selected, add it to the current group
        currentGroup.push(wordState);
      } else {
        // If the word is not selected, merge the current group if it's not empty,
        // then add the unselected word as a standalone item
        if (currentGroup.length > 0) {
          newSelectors.push(this.mergeWordStates(currentGroup));
          currentGroup = [];
        }
        newSelectors.push(wordState);
      }
    }
  
    // After the loop, merge any remaining selected words
    if (currentGroup.length > 0) {
      newSelectors.push(this.mergeWordStates(currentGroup));
    }
  
    console.log(newSelectors);
  
    // Uncomment this to update the _selectors with the new selectors
    this._selectors = newSelectors;
  }
  
  mergeWordStates(group: WordState[]): WordState {
    return {
      word: group.map(w => w.word).join(' '),
      isSelected: group[0].isSelected,
      isCorrect: group[0].isCorrect
    };
  }

}
