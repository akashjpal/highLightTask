import { Component, OnInit } from '@angular/core';

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

  questionObject = {
    question: "",
    textPhrase: "",
    answerType: "",
    options: [{
      word: "",
      isSelected: false,
      isCorrect: false
    }]
  }

  constructor() {}

  ngOnInit(): void {}

  getSelector(textPhrase: string, answerType: string): { word: string, isSelected: boolean, isCorrect: boolean }[] | null {
    if (answerType === "word") {
      return this.getWordOptions(textPhrase);
    } else if (answerType === "sentence") {
      return this.getSentenceOptions(textPhrase);
    } else if(answerType === "paragraph"){
      return this.getParagraphOptions(textPhrase)
    }
    return null;
  }

  getWordOptions(textPhrase: string): { word: string, isSelected: boolean, isCorrect: boolean }[] {
    console.log(textPhrase);
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

  // updateVisibility(): void {
  //   console.log(this.question + " " + this.textPhrase + " " + this.answerType);
  //   if (this.question !== "" && this.textPhrase !== "" && this.answerType !== "") {
  //     this.options = this.getSelector(this.textPhrase, this.answerType);
  //     this.isVisible = true;  
  //   } else {
  //     this.isVisible = false;
  //   }
  // }

  editOptions(options: { word: string, isSelected: boolean, isCorrect: boolean }[] | null) {
    console.log(options);
    this.options = options;
  }


  // doing resize of the textarea
  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    //by default auto is 2 lines fixed for chrome, override this by setting rows=1
    textarea.style.height = 'auto'; 
    console.log(textarea.clientHeight);
    // textarea.style.height = '21px'
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  onEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      const textarea = event.target as HTMLTextAreaElement;
      this.autoResize(event);
    }
  }

  // handling custom selections

  getCustomSelections(textPhrase: string): { word: string, isSelected: boolean, isCorrect: boolean }[] {
    // This method doesn't split the text at predefined points, instead, it will allow for freeform selections
    return [{ word: textPhrase, isSelected: false, isCorrect: false }];
  }
  

  handleCustomSelection(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
  
    if (start !== end) { // Ensure there is a selection
      const selectedText = this.question.substring(start, end);
      if (this.options) {
        console.log(this.options)
        this.options.push({ word: selectedText, isSelected: false, isCorrect: false });
      } else {
        this.options = [{ word: selectedText, isSelected: false, isCorrect: false }];
      }
      console.log('Custom Selection:', selectedText);
    }
  }

  updateVisibility(): void {
    console.log(this.question + " " + this.textPhrase + " " + this.answerType);
    if (this.question !== "" && this.textPhrase !== "" && this.answerType !== "") {
      if (this.answerType === 'custom') {
        this.options = []; // Reset options for custom selections
      } else {
        this.options = this.getSelector(this.textPhrase, this.answerType);
      }
      this.isVisible = true;  
    } else {
      this.isVisible = false;
    }
  }
  


  

}
