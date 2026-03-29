import React, { useState, useCallback } from 'react';
import { searchVerses } from '@/data/bibleLoader';
import type { SearchResult } from '@/data/bibleLoader';
import { useBibleStore } from '@/store/bibleStore';
import { Search, X, Loader2, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchPageProps {
  onNavigate: (page: 'home' | 'read' | 'search' | 'bookmarks') => void;
}

function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="search-highlight">{part}</mark>
    ) : (
      part
    )
  );
}

export const SearchPage: React.FC<SearchPageProps> = ({ onNavigate }) => {
  const { setLocation, currentVersion } = useBibleStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const res = await searchVerses(q, 80, 'cuv');
      setResults(res);
    } finally {
      setLoading(false);
    }
  }, [currentVersion]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch(query);
  };

  const suggestions = ['神爱世人', '耶和华', '信心', '平安', '喜乐', '恩典', '爱'];

  return (
    <div className="min-h-screen pb-24 pt-4 max-w-3xl mx-auto">
      {/* 搜索框 */}
      <div className="px-4 mb-4">
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="搜索经文关键词…"
              className="pl-9 pr-10 h-11 text-base bg-secondary border-0 focus-visible:ring-primary"
              autoFocus
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setResults([]); setSearched(false); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => handleSearch(query)}
            className="h-11 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity shrink-0"
          >
            搜索
          </button>
        </div>
      </div>

      {/* 搜索建议 */}
      {!searched && (
        <div className="px-4">
          <p className="text-xs text-muted-foreground mb-3">常用搜索</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => { setQuery(s); handleSearch(s); }}
                className="px-3 py-1.5 text-sm bg-secondary text-foreground rounded-full cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">搜索范围包含已加载的章节</p>
            <p className="text-xs text-muted-foreground mt-1">浏览更多章节后，搜索范围自动扩展</p>
          </div>
        </div>
      )}

      {/* 加载中 */}
      {loading && (
        <div className="flex flex-col items-center py-12 gap-3">
          <Loader2 className="w-7 h-7 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">搜索中…</p>
        </div>
      )}

      {/* 搜索结果 */}
      {!loading && searched && (
        <div className="px-4">
          <p className="text-xs text-muted-foreground mb-3">
            共找到 <span className="text-primary font-semibold">{results.length}</span> 条结果
            {results.length === 80 && '（已显示前80条）'}
          </p>
          {results.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4 opacity-30">
                <Search className="w-12 h-12 mx-auto text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">未找到包含「{query}」的经文</p>
              <p className="text-xs text-muted-foreground mt-2">请先浏览相关书卷以扩大搜索范围</p>
            </div>
          ) : (
            <div className="space-y-2">
              {results.map((r, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setLocation(r.bookId, r.chapter);
                    onNavigate('read');
                  }}
                  className="w-full text-left p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 cursor-pointer transition-all active:scale-99"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="text-xs font-semibold text-primary">
                      {r.bookName} {r.chapter}:{r.verse}
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed verse-text" style={{ fontSize: '0.9rem' }}>
                    {highlightText(r.text, query)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
