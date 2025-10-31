// src/pages/BooksPage.jsx
import React, { useState, useEffect } from 'react';
import { BookOpen, User, ArrowRight, Search, Filter, Loader2, Library } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance'; // adjust path
import { API_PATHS } from '../utils/apiPaths'; // adjust path
import Navbar from '../components/layouts/Navbar';

const BooksPage = () => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const { data } = await axiosInstance.get(API_PATHS.BOOKS.GET_PUBLISHED);
                console.log('📚 Books data:', data); // ADD THIS
                console.log('📷 First book cover:', data[0]?.coverImage); // AND THIS
                setBooks(data);
                setFilteredBooks(data);
            } catch (error) {
                console.error('Failed to fetch books:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    // Search filter
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredBooks(books);
        } else {
            const filtered = books.filter(book =>
                book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredBooks(filtered);
        }
    }, [searchTerm, books]);

    const handleReadClick = (bookId) => {
        navigate(`/view-book/${bookId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
                <Navbar />
                <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 text-violet-600 animate-spin mx-auto mb-4" />
                        <p className="text-gray-600 text-lg">Loading books...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
            <Navbar />

            {/* Floating background blobs */}
            <div
                className="fixed top-20 right-10 w-64 h-64 bg-gradient-to-br from-purple-300/30 to-violet-200/20 rounded-full blur-3xl animate-float pointer-events-none"
                style={{ animationDuration: '10s' }}
            ></div>
            <div
                className="fixed bottom-20 left-10 w-96 h-96 bg-gradient-to-tl from-violet-200/30 to-purple-200/20 rounded-full blur-3xl animate-float pointer-events-none"
                style={{ animationDuration: '12s', animationDelay: '500ms' }}
            ></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 relative">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                            <Library className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
                                Browse{' '}
                                <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                                    All Books
                                </span>
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Discover {books.length} published {books.length === 1 ? 'book' : 'books'}
                            </p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative max-w-xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by title, author, or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-200"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {/* Books Grid */}
                {filteredBooks.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <BookOpen className="w-10 h-10 text-violet-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {searchTerm ? 'No books found' : 'No books yet'}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {searchTerm
                                ? 'Try adjusting your search terms'
                                : 'Be the first to publish a book!'}
                        </p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="px-6 py-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Results count */}
                        {searchTerm && (
                            <div className="mb-6 text-sm text-gray-600">
                                Found {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredBooks.map((book) => (
                                <div
                                    key={book._id}
                                    className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200/50 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer"
                                    onClick={() => handleReadClick(book._id)}
                                >
                                    {/* Book Cover */}
                                    <div className="relative h-64 bg-gradient-to-br from-violet-100 to-purple-100 overflow-hidden">
                                        {book.coverImage ? (
                                            <img
                                                src={book.coverImage?.url || 'https://www.globaluniversityalliance.org/wp-content/uploads/2017/10/No-Cover-Image-01.png'}
                                                alt={book.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <BookOpen className="w-16 h-16 text-violet-300" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                        {/* Hover overlay with Read button */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleReadClick(book._id);
                                                }}
                                                className="bg-white text-violet-600 px-5 py-2.5 rounded-xl font-bold shadow-lg hover:bg-violet-600 hover:text-white transition-all duration-300 flex items-center gap-2"
                                            >
                                                <BookOpen className="w-4 h-4" />
                                                Read Now
                                            </button>
                                        </div>
                                    </div>

                                    {/* Book Info */}
                                    <div className="p-5">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-violet-600 transition-colors">
                                            {book.title}
                                        </h3>

                                        {book.subtitle && (
                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                {book.subtitle}
                                            </p>
                                        )}

                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
                                                    <User className="w-3.5 h-3.5 text-white" />
                                                </div>
                                                <span className="text-sm font-medium text-gray-700 truncate">
                                                    {book.author}
                                                </span>
                                            </div>

                                            <ArrowRight className="w-5 h-5 text-violet-600 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>

                                    {/* Gradient border effect on hover */}
                                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                        <div className="absolute inset-0 rounded-2xl border-2 border-violet-500/50"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
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

export default BooksPage;