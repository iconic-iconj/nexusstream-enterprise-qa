import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'motion/react';
import { useCart } from '../context/CartContext';
import { Search, ShoppingCart, Box, Zap } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image_url: string;
}

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);
  const { addItem, items } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products');
        setProducts(res.data.data);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const checkServer = async () => {
      try {
        await axios.get('/api/user');
      } catch (err: any) {
        if (axios.isAxiosError(err) && err.response?.status === 500) {
          setServerError('Server Error');
        }
      }
    };
    checkServer();
  }, []);

  const filtered = products.filter(p => 
    (filter === 'All' || p.category.toLowerCase() === filter.toLowerCase()) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen pt-24 bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-gray-200 px-4 pb-20 transition-colors duration-300" data-test="dashboard">
      <div className="max-w-7xl mx-auto">
        {serverError && (
          <div className="mb-6 p-4 rounded-lg border border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-300 text-sm font-mono uppercase tracking-widest">
            Server Error
          </div>
        )}

        {/* Header - Technical Data Grid Style */}
        <header className="mb-12 border-b border-gray-200 dark:border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
              <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 uppercase tracking-widest">Repository / Inventory / v1.0.4</span>
            </div>
            <h1 className="text-5xl font-black uppercase tracking-tighter italic text-gray-900 dark:text-white">Marketplace</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-mono">Filter by category: hardware, digital_courses, peripherals</p>
          </div>
          
          <div className="flex flex-wrap gap-4 items-center">
            <Link
              to="/checkout"
              data-testid="cart-button"
              className="relative flex items-center justify-center w-11 h-11 border border-gray-300 dark:border-white/10 rounded-lg bg-white dark:bg-[#0a0a0a] hover:border-blue-500 transition-all shadow-sm"
            >
              <ShoppingCart size={18} className="text-gray-700 dark:text-gray-200" />
              <span
                data-testid="cart-count"
                className="absolute -top-2 -right-2 min-w-5 h-5 px-1 flex items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-black"
              >
                {items.length}
              </span>
            </Link>

            <div className="relative group flex items-center">
              <Search className="absolute left-3 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search components..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg py-2.5 pl-10 pr-10 text-xs font-mono focus:outline-none focus:border-blue-500 transition-colors w-64 text-gray-900 dark:text-white shadow-sm"
                data-testid="shop-search"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2 px-2 py-1 text-[10px] font-black text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
                  aria-label="Clear Search"
                >
                  Clear Search
                </button>
              )}
            </div>

            <div className="flex border border-gray-300 dark:border-white/10 rounded-lg p-1 bg-white dark:bg-[#0a0a0a] shadow-sm">
              {['All', 'Hardware', 'Digital'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${
                    filter === cat 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  data-testid={`filter-${cat.toLowerCase()}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-3/4 bg-gray-200 dark:bg-white/5 animate-pulse rounded-xl border border-gray-300 dark:border-white/10" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={product.id}
                className="group flex flex-col rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden hover:border-blue-500/50 hover:shadow-xl transition-all shadow-sm"
                data-testid="product-card"
              >
                {/* Product Image Container */}
                <div className="relative aspect-4/3 overflow-hidden border-b border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-[#0a0a0a]">
                  <img 
                    data-testid={`product-image-${product.id}`}
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-100"
                  />
                  <div className="absolute top-3 left-3">
                    <span 
                      data-testid={`product-category-${product.id}`}
                      className="px-2.5 py-1 bg-white/90 dark:bg-black/70 backdrop-blur-md text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest border border-gray-200 dark:border-white/10 rounded-md shadow-sm">
                      {product.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="px-2 py-0.5 bg-white/90 dark:bg-black/70 backdrop-blur-md text-[10px] font-mono text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 rounded-md shadow-sm">
                      STOCK: {product.stock}
                    </span>
                  </div>
                </div>
                
                {/* Details */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <h3
                      className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1"
                      data-testid={`product-name-${product.id}`}
                    >
                      {product.name}
                    </h3>

                    <span
                      className="text-blue-600 dark:text-blue-400 font-mono font-bold text-lg"
                      data-testid={`product-price-${product.id}`}
                    >
                      ${product.price}
                    </span>
                  </div>

                  <p
                    className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed mb-6 line-clamp-2"
                    data-testid={`product-description-${product.id}`}
                  >
                    {product.description}
                  </p>
                  
                  <div className="mt-auto">
                    <button
                      onClick={() => addItem(product)}
                      disabled={product.stock <= 0}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white text-sm font-semibold rounded-lg uppercase tracking-wider hover:bg-blue-500 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      data-testid={`add-to-cart-${product.id}`}
                    >
                      <ShoppingCart size={16} />
                      {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>

                {/* Footer Metadata */}
                <div className="border-t border-gray-100 dark:border-white/5 p-3 flex items-center justify-between text-[9px] font-mono text-gray-500 dark:text-gray-400 uppercase tracking-widest bg-gray-50/50 dark:bg-black/30">
                  <span className="flex items-center gap-1.5"><Zap size={10} className="text-blue-500" /> instant_fulfillment</span>
                  <span className="flex items-center gap-1"><Box size={10} /> uuid_{product.id.toString(16).padStart(4, '0')}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 border border-dashed border-gray-300 dark:border-white/10 rounded-xl bg-white/50 dark:bg-white/5">
            <span className="font-mono text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest italic">No matching assets found in persistent storage.</span>
          </div>
        )}
      </div>
    </div>
  );
}