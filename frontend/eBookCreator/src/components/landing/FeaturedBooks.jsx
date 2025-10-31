import React, { useState, useEffect } from 'react';
import { BookOpen, User, ArrowRight, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from '../../utils/apiPaths';

const FeaturedBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const { data } = await axiosInstance.get(API_PATHS.BOOKS.GET_PUBLISHED);
                // Show only first 6 books for featured section
                setBooks(data.slice(0, 6));
            } catch (error) {
                console.error('Failed to fetch books:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const handleReadClick = (bookId) => {
        if (isAuthenticated) {
            navigate(`/view-book/${bookId}`);
        } else {
            navigate('/login');
        }
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-violet-50 via-white to-purple-50 py-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-violet-600 border-r-transparent"></div>
                        <p className="mt-4 text-gray-600">Loading amazing books...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative bg-gradient-to-br from-violet-50 via-white to-purple-50 py-20 lg:py-28 overflow-hidden">
            {/* Floating background blobs */}
            <div
                className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-purple-300/30 to-violet-200/20 rounded-full blur-3xl animate-float"
                style={{ animationDuration: '10s' }}
            ></div>
            <div
                className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tl from-violet-200/30 to-purple-200/20 rounded-full blur-3xl animate-float"
                style={{ animationDuration: '12s', animationDelay: '500ms' }}
            ></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-full border border-violet-200/50 shadow-lg shadow-violet-500/10 mb-6">
                        <Sparkles className="h-4 w-4 text-violet-600" />
                        <span className="text-sm font-semibold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                            Featured Books
                        </span>
                    </div>

                    <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
                        Discover Amazing{' '}
                        <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                            Stories
                        </span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Explore our collection of published books created by talented authors
                    </p>
                </div>

                {/* Books Grid */}
                {books.length === 0 ? (
                    <div className="text-center py-12">
                        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 text-lg">No books available yet. Be the first to publish!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {books.map((book) => (
                            <div
                                key={book._id}
                                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200/50 hover:scale-[1.02] hover:-translate-y-1"
                            >
                                {/* Book Cover */}
                                <div className="relative h-64 bg-gradient-to-br from-violet-100 to-purple-100 overflow-hidden">
                                    {book.coverImage ? (
                                        <img
                                            src={book.coverImage}
                                            alt={book.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <BookOpen className="w-20 h-20 text-violet-300" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                    {/* Hover overlay with Read button */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button
                                            onClick={() => handleReadClick(book._id)}
                                            className="bg-white text-violet-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-violet-600 hover:text-white transition-all duration-300 flex items-center gap-2"
                                        >
                                            <BookOpen className="w-5 h-5" />
                                            Read Now
                                        </button>
                                    </div>
                                </div>

                                {/* Book Info */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-violet-600 transition-colors">
                                        {book.title}
                                    </h3>

                                    {book.subtitle && (
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                            {book.subtitle}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
                                                <User className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">
                                                {book.author}
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => handleReadClick(book._id)}
                                            className="text-violet-600 hover:text-violet-700 transition-colors"
                                        >
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Gradient border effect on hover */}
                                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                    <div className="absolute inset-0 rounded-2xl border-2 border-violet-500/50"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* View All Books CTA */}
                {books.length > 0 && (
                    <div className="text-center mt-16">
                        <Link
                            to={isAuthenticated ? "/books" : "/login"}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold rounded-2xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300"
                        >
                            {isAuthenticated ? 'Browse All Books' : 'Sign in to Browse More'}
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          .animate-float { 
            animation: float 6s ease-in-out infinite; 
          }
        `
            }} />
        </div>
    );
};

export default FeaturedBooks;