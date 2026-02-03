import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { GoogleGenAI } from '@google/genai';

interface LoveChapter {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule]
})
export class AppComponent {
  title = signal('情 笺');
  counter = signal(520);
  isSent = signal(false);
  loveQuote = signal('');
  isGenerating = signal(false);

  loveChapters = signal<LoveChapter[]>([
    {
      icon: '壹',
      title: '初见如画',
      description: '人海遥遥，你如一幅丹青，只一眼，便刻在我心上，再难忘。'
    },
    {
      icon: '贰',
      title: '再会倾心',
      description: '月下重逢，言笑晏晏。你的温柔，是穿过长夜，照亮我世界的光。'
    },
    {
      icon: '叁',
      title: '相知相许',
      description: '始于惊鸿，终于白首。愿执子之手，共赴一场无关风月的山河。'
    },
     {
      icon: '肆',
      title: '此生长留',
      description: '往后余生，三餐四季，晨暮日常，皆愿与你一同走过。'
    }
  ]);
  
  confessionForm = new FormGroup({
    name: new FormControl('', Validators.required),
    message: new FormControl('', Validators.required)
  });

  increment() {
    this.counter.update(c => c + 1);
  }

  decrement() {
    this.counter.update(c => c > 0 ? c - 1 : 0);
  }
  
  async generateQuote() {
    this.isGenerating.set(true);
    this.loveQuote.set('');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: '生成一句简短的、古典风格的、适合写入情书的诗句。',
        config: {
            thinkingConfig: { thinkingBudget: 0 } 
        }
      });
      this.loveQuote.set(response.text);
    } catch (error) {
      console.error('Error generating quote:', error);
      this.loveQuote.set('言语有穷，但爱意无垠。');
    } finally {
      this.isGenerating.set(false);
    }
  }

  onSubmit() {
    if (this.confessionForm.valid) {
      this.isSent.set(true);
    }
  }

  resetForm() {
    this.isSent.set(false);
    this.confessionForm.reset();
  }
}
