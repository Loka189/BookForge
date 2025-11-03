// src/components/landing/FeaturedBooks.jsx
import React, { useState, useEffect } from 'react';
import { BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import BookCard from '../cards/BookCard';

const FeaturedBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.BOOKS.GET_PUBLISHED_BOOKS);
                // Access the data property from the response
                setBooks(response.data.slice(0, 6));
            } catch (error) {
                console.error('Failed to fetch books:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

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
                            <BookCard 
                                key={book._id} 
                                book={book} 
                                showActions={false} 
                            />
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