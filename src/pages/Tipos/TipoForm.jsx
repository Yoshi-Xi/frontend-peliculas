import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTipo, createTipo, updateTipo } from '../../api/apiService';
import Swal from 'sweetalert2';

const TipoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', descripcion: '' });

  useEffect(() => {
    if (id) {
      setEditMode(true);
      const fetchTipo = async () => {
        try {
          setLoading(true);
          const response = await getTipo(id);
          setFormData({ nombre: response.data.nombre, descripcion: response.data.descripcion || '' });
        } catch (error) {
          Swal.fire('Error', 'No se pudo cargar el tipo.', 'error');
          navigate('/tipos');
        } finally {
          setLoading(false);
        }
      };
      fetchTipo();
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
        await updateTipo(id, formData);
        Swal.fire('Éxito', 'Tipo actualizado correctamente.', 'success');
      } else {
        await createTipo(formData);
        Swal.fire('Éxito', 'Tipo creado correctamente.', 'success');
      }
      navigate('/tipos');
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
          <div className="card-header"><h3>{editMode ? '✏️ Editar Tipo' : '➕ Crear Nuevo Tipo'}</h3></div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">Nombre *</label>
                <input type="text" className="form-control" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej: Película" required />
              </div>
              <div className="mb-3">
                <label htmlFor="descripcion" className="form-label">Descripción</label>
                <textarea className="form-control" id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} rows="3" placeholder="Descripción del tipo" />
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => navigate('/tipos')}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Guardando...' : editMode ? 'Actualizar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipoForm;