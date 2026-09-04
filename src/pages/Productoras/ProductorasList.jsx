import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProductoras, deleteProductora } from '../../api/apiService';
import Swal from 'sweetalert2';

const ProductorasList = () => {
  const [productoras, setProductoras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProductoras = async () => {
    try {
      setLoading(true);
      const response = await getProductoras();
      setProductoras(response.data);
      setError(null);
    } catch (err) {
      setError('❌ Error al cargar las productoras.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProductoras(); }, []);

  const handleDelete = async (id, nombre) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Eliminar la productora "${nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#b333dd',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (result.isConfirmed) {
      try {
        await deleteProductora(id);
        fetchProductoras();
        Swal.fire('Eliminado', 'Productora eliminada correctamente.', 'success');
      } catch (error) {
        Swal.fire('Error', 'Hubo un problema al eliminar.', 'error');
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🏢 Productoras</h2>
        <Link to="/productoras/nuevo" className="btn btn-success">+ Nueva Productora</Link>
      </div>
      {loading && <div className="alert alert-info">⏳ Cargando productoras...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr><th>#</th><th>Nombre</th><th>Estado</th><th>Slogan</th><th>Descripción</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {productoras.length === 0 ? (
                <tr><td colSpan="6" className="text-center">No hay productoras registradas.</td></tr>
              ) : (
                productoras.map((productora, index) => (
                  <tr key={productora._id}>
                    <td>{index + 1}</td>
                    <td>{productora.nombre}</td>
                    <td><span className={`badge ${productora.estado === 'Activo' ? 'bg-success' : 'bg-secondary'}`}>{productora.estado}</span></td>
                    <td>{productora.eslogan || 'Sin eslogan'}</td>
                    <td>{productora.descripcion || 'Sin descripción'}</td>
                    <td>
                      <Link to={`/productoras/editar/${productora._id}`} className="btn btn-warning btn-sm me-2"> Editar</Link>
                      <button onClick={() => handleDelete(productora._id, productora.nombre)} className="btn btn-danger btn-sm"> Eliminar</button>
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

export default ProductorasList;