import { Component, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-highlight',
  templateUrl: './highlight.component.html',
  styleUrls: ['./highlight.component.css']
})
export class HighlightComponent implements OnInit {
  question: string = "";
  textPhrase: string = "";
  answerType: string = "";
  options: { word: string, isSelected: boolean, isCorrect: boolean }[] | null = null;
  isVisible: boolean = false;
  selectedText: string = "";
  customType:true|false = false;

  constructor() {
   
  }

  ngOnInit(): void {
  }

  captureSelection() {
    const selection = window.getSelection();
    if (selection) {
      this.selectedText = selection.toString();
    }
  }

  getSelector(textPhrase: string, answerType: string): { word: string, isSelected: boolean, isCorrect: boolean }[] | null {
    if (answerType === "word") {
      this.customType = false;
      return this.getWordOptions(textPhrase);
    } else if (answerType === "sentence") {
      this.customType = false;
      return this.getSentenceOptions(textPhrase);
    } else if(answerType === "paragraph"){
      this.customType = false;
      return this.getParagraphOptions(textPhrase);
    } else if(answerType === "custom"){
      return this.getCustomOptions(textPhrase);
    }
    return null;
  }

  getWordOptions(textPhrase: string): { word: string, isSelected: boolean, isCorrect: boolean }[] {
    const wordOptions: string[] = textPhrase.split(" ");
    return wordOptions.map((word) => ({
      word: word,
      isSelected: false,
      isCorrect: false
    }));
  }

  getSentenceOptions(textPhrase: string): { word: string, isSelected: boolean, isCorrect: boolean }[] {
    const sentenceOptions: string[] = textPhrase.split(".");
    return sentenceOptions.map((sentence) => ({
      word: sentence,
      isSelected: false,
      isCorrect: false
    }));
  }

  getParagraphOptions(textPhrase: string): { word: string, isSelected: boolean, isCorrect: boolean }[] {
    const paragraphOptions: string[] = textPhrase.split("\n");
    return paragraphOptions.map((sentence) => ({
      word: sentence,
      isSelected: false,
      isCorrect: false
    }));
  }

  getCustomOptions(textPhrase: string): { word: string, isSelected: boolean, isCorrect: boolean }[] | null {
    // const customOptions: { word: string, isSelected: boolean, isCorrect: boolean }[] = [];
    this.customType = true;
    return [{
      word:textPhrase,
      isSelected:false,
      isCorrect:false
    }];
    
  }

  updateVisibility(): void {
    if (this.question !== "" && this.textPhrase !== "" && this.answerType !== "") {
      this.options = this.getSelector(this.textPhrase, this.answerType);
      this.isVisible = true;  
    } else {
      this.isVisible = false;
    }
  }

  editOptions(options: { word: string, isSelected: boolean, isCorrect: boolean }[] | null) {
    this.options = options;
    console.log(options);
  }
  // editLetMe(options: { word: string, isSelected: boolean, isCorrect: boolean }[] | null) {
  //   // this.options = options;
  //   console.log("Received at html");
  //   this.options = options;
  //   console.log(this.options);
  // }
  

  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; 
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  onEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.autoResize(event);
    }
  }


 

  
}
