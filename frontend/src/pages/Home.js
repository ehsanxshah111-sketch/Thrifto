import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import ProductCard from '../components/ProductCard';

// Shown only if the admin hasn't added any "hero" promotions yet, so the
// homepage never looks empty on a fresh install.
const DEFAULT_SLIDES = [
  {
    eyebrow: 'The Edit — SS26',
    title: 'Thrifto',
    description: 'Premium footwear, distilled to black and white. Considered shapes, honest materials, no noise.',
    ctaText: 'Shop Best Sellers',
    ctaLink: '/shop',
  },
];

// Shown only if the admin hasn't added a "banner" promotion yet.
const DEFAULT_BANNER = {
  eyebrow: 'Limited Time',
  title: 'The Season Sale',
  description: 'Selected styles, reduced for a limited time. While sizes last.',
  ctaText: 'Shop the Sale',
  ctaLink: '/shop',
};

const CATEGORY_TILES = ['Sneakers', 'Running', 'Boots', 'Formal', 'Sandals'];

const TESTIMONIALS = [
  { name: 'Ahmad S.', quote: 'Comfortable and true to size. The finish feels far more premium than the price suggests.' },
  { name: 'Hamdan R.', quote: 'My go-to for both casual and slightly dressed-up days. Ordering my second pair already.' },
  { name: 'Zunairah K.', quote: 'Delivery was quick and the box experience felt properly premium.' },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [onSale, setOnSale] = useState([]);
  const [heroSlides, setHeroSlides] = useState(DEFAULT_SLIDES);
  const [banner, setBanner] = useState(DEFAULT_BANNER);
  const [slide, setSlide] = useState(0);
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    api.get('/products', { params: { featured: true } }).then(({ data }) => setFeatured(data.slice(0, 4)));
    api.get('/products', { params: { onSale: true } }).then(({ data }) => setOnSale(data.slice(0, 4)));

    // Admin-managed promotions/announcements (e.g. "Independence Day Sale")
    // - see Admin > Promotions. Falls back to the static defaults above if
    // the admin hasn't added anything for a given placement yet.
    api.get('/promotions').then(({ data }) => {
      const heroPromos = data.filter((p) => p.placement === 'hero');
      const bannerPromos = data.filter((p) => p.placement === 'banner');
      if (heroPromos.length > 0) setHeroSlides(heroPromos);
      if (bannerPromos.length > 0) setBanner(bannerPromos[0]);
    });
  }, []);

  // Auto-advance the hero carousel every 5s, like a slow editorial slideshow
  useEffect(() => {
    if (heroSlides.length <= 1) return undefined;
    const id = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(id);
  }, [heroSlides.length]);

  const current = useMemo(
    () => heroSlides[slide] || heroSlides[0],
    [heroSlides, slide]
  );

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!emailInput) return;
    try {
      await api.post('/messages', {
        name: 'Newsletter Signup',
        email: emailInput,
        subject: 'Newsletter Subscription',
        message: `${emailInput} subscribed to the Thrifto newsletter.`,
      });
      setSubscribed(true);
      setEmailInput('');
    } catch {
      // fail quietly - non-critical UI
      setSubscribed(true);
    }
  };

  return (
    <div>
      {/* ---------- Hero carousel (admin-managed via Promotions) ---------- */}
      <section
        className={`hero hero--carousel${current.backgroundImage ? ' hero--has-photo' : ` theme-${current.theme || 'classic'}`}`}
      >
        {current.backgroundImage && (
          <div className="hero-photo-frame">
            <img src={current.backgroundImage} alt="" />
            <div className="hero-photo-frame__scrim" />
          </div>
        )}
        <div className="hero__content">
          {current.eyebrow && <p className="hero__eyebrow">{current.eyebrow}</p>}
          <h1>{current.title}</h1>
          <p>{current.description}</p>
          <Link to={current.ctaLink || '/shop'} className="btn btn-primary">
            {current.ctaText || 'Shop Best Sellers'}
          </Link>

          {heroSlides.length > 1 && (
            <div className="hero__dots">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  className={i === slide ? 'active' : ''}
                  onClick={() => setSlide(i)}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---------- Category quick-nav ---------- */}
      <div className="container">
        <div className="category-tiles">
          {CATEGORY_TILES.map((c) => (
            <Link key={c} to={`/shop?category=${c}`} className="category-tile">
              {c}
            </Link>
          ))}
        </div>
      </div>

      {/* ---------- Featured ---------- */}
      {featured.length > 0 && (
        <div className="container">
          <h2 className="section-title">Featured</h2>
          <p className="section-sub">A first look at the current collection</p>
          <div className="grid">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* ---------- Promo banner (admin-managed via Promotions) ---------- */}
      <section
        className={`promo-banner${banner.backgroundImage ? ' promo-banner--has-photo' : ` theme-${banner.theme || 'classic'}`}`}
      >
        {banner.backgroundImage && (
          <div className="promo-banner-photo-frame">
            <img src={banner.backgroundImage} alt="" />
            <div className="promo-banner-photo-frame__scrim" />
          </div>
        )}
        <div className="promo-banner__inner">
          {banner.eyebrow && <p className="promo-banner__eyebrow">{banner.eyebrow}</p>}
          <h2>{banner.title}</h2>
          <p>{banner.description}</p>
          <Link to={banner.ctaLink || '/shop'} className="btn btn-outline promo-banner__btn">
            {banner.ctaText || 'Shop the Sale'}
          </Link>
        </div>
      </section>

      {/* ---------- On sale ---------- */}
      {onSale.length > 0 && (
        <div className="container">
          <h2 className="section-title">On Sale</h2>
          <p className="section-sub">Considered reductions on classic styles</p>
          <div className="grid">
            {onSale.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* ---------- Testimonials ---------- */}
      <section className="testimonials">
        <div className="container">
          <h2 className="section-title" style={{ color: '#fff' }}>Happy Customers</h2>
          <div className="testimonials__grid">
            {TESTIMONIALS.map((t) => (
              <div className="testimonial-card" key={t.name}>
                <p className="testimonial-card__stars">★★★★★</p>
                <p className="testimonial-card__quote">&ldquo;{t.quote}&rdquo;</p>
                <p className="testimonial-card__name">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Newsletter ---------- */}
      <section className="newsletter">
        <div className="container">
          <h2 className="section-title">Join the List</h2>
          <p className="section-sub">Be first to know about new arrivals and seasonal sales.</p>
          {subscribed ? (
            <p style={{ textAlign: 'center', color: '#1f6b3a', fontFamily: 'var(--sans)', fontSize: 13 }}>
              Thank you — you're on the list.
            </p>
          ) : (
            <form className="newsletter__form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Your email address"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
              />
              <button className="btn btn-primary">Subscribe</button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
