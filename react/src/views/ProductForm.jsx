import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../context/ContextProvider.jsx";

export default function ProductForm() {
  const navigate = useNavigate();
 
  let {id} = useParams();
  const [products, setProduct] = useState({
    id: null,
    title: '',
    description: ''
  })
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(false)
  const {setNotification} = useStateContext()

  if (id) {
    useEffect(() => {
      setLoading(true)
      axiosClient.get(`/products/${id}`)
      .then(({data}) => {
          setLoading(false)
          setProduct(data)
        })
       
        .catch(() => {
          setLoading(false)
        })
    }, [])
   
  }

  const onSubmit = ev => {
    ev.preventDefault()
    if (products.id) {
      axiosClient.put(`/products/${products.id}`, products)
        .then(() => {
          setNotification('User was successfully updated')
          navigate('/products')
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    } 
    else {
      axiosClient.post('/products', products)
        .then(() => {
          setNotification('Product was successfully created')
          navigate('/products')
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    }
  }

  return (
    <>
      {products.id && <h1>Update Product: {products.title}</h1>}
      {!products.id && <h1>New Product</h1>}
      <div className="card animated fadeInDown">
        {loading && (
          <div className="text-center">
            Loading...
          </div>
        )}
        {errors &&
          <div className="alert">
            {Object.keys(errors).map(key => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        }
        {!loading && (
          <form onSubmit={onSubmit} enctype="multipart/form-data">
            <input value={products.title} onChange={ev => setProduct({...products, title: ev.target.value})} placeholder="title"/>
            <input value={products.description} onChange={ev => setProduct({...products, description: ev.target.value})} placeholder="description"/>

            <button className="btn">Save</button>
          </form>
        )}
      </div>
    </>
  )
}
