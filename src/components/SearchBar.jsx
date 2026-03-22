import { Search, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/Button';

export default function SearchBar({
  onSearch,
  className = '',
  placeholder = 'Search by city or location...',
}) {
  const [query, setQuery] = useState('');

  return (
    <div
      className={`flex items-center gap-2 p-2 rounded-2xl backdrop-blur-xl bg-white/70 border border-white/30 shadow-md focus-within:shadow-lg focus-within:ring-2 focus-within:ring-blue-400 transition-all ${className}`}
    >
      {/* Input Section */}
      <div className="flex items-center gap-2 flex-1 px-3">

        <MapPin className="w-4 h-4 text-blue-500 shrink-0" />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch(query)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
        />

      </div>

      {/* Button */}
      <Button
        size="sm"
        className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:scale-105 transition"
        onClick={() => onSearch(query)}
      >
        <Search className="w-4 h-4" />
        Search
      </Button>
    </div>
  );
}