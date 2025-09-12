import { Routes, Route } from 'react-router-dom';
import { Navbar, Footer, Hero, Services, Transaction } from './components';

const renderHome = (
  <div className="min-h-screen">
    <div className="gradient-bg-welcome">
      <Navbar />
      <Hero />
    </div>
    <Services />
    <Transaction />
    <Footer />
  </div>
);

const App = () => {
  return (
    <Routes>
      <Route path="/" element={renderHome} />
    </Routes>
  );
};

export default App;
