// src/pages/Media/MediaForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMediaItem, createMedia, updateMedia } from '../../api/apiService';
import { getGeneros } from '../../api/apiService';
import { getDirectores } from '../../api/apiService';
import { getProductoras } from '../../api/apiService';
import { getTipos } from '../../api/apiService';
import Swal from 'sweetalert2';

const MediaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Estados para los selects (listas desplegables)
  const [generos, setGeneros] = useState([]);
  const [directores, setDirectores] = useState([]);
  const [productoras, setProductoras] = useState([]);
  const [tipos, setTipos] = useState([]);

  // Estado del formulario
  const [formData, setFormData] = useState({
    serial: '',
    titulo: '',
    sinopsis: '',
    url: '',
    imagenPortada: '',
    añoEstreno: '',
    genero: '',
    director: '',
    productora: '',
    tipo: '',
  });

  // Cargar datos para los selects
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [generosRes, directoresRes, productorasRes, tiposRes] = await Promise.all([
          getGeneros(),
          getDirectores(),
          getProductoras(),
          getTipos(),
        ]);
        setGeneros(generosRes.data);
        setDirectores(directoresRes.data);
        setProductoras(productorasRes.data);
        setTipos(tiposRes.data);
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };
    fetchData();
  }, []);

  // Cargar datos si estamos en modo edición
  useEffect(() => {
    if (id) {
      setEditMode(true);
      const fetchMedia = async () => {
        try {
          setLoading(true);
          const response = await getMediaItem(id);
          const data = response.data;
          setFormData({
            serial: data.serial || '',
            titulo: data.titulo || '',
            sinopsis: data.sinopsis || '',
            url: data.url || '',
            imagenPortada: data.imagenPortada || '',
            añoEstreno: data.añoEstreno || '',
            genero: data.genero?._id || '',
            director: data.director?._id || '',
            productora: data.productora?._id || '',
            tipo: data.tipo?._id || '',
          });
        } catch (error) {
          Swal.fire('Error', 'No se pudo cargar el contenido.', 'error');
          navigate('/media');
        } finally {
          setLoading(false);
        }
      };
      fetchMedia();
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!formData.serial.trim() || !formData.titulo.trim() || !formData.url.trim() || !formData.añoEstreno) {
      Swal.fire('Error', 'Los campos Serial, Título, URL y Año son requeridos.', 'error');
      return;
    }

    if (!formData.genero || !formData.director || !formData.productora || !formData.tipo) {
      Swal.fire('Error', 'Debes seleccionar Género, Director, Productora y Tipo.', 'error');
      return;
    }

    try {
      setLoading(true);
      if (editMode) {
        await updateMedia(id, formData);
        Swal.fire('Éxito', 'Contenido actualizado correctamente.', 'success');
      } else {
        await createMedia(formData);
        Swal.fire('Éxito', 'Contenido creado correctamente.', 'success');
      }
      navigate('/media');
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al guardar.', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-10">
        <div className="card">
          <div className="card-header">
            <h3>{editMode ? '✏️ Editar Contenido' : '➕ Crear Nuevo Contenido'}</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* Columna izquierda */}
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="serial" className="form-label">Serial *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="serial"
                      name="serial"
                      value={formData.serial}
                      onChange={handleChange}
                      placeholder="Ej: MOV-001"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="titulo" className="form-label">Título *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="titulo"
                      name="titulo"
                      value={formData.titulo}
                      onChange={handleChange}
                      placeholder="Ej: El Señor de los Anillos"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="sinopsis" className="form-label">Sinopsis</label>
                    <textarea
                      className="form-control"
                      id="sinopsis"
                      name="sinopsis"
                      value={formData.sinopsis}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Breve descripción del contenido"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="url" className="form-label">URL del video *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="url"
                      name="url"
                      value={formData.url}
                      onChange={handleChange}
                      placeholder="https://ejemplo.com/video.mp4"
                      required
                    />
                  </div>
                </div>

                {/* Columna derecha */}
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="imagenPortada" className="form-label">URL Imagen de Portada</label>
                    <input
                      type="text"
                      className="form-control"
                      id="imagenPortada"
                      name="imagenPortada"
                      value={formData.imagenPortada}
                      onChange={handleChange}
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="añoEstreno" className="form-label">Año de Estreno *</label>
                    <input
                      type="number"
                      className="form-control"
                      id="añoEstreno"
                      name="añoEstreno"
                      value={formData.añoEstreno}
                      onChange={handleChange}
                      placeholder="2024"
                      min="1900"
                      max="2100"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="genero" className="form-label">Género *</label>
                    <select
                      className="form-select"
                      id="genero"
                      name="genero"
                      value={formData.genero}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecciona un género</option>
                      {generos.filter(g => g.estado === 'Activo').map((g) => (
                        <option key={g._id} value={g._id}>{g.nombre}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="director" className="form-label">Director *</label>
                    <select
                      className="form-select"
                      id="director"
                      name="director"
                      value={formData.director}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecciona un director</option>
                      {directores.filter(d => d.estado === 'Activo').map((d) => (
                        <option key={d._id} value={d._id}>{d.nombres}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="productora" className="form-label">Productora *</label>
                    <select
                      className="form-select"
                      id="productora"
                      name="productora"
                      value={formData.productora}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecciona una productora</option>
                      {productoras.filter(p => p.estado === 'Activo').map((p) => (
                        <option key={p._id} value={p._id}>{p.nombre}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="tipo" className="form-label">Tipo *</label>
                    <select
                      className="form-select"
                      id="tipo"
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecciona un tipo</option>
                      {tipos.map((t) => (
                        <option key={t._id} value={t._id}>{t.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate('/media')}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : editMode ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaForm;