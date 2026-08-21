import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="container" style={{ textAlign: 'center', padding: '110px 24px' }}>
    <p
      style={{
        fontFamily: 'var(--sans)',
        fontSize: 11,
        letterSpacing: 3,
        textTransform: 'uppercase',
        color: 'var(--gold)',
        margin: '0 0 16px',
      }}
    >
      404
    </p>
    <h1
      style={{
        fontFamily: 'var(--serif)',
        fontStyle: 'italic',
        fontSize: 36,
        margin: '0 0 14px',
      }}
    >
      Page Not Found
    </h1>
    <p
      style={{
        fontFamily: 'var(--sans)',
        color: 'var(--gray)',
        fontSize: 13,
        maxWidth: 420,
        margin: '0 auto 32px',
      }}
    >
      The page you're looking for doesn't exist or may have moved.
    </p>
    <Link to="/" className="btn btn-primary">
      Back to Home
    </Link>
  </div>
);

export default NotFound;
