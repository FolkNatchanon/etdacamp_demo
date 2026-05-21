import { useState } from 'react';
import { X, Copy, Check, FileCode } from 'lucide-react';

interface JSONInspectorModalProps {
  title: string;
  jsonData: any;
  onClose: () => void;
}

export default function JSONInspectorModal({
  title,
  jsonData,
  onClose,
}: JSONInspectorModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple and clean JSON syntax highlighter (One Dark Pro style)
  const syntaxHighlight = (jsonObj: any) => {
    let jsonStr = JSON.stringify(jsonObj, null, 2);
    // Escape HTML
    jsonStr = jsonStr
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    // Regexp to find keys, strings, numbers, booleans, null
    return jsonStr.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      (match) => {
        let cls = 'text-[#d19a66]'; // default orange/gold for numbers
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'text-[#e06c75] font-semibold'; // red/pink for JSON keys
          } else {
            cls = 'text-[#98c379]'; // green for string values
          }
        } else if (/true|false/.test(match)) {
          cls = 'text-[#56b6c2] font-semibold'; // cyan for booleans
        } else if (/null/.test(match)) {
          cls = 'text-[#abb2bf] opacity-60'; // light gray for null
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[999] animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5 text-indigo-400">
            <FileCode size={20} className="shrink-0" />
            <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wide truncate">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-xl p-1.5 transition-all active:scale-90"
          >
            <X size={18} />
          </button>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto p-4 bg-[#282c34]">
          <pre
            className="font-mono text-[11px] leading-relaxed text-[#abb2bf] select-text whitespace-pre-wrap break-all"
            dangerouslySetInnerHTML={{ __html: syntaxHighlight(jsonData) }}
          />
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/80 flex justify-between items-center shrink-0">
          <span className="text-[10px] text-slate-500 font-mono">
            Standard: W3C Verifiable Credentials Data Model v2.0
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 bg-indigo-600/90 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-semibold active:scale-95 transition-all shadow-lg shadow-indigo-600/20"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-300" />
                  คัดลอกแล้ว!
                </>
              ) : (
                <>
                  <Copy size={14} />
                  คัดลอก JSON
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
