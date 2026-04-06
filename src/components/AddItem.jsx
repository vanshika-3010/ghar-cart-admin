import React, { useState } from 'react';
import axios from 'axios';

export default function AddItemPage() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !category || !price || !oldPrice) {
      alert('Please fill all required fields!');
      return;
    }

    try {
      const token = localStorage.getItem('token'); // JWT from login

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

      setName('');
      setCategory('');
      setPrice('');
      setOldPrice('');
      setImageFile(null);
    } catch (err) {
      console.error('Error adding product:', err);
      alert(err.response?.data?.message || 'Failed to add product');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        type="number"
        placeholder="Old Price"
        value={oldPrice}
        onChange={(e) => setOldPrice(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
      />
      <button type="submit">Add Product</button>
    </form>
  );
}