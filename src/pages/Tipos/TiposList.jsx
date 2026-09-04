import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTipos, deleteTipo } from '../../api/apiService';
import Swal from 'sweetalert2';

const TiposList = () => {
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTipos = async () => {
    try {
      setLoading(true);
      const response = await getTipos();
      setTipos(response.data);
      setError(null);
    } catch (err) {
      setError('❌ Error al cargar los tipos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTipos(); }, []);

  const handleDelete = async (id, nombre) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Eliminar el tipo "${nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#b333dd',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (result.isConfirmed) {
      try {
        await deleteTipo(id);
        fetchTipos();
        Swal.fire('Eliminado', 'Tipo eliminado correctamente.', 'success');
      } catch (error) {
        Swal.fire('Error', 'Hubo un problema al eliminar.', 'error');
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📋 Tipos</h2>
        <Link to="/tipos/nuevo" className="btn btn-success">+ Nuevo Tipo</Link>
      </div>
      {loading && <div className="alert alert-info">⏳ Cargando tipos...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr><th>#</th><th>Nombre</th><th>Descripción</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {tipos.length === 0 ? (
                <tr><td colSpan="4" className="text-center">No hay tipos registrados.</td></tr>
              ) : (
                tipos.map((tipo, index) => (
                  <tr key={tipo._id}>
                    <td>{index + 1}</td>
                    <td>{tipo.nombre}</td>
                    <td>{tipo.descripcion || 'Sin descripción'}</td>
                    <td>
                      <Link to={`/tipos/editar/${tipo._id}`} className="btn btn-warning btn-sm me-2"> Editar</Link>
                      <button onClick={() => handleDelete(tipo._id, tipo.nombre)} className="btn btn-danger btn-sm"> Eliminar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TiposList;