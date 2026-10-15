import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Cpu,
  Shield,
  Gauge,
  Bot,
  CheckCircle2,
  ShoppingCart,
  RefreshCw,
  AlertCircle,
  Package,
  Activity,
  Database,
  LockKeyhole,
  Workflow,
} from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number | string;
  category: string;
  stock: number;
  image_url: string;
}

interface HealthResponse {
  success: boolean;
  status: string;
  timestamp: string;
}

type ApiStatus = 'checking' | 'online' | 'offline';

const formatPrice = (price: number | string): string => {
  const amount = Number(price);

  if (!Number.isFinite(amount)) {
    return 'Price unavailable';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const pillars = [
  {
    title: 'Risk-based QA',
    description:
      'Prioritize authentication, checkout, inventory, authorization, and other business-critical failure points.',
    icon: Shield,
    label: 'BUSINESS RISK',
  },
  {
    title: 'API & UI automation',
    description:
      'Validate REST contracts, browser workflows, response schemas, error handling, and regression behavior.',
    icon: CheckCircle2,
    label: 'TEST COVERAGE',
  },
  {
    title: 'AI quality evaluation',
    description:
      'Evaluate response correctness, grounding, policy adherence, and resistance to unsupported claims.',
    icon: Bot,
    label: 'AI RELIABILITY',
  },
];

const capabilities = [
  {
    icon: Activity,
    title: 'API validation',
    description: 'HTTP status codes, JSON contracts, authentication, and error responses.',
  },
  {
    icon: Database,
    title: 'Database integrity',
    description: 'Product inventory, order persistence, data consistency, and SQL verification.',
  },
  {
    icon: LockKeyhole,
    title: 'Security regression',
    description: 'Unauthorized access, role boundaries, session handling, and access control.',
  },
  {
    icon: Workflow,
    title: 'CI/CD quality gates',
    description: 'Repeatable automated checks, regression reports, and build failure evidence.',
  },
];

const badges = [
  { icon: Cpu, label: 'API TESTING', color: 'text-emerald-400' },
  { icon: Shield, label: 'RISK-BASED QA', color: 'text-blue-400' },
  { icon: Gauge, label: 'CI QUALITY GATES', color: 'text-violet-400' },
];

const fallbackImages = [
  'https://images.unsplash.com/photo-1517336712462-83975851d87d?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [apiStatus, setApiStatus] = useState<ApiStatus>('checking');
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadHomepageData() {
      const healthPromise = fetch('/api/health', {
        signal: controller.signal,
      })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error('Health endpoint returned an error.');
          }

          const result: HealthResponse = await response.json();

          if (!result.success || result.status !== 'operational') {
            throw new Error('API is not operational.');
          }

          setApiStatus('online');
        })
        .catch((error: unknown) => {
          if (error instanceof Error && error.name === 'AbortError') {
            return;
          }

          setApiStatus('offline');
        });

      const productsPromise = fetch('/api/products', {
        signal: controller.signal,
      })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(
              `Product request failed with status ${response.status}.`,
            );
          }

          const result: { data?: Product[] } = await response.json();

          if (!Array.isArray(result.data)) {
            throw new Error('The product API returned an invalid response.');
          }

          setProducts(result.data);
          setProductsError('');
        })
        .catch((error: unknown) => {
          if (error instanceof Error && error.name === 'AbortError') {
            return;
          }

          setProductsError(
            error instanceof Error
              ? error.message
              : 'Unable to load products.',
          );
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setProductsLoading(false);
          }
        });

      await Promise.all([healthPromise, productsPromise]);
    }

    void loadHomepageData();

    return () => {
      controller.abort();
    };
  }, []);

  const retryProducts = async () => {
    setProductsLoading(true);
    setProductsError('');

    try {
      const response = await fetch('/api/products');

      if (!response.ok) {
        throw new Error(
          `Product request failed with status ${response.status}.`,
        );
      }

      const result: { data?: Product[] } = await response.json();

      if (!Array.isArray(result.data)) {
        throw new Error('The product API returned an invalid response.');
      }

      setProducts(result.data);
    } catch (error: unknown) {
      setProductsError(
        error instanceof Error
          ? error.message
          : 'Unable to load products.',
      );
    } finally {
      setProductsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50 pt-16 text-neutral-900 transition-colors duration-300 dark:bg-[#050505] dark:text-neutral-100">
      {/* Hero Section */}
      <section
        className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 md:pt-24"
        data-test="editorial-split"
      >
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
          >
            <div className="mb-6 flex items-center gap-3">
              <span className="rounded-md bg-blue-600 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
                Enterprise QA Lab
              </span>
              <span className="h-px w-16 bg-neutral-200 dark:bg-neutral-800" />
            </div>

            <h1 className="mb-6 text-5xl font-black uppercase tracking-tight text-neutral-900 dark:text-white sm:text-6xl lg:text-7xl">
              Nexus
              <br />
              <span className="text-blue-600 dark:text-blue-500">
                Quality
              </span>
              <br />
              Engineering
            </h1>

            <p className="mb-8 max-w-xl font-mono text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              An enterprise storefront built to demonstrate software testing, API
              automation, database validation, security regression, and AI
              application quality evaluation.
            </p>

            <div className="mb-8 flex flex-wrap gap-4">
              <Link
                to="/shop"
                data-test="hero-shop-button"
                className="group inline-flex items-center gap-3 rounded-xl bg-blue-600 px-7 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500 hover:shadow-blue-500/30"
              >
                Explore storefront
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/login"
                data-test="hero-login-button"
                className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-7 py-4 text-sm font-bold uppercase tracking-wider text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                Test authentication
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-xs text-neutral-500 dark:text-neutral-400">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={16} className="text-blue-500" />
                API-driven products
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={16} className="text-blue-500" />
                Database-backed
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={16} className="text-blue-500" />
                Automation-ready
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative"
          >
            <div className="group relative aspect-square overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
              <img
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000"
                alt="Cybersecurity and software engineering workstation"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent" />

              <div className="absolute right-5 top-5 flex flex-col gap-3 sm:right-8 sm:top-8">
                {badges.map((item) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="inline-flex items-center gap-3 rounded-2xl border border-neutral-800/60 bg-neutral-950/80 px-4 py-3 shadow-xl backdrop-blur-xl"
                  >
                    <item.icon size={18} className={item.color} />
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-200">
                      {item.label}
                    </span>
                  </motion.div>
                ))}
              </div>

              <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8">
                <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-neutral-400">
                  Application Health Status
                </div>

                <div
                  data-test="api-health-status"
                  data-status={apiStatus}
                  role="status"
                  aria-live="polite"
                  className="flex items-center gap-3 text-sm font-bold uppercase tracking-wide text-white"
                >
                  <span
                    className={`h-3 w-3 rounded-full ${
                      apiStatus === 'online'
                        ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]'
                        : apiStatus === 'offline'
                          ? 'bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.5)]'
                          : 'animate-pulse bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                    }`}
                  />
                  {apiStatus === 'online'
                    ? 'API operational'
                    : apiStatus === 'offline'
                      ? 'API unavailable'
                      : 'Checking API...'}
                </div>

                <p className="mt-2 font-mono text-xs text-neutral-400">
                  Express API / Database / Test workflows
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* System Overview Bar */}
      <section className="border-y border-neutral-200 bg-white px-4 py-8 dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-blue-500/10 p-3.5 text-blue-600 dark:text-blue-400">
              <Activity size={24} />
            </div>
            <div>
              <div className="text-sm font-bold uppercase tracking-wide">REST API</div>
              <p className="mt-1 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                Health, auth, products and orders
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-violet-500/10 p-3.5 text-violet-600 dark:text-violet-400">
              <Database size={24} />
            </div>
            <div>
              <div className="text-sm font-bold uppercase tracking-wide">Persistent Data</div>
              <p className="mt-1 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                SQLite or PostgreSQL backend
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-emerald-500/10 p-3.5 text-emerald-600 dark:text-emerald-400">
              <ShoppingCart size={24} />
            </div>
            <div>
              <div className="text-sm font-bold uppercase tracking-wide">Business Workflows</div>
              <p className="mt-1 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                Storefront, inventory and checkout
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Product Catalog Section */}
      <section
        className="border-b border-neutral-200 px-4 py-20 dark:border-neutral-800"
        data-test="product-catalog-section"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                Live API Response
              </p>
              <h2 className="text-3xl font-black uppercase tracking-tight text-neutral-900 dark:text-white sm:text-5xl">
                Storefront <span className="text-blue-600 dark:text-blue-500">Catalog</span>
              </h2>
              <p className="mt-3 max-w-xl font-mono text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                Products are loaded dynamically from <code className="text-blue-600 dark:text-blue-400">GET /api/products</code>. Pricing, inventory counts, categories, and imagery update instantly from the server response.
              </p>
            </div>

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 self-start font-mono text-xs font-bold uppercase tracking-wider text-blue-600 transition-colors hover:text-blue-500 dark:text-blue-400 md:self-auto"
            >
              Open full marketplace
              <ArrowRight size={16} />
            </Link>
          </div>

          {productsLoading ? (
            <div
              data-test="products-loading"
              role="status"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4"
            >
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-3xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <div className="aspect-[4/3] animate-pulse bg-neutral-200 dark:bg-neutral-800" />
                  <div className="space-y-3 p-6">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
                    <div className="h-3 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
                  </div>
                </div>
              ))}
            </div>
          ) : productsError ? (
            <div
              data-test="products-error"
              role="alert"
              className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8"
            >
              <div className="flex items-start gap-4">
                <AlertCircle className="mt-0.5 shrink-0 text-red-500" size={24} />
                <div>
                  <h3 className="font-bold text-neutral-900 dark:text-white">
                    Unable to load the product catalog
                  </h3>
                  <p className="mt-2 break-words font-mono text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {productsError}
                  </p>
                  <button
                    type="button"
                    onClick={retryProducts}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-blue-500"
                    data-test="retry-products-button"
                  >
                    <RefreshCw size={15} />
                    Retry request
                  </button>
                </div>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div
              data-test="products-empty"
              className="rounded-3xl border border-neutral-200 bg-white p-12 text-center dark:border-neutral-800 dark:bg-neutral-900/50"
            >
              <Package size={40} className="mx-auto mb-4 text-neutral-400" />
              <h3 className="text-lg font-bold uppercase tracking-tight">No products available</h3>
              <p className="mt-2 font-mono text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                The API returned an empty product catalog. Seed the database before testing checkout workflows.
              </p>
              <button
                type="button"
                onClick={retryProducts}
                className="mt-6 rounded-xl border border-neutral-300 px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
              >
                Refresh catalog
              </button>
            </div>
          ) : (
            <>
              <div
                data-test="product-count"
                className="mb-6 font-mono text-xs text-neutral-500 dark:text-neutral-400"
              >
                Showing {products.length} product{products.length === 1 ? '' : 's'} returned by the backend API
              </div>

              <div
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4"
                data-test="product-grid"
              >
                {products.map((product, index) => (
                  <motion.article
                    key={product.id}
                    data-test="product-card"
                    data-product-id={product.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                    className="group overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900/60"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                      <img
                        src={product.image_url || fallbackImages[index % fallbackImages.length]}
                        alt={product.name}
                        loading="lazy"
                        onError={(event) => {
                          const image = event.currentTarget;
                          image.onerror = null;
                          image.src = fallbackImages[index % fallbackImages.length];
                        }}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span
                        data-test="product-category"
                        className="absolute left-3 top-3 rounded-lg bg-white/95 px-3 py-1.5 font-mono text-[9px] font-extrabold uppercase tracking-widest text-blue-600 shadow-sm backdrop-blur-md dark:bg-neutral-950/90 dark:text-blue-400"
                      >
                        {product.category}
                      </span>
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between gap-3">
                        <h3
                          data-test="product-name"
                          className="font-bold tracking-tight text-neutral-900 dark:text-white"
                        >
                          {product.name}
                        </h3>
                        <span
                          data-test="product-price"
                          className="shrink-0 font-mono text-sm font-bold text-blue-600 dark:text-blue-400"
                        >
                          {formatPrice(product.price)}
                        </span>
                      </div>

                      <p
                        data-test="product-description"
                        className="mt-3 line-clamp-2 min-h-10 font-mono text-xs leading-relaxed text-neutral-500 dark:text-neutral-400"
                      >
                        {product.description}
                      </p>

                      <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-4 dark:border-neutral-800">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
                          Inventory Status
                        </span>
                        <span
                          data-test="product-stock"
                          className={`font-mono text-xs font-bold ${
                            product.stock > 0
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-red-500'
                          }`}
                        >
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                      </div>

                      <Link
                        to="/shop"
                        data-test="product-view-button"
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-neutral-700 transition-colors hover:border-blue-500 hover:bg-blue-500/5 hover:text-blue-600 dark:border-neutral-800 dark:text-neutral-300 dark:hover:text-blue-400"
                      >
                        View in storefront
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* QA Pillars Section */}
      <section
        className="border-b border-neutral-200 bg-white px-4 py-20 dark:border-neutral-800 dark:bg-neutral-950"
        data-test="qa-pillars-section"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              Quality Engineering Strategy
            </p>
            <h2 className="text-3xl font-black uppercase tracking-tight text-neutral-900 dark:text-white sm:text-5xl">
              Test what <span className="text-blue-600 dark:text-blue-500">matters</span>
            </h2>
            <p className="mt-4 max-w-2xl font-mono text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              A comprehensive test suite prioritizes business risk, realistic coverage metrics, maintainability, and dependable release gates. Automation aids verification speed; it does not replace solid architectural testing strategy.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {pillars.map((pillar, index) => (
              <motion.article
                key={pillar.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                data-test="qa-pillar-card"
                className="group relative overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-50 p-8 transition-all duration-300 hover:border-blue-500/40 hover:bg-white hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900/40 dark:hover:bg-neutral-900"
              >
                <div className="mb-8 flex items-center justify-between">
                  <span className="font-mono text-5xl font-black italic tracking-tighter text-neutral-200 transition-colors group-hover:text-blue-600 dark:text-neutral-800 dark:group-hover:text-blue-500">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="rounded-2xl bg-blue-500/10 p-3.5 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:text-blue-400">
                    <pillar.icon size={24} />
                  </div>
                </div>

                <p className="mb-3 font-mono text-[9px] font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                  {pillar.label}
                </p>

                <h3 className="mb-4 text-xl font-bold uppercase tracking-tight text-neutral-900 dark:text-white">
                  {pillar.title}
                </h3>

                <p className="font-mono text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {pillar.description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Testing Capabilities Section */}
      <section className="px-4 py-20" data-test="testing-capabilities-section">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
              Portfolio Scope
            </p>
            <h2 className="text-3xl font-black uppercase tracking-tight text-neutral-900 dark:text-white sm:text-5xl">
              Engineering the <span className="text-blue-600 dark:text-blue-500">test layer</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((capability) => (
              <article
                key={capability.title}
                data-test="capability-card"
                className="rounded-3xl border border-neutral-200 bg-white p-8 transition-shadow hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900/60"
              >
                <div className="mb-6 inline-flex rounded-2xl bg-blue-500/10 p-3.5 text-blue-600 dark:text-blue-400">
                  <capability.icon size={24} />
                </div>

                <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-neutral-900 dark:text-white">
                  {capability.title}
                </h3>

                <p className="font-mono text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                  {capability.description}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-8 rounded-3xl border border-blue-500/20 bg-blue-500/5 p-8 sm:flex-row sm:items-center sm:p-12">
            <div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-blue-600 dark:text-blue-400">
                Start a test journey
              </p>
              <h3 className="text-2xl font-black uppercase tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
                Explore the application
              </h3>
              <p className="mt-3 max-w-xl font-mono text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                Browse products, exercise role-based authentication, and investigate checkout error handling behavior. Use your automated suites to verify actual application outcomes.
              </p>
            </div>

            <Link
              to="/shop"
              data-test="final-shop-button"
              className="inline-flex shrink-0 items-center gap-3 rounded-xl bg-blue-600 px-7 py-4 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500 hover:shadow-blue-500/30"
            >
              Open storefront
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}