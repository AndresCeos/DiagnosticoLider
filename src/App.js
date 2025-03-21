import './App.css';
import {BrowserRouter, Routes, Route } from 'react-router-dom';
import FormularioRadar from './components/FormularioRadar';
import EncuestaSatisfaccion from './components/EncuestaSatisfaccion';
import BriefFormulario from './components/BriefForm';
import Redactores from './components/Redactores';


function App() {
  return (
    <BrowserRouter >
        <Routes>
            <Route path="/" element={<FormularioRadar />} />
            <Route path="satisfaccion" element={<EncuestaSatisfaccion />} />
            <Route path='brief' element={<BriefFormulario />} />
            <Route path='redactores' element={<Redactores />} />
            <Route path="*" element={<h1>404</h1>} />
        </Routes>
    </BrowserRouter>

  );
}

export default App;
