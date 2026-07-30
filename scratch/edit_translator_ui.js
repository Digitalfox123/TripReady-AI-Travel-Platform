import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/pages/DestinationPage.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

const oldBlock = `              {/* Translation Output Card */}
              <div className="mt-8 pt-5 border-t border-[var(--border)]">
                {translatedText ? (
                  <div className="p-4 rounded-2xl bg-[var(--accent)]/[0.03] border border-[var(--accent)]/15 space-y-2 text-left animate-fade-in flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-[var(--accent)] block font-mono">CONVERSATIONAL dialect</span>
                      <p className="text-base font-bold text-[var(--text-primary)]">{translatedText}</p>
                      {translationPhonetic && (
                        <p className="text-[10px] text-[var(--text-secondary)] italic font-light">Phonetic: <span className="font-mono font-normal text-[var(--accent)]">{translationPhonetic}</span></p>
                      )}
                    </div>`;

const newBlock = `              {/* Translation Output Card */}
              <div className="mt-8 pt-5 border-t border-[var(--border)]">
                {translatedText ? (
                  <div className="p-5 rounded-2xl bg-[var(--accent)]/[0.03] border border-[var(--accent)]/15 space-y-3.5 text-left animate-fade-in flex flex-col justify-between">
                    <div className="grid grid-cols-2 gap-3 text-[10px] font-mono border-b border-[var(--border)] pb-2.5">
                      <div>
                        <span className="text-slate-400 block uppercase tracking-wider text-[8px] font-bold">Source Language</span>
                        <span className="text-[var(--text-primary)] font-semibold">{detectedLang || 'English'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block uppercase tracking-wider text-[8px] font-bold">Target Language</span>
                        <span className="text-[var(--accent)] font-semibold">{targetLang || 'Urdu'}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1.5 flex-1">
                        <span className="text-[8px] uppercase font-bold tracking-widest text-[var(--accent)] block font-mono">Original Text</span>
                        <p className="text-xs text-[var(--text-secondary)] italic">"\${translationInput}"</p>
                        
                        <span className="text-[8px] uppercase font-bold tracking-widest text-[var(--accent)] block font-mono pt-1">Translated Text</span>
                        <p className="text-base font-bold text-[var(--text-primary)] leading-relaxed">{translatedText}</p>
                        
                        {translationPhonetic && (
                          <p className="text-[10px] text-[var(--text-secondary)] italic font-light">Phonetic: <span className="font-mono font-normal text-[var(--accent)]">{translationPhonetic}</span></p>
                        )}
                      </div>`;

if (content.includes(oldBlock)) {
  content = content.replace(oldBlock, newBlock);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log("Successfully updated Translator Output Card UI!");
} else {
  console.error("Could not find Translator Output Card old block");
}
