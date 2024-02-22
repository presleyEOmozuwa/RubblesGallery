import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts } from '../../services/product.service';

const AuthShowProducts = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [count, setCount] = useState(3);
    const [searchVal, setSearchVal] = useState('');

    const filtered = products.filter((item) => item.prodName.toLowerCase().includes(searchVal));
    
    const navigate = useNavigate();

    const handleClick = (event) => {
        navigate(`/product/${event.target.value}`);
    }
    

    const handlePrevious = async (event) => {
        event.preventDefault();
        if(page >= 0){
            return setPage((page) => page - 1);
        }
    }

    const handleNext = async (event) => {
        event.preventDefault();
        if(products.length >= 1){
            return setPage((page) => page + 1);
        }
    }

    const handleSearch = async (event) => {
        event.preventDefault();
        setSearchVal(event.target.value);
    }

    // REQUEST TO GET ALL PRODUCTS FOR DISPLAY
    useEffect(() => {
        getAllProducts(`/api/product-list?count=${count}&page=${page}`).then((res) => {
            console.log(res);
            if (res.data.products) {
                setProducts(res.data.products)
            }
        }).catch((err) => {
            const { error } = err.response.data;
            console.log(error);
        });

    }, [JSON.stringify(products), count, page]);


    return (
        <div className='container-fluid'>
            <div className='row p-2'>
                <div className='col-lg-8'>
                    <h1 className='fw-light'>Rubbles Brand Gallery</h1>
                </div>
                <div className='col-lg-4 text-center sect'>
                    <input className='rounded form-control' type="text" placeholder="Search Item" onChange={(e) => handleSearch(e)} />
                </div>
            </div>
            <div className='row mx-1 p-2'>
                {filtered.map((product, index) => {
                    return (
                        <div key={index} className='col-lg-4 p-4 shadow sect mb-2 px-4 rounded fw-bold'>
                            <div className='border shadow mb-3'>
                                <img src={product.imageUrl} width="100%" alt={product.prodName} />
                            </div>
                            <p className='card-text'><span className='fw-bold'>Name : </span> {product.prodName} </p>
                            <p > <span className='fw-bold'>Price : </span>{product.price}</p>
                            <p className='mb-4'> <span className='fw-bold'>Coupon : </span> {product.coupon}% off original price </p>
                            <div className="d-grid gap-2 col-10 rounded-0 shadow mx-auto">
                                <button className="btn btn-primary" type="button" onClick={(e) => handleClick(e)} value={product._id}>Show Info</button>
                            </div>

                        </div>
                    )
                })}
            </div>
            <div className='row mb-3'>
                <div className='col-lg-4'></div>
                <div className='col-lg-4 text-center'>
                    <button className="btn btn-white text-primary p-0 px-3 rounded-0 border me-1" onClick={(e) => handlePrevious(e)}><small> Previous </small></button>
                    <button className="btn btn-white text-primary p-0 px-3 rounded-0 border ms-1" onClick={(e) => handleNext(e)}><small> Next</small></button>
                </div>
                <div className='col-lg-4'></div>
            </div>
        </div>
    );
};

export default AuthShowProducts;