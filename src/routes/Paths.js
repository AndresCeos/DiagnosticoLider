import React from 'react';
import {BrowserRouter, Routes, Route } from 'react-router-dom';
import FormularioRadar from '../components/FormularioRadar';
import EncuestaSatisfaccion from '../components/EncuestaSatisfaccion';


function Paths () {
    return (
    <BrowserRouter >
        <Routes>
            <Route path="/" element={<FormularioRadar/>} />
            <Route path="/satisfaccion" element={<EncuestaSatisfaccion/>} />
        </Routes>
    </BrowserRouter>
    
    );
}

export default Paths;