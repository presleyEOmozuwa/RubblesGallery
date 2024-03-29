import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Product.css'
import AddToCart from './AddToCart';
import { getProduct } from '../../services/product.service';
import SingelRegularItem from './BuySingleRegItem';
import SingleSubscriptionItem from './BuySingleSubItem';


const ProductDetails = () => {
    const [product, setProduct] = useState({ id: '', prodName: '', price: 0, coupon: 0, newPrice: 0, priceId: '', imageUrl: '', quantity: 0, typeOfItem: '', des: '' });

    const { id, prodName, price, coupon, newPrice, imageUrl, typeOfItem, des } = product;

    const params = useParams();
    const { productId } = params

    // REQUEST TO GET A PRODUCT
    useEffect(() => {
        getProduct(`/api/product-details/${productId}`).then((res) => {
            if (res && res.data.product) {
                setProduct((state) => {
                    let data = res.data.product;
                    const clone = {
                        ...state,
                        id: data._id,
                        prodName: data.prodName,
                        price: data.price,
                        coupon: data.coupon,
                        newPrice: data.newPrice,
                        priceId: data.priceId,
                        stockQty: data.stockQty,
                        des: data.des,
                        quantity: data.quantity,
                        typeOfItem: data.typeOfItem,
                        imageUrl: data.imageUrl
                    }
                    return clone;
                });
            }

        }).catch(async (err) => {
            if (err.response) {
                const { error } = err.response.data;
                console.log(error);
            }
        });

    }, [productId]);


    return (
        <div className='container-fluid mt-4'>
            <div className='row justify-content-center'>
                <div className='col-lg-4'></div>
                <div className='col-lg-4 p-4 shadow sect mb-2 rounded fw-bold'>
                    <div className='border shadow mb-3'>
                        <img className='img-fluid' src={imageUrl} width="100%" alt={prodName} />
                    </div>

                    <p className='card-text mb-2'><span className='fw-bold'>Name : </span> {prodName} </p>

                    {typeOfItem === "subscription" ? <p className='mb-2'> <span className='fw-bold'> Price : </span>${price} per month </p> : <p className='mb-2'> <span className='fw-bold'> Price : </span>${price}</p>}

                    {coupon ? <p className='m-0 mb-2'> <span className='fw-bold'> Coupon : </span> ${coupon}% off original price </p> : null}

                    {typeOfItem === "subscription" ? <p > <span className='fw-bold mb-2'> NewPrice : </span>${newPrice} per month </p> : <p > <span className='fw-bold mb-2'> NewPrice : </span>${newPrice}</p>}

                    <div className='text-center mt-2'>
                        {typeOfItem === "regular" ? <SingelRegularItem cartItems={[product]} /> : <SingleSubscriptionItem cartItems={[product]} />}
                        <AddToCart productId={id} typeOfItem={typeOfItem}/>
                    </div>
                </div>
                <div className='col-lg-4 pt-5'>
                    <h4 className='ps-3'>{des}</h4>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;