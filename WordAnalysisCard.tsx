
import * as React from 'react';
import { WordAnalysis } from '../types';
import { Leaf, Volume2, BookOpen, Library, AlertTriangle, Plane, Sparkles, AlertOctagon, HelpCircle, CheckCircle, Star, GraduationCap, Zap, Lightbulb, PenTool } from 'lucide-react';

interface Props {
  data: WordAnalysis;
}

export const WordAnalysisCard: React.FC<Props> = ({ data }) => {
  const [showQuizAnswer, setShowQuizAnswer] = React.useState(false);
  const [showGrammarMCQ, setShowGrammarMCQ] = React.useState(false);
  const [showGrammarRewrite, setShowGrammarRewrite] = React.useState(false);

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(data.word);
      utterance.pitch = 1.3;
      utterance.rate = 1.1;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const isChallengeMode = data.category === 'CHALLENGE';
  const isGrammarMode = data.category === 'GRAMMAR';

  return (
    <div className="bg-white/95 rounded-[2rem] p-6 shadow-xl border-2 border-ac-cream animate-fade-in flex flex-col gap-6 w-full max-w-4xl mx-auto">
      
      {/* Sound Effect Indicator */}
      <div className="text-center italic text-ac-orange font-bold text-sm">
        🔊 {data.soundEffect || '*Ta-da!* ✨'}
      </div>

      {/* Header Info */}
      <div className="flex flex-col gap-4 bg-ac-cream rounded-2xl p-6 border-l-8 border-ac-yellow shadow-inner">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <h2 className={`font-black text-ac-brown uppercase tracking-tighter ${data.word.length > 20 ? 'text-xl' : 'text-3xl'}`}>
              {data.word}
            </h2>
            {!isChallengeMode && !isGrammarMode && (
              <span className="text-sm font-mono text-ac-darkGreen bg-white px-3 py-1 rounded-full border border-ac-darkGreen/20 shadow-sm whitespace-nowrap">
                {data.pronunciation}
              </span>
            )}
            {!isGrammarMode && (
                <button onClick={handleSpeak} className="p-2.5 rounded-full bg-ac-green text-white hover:bg-ac-darkGreen shadow-md transition-all active:scale-95 shrink-0">
                <Volume2 size={20} />
                </button>
            )}
          </div>
          <Sparkles className="text-ac-yellow hidden md:block shrink-0" />
        </div>
        
        {/* Definition / Analysis */}
        <p className="text-ac-brown font-semibold text-lg leading-snug border-t border-ac-yellow/20 pt-4">
          {data.definition}
        </p>

        {/* Example Context (Optional for Grammar) */}
        {!isGrammarMode && (
          <div className="bg-white/70 p-4 rounded-xl border border-ac-yellow/30 mt-2">
            <p className="text-[10px] font-bold text-ac-orange uppercase tracking-widest mb-1">Scenario on Word Horizon</p>
            <p className="text-sm italic text-ac-brown leading-relaxed">"{data.example}"</p>
          </div>
        )}
      </div>

      {/* GRAMMAR MODE: Nook Academy Layout */}
      {isGrammarMode && data.grammar && (
        <div className="space-y-6">
           {/* 1. Quick Map */}
           <div className="bg-white rounded-2xl border-2 border-purple-200 overflow-hidden shadow-sm">
              <div className="bg-purple-100 p-4 flex items-center gap-2 text-purple-800 font-black text-lg">
                 <Lightbulb size={24} /> 💡 Quick Map
              </div>
              <div className="p-5">
                 <ul className="space-y-2">
                    {data.grammar.quickMap.map((point, idx) => (
                      <li key={idx} className="flex gap-3 text-ac-brown font-medium">
                        <span className="text-purple-400 font-bold">•</span>
                        {point}
                      </li>
                    ))}
                 </ul>
              </div>
           </div>

           {/* 2. Memory Trick */}
           <div className="bg-ac-green/10 rounded-2xl p-6 border-2 border-ac-green/20 relative">
              <div className="absolute -top-3 -left-3 bg-ac-green text-white p-2 rounded-full shadow-md rotate-12">
                 <Sparkles size={20} />
              </div>
              <h4 className="font-black text-ac-darkGreen mb-2 ml-4">🍎 Memory Trick</h4>
              <p className="text-ac-brown italic text-lg text-center font-bold">
                 "{data.grammar.memoryTrick}"
              </p>
           </div>

           {/* 3. Expert Trap */}
           <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-100 flex gap-4 items-start">
              <div className="bg-red-100 p-2 rounded-full text-red-500 shrink-0">
                 <AlertTriangle size={24} />
              </div>
              <div>
                 <h4 className="font-black text-red-500 uppercase tracking-widest text-xs mb-1">⚠️ Expert Trap</h4>
                 <p className="text-ac-brown font-medium">{data.grammar.expertTrap}</p>
              </div>
           </div>

           {/* 4. Practice */}
           <div className="space-y-4">
              <h3 className="font-black text-ac-brown text-xl flex items-center gap-2">
                 <PenTool size={24} /> 📝 Practice Time
              </h3>
              
              {/* MCQ */}
              <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 shadow-sm">
                 <p className="font-bold text-ac-brown mb-4">1. Multiple Choice: {data.grammar.practice.mcq.question}</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                    {data.grammar.practice.mcq.options?.map((opt, i) => (
                       <div key={i} className="bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-100">
                          {opt}
                       </div>
                    ))}
                 </div>
                 {!showGrammarMCQ ? (
                    <button onClick={() => setShowGrammarMCQ(true)} className="text-xs font-bold text-ac-blue bg-ac-blue/10 px-3 py-1 rounded-full">Reveal Answer</button>
                 ) : (
                    <div className="text-ac-green font-black flex items-center gap-2 animate-fade-in">
                       <CheckCircle size={16} /> {data.grammar.practice.mcq.correctAnswer}
                    </div>
                 )}
              </div>

              {/* Rewrite */}
              <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 shadow-sm">
                 <p className="font-bold text-ac-brown mb-4">2. Rewrite: {data.grammar.practice.rewrite.question}</p>
                 {!showGrammarRewrite ? (
                    <button onClick={() => setShowGrammarRewrite(true)} className="text-xs font-bold text-ac-blue bg-ac-blue/10 px-3 py-1 rounded-full">Reveal Answer</button>
                 ) : (
                    <div className="text-ac-green font-black flex items-center gap-2 animate-fade-in">
                       <CheckCircle size={16} /> {data.grammar.practice.rewrite.correctAnswer}
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}


      {/* CHALLENGE MODE: Upgrade & Rewrite */}
      {isChallengeMode && data.vocabUpgrades && (
         <div className="space-y-4">
           {data.vocabUpgrades.map((upgrade, idx) => (
             <div key={idx} className="bg-gradient-to-r from-orange-50 to-white rounded-2xl border-2 border-orange-100 shadow-md p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 bg-orange-200 text-orange-900 text-xs font-black px-3 py-1 rounded-br-xl uppercase tracking-widest z-10">
                   {upgrade.level}
                </div>
                <div className="mt-4 space-y-3">
                   <div className="flex items-start gap-3">
                     <Zap className="text-orange-400 mt-1 shrink-0" size={20} fill="currentColor" />
                     <p className="text-lg font-bold text-ac-brown">{upgrade.text}</p>
                   </div>
                   <div className="pl-8 text-sm text-orange-800/70 italic border-l-2 border-orange-200">
                     🚀 {upgrade.notes}
                   </div>
                </div>
             </div>
           ))}
         </div>
      )}

      {/* STANDARD MODES: Word Formation & Idioms */}
      {!isGrammarMode && !isChallengeMode && (
          <div className="space-y-6">
            {/* Tricky Forms Alert */}
            {data.trickyPairs && data.trickyPairs.length > 0 && (
                <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3 text-red-500 font-black uppercase text-sm tracking-wider">
                    <AlertOctagon size={18} />
                    <span>Tricky Forms Alert!</span>
                </div>
                <div className="space-y-3">
                    {data.trickyPairs.map((pair, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row md:items-center gap-2 text-sm text-ac-brown">
                        <span className="font-bold bg-white px-2 py-1 rounded border border-red-100 shadow-sm whitespace-nowrap">{pair.word}</span>
                        <span className="hidden md:inline text-red-300">vs</span>
                        <span className="italic">{pair.difference}</span>
                    </div>
                    ))}
                </div>
                </div>
            )}

            {/* Word Family List */}
            {data.category === 'WORD_FORMATION' && data.wordFamily.length > 0 && (
            <div className="bg-white rounded-2xl border-2 border-ac-green/30 shadow-sm overflow-hidden">
                <div className="bg-ac-green/10 p-4 border-b-2 border-ac-green/10 flex items-center justify-between">
                <h3 className="text-ac-darkGreen font-black text-lg flex items-center gap-2">
                    <Leaf size={22} /> 🌳 Word Formation (Full Tree)
                </h3>
                <span className="text-xs bg-ac-green text-white px-3 py-1 rounded-full font-bold uppercase tracking-widest">A1-C2</span>
                </div>
                <div className="p-2 divide-y divide-ac-cream">
                {data.wordFamily.map((f, i) => (
                    <div key={i} className="flex flex-col p-4 hover:bg-ac-cream/20 transition-colors group">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                        <span className="font-black text-ac-brown text-base group-hover:text-ac-darkGreen transition-colors">{f.form}</span>
                        {f.level && (
                        <span className="text-[10px] bg-ac-yellow/20 text-ac-brown px-2 py-0.5 rounded font-black border border-ac-yellow/40">
                            {f.level}
                        </span>
                        )}
                        {f.register && (
                        <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-bold border border-purple-100 uppercase tracking-wide">
                            {f.register}
                        </span>
                        )}
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                        • {f.meaning}
                    </div>
                    {f.morphology && (
                        <div className="mt-2 text-xs bg-ac-green/5 text-ac-darkGreen p-2 rounded-lg border border-ac-green/10 flex gap-2 items-start">
                        <span className="font-bold">💡 Logic:</span>
                        <span className="italic">{f.morphology}</span>
                        </div>
                    )}
                    </div>
                ))}
                </div>
            </div>
            )}

            {/* Idioms List */}
            {(data.category === 'IDIOMS_PHRASAL') && data.nookLibrary.length > 0 && (
            <div className="bg-white rounded-2xl border-2 border-ac-blue/30 shadow-sm overflow-hidden">
                <div className="p-4 border-b-2 border-gray-100 flex items-center gap-3 font-black text-lg bg-ac-blue/10 text-ac-brown">
                <Library size={22} />
                📚 Idioms & Phrasal Verbs
                </div>
                <div className="p-2 divide-y divide-gray-50">
                {data.nookLibrary.map((item, idx) => (
                    <div key={idx} className="p-4 hover:bg-gray-50/50 transition-all flex flex-col gap-2">
                    <div className="font-black text-ac-brown text-base flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-ac-yellow" /> {item.phrase}
                    </div>
                    <div className="text-sm text-gray-600 font-medium pl-5 border-l-4 border-ac-cream">
                        {item.meaning}
                    </div>
                    </div>
                ))}
                </div>
            </div>
            )}
            
            {/* Standard Mini Quiz */}
            {data.quiz && (
                <div className="bg-ac-brown/5 rounded-2xl p-6 border-2 border-ac-brown/10 relative overflow-hidden group">
                <div className="absolute top-0 left-0 bg-ac-brown text-white text-[10px] font-black px-3 py-1 rounded-br-xl uppercase tracking-widest z-10">
                    📝 Mini Quiz
                </div>
                <div className="mt-4 flex flex-col items-center gap-4 text-center">
                    <p className="text-ac-brown font-bold text-lg leading-relaxed max-w-lg">
                    {data.quiz.question}
                    </p>
                    <div className="flex gap-3">
                    {!showQuizAnswer ? (
                        <button 
                        onClick={() => setShowQuizAnswer(true)}
                        className="flex items-center gap-2 bg-ac-brown text-white px-5 py-2 rounded-full font-bold shadow hover:bg-ac-brown/90 transition-all text-sm"
                        >
                        <HelpCircle size={16} /> Reveal Answer
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 bg-ac-green text-white px-6 py-2 rounded-full font-black shadow animate-fade-in text-lg">
                        <CheckCircle size={20} /> {data.quiz.correctAnswer}
                        </div>
                    )}
                    </div>
                </div>
                </div>
            )}
          </div>
      )}

      {/* Etymology Info (Only for Words) */}
      {!isGrammarMode && !isChallengeMode && (
        <div className="bg-[#EBE4D5] p-5 rounded-2xl border-2 border-[#8B4513]/10 flex gap-5 items-start">
          <div className="bg-white p-2 rounded-full shadow-sm">
            <BookOpen size={28} className="text-[#8B4513]" />
          </div>
          <div>
            <h4 className="text-xs font-black text-[#8B4513] uppercase tracking-[0.2em] mb-2">Blathers' Museum Notes</h4>
            <p className="text-sm text-[#5D5046] italic leading-relaxed font-medium">{data.etymology}</p>
          </div>
        </div>
      )}

      {/* System Note & Disclaimer */}
      <div className="pt-4 border-t-2 border-dashed border-ac-cream space-y-4">
        <p className="text-center text-xs font-bold text-ac-brown/60">"Gõ 'Fav' để lưu ⭐, 'History' để xem lại 📝, 'Menu' để về trang chủ 🏠"</p>
        <div className="flex items-center justify-center gap-3 text-[10px] text-gray-400 text-center bg-gray-50/80 py-4 px-6 rounded-2xl">
          <AlertTriangle size={16} className="text-ac-orange shrink-0" />
          <p className="font-medium">✨ Dữ liệu được tổng hợp từ nguồn học thuật uy tín. Tuy nhiên, để đạt kết quả tốt nhất cho kỳ thi chuyên, bồ hãy đối chiếu thêm với các tài liệu chuẩn và giáo trình chính thống nhé!</p>
        </div>
      </div>
    </div>
  );
};
