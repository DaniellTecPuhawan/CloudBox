import React, { useState, useEffect } from 'react';
import { ImageDb } from '../firebase';
import { uploadBytes, ref, listAll, getDownloadURL, deleteObject, getMetadata } from 'firebase/storage';
import { v4 } from "uuid";
import { Modal, Button, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import '../css/styles.css';

function ImageUpload() {
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
  const [previewImgUrl, setPreviewImgUrl] = useState(null);

  const handleClickUpload = () => {
    if (img !== null || editImg !== null) {
      if (editingImage) {
        const imgRef = ref(ImageDb, `images/${editingImage.id}`);
        uploadBytes(imgRef, editImg || img).then(() => {
          setImg(null);
          setEditingImage(null);
          setEditImg(null);
          listImages();
          setShowModal(false);
          setShowEditModal(false);
          setShowFileModal(false);
          setPreviewImgUrl(null);
        }).catch(error => console.error('Error uploading image:', error));
      } else {
        const imgRef = ref(ImageDb, `images/${v4()}`);
        uploadBytes(imgRef, img).then(() => {
          setImg(null);
          listImages();
          setShowModal(false);
          setShowEditModal(false);
          setShowFileModal(false);
          setPreviewImgUrl(null);
        }).catch(error => console.error('Error uploading image:', error));
      }
    }
  };

  const listImages = () => {
    listAll(ref(ImageDb, "images")).then(imgs => {
      const promises = imgs.items.map(val => 
        getMetadata(val).then(metadata => 
          getDownloadURL(val).then(url => ({ url, ref: val, date: metadata.timeCreated }))
        )
      );
      Promise.all(promises).then(imageUrls => {
        imageUrls.sort((a, b) => new Date(b.date) - new Date(a.date));
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImg(file);
    setPreviewImgUrl(URL.createObjectURL(file));
  };

  const handleShowFileModal = () => {
    setPreviewImgUrl(null);
    setShowFileModal(true);
  };

  const handleShowModal = (imageUrl, index) => {
    setModalImgUrl(imageUrl);
    setShowModal(true);
    setDeletingIndex(index);
  };

  useEffect(() => {
    listImages();
  }, []);

  return (
    <div className="container">
      <div className="row bottomright">
        <div className="col">
          <Button onClick={handleShowFileModal}>
            <FontAwesomeIcon icon={faFileUpload} />
          </Button>
        </div>
      </div>

      <br /><br />

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {imgUrl.map((data, index) => (
          <div className="col" key={index}>
            <div className="card position-relative">
              <img src={data.url} 
                className="card-img-top img-fluid" 
                loading="lazy"
                alt={`image_${index}`} 
                onClick={() => handleShowModal(data.url, index)} 
                style={{ height: '320px' }} 
              />
              <Dropdown className="position-absolute top-0 end-0 m-2">
                <Dropdown.Toggle variant="secondary" id="dropdown-basic" size="sm">
                  <FontAwesomeIcon/> {/*icon={faEllipsisV}*/}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleEdit(data)}>Edit</Dropdown.Item>
                  <Dropdown.Item onClick={() => setShowDeleteModal(true)}>Delete</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
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
          {previewImgUrl && <img src={previewImgUrl} alt="Preview" className="img-fluid" />}
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
          {previewImgUrl && <img src={previewImgUrl} alt="Preview" className="img-fluid" />}
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