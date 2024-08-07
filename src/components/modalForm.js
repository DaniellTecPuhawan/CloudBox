import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ModalPage = ({ show, onHide, onSubmit, wofData, handleChange }) => {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{wofData ? 'Edit Item' : 'Add New Item'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={onSubmit}>
                    <Form.Group controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter name" name="name" value={wofData?.name || ''} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="formTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" placeholder="Enter title" name="title" value={wofData?.title || ''} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="formStory">
                        <Form.Label>Story</Form.Label>
                        <Form.Control type="text" placeholder="Enter story" name="story" value={wofData?.story || ''} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="formType">
                        <Form.Label>Type</Form.Label>
                        <Form.Control type="text" placeholder="Enter type" name="type" value={wofData?.type || ''} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="formRange">
                        <Form.Label>Range</Form.Label>
                        <Form.Control type="text" placeholderzz="Enter range" name="range" value={wofData?.range || ''} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="formMovementSpeed">
                        <Form.Label>Movement Speed</Form.Label>
                        <Form.Control type="text" placeholder="Enter movement speed" name="movementSpeed" value={wofData?.movementSpeed || ''} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="formEnchantment">
                        <Form.Label>Enchantment</Form.Label>
                        <Form.Control type="text" placeholder="Enter enchantment" name="Enchantment" value={wofData?.Enchantment || ''} onChange={handleChange} />
                    </Form.Group>
                    <Button variant="secondary" onClick={onHide}>Close</Button>
                    <Button variant="primary" type="submit">{wofData ? 'Update' : 'Create'}</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ModalPage;
