import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/pages/DestinationPage.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

const oldBlock = `                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1.5 flex-1">
                        <span className="text-[8px] uppercase font-bold tracking-widest text-[var(--accent)] block font-mono">Original Text</span>
                        <p className="text-xs text-[var(--text-secondary)] italic">"{translationInput}"</p>
                        
                        <span className="text-[8px] uppercase font-bold tracking-widest text-[var(--accent)] block font-mono pt-1">Translated Text</span>
                        <p className="text-base font-bold text-[var(--text-primary)] leading-relaxed">{translatedText}</p>
                        
                        {translationPhonetic && (
                          <p className="text-[10px] text-[var(--text-secondary)] italic font-light">Phonetic: <span className="font-mono font-normal text-[var(--accent)]">{translationPhonetic}</span></p>
                        )}
                      </div>
                    
                    <button 
                      onClick={() => {
                        if ('speechSynthesis' in window) {
                          window.speechSynthesis.cancel();
                          const cleanText = translatedText.split('(')[0].trim();
                          const utterance = new SpeechSynthesisUtterance(cleanText);
                          
                          const langMap = {
                            Arabic: 'ar-SA',
                            German: 'de-DE',
                            Portuguese: 'pt-BR',
                            Japanese: 'ja-JP',
                            Italian: 'it-IT',
                            Spanish: 'es-ES',
                            Thai: 'th-TH',
                            Indonesian: 'id-ID',
                            Urdu: 'ur-PK',
                            English: 'en-US'
                          };
                          
                          utterance.lang = langMap[getDestinationLanguage(destination)] || 'en-US';
                          window.speechSynthesis.speak(utterance);
                        }
                      }}
                      className="w-8 h-8 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all shadow-sm cursor-pointer shrink-0 ml-4"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>`;

const newBlock = `                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1.5 flex-1">
                        <span className="text-[8px] uppercase font-bold tracking-widest text-[var(--accent)] block font-mono">Original Text</span>
                        <p className="text-xs text-[var(--text-secondary)] italic">"{translationInput}"</p>
                        
                        <span className="text-[8px] uppercase font-bold tracking-widest text-[var(--accent)] block font-mono pt-1">Translated Text</span>
                        <p className="text-base font-bold text-[var(--text-primary)] leading-relaxed">{translatedText}</p>
                        
                        {translationPhonetic && (
                          <p className="text-[10px] text-[var(--text-secondary)] italic font-light">Phonetic: <span className="font-mono font-normal text-[var(--accent)]">{translationPhonetic}</span></p>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => {
                          if ('speechSynthesis' in window) {
                            window.speechSynthesis.cancel();
                            const cleanText = translatedText.split('(')[0].trim();
                            const utterance = new SpeechSynthesisUtterance(cleanText);
                            
                            const langMap = {
                              Arabic: 'ar-SA',
                              German: 'de-DE',
                              Portuguese: 'pt-BR',
                              Japanese: 'ja-JP',
                              Italian: 'it-IT',
                              Spanish: 'es-ES',
                              Thai: 'th-TH',
                              Indonesian: 'id-ID',
                              Urdu: 'ur-PK',
                              English: 'en-US'
                            };
                            
                            utterance.lang = langMap[getDestinationLanguage(destination)] || 'en-US';
                            window.speechSynthesis.speak(utterance);
                          }
                        }}
                        className="w-8 h-8 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all shadow-sm cursor-pointer shrink-0 ml-4"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>`;

// Simple normalization and replace
const normalizedContent = content.replace(/\r\n/g, '\n');
const normalizedOld = oldBlock.replace(/\r\n/g, '\n');
const normalizedNew = newBlock.replace(/\r\n/g, '\n');

if (normalizedContent.includes(normalizedOld)) {
  content = normalizedContent.replace(normalizedOld, normalizedNew);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log("Successfully fixed translation card JSX nesting!");
} else {
  console.error("FAIL: Could not locate JSX nesting old block");
}
