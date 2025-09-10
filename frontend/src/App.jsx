import { Navbar, Footer, Hero, Services, Transaction } from './components';

const App = () => {
  return (
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
};

export default App;
