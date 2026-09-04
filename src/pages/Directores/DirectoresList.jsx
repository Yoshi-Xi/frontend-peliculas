import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDirectores, deleteDirector } from '../../api/apiService';
import Swal from 'sweetalert2';

const DirectoresList = () => {
  const [directores, setDirectores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDirectores = async () => {
    try {
      setLoading(true);
      const response = await getDirectores();
      setDirectores(response.data);
      setError(null);
    } catch (err) {
      setError('❌ Error al cargar los directores.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDirectores(); }, []);

  const handleDelete = async (id, nombre) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Eliminar al director "${nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#b333dd',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (result.isConfirmed) {
      try {
        await deleteDirector(id);
        fetchDirectores();
        Swal.fire('Eliminado', 'Director eliminado correctamente.', 'success');
      } catch (error) {
        Swal.fire('Error', 'Hubo un problema al eliminar.', 'error');
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🎬 Directores</h2>
        <Link to="/directores/nuevo" className="btn btn-success">+ Nuevo Director</Link>
      </div>
      {loading && <div className="alert alert-info">⏳ Cargando directores...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr><th>#</th><th>Nombres</th><th>Estado</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {directores.length === 0 ? (
                <tr><td colSpan="4" className="text-center">No hay directores registrados.</td></tr>
              ) : (
                directores.map((director, index) => (
                  <tr key={director._id}>
                    <td>{index + 1}</td>
                    <td>{director.nombres}</td>
                    <td><span className={`badge ${director.estado === 'Activo' ? 'bg-success' : 'bg-secondary'}`}>{director.estado}</span></td>
                    <td>
                      <Link to={`/directores/editar/${director._id}`} className="btn btn-warning btn-sm me-2"> Editar</Link>
                      <button onClick={() => handleDelete(director._id, director.nombres)} className="btn btn-danger btn-sm"> Eliminar</button>
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

export default DirectoresList;