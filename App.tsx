
import * as React from 'react';
import { IsabelleAvatar } from './components/IsabelleAvatar';
import { WordAnalysisCard } from './components/WordAnalysisCard';
import { NookPhone } from './components/NookPhone';
import { analyzeWord } from './services/geminiService';
import { Language, ViewMode, WordAnalysis, AnalysisCategory, HistoryEntry } from './types';
import { Search, Globe, Leaf, Library, ArrowLeft, RefreshCw, Smartphone, Star, GraduationCap, Zap, Menu } from 'lucide-react';

const { useState, useEffect, useRef } = React;

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('LANG_SELECT');
  const [selectedLang, setSelectedLang] = useState<Language | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<AnalysisCategory | null>(null);
  const [inputText, setInputText] = useState('');
  const [currentData, setCurrentData] = useState<WordAnalysis | null>(null);
  const [soundText, setSoundText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // History & Favorites
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (viewMode === 'WORD_INPUT') {
      inputRef.current?.focus();
    }
  }, [viewMode]);

  const playSoundEffect = (text: string) => {
    setSoundText(text);
    setTimeout(() => setSoundText(null), 3500);
  };

  const handleLanguageSelect = (lang: Language) => {
    setSelectedLang(lang);
    setViewMode('CAT_SELECT');
    playSoundEffect('*Bell jingle* 🔔');
  };

  const handleCategorySelect = (cat: AnalysisCategory) => {
    setSelectedCategory(cat);
    setViewMode('WORD_INPUT');
    playSoundEffect('*Sparkle!* ✨');
  };

  const addToHistory = (word: string, category: AnalysisCategory) => {
    const entry: HistoryEntry = { word, category, timestamp: Date.now() };
    setHistory(prev => [...prev, entry]);
    playSoundEffect('Đã lưu vào Nook Phone! 📱');
  };

  const toggleFavorite = (word: string) => {
    setFavorites(prev => {
      const isFav = prev.includes(word);
      if (isFav) {
        return prev.filter(w => w !== word);
      }
      playSoundEffect(selectedLang === Language.VIETNAMESE ? `Đã thêm ${word} vào yêu thích! ⭐` : `Added ${word} to favorites! ⭐`);
      return [...prev, word];
    });
  };

  const executeAnalysis = async (wordToSearch?: string) => {
    const wordRaw = wordToSearch || inputText.trim();
    if (!wordRaw || !selectedLang || !selectedCategory) return;
    
    // Check for special commands
    const wordLower = wordRaw.toLowerCase();
    if (wordLower === 'fav' && currentData) {
      toggleFavorite(currentData.word);
      setInputText('');
      return;
    }
    if (wordLower === 'history' || wordLower === 'my favorites' || wordLower === 'favorites') {
      setIsPhoneOpen(true);
      setInputText('');
      return;
    }
    if (wordLower === 'menu' || wordLower === 'home') {
      resetToStart();
      return;
    }

    setIsLoading(true);
    setViewMode('LOADING');
    playSoundEffect('*Dodo Airlines chime* ✈️');

    try {
      const data = await analyzeWord(wordRaw, selectedLang, selectedCategory);
      setCurrentData(data);
      addToHistory(data.word, selectedCategory);
      playSoundEffect(data.soundEffect || '*Ta-da!* ✨');
      setViewMode('ANALYSIS');
      setInputText('');
    } catch (error) {
      setViewMode('ERROR');
      playSoundEffect('*Oops! Oh no!*');
    } finally {
      setIsLoading(false);
    }
  };

  const resetToStart = () => {
    setSelectedLang(null);
    setSelectedCategory(null);
    setInputText('');
    setCurrentData(null);
    setViewMode('LANG_SELECT');
  };

  const getPlaceholder = () => {
    if (selectedLang === Language.VIETNAMESE) {
        switch(selectedCategory) {
            case 'WORD_FORMATION': return "Nhập từ (VD: Heart, Just)...";
            case 'IDIOMS_PHRASAL': return "Nhập từ (VD: Get, Blue)...";
            case 'GRAMMAR': return "Nhập chủ điểm (VD: Đảo ngữ)...";
            case 'CHALLENGE': return "Nhập câu cần nâng cấp (C2)...";
            default: return "Nhập nội dung...";
        }
    } else {
        switch(selectedCategory) {
            case 'WORD_FORMATION': return "Enter word (e.g., Heart, Just)...";
            case 'IDIOMS_PHRASAL': return "Enter word (e.g., Get, Blue)...";
            case 'GRAMMAR': return "Enter topic (e.g., Inversion)...";
            case 'CHALLENGE': return "Enter sentence to upgrade...";
            default: return "Enter content...";
        }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-10 bg-ac-green/10">
      {/* NookPhone Overlay */}
      <NookPhone 
        isOpen={isPhoneOpen} 
        onClose={() => setIsPhoneOpen(false)} 
        history={history} 
        favorites={favorites} 
        onSelectWord={(word) => executeAnalysis(word)} 
      />

      {/* Sound Effect Display */}
      {soundText && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 bg-ac-brown text-ac-yellow px-10 py-4 rounded-full font-black shadow-2xl z-50 animate-bounce border-4 border-white text-lg text-center whitespace-nowrap">
          🔊 {soundText}
        </div>
      )}

      {/* Phone Button */}
      <button 
        onClick={() => setIsPhoneOpen(true)}
        className="fixed bottom-8 right-8 bg-ac-orange text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all z-40 border-4 border-white"
      >
        <Smartphone size={32} />
      </button>

      <div className="w-full max-w-4xl">
        {/* Step 1: Language Selection */}
        {viewMode === 'LANG_SELECT' && (
          <div className="bg-ac-cream rounded-[4rem] p-12 shadow-2xl border-8 border-white text-center space-y-10 animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-ac-yellow" />
            <div className="flex flex-col items-center gap-4">
              <IsabelleAvatar />
              <div className="space-y-2">
                <h1 className="text-3xl font-black text-ac-brown">Word Horizon Academy 🏝️</h1>
                <p className="text-gray-500 font-bold italic">"Chào mừng bồ! Chọn ngôn ngữ để bắt đầu nhé! 🐾"</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button 
                  onClick={() => handleLanguageSelect(Language.ENGLISH)} 
                  className="group bg-white border-4 border-ac-green/30 p-8 rounded-[2.5rem] shadow-xl hover:scale-105 hover:bg-ac-green/10 transition-all flex flex-col items-center gap-4"
                >
                  <div className="bg-ac-green p-4 rounded-full text-white shadow-md group-hover:rotate-12 transition-transform">
                    <Globe size={40} />
                  </div>
                  <span className="text-2xl font-black text-ac-brown">🇺🇸 English</span>
                </button>
                <button 
                  onClick={() => handleLanguageSelect(Language.VIETNAMESE)} 
                  className="group bg-white border-4 border-ac-yellow/30 p-8 rounded-[2.5rem] shadow-xl hover:scale-105 hover:bg-ac-yellow/10 transition-all flex flex-col items-center gap-4"
                >
                  <div className="bg-ac-yellow p-4 rounded-full text-white shadow-md group-hover:-rotate-12 transition-transform">
                    <Globe size={40} />
                  </div>
                  <span className="text-2xl font-black text-ac-brown">🇻🇳 Vietnamese</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Category Selection (Main Menu) */}
        {viewMode === 'CAT_SELECT' && (
          <div className="bg-ac-cream rounded-[4rem] p-10 shadow-2xl border-8 border-white text-center space-y-8 animate-fade-in">
            <div className="flex flex-col items-center gap-2">
              <IsabelleAvatar />
              <h2 className="text-xl font-black text-ac-brown">
                {selectedLang === Language.VIETNAMESE ? 'Menu Chính học viện đây! 🐾' : 'Main Menu is here! 🐾'}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <button onClick={() => handleCategorySelect('WORD_FORMATION')} className="bg-white border-4 border-ac-green p-5 rounded-3xl flex items-center gap-4 hover:bg-ac-green/10 transition-all text-left group shadow-lg">
                <div className="bg-ac-green p-3 rounded-2xl text-white group-hover:scale-110 transition-transform shrink-0"><Leaf size={24} /></div>
                <div className="flex-1">
                  <p className="font-black text-ac-brown text-base">1. 🌳 Word Formation</p>
                  <p className="text-[10px] text-gray-400 font-bold italic">{selectedLang === Language.VIETNAMESE ? '(A1-C2 Full List)' : '(A1-C2 Full List)'}</p>
                </div>
              </button>
              <button onClick={() => handleCategorySelect('IDIOMS_PHRASAL')} className="bg-white border-4 border-ac-blue p-5 rounded-3xl flex items-center gap-4 hover:bg-ac-blue/10 transition-all text-left group shadow-lg">
                <div className="bg-ac-blue p-3 rounded-2xl text-white group-hover:scale-110 transition-transform shrink-0"><Library size={24} /></div>
                <div className="flex-1">
                  <p className="font-black text-ac-brown text-base">2. 📚 Idioms/Phrasal Verbs</p>
                  <p className="text-[10px] text-gray-400 font-bold italic">{selectedLang === Language.VIETNAMESE ? '(Thành ngữ & Cụm từ)' : '(All-in-one)'}</p>
                </div>
              </button>
              <button onClick={() => handleCategorySelect('GRAMMAR')} className="bg-white border-4 border-purple-300 p-5 rounded-3xl flex items-center gap-4 hover:bg-purple-50 transition-all text-left group shadow-lg">
                <div className="bg-purple-400 p-3 rounded-2xl text-white group-hover:scale-110 transition-transform shrink-0"><GraduationCap size={24} /></div>
                <div className="flex-1">
                  <p className="font-black text-ac-brown text-base">3. 🏫 Grammar</p>
                  <p className="text-[10px] text-gray-400 font-bold italic">{selectedLang === Language.VIETNAMESE ? '(Ngữ pháp chuyên)' : '(Specialized Grammar)'}</p>
                </div>
              </button>
              <button onClick={() => handleCategorySelect('CHALLENGE')} className="bg-white border-4 border-ac-orange p-5 rounded-3xl flex items-center gap-4 hover:bg-ac-orange/10 transition-all text-left group shadow-lg">
                <div className="bg-ac-orange p-3 rounded-2xl text-white group-hover:scale-110 transition-transform shrink-0"><Zap size={24} /></div>
                <div className="flex-1">
                  <p className="font-black text-ac-brown text-base">4. ✍️ Challenge & Upgrade</p>
                  <p className="text-[10px] text-gray-400 font-bold italic">{selectedLang === Language.VIETNAMESE ? '(Viết lại câu C2)' : '(C2 Rewrite)'}</p>
                </div>
              </button>
            </div>
            <button onClick={() => setViewMode('LANG_SELECT')} className="text-sm font-bold text-gray-400 hover:text-ac-brown transition-colors flex items-center justify-center gap-2 mt-2">
                <ArrowLeft size={16} /> {selectedLang === Language.VIETNAMESE ? 'Quay lại' : 'Back'}
            </button>
          </div>
        )}

        {/* Step 3: Input */}
        {viewMode === 'WORD_INPUT' && (
          <div className="bg-ac-cream rounded-[4rem] p-12 shadow-2xl border-8 border-white text-center space-y-10 animate-fade-in">
            <div className="flex flex-col items-center gap-4">
              <IsabelleAvatar />
              <h2 className="text-2xl font-black text-ac-brown uppercase tracking-tight">
                {selectedLang === Language.VIETNAMESE ? 'Bước 3: Nhập yêu cầu nhé! 🍎' : 'Step 3: Enter request! 🍎'}
              </h2>
              <div className="flex gap-2 justify-center">
                <span className="text-[10px] font-black bg-white border border-ac-green text-ac-darkGreen px-3 py-1 rounded-full">{selectedLang}</span>
                <span className="text-[10px] font-black bg-white border border-ac-blue text-ac-brown px-3 py-1 rounded-full">{selectedCategory}</span>
              </div>
            </div>
            
            <div className="max-w-xl mx-auto space-y-6">
              <div className="relative group">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={getPlaceholder()}
                  className="w-full bg-white border-4 border-ac-yellow/20 rounded-[2.5rem] py-6 px-10 text-xl font-black text-ac-brown focus:outline-none focus:border-ac-yellow shadow-inner transition-all placeholder:text-gray-300"
                  onKeyDown={(e) => e.key === 'Enter' && executeAnalysis()}
                />
                <button 
                  onClick={() => executeAnalysis()}
                  className="absolute right-3 top-3 bottom-3 bg-ac-darkGreen text-white px-8 rounded-full font-black shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  {selectedLang === Language.VIETNAMESE ? 'Gửi' : 'Send'} <Search size={20} />
                </button>
              </div>
              <button onClick={() => setViewMode('CAT_SELECT')} className="text-sm font-bold text-gray-400 hover:text-ac-brown transition-colors flex items-center justify-center gap-2 mx-auto">
                <ArrowLeft size={16} /> {selectedLang === Language.VIETNAMESE ? 'Quay lại Menu' : 'Back to Menu'}
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {viewMode === 'LOADING' && (
          <div className="bg-ac-cream rounded-[4rem] p-24 shadow-2xl border-8 border-white flex flex-col items-center justify-center space-y-10 animate-pulse">
            <div className="relative">
              <IsabelleAvatar />
              <RefreshCw size={48} className="text-ac-yellow absolute -bottom-4 -right-4 animate-spin" />
            </div>
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-black text-ac-brown">{selectedLang === Language.VIETNAMESE ? 'Đang soạn tài liệu...' : 'Preparing docs...'}</h2>
              <p className="text-gray-400 font-bold italic">"Isabelle is working fast! 🐾"</p>
            </div>
          </div>
        )}

        {/* Results Screen */}
        {viewMode === 'ANALYSIS' && currentData && (
          <div className="space-y-8 animate-fade-in pb-20">
             <div className="flex flex-col md:flex-row justify-between items-center bg-white/70 p-4 rounded-3xl backdrop-blur-sm shadow-md border-4 border-white gap-4">
                <div className="flex gap-2">
                  <button onClick={resetToStart} className="flex items-center gap-2 px-6 py-2 bg-ac-brown text-ac-yellow rounded-full font-black text-sm shadow-md hover:scale-105 transition-all">
                    <Menu size={18} /> Menu
                  </button>
                  <button 
                    onClick={() => toggleFavorite(currentData.word)} 
                    className={`flex items-center gap-2 px-6 py-2 rounded-full font-black text-sm shadow-md hover:scale-105 transition-all ${favorites.includes(currentData.word) ? 'bg-ac-yellow text-ac-brown' : 'bg-white text-ac-yellow border-2 border-ac-yellow'}`}
                  >
                    <Star size={18} fill={favorites.includes(currentData.word) ? "currentColor" : "none"} />
                    {favorites.includes(currentData.word) ? 'Saved' : 'Fav'}
                  </button>
                </div>
                <div className="flex gap-3">
                  <span className="text-xs font-black bg-ac-yellow text-ac-brown px-4 py-2 rounded-2xl shadow-sm border-2 border-white">{selectedLang}</span>
                  <span className="text-xs font-black bg-ac-green text-white px-4 py-2 rounded-2xl shadow-sm border-2 border-white">{selectedCategory}</span>
                </div>
             </div>
             
             <div className="flex gap-6 items-start">
               <div className="hidden md:block">
                 <IsabelleAvatar />
               </div>
               <div className="bg-ac-cream rounded-[2.5rem] rounded-tl-none md:rounded-tl-[2.5rem] p-8 shadow-xl border-8 border-white flex-1 relative">
                 <div className="absolute -top-3 left-8 bg-ac-orange text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">Academic Services</div>
                 <p className="text-ac-brown text-lg leading-relaxed font-bold italic">
                   {currentData.greeting}
                 </p>
               </div>
             </div>

             <WordAnalysisCard data={currentData} />
             
             {/* Bottom Quick Search */}
             <div className="max-w-md mx-auto relative group mt-8">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={selectedLang === Language.VIETNAMESE ? "Gõ 'Fav', 'Menu', hoặc nhập tiếp..." : "Type 'Fav', 'Menu', or continue..."}
                  className="w-full bg-white/80 border-4 border-ac-yellow/30 rounded-full py-4 px-8 font-bold text-ac-brown focus:outline-none focus:border-ac-yellow shadow-lg backdrop-blur-sm"
                  onKeyDown={(e) => e.key === 'Enter' && executeAnalysis()}
                />
                <button onClick={() => executeAnalysis()} className="absolute right-2 top-2 bottom-2 bg-ac-yellow text-white px-6 rounded-full font-black">
                  <Search size={18} />
                </button>
             </div>
          </div>
        )}

        {/* Error State */}
        {viewMode === 'ERROR' && (
          <div className="bg-red-50 rounded-[4rem] p-16 shadow-2xl border-8 border-white text-center space-y-8">
            <div className="grayscale opacity-50">
              <IsabelleAvatar />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-red-600 uppercase tracking-tighter">
                {selectedLang === Language.VIETNAMESE ? 'Ôi chuông vàng ơi! Có lỗi rồi!' : 'Oh bells! An error occurred!'}
              </h2>
              <p className="text-gray-500 font-bold">
                {selectedLang === Language.VIETNAMESE 
                  ? 'Isabelle gặp trục trặc khi kết nối thư viện. Bạn thử lại nhé!' 
                  : 'Isabelle had trouble connecting to the library. Please try again!'}
              </p>
            </div>
            <button onClick={resetToStart} className="bg-ac-brown text-white px-10 py-4 rounded-full font-black shadow-xl hover:scale-105 transition-transform">
              {selectedLang === Language.VIETNAMESE ? 'Thử lại từ đầu' : 'Start over'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
