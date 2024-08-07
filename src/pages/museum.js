import React, { useState, useEffect } from 'react';
import { ImageDb } from '../firebase';
import { uploadBytes, ref, listAll, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 } from "uuid";
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
import '../css/styles.css';

function ImageUpload(){

  const [img, setImg] = useState(null);
  const [imgUrl, setImgUrl] = useState([]);
  const [editingImage, setEditingImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalImgUrl, setModalImgUrl] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editImg, setEditImg] = useState(null);
  const [showFileModal, setShowFileModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState(null);
  const [previewImgUrl, setPreviewImgUrl] = useState(null); // Estado para almacenar la URL de la vista previa de la imagen seleccionada para cargar

  const handleClickUpload = () => {
    if (img !== null || editImg !== null) {
      if (editingImage) {
        const imgRef = ref(ImageDb, `files/${editingImage.id}`);
        uploadBytes(imgRef, editImg || img).then(() => {
          setImg(null);
          setEditingImage(null);
          setEditImg(null);
          listImages();
          setShowModal(false);
          setShowEditModal(false);
          setShowFileModal(false);
          setPreviewImgUrl(null); // Limpiar la vista previa de la imagen al cargar
        }).catch(error => console.error('Error uploading image:', error));
      } else {
        const imgRef = ref(ImageDb, `files/${v4()}`);
        uploadBytes(imgRef, img).then(() => {
          setImg(null);
          listImages();
          setShowModal(false);
          setShowEditModal(false);
          setShowFileModal(false);
          setPreviewImgUrl(null); // Limpiar la vista previa de la imagen al cargar
        }).catch(error => console.error('Error uploading image:', error));
      }
    }
  };

  const listImages = () => {
    listAll(ref(ImageDb, "files")).then(imgs => {
      const promises = imgs.items.map(val =>
        getDownloadURL(val).then(url => ({ url, ref: val }))
      );
      Promise.all(promises).then(imageUrls => {
        setImgUrl(imageUrls);
      });
    }).catch(error => console.error('Error listing images:', error));
  };

  const handleDelete = () => {
    const index = deletingIndex;
    const refToDelete = imgUrl[index].ref;
    deleteObject(refToDelete).then(() => {
      listImages();
      setShowDeleteModal(false);
    }).catch(error => console.error('Error deleting image:', error));
  };

  const handleEdit = (image) => {
    setEditingImage(image);
    setShowEditModal(true);
  };

  const handleShowModal = (imageUrl, index) => {
    setModalImgUrl(imageUrl);
    setShowModal(true);
    setDeletingIndex(index);
  };

  // Función para manejar el cambio en el input de tipo file y mostrar la vista previa de la imagen
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImg(file); // Almacena el archivo seleccionado en el estado
    setPreviewImgUrl(URL.createObjectURL(file)); // Crea y almacena la URL de la vista previa de la imagen
  };

  useEffect(() => {
    listImages();
  }, []);

  const handleShowFileModal = () => {
    // Limpiar el estado de la vista previa de la imagen al abrir el modal de selección de archivos
    setPreviewImgUrl(null);
    setShowFileModal(true);
  };

  return(
    <div className="container">
      <div className="row bottomright">
        <div className="col">
          {/* Botón de carga de archivo */}
          <Button onClick={handleShowFileModal}>
            <FontAwesomeIcon icon={faFileUpload} />
          </Button>
        </div>
      </div>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {imgUrl.map((data, index) => (
          <div className="col" key={index}>
            <div className="card">
              <img src={data.url} className="card-img-top img-fluid" alt={`image_${index}`} onClick={() => handleShowModal(data.url, index)} style={{height: '200px'}} />
              <div className="card-body d-flex justify-content-center align-items-center">
                <div>
                  <button className="btn btn-danger me-2" onClick={() => {setDeletingIndex(index); setShowDeleteModal(true);}}>Delete</button>
                  <button className="btn btn-primary" onClick={() => handleEdit({ id: index, ref: data.ref })}>Edit</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Modal de zoom */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Body>
          <img src={modalImgUrl} className="card-img-top modal-img img-fluid" alt="modal-img" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
      {/* Modal de edición */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Body>
          {/* Vista previa de la imagen seleccionada para editar */}
          {previewImgUrl && <img src={previewImgUrl} alt="Preview" className="img-fluid" />}
          {/* Botón de carga de archivo dentro del modal de edición */}
          <input type="file" onChange={handleFileChange} />
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-info" onClick={handleClickUpload}>{editingImage ? 'Update' : 'Upload'}</button>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
      {/* Modal de selección de archivo */}
      <Modal show={showFileModal} onHide={() => setShowFileModal(false)} centered>
        <Modal.Body>
          {/* Vista previa de la imagen seleccionada */}
          {previewImgUrl && <img src={previewImgUrl} alt="Preview" className="img-fluid" />}
          {/* Botón de carga de archivo dentro del modal de selección de archivo */}
          <input type="file" onChange={handleFileChange} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFileModal(false)}>Close</Button>
          <button className="btn btn-info" onClick={handleClickUpload}>{editingImage ? 'Update' : 'Upload'}</button>
        </Modal.Footer>
      </Modal>
      {/* Modal de confirmación de eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Body>
          <p>Are you sure you want to delete this image?</p>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-danger" onClick={handleDelete}>Confirm</button>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ImageUpload;
