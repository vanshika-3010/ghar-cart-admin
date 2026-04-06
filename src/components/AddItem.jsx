import React, { useState } from 'react';
import axios from 'axios';

export default function AddItemPage() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!token) {
      alert('Unauthorized: Please login again');
      return;
    }

    if (!name || !category || !price || !oldPrice) {
      alert('Please fill all required fields!');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('name', name);
      formData.append('category', category);
      formData.append('price', parseFloat(price));
      formData.append('oldPrice', parseFloat(oldPrice));
      if (imageFile) formData.append('image', imageFile);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/items`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      alert('Product added successfully!');
      console.log(response.data);

      // Reset form
      setName('');
      setCategory('');
      setPrice('');
      setOldPrice('');
      setImageFile(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Add Product</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md max-w-4xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded w-full"
          />

          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded w-full"
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border p-2 rounded w-full"
          />

          <input
            type="number"
            placeholder="Old Price"
            value={oldPrice}
            onChange={(e) => setOldPrice(e.target.value)}
            className="border p-2 rounded w-full"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files.length > 0) {
                setImageFile(e.target.files[0]);
              }
            }}
            className="border p-2 rounded w-full col-span-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}