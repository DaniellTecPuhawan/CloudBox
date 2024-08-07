import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload } from '@fortawesome/free-solid-svg-icons';

const Paint = () => {
    // Estado para almacenar los datos obtenidos de MongoDB
    const [wofDatas, setwofDatas] = useState(null);

    // Estado para almacenar el formulario de entrada
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        story: '',
        type: '',
        range: '',
        movementSpeed: '',
        Enchantment: ''
    });

    // Estado para almacenar el elemento que se está editando
    const [editingItem, setEditingItem] = useState(null);

    // Función para manejar cambios en el formulario de entrada
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Función para enviar el formulario al backend y crear o actualizar un elemento
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                // Si hay un elemento en edición, realizamos una solicitud PUT para actualizarlo
                await fetch(`/wofdata/${editingItem._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                // Actualizar el estado para reflejar los cambios
                setwofDatas(wofDatas.map(item => (item._id === editingItem._id ? formData : item)));
                // Limpiar el formulario y el estado de edición
                setFormData({
                    name: '',
                    title: '',
                    story: '',
                    type: '',
                    range: '',
                    movementSpeed: '',
                    Enchantment: ''
                });
                setEditingItem(null);
            } else {
                // Si no hay un elemento en edición, realizamos una solicitud POST para crear uno nuevo
                const response = await fetch('/wofdata', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                const data = await response.json();
                // Actualizar el estado con el nuevo elemento
                setwofDatas([...wofDatas, data]);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Función para manejar la eliminación de un elemento
    const handleDelete = async (id) => {
        try {
            await fetch(`/wofdata/${id}`, {
                method: 'DELETE'
            });
            // Filtrar los datos para eliminar el elemento eliminado
            setwofDatas(wofDatas.filter(item => item._id !== id));
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Función para manejar la edición de un elemento
    const handleEdit = (item) => {
        // Rellenar el formulario con los detalles del elemento que se está editando
        setFormData({
            name: item.name,
            title: item.title,
            story: item.story,
            type: item.type,
            range: item.range,
            movementSpeed: item.movementSpeed,
            Enchantment: item.Enchantment
        });
        // Actualizar el estado de edición con el elemento seleccionado
        setEditingItem(item);
    };

    // Función para obtener todos los elementos de MongoDB al cargar la página
    useEffect(() => {
        const fetchwofDatas = async () => {
            const response = await fetch('/wofdata');
            const json = await response.json();

            if(response.ok){
                setwofDatas(json);
            }  
        }
        fetchwofDatas(); 
    }, []);

    return( 

        <div> 
            <h1>Data from MongoDB</h1> 
            {/* Formulario para crear o editar un elemento */}
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
                <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} />
                {/*
                <input type="text" name="story" placeholder="Story" value={formData.story} onChange={handleChange} />
                <input type="text" name="type" placeholder="Type" value={formData.type} onChange={handleChange} />
                <input type="text" name="range" placeholder="Range" value={formData.range} onChange={handleChange} />
                
                <input type="text" name="movementSpeed" placeholder="Movement Speed" value={formData.movementSpeed} onChange={handleChange} />
                <input type="text" name="Enchantment" placeholder="Enchantment" value={formData.Enchantment} onChange={handleChange} />
                */}
<button type="submit" className="btn btn-primary">
    {editingItem ? <span><FontAwesomeIcon icon={faFileUpload} /> Update</span> : <span><FontAwesomeIcon icon={faFileUpload} /></span>}
</button>
            </form>
            
            <div className="container">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                {wofDatas &&
                    wofDatas.map((wofData) => (
                        <div className="col" key={wofData._id}>
                            <div className="card mb-3">
                                <div className="card-body">
                                    <p className="card-text"><p className="bold-text">Name: {wofData.name}</p></p>
                                    <p className="card-text"><p className="bold-text">Title: {wofData.title}</p></p>
                                    {/*
                                    <p className="card-text"><p className="bold-text">Story: : {wofData.story}</p></p>
                                    <p className="card-text"><p className="bold-text">Type: : {wofData.type}</p></p>
                                    <p className="card-text"><p className="bold-text">Range: : {wofData.range}</p></p>
                                    <p className="card-text"><p className="bold-text">Movement: : {wofData.movementSpeed}</p></p>
                                    <p className="card-text"><p className="bold-text">Enchantment: : {wofData.Enchantment}</p></p>
                                    */}
                                    {/* Botones para editar y borrar elementos */}
                                    <button className="btn btn-primary" onClick={() => handleEdit(wofData)}>Edit</button>
                                    <button className="btn btn-danger" onClick={() => handleDelete(wofData._id)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
            
        </div> 
    );
};

export default Paint;
