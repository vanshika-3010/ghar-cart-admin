import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiPackage, FiFilter } from 'react-icons/fi';
import { listItemsPageStyles as styles } from '../assets/adminStyles';
import { BACKEND_URL } from '../config'; 

const StatsCard = ({ icon: Icon, color, border, label, value }) => (
  <div className={styles.statsCard(border)}>
    <div className={styles.statsCardInner}>
      <div className={styles.statsCardIconContainer(color)}>
        <Icon className={styles.statsCardIcon(color)} />
      </div>
      <div>
        <p className={styles.statsCardLabel}>{label}</p>
        <p className={styles.statsCardValue}>{value}</p>
      </div>
    </div>
  </div>
);

export default function ListItemsPage() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const loadItems = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/items`);
        const data = response.data;

        const itemCategories = data.map(item => item.category);
        const uniqueCategories = ['All', ...new Set(itemCategories)];

        setCategories(uniqueCategories);
        setItems(data);
        setFilteredItems(data);
      } catch (err) {
        console.error('Failed to load items:', err);
        alert('Could not load products. Check console.');
      }
    };
    loadItems();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'All') setFilteredItems(items);
    else setFilteredItems(items.filter(item => item.category === selectedCategory));
  }, [selectedCategory, items]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/items/${id}`);
      setItems(prev => prev.filter(i => i._id !== id));
      setFilteredItems(prev => prev.filter(i => i._id !== id));
    } catch (err) {
      console.error('Delete failed', err);
      alert('Delete failed');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.innerContainer}>
        <h1 className={styles.headerTitle}>Product Inventory</h1>

        <div className={styles.statsGrid}>
          <StatsCard
            icon={FiPackage}
            color="bg-emerald-100"
            border="border-emerald-500"
            label="Total Products"
            value={items.length}
          />
        </div>

        <div className={styles.contentContainer}>
          <div className={styles.headerFlex}>
            <h2 className={styles.headerTitleSmall}>Products ({filteredItems.length})</h2>
            <div className={styles.filterContainer}>
              <div className={styles.filterSelectContainer}>
                <div className={styles.filterIconContainer}>
                  <FiFilter className={styles.filterIcon} />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={styles.filterSelect}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <p>No products found</p>
          ) : (
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(item => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>₹{item.price}</td>
                    <td>
                      <button onClick={() => window.location.assign(`/admin/add-item?edit=${item._id}`)}>Edit</button>
                      <button onClick={() => handleDelete(item._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}