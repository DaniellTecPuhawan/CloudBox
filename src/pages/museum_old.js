import React, { useEffect, useState } from 'react';
import { ImageDb } from '../firebase';
import { uploadBytes, ref, listAll, getDownloadURL, deleteObject } from 'firebase/storage';
import { set } from 'firebase/database'; // Importa la función set de Firebase Realtime Database
import { v4 } from "uuid";

import '../css/styles.css';

function ImageUpload(){

  const [img, setImg] = useState(null);
  const [imgUrl, setImgUrl] = useState([]);
  const [editingImage, setEditingImage] = useState(null);
  const [textArray, setTextArray] = useState([]); // Arreglo para almacenar el texto asociado a cada imagen
  const [editedTextArray, setEditedTextArray] = useState([]); // Arreglo para almacenar el texto editado de cada imagen
  const [text, setText] = useState(''); // Agrega la variable de estado para el texto

  const handleClickUpload = () => {
    if (img !== null) {
      const imgRef = ref(ImageDb, editingImage ? `files/${editingImage.id}` : `files/${v4()}`);
      uploadBytes(imgRef, img).then(() => {
        setImg(null); // Limpiar el estado de la imagen después de cargar
        setEditingImage(null); // Limpiar el estado de edición
        listImages(); // Actualizar la lista de imágenes después de cargar una nueva
        setTextArray(prevTextArray => [...prevTextArray, text]); // Agregar un nuevo texto al arreglo para la nueva imagen
        setEditedTextArray(prevEditedTextArray => [...prevEditedTextArray, text]); // Agregar un nuevo texto editado al arreglo
        setText(''); // Limpiar el campo de entrada de texto después de la carga
      }).catch(error => console.error('Error uploading image:', error));
    }
  };

  const listImages = () => {
    setImgUrl([]); // Limpiar la lista de URLs de imágenes antes de volver a cargar
    listAll(ref(ImageDb, "files")).then(imgs => {
      imgs.items.forEach(val => {
        getDownloadURL(val).then(url => {
          setImgUrl(prevUrls => [...prevUrls, { url, ref: val }]);
        });
      });
    }).catch(error => console.error('Error listing images:', error));
  };

  const handleDelete = (ref, index) => {
    deleteObject(ref).then(() => {
      listImages(); // Actualizar la lista de imágenes después de eliminar una
      setTextArray(prevTextArray => prevTextArray.filter((_, i) => i !== index)); // Eliminar el texto asociado a la imagen eliminada
      setEditedTextArray(prevEditedTextArray => prevEditedTextArray.filter((_, i) => i !== index)); // Eliminar el texto editado asociado a la imagen eliminada
    }).catch(error => console.error('Error deleting image:', error));
  };

  const handleEdit = (image, index) => {
    setEditingImage(image);
    // Obtener el texto actual del elemento seleccionado para la edición
    const text = textArray[index] || '';
    setEditedTextArray(prevEditedTextArray => {
      const newArray = [...prevEditedTextArray];
      newArray[index] = text;
      return newArray;
    });
  };

  const handleSaveEdit = (index) => {
    // Guardar el texto editado en su respectivo lugar en el arreglo de texto
    setTextArray(prevTextArray => {
      const newArray = [...prevTextArray];
      newArray[index] = editedTextArray[index];
      return newArray;
    });
    setEditingImage(null); // Finalizar el modo de edición
  };

  useEffect(() => {
    listImages(); // Obtener la lista de imágenes al cargar el componente
  }, []);

  return(
    <div className="container">
      <div className="row">
        <div className="col">
          <input type="file" onChange={(e) => setImg(e.target.files[0])} />
        </div>
        <div className="col">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text"
          />
        </div>
        <div className="col">
          <button className="btn btn-info" onClick={handleClickUpload}>{editingImage ? 'Update' : 'Upload'}</button>
        </div>
      </div>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {imgUrl.map((data, index) => (
          <div className="col" key={index}>
            <div className="card">
              <img src={data.url} className="card-img-top" alt={`image_${index}`} />
              <div className="card-body">
                {editingImage && editingImage.id === index ? (
                  <input
                    type="text"
                    value={editedTextArray[index]}
                    onChange={(e) => {
                      const newText = e.target.value;
                      setEditedTextArray(prevEditedTextArray => {
                        const newArray = [...prevEditedTextArray];
                        newArray[index] = newText;
                        return newArray;
                      });
                    }}
                    placeholder="Enter text"
                  />
                ) : (
                  <p className="card-text">{textArray[index]}</p>
                )}
                <button className="btn btn-danger" onClick={() => handleDelete(data.ref, index)}>Delete</button> {/* Botón para eliminar */}
                {editingImage && editingImage.id === index ? (
                  <button className="btn btn-success" onClick={() => handleSaveEdit(index)}>Save</button>
                ) : (
                  <button className="btn btn-primary" onClick={() => handleEdit({ id: index, ref: data.ref }, index)}>Edit</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageUpload;
