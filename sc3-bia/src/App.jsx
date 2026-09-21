import './App.css';
import WrappedBIAForm from './components/BIAForm';

{/* Breadcrumbs 
function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  return (
    <nav style={{ margin: '10px 0' }}>
      <Link to="/">Home</Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        return (
          <span key={to}>
            {' / '}
            <Link to={to}>{value}</Link>
          </span>
        );
      })}
    </nav>
  );
}
*/}

function App() {
  return (
    <WrappedBIAForm />
  );
}

export default App;