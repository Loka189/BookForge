import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Book } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import DashboardLayout from "../components/layouts/DashboardLayout";
import BookCard from "../components/cards/BookCard";
import CreateBookModal from "../components/modal/CreateBookModal";

// ✅ Skeleton Loader
const BookCardSkeletonLoader = () => (
  <div className="bg-white rounded-2xl shadow-md p-4 flex items-center space-x-4 animate-pulse">
    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-200"></div>
    <div className="flex-1">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
);

// ✅ Delete Confirmation Modal
const ConfirmationModal = ({ isOpen, onClose, onConfirm, message, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md z-10 animate-fadeInUp">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <Button
            variant="secondary"
            onClick={onClose}
            className="bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 text-white hover:bg-red-700 transition-colors duration-200"
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // ✅ Fetch all books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(API_PATHS.BOOKS.GET_BOOKS);
        setBooks(response.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch books");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // ✅ Handlers
  const handleCreateBook = () => setIsCreateModalOpen(true);

  const handleBookCreated = (bookId) => {
    setIsCreateModalOpen(false);
    navigate(`/editor/${bookId}`);
  };

  const handleDeleteBook = async (bookId) => {
    try {
      await axiosInstance.delete(`${API_PATHS.BOOKS.DELETE_BOOK}/${bookId}`);
      setBooks((prev) => prev.filter((b) => b._id !== bookId));
      toast.success("eBook deleted successfully");
    } catch {
      toast.error("Failed to delete eBook");
    } finally {
      setBookToDelete(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              All eBooks
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              Manage your eBooks here. Create, edit, and organize your content.
            </p>
          </div>

          <Button
            onClick={handleCreateBook}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-violet-600 to-purple-500 text-white px-5 py-2.5 rounded-2xl font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 transform transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Create New eBook</span>
          </Button>
        </div>

        {/* Book Section */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <BookCardSkeletonLoader key={i} />
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="text-center mt-6 space-y-4">
            <Book className="w-16 h-16 text-gray-300 mx-auto" />
            <h3 className="text-lg font-semibold text-gray-900">
              No eBooks found.
            </h3>
            <p className="text-gray-500">
              You haven’t created any eBooks yet. Click below to get started!
            </p>
            <Button
              onClick={handleCreateBook}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-violet-600 to-purple-500 text-white px-5 py-2.5 rounded-2xl font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 transform transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Create New eBook</span>
            </Button>
          </div>
        ) : (
          <div
            className="
              grid
              gap-6
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
              xl:grid-cols-5
            "
          >
            {books.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onDelete={() => setBookToDelete(book._id)}
              />
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={!!bookToDelete}
          onClose={() => setBookToDelete(null)}
          onConfirm={() => handleDeleteBook(bookToDelete)}
          title="Confirm Deletion"
          message="Are you sure you want to delete this eBook? This action cannot be undone."
        />

        {/* Create Book Modal */}
        <CreateBookModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onBookCreated={handleBookCreated}
        />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
