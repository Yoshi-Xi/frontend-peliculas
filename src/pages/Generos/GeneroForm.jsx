import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGenero, createGenero, updateGenero } from '../../api/apiService';
import Swal from 'sweetalert2';

const GeneroForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', estado: 'Activo', descripcion: '' });

  useEffect(() => {
    if (id) {
      setEditMode(true);
      const fetchGenero = async () => {
        try {
          setLoading(true);
          const response = await getGenero(id);
          setFormData({ nombre: response.data.nombre, estado: response.data.estado, descripcion: response.data.descripcion || '' });
        } catch (error) {
          Swal.fire('Error', 'No se pudo cargar el género.', 'error');
          navigate('/generos');
        } finally {
          setLoading(false);
        }
      };
      fetchGenero();
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      Swal.fire('Error', 'El nombre es requerido.', 'error');
      return;
    }
    try {
      setLoading(true);
      if (editMode) {
        await updateGenero(id, formData);
        Swal.fire('Éxito', 'Género actualizado correctamente.', 'success');
      } else {
        await createGenero(formData);
        Swal.fire('Éxito', 'Género creado correctamente.', 'success');
      }
      navigate('/generos');
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al guardar.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card">
          <div className="card-header"><h3>{editMode ? '📝 Editar Género' : '➕ Crear Nuevo Género'}</h3></div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">Nombre *</label>
                <input type="text" className="form-control" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej: Acción" required />
              </div>
              <div className="mb-3">
                <label htmlFor="estado" className="form-label">Estado</label>
                <select className="form-select" id="estado" name="estado" value={formData.estado} onChange={handleChange}>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="descripcion" className="form-label">Descripción</label>
                <textarea className="form-control" id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} rows="3" placeholder="Descripción del género" />
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => navigate('/generos')}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Guardando...' : editMode ? 'Actualizar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneroForm;