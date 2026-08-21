import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/api';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['All', 'Sneakers', 'Running', 'Boots', 'Formal', 'Sandals'];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(
    CATEGORIES.includes(initialCategory) ? initialCategory : 'All'
  );
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Keep the URL in sync so category links (e.g. from the Home page tiles)
  // and browser back/forward both work as expected.
  const handleCategoryChange = (c) => {
    setCategory(c);
    if (c === 'All') setSearchParams({});
    else setSearchParams({ category: c });
  };

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category !== 'All') params.category = category;
    if (search) params.search = search;
    api.get('/products', { params }).then(({ data }) => {
      setProducts(data);
      setLoading(false);
    });
  }, [category, search]);

  return (
    <div className="container">
      <h1 className="section-title" style={{ marginTop: 40 }}>Shop</h1>

      <div className="toolbar">
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => handleCategoryChange(c)}
              className={c === category ? 'btn btn-primary' : 'btn btn-outline'}
              style={{ padding: '8px 16px', fontSize: 12 }}
            >
              {c}
            </button>
          ))}
        </div>
        <input
          placeholder="Search shoes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '10px 14px', border: '1px solid #ccc', borderRadius: 4, minWidth: 220 }}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No shoes match that search.</p>
      ) : (
        <div className="grid">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
