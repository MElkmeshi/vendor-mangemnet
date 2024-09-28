import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Store } from '../Store';
import { getError } from '../utils';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Button from 'react-bootstrap/Button';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
};
export default function VendorCreateScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const { id: productId } = params;

  const [{ loadingUpdate }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      const form = new FormData();
      form.append('name', name);
      form.append('description', description);
      form.append('img', e.target.imageFile.files[0]);

      await axios({
        method: 'POST',
        url: `/vendors`,
        data: form,
        headers: {
          'Content-Type': `multipart/form-data; boundary=${form._boundary}`,
        },
      });


      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      toast.success('Product updated successfully');
      navigate('/admin/vendors');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };


  return (
    <Container className="small-container">
      <h1>Create Product {productId}</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="imageFile">
          <Form.Label>Upload Image</Form.Label>
          <Form.Control type="file" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>
        <div className="mb-3">
          <Button disabled={loadingUpdate} type="submit">
            Update
          </Button>
          {loadingUpdate && <LoadingBox></LoadingBox>}
        </div>
      </Form>
    </Container>
  );
}
