import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Edit2, BookOpen, Calendar, Eye, Sparkles } from "lucide-react";
import { BASE_URL } from "../../utils/apiPaths";

const BookCard = ({ book, onDelete }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  const coverImageUrl = book.coverImage
    ? `${BASE_URL.replace(/\/$/, "")}${book.coverImage}`
    : "https://assets.xboxservices.com/assets/1d/5b/1d5bc84f-2135-4e2f-8ca6-bb000d97db7f.jpg?n=Elden-Ring_GLP-Poster-Image-1084_1920x1080.jpg";

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="group relative">
      {/* Gradient glow effect on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500"></div>
      
      <div
        className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-[1.02]"
        onClick={() => navigate(`/view-book/${book._id}`)}
      >
        {/* Cover Image Section */}
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-violet-100 to-purple-100">
          {/* Loading skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-violet-200 to-purple-200 animate-pulse"></div>
          )}
          
          <img
            src={coverImageUrl}
            alt={book.title}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.src = "https://assets.xboxservices.com/assets/1d/5b/1d5bc84f-2135-4e2f-8ca6-bb000d97db7f.jpg?n=Elden-Ring_GLP-Poster-Image-1084_1920x1080.jpg";
            }}
          />

          {/* Enhanced gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

         

          {/* Floating action buttons */}
          <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/editor/${book._id}`);
              }}
              className="p-2 bg-white/95 hover:bg-white rounded-lg shadow-lg transition-all duration-300 hover:scale-110 hover:rotate-6 backdrop-blur-sm"
              title="Edit Book"
            >
              <Edit2 size={14} className="text-violet-600" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(book._id);
              }}
              className="p-2 bg-white/95 hover:bg-red-50 rounded-lg shadow-lg transition-all duration-300 hover:scale-110 hover:-rotate-6 backdrop-blur-sm"
              title="Delete Book"
            >
              <Trash2 size={14} className="text-red-600" />
            </button>
          </div>

          {/* Bottom stats overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-white text-[10px] font-medium">
              <BookOpen className="w-3 h-3" />
              <span>{book.chapters?.length || 0}</span>
            </div>
            {book.views && (
              <div className="flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-white text-[10px] font-medium">
                <Eye className="w-3 h-3" />
                <span>{book.views}</span>
              </div>
            )}
          </div>
        </div>

        {/* Book Info Section */}
        <div className="p-4 space-y-2">
          

          {/* Title and Author */}
          <div className="space-y-1">
            <h3 className="font-bold text-gray-900 text-base leading-tight line-clamp-2 group-hover:text-violet-600 transition-colors duration-300">
              {book.title}
            </h3>
            <p className="text-xs text-gray-500 font-medium truncate">
              <span className="text-violet-500">by</span> {book.author || "Unknown Author"}
            </p>
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between pt-1.5 border-t border-gray-100">
            <div className="flex items-center gap-1 text-[10px] text-gray-400">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(book.createdAt)}</span>
            </div>
            {book.status && (
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                book.status === 'published' 
                  ? 'bg-green-50 text-green-700'
                  : 'bg-yellow-50 text-yellow-700'
              }`}>
                <div className={`w-1 h-1 rounded-full animate-pulse ${
                  book.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'
                }`}></div>
                {book.status === 'published' ? 'Published' : 'Draft'}
              </div>
            )}
          </div>
        </div>

        {/* Hover indicator line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
      </div>
    </div>
  );
};

export default BookCard;