import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDirector, createDirector, updateDirector } from '../../api/apiService';
import Swal from 'sweetalert2';

const DirectorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ nombres: '', estado: 'Activo' });

  useEffect(() => {
    if (id) {
      setEditMode(true);
      const fetchDirector = async () => {
        try {
          setLoading(true);
          const response = await getDirector(id);
          setFormData({ nombres: response.data.nombres, estado: response.data.estado });
        } catch (error) {
          Swal.fire('Error', 'No se pudo cargar el director.', 'error');
          navigate('/directores');
        } finally {
          setLoading(false);
        }
      };
      fetchDirector();
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombres.trim()) {
      Swal.fire('Error', 'El nombre es requerido.', 'error');
      return;
    }
    try {
      setLoading(true);
      if (editMode) {
        await updateDirector(id, formData);
        Swal.fire('Éxito', 'Director actualizado correctamente.', 'success');
      } else {
        await createDirector(formData);
        Swal.fire('Éxito', 'Director creado correctamente.', 'success');
      }
      navigate('/directores');
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
          <div className="card-header"><h3>{editMode ? '📝 Editar Director' : '➕ Crear Nuevo Director'}</h3></div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="nombres" className="form-label">Nombres *</label>
                <input type="text" className="form-control" id="nombres" name="nombres" value={formData.nombres} onChange={handleChange} placeholder="Ej: Steven Spielberg" required />
              </div>
              <div className="mb-3">
                <label htmlFor="estado" className="form-label">Estado</label>
                <select className="form-select" id="estado" name="estado" value={formData.estado} onChange={handleChange}>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => navigate('/directores')}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Guardando...' : editMode ? 'Actualizar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectorForm;