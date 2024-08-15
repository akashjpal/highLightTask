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
  private wordStates: WordState[] = [];

  @Input() set selectors(value: WordState[] | null) {
    if (value !== this.wordStates) {
      console.log("Received at Highlight custom component");
      console.log(value);
      
      this.wordStates = value ? value : [];
      this.updateHighlighting();
    }
  }

  get selectors(): WordState[] | null {
    return this.wordStates;
  }

  @Output() options: EventEmitter<WordState[] | null> = new EventEmitter<WordState[] | null>();

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
    for (let i = startWord; i <= endWord; i++) {
      this.wordStates[i].isSelected = !this.wordStates[i].isSelected;
    }
    this.updateSelectors();
    this.emitSelectors();
  }
  updateSelectors(): void {
    if (!this.wordStates) { return; }
  
    let newSelectors: WordState[] = [];
    let currentGroup: WordState[] = [];
  
    for (let wordState of this.wordStates) {
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
    this.wordStates = newSelectors;
  }
  
  mergeWordStates(group: WordState[]): WordState {
    return {
      word: group.map(w => w.word).join(' '),
      isSelected: group[0].isSelected,
      isCorrect: group[0].isCorrect
    };
  }

  emitSelectors(): void {
    this.options.emit([...this.wordStates]); // Emit the updated word states
    this.updateHighlighting(); // Re-render the highlighting after emitting
  }

  updateHighlighting(): void {
    const container = this.el.nativeElement.querySelector('.highlight-container');
    if (!container) return;

    // Clear the container
    container.innerHTML = '';

    const div = this.renderer.createElement('div');
    this.renderer.appendChild(container, div);

    // Create a label element and add it to the container
    const label = this.renderer.createElement('label');
    this.renderer.setProperty(label, 'textContent', "Set Selectors");
    this.renderer.appendChild(div, label);

    // Add a line break after the label
    const br = this.renderer.createElement('br');
    this.renderer.appendChild(div, br);

    // Create and append span elements for each word state
    this.wordStates.forEach(wordState => {
      const span = this.renderer.createElement('span');
      this.renderer.setProperty(span, 'textContent', wordState.word + ' ');
      if (wordState.isSelected) {
        this.renderer.addClass(span, 'highlighted');
      }
      this.renderer.appendChild(div, span);
    });
  }
}
