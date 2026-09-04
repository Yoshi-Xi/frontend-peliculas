// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from './components/Navbar';

import GenerosList from './pages/Generos/GenerosList';
import GeneroForm from './pages/Generos/GeneroForm';
import DirectoresList from './pages/Directores/DirectoresList';
import DirectorForm from './pages/Directores/DirectorForm';
import ProductorasList from './pages/Productoras/ProductorasList';
import ProductoraForm from './pages/Productoras/ProductoraForm';
import TiposList from './pages/Tipos/TiposList';
import TipoForm from './pages/Tipos/TipoForm';
import MediaList from './pages/Media/MediaList';
import MediaForm from './pages/Media/MediaForm';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={
            <div className="text-center mt-5">
              <h1>🎬 Bienvenido al Admin de Películas</h1>
              <p className="lead">Gestiona géneros, directores, productoras, tipos y contenido multimedia</p>
            </div>
          } />
          
          <Route path="/generos" element={<GenerosList />} />
          <Route path="/generos/nuevo" element={<GeneroForm />} />
          <Route path="/generos/editar/:id" element={<GeneroForm />} />
          
          <Route path="/directores" element={<DirectoresList />} />
          <Route path="/directores/nuevo" element={<DirectorForm />} />
          <Route path="/directores/editar/:id" element={<DirectorForm />} />
          
          <Route path="/productoras" element={<ProductorasList />} />
          <Route path="/productoras/nuevo" element={<ProductoraForm />} />
          <Route path="/productoras/editar/:id" element={<ProductoraForm />} />
          
          <Route path="/tipos" element={<TiposList />} />
          <Route path="/tipos/nuevo" element={<TipoForm />} />
          <Route path="/tipos/editar/:id" element={<TipoForm />} />
          
          <Route path="/media" element={<MediaList />} />
          <Route path="/media/nuevo" element={<MediaForm />} />
          <Route path="/media/editar/:id" element={<MediaForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;