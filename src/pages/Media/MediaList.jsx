import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMedia, deleteMedia } from '../../api/apiService';
import Swal from 'sweetalert2';

const MediaList = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const response = await getMedia();
      setMedia(response.data);
      setError(null);
    } catch (err) {
      setError('❌ Error al cargar el contenido multimedia.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleDelete = async (id, titulo) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Eliminar "${titulo}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#b333dd',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await deleteMedia(id);
        fetchMedia();
        Swal.fire('Eliminado', 'Contenido eliminado correctamente.', 'success');
      } catch (error) {
        Swal.fire('Error', 'Hubo un problema al eliminar.', 'error');
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🎥 Contenido Multimedia</h2>
        <Link to="/media/nuevo" className="btn btn-success">
          + Nuevo Contenido
        </Link>
      </div>

      {loading && <div className="alert alert-info">⏳ Cargando contenido...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Serial</th>
                <th>Título</th>
                <th>Año</th>
                <th>Género</th>
                <th>Director</th>
                <th>Tipo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {media.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">No hay contenido registrado.</td>
                </tr>
              ) : (
                media.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.serial}</td>
                    <td>{item.titulo}</td>
                    <td>{item.añoEstreno}</td>
                    <td>{item.genero?.nombre || 'N/A'}</td>
                    <td>{item.director?.nombres || 'N/A'}</td>
                    <td>{item.tipo?.nombre || 'N/A'}</td>
                    <td>
                      <Link to={`/media/editar/${item._id}`} className="btn btn-warning btn-sm me-2">
                         Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(item._id, item.titulo)}
                        className="btn btn-danger btn-sm"
                      >
                         Eliminar
                      </button>
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

export default MediaList;