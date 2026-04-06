import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ListItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/items`
      );
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Unauthorized');
      return;
    }

    if (!window.confirm('Are you sure?')) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/items/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setItems(items.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Product List</h2>

      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Old Price</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="border-t">
                <td className="p-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.category}</td>
                <td className="p-3">₹{item.price}</td>
                <td className="p-3 line-through text-gray-500">
                  ₹{item.oldPrice}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => deleteItem(item._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}