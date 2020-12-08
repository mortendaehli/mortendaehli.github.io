import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import NavBar from './components/Nav/NavBar';
import Home from './components/views/Home/Home';
import Footer from './components/Footer/Footer';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <div>
            <NavBar />
            <Route name="home" exact path="/" component={Home} />
            <Footer />
          </div>
        </Router>
      </header>
    </div>
  );
}

export default App;
