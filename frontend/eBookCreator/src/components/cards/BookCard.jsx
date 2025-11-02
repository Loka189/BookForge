import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Edit2, BookOpen, Calendar, Eye, MoreVertical, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { BASE_URL } from "../../utils/apiPaths";

const BookCard = ({ book, onDelete, onPublish, showActions = true }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const coverImageUrl = (book.coverImage?.url && book.coverImage.url.trim() !== "") 
  ? book.coverImage.url 
  : "https://assets.xboxservices.com/assets/1d/5b/1d5bc84f-2135-4e2f-8ca6-bb000d97db7f.jpg?n=Elden-Ring_GLP-Poster-Image-1084_1920x1080.jpg";

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const handleCardClick = () => {
    if (!showMobileMenu && !showPublishModal) {
      navigate(`/view-book/${book._id}`);
    }
  };

  const handlePublishClick = (e) => {
    e.stopPropagation();
    setShowMobileMenu(false);
    setShowPublishModal(true);
  };

  const confirmPublish = async () => {
    setIsPublishing(true);
    try {
      await onPublish(book._id);
      setShowPublishModal(false);
    } catch (error) {
      console.error('Failed to publish book:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  const isDraft = book.status === 'draft';

  return (
    <>
      <div className="group relative">
        {/* Gradient glow effect on hover */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500"></div>
        
        <div
          className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-[1.02]"
          onClick={handleCardClick}
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

            {/* Action buttons - Desktop (hover) and Mobile (always visible with menu) */}
            {showActions && (
              <>
                {/* Desktop: Floating action buttons on hover */}
                <div className="hidden md:flex absolute top-3 right-3 gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/editor/${book._id}`);
                    }}
                    className="p-2 bg-white/95 hover:bg-white rounded-lg shadow-lg transition-all duration-300 hover:scale-110 hover:rotate-6 backdrop-blur-sm cursor-pointer"
                    title="Edit Book"
                  >
                    <Edit2 size={14} className="text-violet-600" />
                  </button>
                  {isDraft && (
                    <button
                      onClick={handlePublishClick}
                      className="p-2 bg-white/95 hover:bg-green-50 rounded-lg shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm cursor-pointer"
                      title="Publish Book"
                    >
                      <Upload size={14} className="text-green-600" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(book._id);
                    }}
                    className="p-2 bg-white/95 hover:bg-red-50 rounded-lg shadow-lg transition-all duration-300 hover:scale-110 hover:-rotate-6 backdrop-blur-sm cursor-pointer"
                    title="Delete Book"
                  >
                    <Trash2 size={14} className="text-red-600" />
                  </button>
                </div>

                {/* Mobile: Menu button always visible */}
                <div className="md:hidden absolute top-3 right-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMobileMenu(!showMobileMenu);
                    }}
                    className="p-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg transition-all duration-300"
                  >
                    <MoreVertical size={16} className="text-gray-700" />
                  </button>

                  {/* Mobile dropdown menu */}
                  {showMobileMenu && (
                    <>
                      {/* Backdrop to close menu */}
                      <div 
                        className="fixed inset-0 z-40"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMobileMenu(false);
                        }}
                      />
                      
                      {/* Menu */}
                      <div className="absolute top-12 right-0 z-50 bg-white rounded-xl shadow-2xl overflow-hidden min-w-[160px] animate-in fade-in slide-in-from-top-2 duration-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowMobileMenu(false);
                            navigate(`/editor/${book._id}`);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-violet-50 transition-colors border-b border-gray-100"
                        >
                          <Edit2 size={16} className="text-violet-600" />
                          <span className="text-sm font-medium text-gray-700">Edit Book</span>
                        </button>
                        {isDraft && (
                          <button
                            onClick={handlePublishClick}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-green-50 transition-colors border-b border-gray-100"
                          >
                            <Upload size={16} className="text-green-600" />
                            <span className="text-sm font-medium text-gray-700">Publish Book</span>
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowMobileMenu(false);
                            onDelete(book._id);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={16} className="text-red-600" />
                          <span className="text-sm font-medium text-gray-700">Delete Book</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}

            {/* Bottom stats overlay */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-white text-[10px] font-medium">
                <BookOpen className="w-3 h-3" />
                <span>{book.chapterCount || 0}</span>
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

      {/* Publish Confirmation Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-6 h-6 text-green-600" />
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Publish Book?
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to publish "<span className="font-semibold text-gray-900">{book.title}</span>"? 
              Once published, it will be visible to all readers.
            </p>

            {/* Info box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 flex gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">
                You can always unpublish your book later if needed.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPublishModal(false);
                }}
                disabled={isPublishing}
                className="cursor-pointer flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  confirmPublish();
                }}
                disabled={isPublishing}
                className="cursor-pointer flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isPublishing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Publishing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Publish
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookCard;