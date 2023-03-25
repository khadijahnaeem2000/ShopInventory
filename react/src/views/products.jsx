import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {Link} from "react-router-dom";
import {useStateContext} from "../context/ContextProvider.jsx";

export default function Products() {
  const [products, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const {setNotification} = useStateContext()

  useEffect(() => {
    getProduct();
  }, [])

  const onDeleteClick = products => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return
    }
    axiosClient.delete(`/products/${products.id}`)
      .then(() => {
        setNotification('Products was successfully deleted')
        getProduct()
      })
  }

  const getProduct = () => {
    setLoading(true)
    axiosClient.get('/products')
      .then(({ data }) => {
        setLoading(false)
        setProduct(data.data)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  return (
    <div>
      <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
        <h1>Products</h1>
        <Link className="btn-add" to="/products/new">Add new</Link>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
          </thead>
          {loading &&
            <tbody>
            <tr>
              <td colSpan="5" class="text-center">
                Loading...
              </td>
            </tr>
            </tbody>
          }
          {!loading &&
            <tbody>
            {products.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.title}</td>
                <td>{u.description}</td>
               
                <td>
                  <Link className="btn-edit" to={'/products/' + u.id}>Edit</Link>
                  &nbsp;
                  <button className="btn-delete" onClick={ev => onDeleteClick(u)}>Delete</button>
                </td>
              </tr>
            ))}
            </tbody>
          }
        </table>
      </div>
    </div>
  )
}
