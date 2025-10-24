import React from 'react'
import { BASE_URL } from '../../utils/apiPaths'
import Button from '../ui/Button'
import { UploadCloud } from 'lucide-react'
import InputField from '../ui/InputField'

const BookDetailsTab = ({
    book,
    onBookChange,
    onCoverImageUpload,
    isUploading,
    fileInputRef
}) => {
    const coverImageUrl = book.coverImage.startsWith('http') ? book.coverImage : `${BASE_URL}/${book.coverImage}`;
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm space-y-6">
      <h2>Book Details</h2>
      <InputField
        label="Title"
        name="title"
        value={book.title}
        onChange={onBookChange}
      />
      <InputField
        label="Author"
        name="author"
        value={book.author}
        onChange={onBookChange}
      />
      <InputField
        label="Description"
        name="description"
        value={book.description}
        onChange={onBookChange}
      />
      <div>
        <img src={coverImageUrl} alt="Cover" />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={onCoverImageUpload}
          disabled={isUploading}
        />
        <Button
          onClick={() => fileInputRef.current.click()}
          disabled={isUploading}
        >
          <UploadCloud />
          Upload Cover Image
        </Button>
      </div>
    </div>
  )
}

export default BookDetailsTab
