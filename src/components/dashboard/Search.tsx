
import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Search() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`relative ${isExpanded ? "w-full md:w-80" : "w-10"} transition-all duration-300 ease-in-out`}>
      <div className="relative flex items-center">
        {!isExpanded && (
          <button 
            onClick={() => setIsExpanded(true)}
            className="absolute left-0 top-0 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <SearchIcon size={18} className="text-gray-500" />
          </button>
        )}
        
        <Input
          type="search"
          placeholder="Search transactions, categories..."
          className={`rounded-full h-10 pl-10 transition-all ${isExpanded ? "opacity-100 w-full" : "opacity-0 w-0"}`}
          onBlur={() => {
            if (!event.target.value) {
              setIsExpanded(false);
            }
          }}
        />
        
        {isExpanded && (
          <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        )}
      </div>
    </div>
  );
}
