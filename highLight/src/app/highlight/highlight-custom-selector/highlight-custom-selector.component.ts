import { Component, OnInit, Input, EventEmitter, Output, Renderer2, ElementRef } from '@angular/core';

interface WordState {
  word: string;
  isSelected: boolean;
  isCorrect: boolean;
}

@Component({
  selector: 'highlight-custom-selector',
  templateUrl: './highlight-custom-selector.component.html',
  styleUrls: ['./highlight-custom-selector.component.css']
})
export class HighlightCustomComponent implements OnInit {
  private _selectors: WordState[] | null = null;
  private wordStates: WordState[] = [];

  @Input() set selectors(value: WordState[] | null) {
    if (value !== this._selectors) { // Only reinitialize if value has changed
        console.log("Recieved at Highlight custom component")
        console.log(value);
        
        this._selectors = value;
        if (value && value.length > 0) {
        this.initializeWordStates(value[0].word);
        }
        this.updateHighlighting();
    }
    }


  get selectors(): WordState[] | null {
    return this._selectors;
  }

  @Output() options:EventEmitter<WordState[] |null> = new EventEmitter<WordState[] | null>();

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit(): void {
    this.initializeEventListeners();
  }

  initializeEventListeners(): void {
    const container = this.el.nativeElement.querySelector('.highlight-container');
    if (container) {
      this.renderer.listen(container, 'mouseup', (e: MouseEvent) => this.handleSelection(e));
    }
  }

  initializeWordStates(text: string): void {
    this.wordStates = text.split(/\s+/).map(word => ({
      word,
      isSelected: false,
      isCorrect: false
    }));
  }

  handleSelection(e: MouseEvent): void {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);
    const container = this.el.nativeElement.querySelector('.highlight-container');
    const startWord = this.getWordIndex(container, range.startContainer, range.startOffset);
    const endWord = this.getWordIndex(container, range.endContainer, range.endOffset);
    // console.log(this.wordStates);
    this.updateWordStates(startWord, endWord);
  }
  
  getWordIndex(container: Node, targetNode: Node, targetOffset: number): number {
    let wordIndex = 0;
    const walk = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (node) => node.nodeName === 'SPAN' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
    });

    while (walk.nextNode()) {
      if (walk.currentNode.contains(targetNode)) {
        return wordIndex;
      }
      wordIndex++;
    }
    return wordIndex;
  }

  

  updateWordStates(startWord: number, endWord: number): void {
    console.log();
    for (let i = startWord; i <= endWord; i++) {
      this.wordStates[i].isSelected = !this.wordStates[i].isSelected;
    }
    this.updateSelectors();
  }

  updateSelectors(): void {
    let newSelectors: WordState[] = [];
    let currentGroup: WordState[] = [];
  
    for (let wordState of this.wordStates) {
      if (currentGroup.length === 0 || currentGroup[0].isSelected === wordState.isSelected) {
        currentGroup.push(wordState);
      } else {
        newSelectors.push(this.mergeWordStates(currentGroup));
        currentGroup = [wordState];
      }
    }
  
    if (currentGroup.length > 0) {
      newSelectors.push(this.mergeWordStates(currentGroup));
    }
  
    this._selectors = newSelectors;
    this.options.emit(this._selectors); // Emit before re-rendering
    this.updateHighlighting(); // Re-render the highlighting after emitting
  }
  
  mergeWordStates(group: WordState[]): WordState {
    return {
      word: group.map(w => w.word).join(' '),
      isSelected: group[0].isSelected,
      isCorrect: group[0].isCorrect
    };
  }

  updateHighlighting(): void {
    const container = this.el.nativeElement.querySelector('.highlight-container');
    if (!container) return;

    container.innerHTML = '';
    this.wordStates.forEach(wordState => {
      const span = this.renderer.createElement('span');
      this.renderer.setProperty(span, 'textContent', wordState.word + ' ');
      if (wordState.isSelected) {
        this.renderer.addClass(span, 'highlighted');
      }
      this.renderer.appendChild(container, span);
    });
  }
}