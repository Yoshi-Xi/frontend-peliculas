import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getGeneros, deleteGenero } from '../../api/apiService';
import Swal from 'sweetalert2';

const GenerosList = () => {
  const [generos, setGeneros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGeneros = async () => {
    try {
      setLoading(true);
      const response = await getGeneros();
      setGeneros(response.data);
      setError(null);
    } catch (err) {
      setError('❌ Error al cargar los géneros.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGeneros();
  }, []);

  const handleDelete = async (id, nombre) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Eliminar el género "${nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#b333dd',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await deleteGenero(id);
        fetchGeneros();
        Swal.fire('Eliminado', 'Género eliminado correctamente.', 'success');
      } catch (error) {
        Swal.fire('Error', 'Hubo un problema al eliminar.', 'error');
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📂 Géneros</h2>
        <Link to="/generos/nuevo" className="btn btn-success">+ Nuevo Género</Link>
      </div>
      {loading && <div className="alert alert-info">⏳ Cargando géneros...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr><th>#</th><th>Nombre</th><th>Estado</th><th>Descripción</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {generos.length === 0 ? (
                <tr><td colSpan="5" className="text-center">No hay géneros registrados.</td></tr>
              ) : (
                generos.map((genero, index) => (
                  <tr key={genero._id}>
                    <td>{index + 1}</td>
                    <td>{genero.nombre}</td>
                    <td><span className={`badge ${genero.estado === 'Activo' ? 'bg-success' : 'bg-secondary'}`}>{genero.estado}</span></td>
                    <td>{genero.descripcion || 'Sin descripción'}</td>
                    <td>
                      <Link to={`/generos/editar/${genero._id}`} className="btn btn-warning btn-sm me-2"> Editar</Link>
                      <button onClick={() => handleDelete(genero._id, genero.nombre)} className="btn btn-danger btn-sm"> Eliminar</button>
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

export default GenerosList;