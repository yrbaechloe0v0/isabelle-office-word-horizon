
import * as React from 'react';
import { HistoryEntry } from '../types';
import { Star, Clock, X } from 'lucide-react';

interface NookPhoneProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  favorites: string[];
  onSelectWord: (word: string) => void;
}

export const NookPhone: React.FC<NookPhoneProps> = ({ isOpen, onClose, history, favorites, onSelectWord }) => {
  const [activeTab, setActiveTab] = React.useState<'history' | 'fav'>('history');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-sm bg-[#5C5C5C] rounded-[3rem] border-8 border-[#EBEBEB] shadow-2xl overflow-hidden h-[600px] flex flex-col">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-20"></div>

        {/* Screen */}
        <div className="flex-1 bg-ac-green/30 pt-12 px-4 pb-4 flex flex-col relative overflow-hidden">
          {/* App Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-ac-brown flex items-center gap-2">
              {activeTab === 'history' ? <Clock size={20} /> : <Star size={20} className="text-ac-yellow fill-current"/>}
              {activeTab === 'history' ? 'History' : 'Favorites'}
            </h2>
            <button onClick={onClose} className="p-1 bg-white/50 rounded-full hover:bg-white transition-colors">
              <X size={20} className="text-ac-brown" />
            </button>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto bg-white/60 rounded-2xl p-4 shadow-inner space-y-2">
            {activeTab === 'history' ? (
              history.length === 0 ? (
                <p className="text-center text-gray-500 italic mt-10">No history yet! 🐾</p>
              ) : (
                [...history].reverse().map((entry, idx) => (
                  <button
                    key={`${entry.word}-${idx}`}
                    onClick={() => { onSelectWord(entry.word); onClose(); }}
                    className="w-full text-left bg-white p-3 rounded-xl shadow-sm hover:scale-[1.02] transition-transform text-ac-brown font-semibold flex justify-between items-center"
                  >
                    <span>{entry.word}</span>
                    <span className="text-xs text-gray-400">{new Date(entry.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </button>
                ))
              )
            ) : (
              favorites.length === 0 ? (
                <p className="text-center text-gray-500 italic mt-10">No favorites yet! ⭐</p>
              ) : (
                favorites.map((word, idx) => (
                  <button
                    key={`${word}-${idx}`}
                    onClick={() => { onSelectWord(word); onClose(); }}
                    className="w-full text-left bg-white p-3 rounded-xl shadow-sm hover:scale-[1.02] transition-transform text-ac-brown font-bold border-l-4 border-ac-yellow"
                  >
                    {word}
                  </button>
                ))
              )
            )}
          </div>

          {/* Bottom Bar */}
          <div className="mt-4 flex justify-around bg-white/80 rounded-2xl p-2 shadow-lg">
             <button 
                onClick={() => setActiveTab('history')}
                className={`p-3 rounded-xl transition-all ${activeTab === 'history' ? 'bg-ac-green text-white shadow-md' : 'text-gray-400 hover:bg-gray-100'}`}
             >
               <Clock size={24} />
             </button>
             <button 
                onClick={() => setActiveTab('fav')}
                className={`p-3 rounded-xl transition-all ${activeTab === 'fav' ? 'bg-ac-yellow text-white shadow-md' : 'text-gray-400 hover:bg-gray-100'}`}
             >
               <Star size={24} className={activeTab === 'fav' ? 'fill-current' : ''} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
