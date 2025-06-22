
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Sidebar from './components/Sidebar';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Sidebar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;