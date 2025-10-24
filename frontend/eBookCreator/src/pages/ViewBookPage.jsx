import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import axiosInstance from '../utils/axiosInstance'
import { API_PATHS } from '../utils/apiPaths'
import ViewBook from '../components/view/ViewBook'

const ViewBookPage = () => {
  const [book, setBook] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { bookId } = useParams()

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axiosInstance.get(`${API_PATHS.BOOKS.GET_BOOKS_BY_ID}/${bookId}`)
        setBook(response.data)
      } catch (error) {
        toast.error('Error fetching book details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBook()
  }, [bookId])

  // Inline skeleton component
  const ViewBookSkeleton = () => (
    <div className="flex w-full min-h-screen animate-pulse bg-gradient-to-br from-slate-100 via-slate-50 to-white">
      {/* Sidebar placeholder */}
      <div className="w-80 bg-slate-200 rounded-lg mr-8"></div>

      {/* Main content placeholder */}
      <div className="flex-1 space-y-6 p-8">
        <div className="h-8 bg-slate-200 rounded w-1/2"></div>
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        <div className="h-96 bg-slate-200 rounded-lg"></div>
        <div className="flex justify-between mt-6">
          <div className="h-10 w-32 bg-slate-300 rounded-lg"></div>
          <div className="h-10 w-32 bg-slate-300 rounded-lg"></div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="w-full h-full">
      {isLoading ? <ViewBookSkeleton /> : <ViewBook book={book} />}
    </div>
  )
}

export default ViewBookPage
