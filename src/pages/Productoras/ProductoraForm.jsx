import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductora, createProductora, updateProductora } from '../../api/apiService';
import Swal from 'sweetalert2';

const ProductoraForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', estado: 'Activo', eslogan: '', descripcion: '' });

  useEffect(() => {
    if (id) {
      setEditMode(true);
      const fetchProductora = async () => {
        try {
          setLoading(true);
          const response = await getProductora(id);
          setFormData({
            nombre: response.data.nombre,
            estado: response.data.estado,
            eslogan: response.data.eslogan || '',
            descripcion: response.data.descripcion || '',
          });
        } catch (error) {
          Swal.fire('Error', 'No se pudo cargar la productora.', 'error');
          navigate('/productoras');
        } finally {
          setLoading(false);
        }
      };
      fetchProductora();
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
        await updateProductora(id, formData);
        Swal.fire('Éxito', 'Productora actualizada correctamente.', 'success');
      } else {
        await createProductora(formData);
        Swal.fire('Éxito', 'Productora creada correctamente.', 'success');
      }
      navigate('/productoras');
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
          <div className="card-header"><h3>{editMode ? '✏️ Editar Productora' : '➕ Crear Nueva Productora'}</h3></div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">Nombre *</label>
                <input type="text" className="form-control" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej: Warner Bros" required />
              </div>
              <div className="mb-3">
                <label htmlFor="estado" className="form-label">Estado</label>
                <select className="form-select" id="estado" name="estado" value={formData.estado} onChange={handleChange}>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="eslogan" className="form-label">Slogan</label>
                <input type="text" className="form-control" id="eslogan" name="eslogan" value={formData.eslogan} onChange={handleChange} placeholder="Ej: La magia del cine" />
              </div>
              <div className="mb-3">
                <label htmlFor="descripcion" className="form-label">Descripción</label>
                <textarea className="form-control" id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} rows="3" placeholder="Descripción de la productora" />
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => navigate('/productoras')}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Guardando...' : editMode ? 'Actualizar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductoraForm;