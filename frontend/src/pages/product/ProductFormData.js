import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import './Product.css'
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { getAllCategories } from '../../services/category.service';
import { createProduct } from '../../services/product.service';
import { tokenRenewalHandler } from '../../utils/tokenRefresh';


const ProductFormData = () => {
    const [categoryObj, setCategoryObj] = useState({ categoryArray: [] });
    const { categoryArray } = categoryObj;

    const auth = useAuth();
    let { httptoken, getToken, setToken } = auth;


    const navigate = useNavigate();

    const initialValues =
    {
        prodName: '',
        price: 0,
        priceId: '',
        coupon: 0,
        stockQty: 0,
        des: '',
        imageUrl: '',
        typeOfItem: '',
        categories: []
    }



    const onSubmit = async (payload, onSubmitProps) => {
        console.log(payload);
        const token = getToken("access_token");
        createProduct("/api/product-form/payload", { payload: payload }, { headers: httptoken(token) }).then((res) => {
            console.log(res.data);
            if (res && res.data.product.typeOfItem === "regular") {
                // onSubmitProps.resetForm();
                navigate("/admin/productlist");
            }
            else{
                // onSubmitProps.resetForm();
                navigate("/admin/sub/products")
            }
        }).catch(async (err) => {
            console.log(err);
            const { error } = err.response.data;
            if (err.response) {
                if (error === "access token expired") {
                    await tokenRenewalHandler(navigate, getToken, setToken, toast);
                }
            }
        });
    }

    const validationSchema = Yup.object({
        prodName: Yup.string().required("name field is required"),
        price: Yup.number().required("price field is required").min(1, "price must be greater than zero"),
        des: Yup.string().required("description field is required"),
        imageUrl: Yup.string().required("image url field is required"),
        typeOfItem: Yup.string().required("type of item required")
    })

    useEffect(() => {
        const token = getToken("access_token");
        getAllCategories("/api/category-list", { headers: httptoken(token) }).then((res) => {
            // console.log(res.data);
            if (res && res.data) {
                setCategoryObj((state) => {
                    return {
                        ...state,
                        categoryArray: res.data.categoryList
                    }
                });
            }
        }).catch(async (err) => {
            console.log(err);
            const { error } = err.response.data;
            if (err.response) {
                if (error === "access token expired") {
                    await tokenRenewalHandler(navigate, getToken, setToken, toast);
                }
                if (error === "already cleared out") {
                    toast.info(error);
                }
            }

        });

    }, [JSON.stringify(categoryArray), httptoken, getToken, setToken, navigate]);


    return (
        <div className='container mt-5'>
            <div className='row'>
                <div className='col-lg-4'></div>
                <div className='col-lg-5 border p-4 shadow'>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={onSubmit}
                        validationSchema={validationSchema}
                        enableReinitialize={true}
                    >
                        {(formik) => {
                            const handleCategory = (event) => {
                                const { target } = event;
                                const { checked, value } = target;
                                const modified = [...categoryArray];
                                modified.forEach((c) => {
                                    if(c.catName === value){
                                        c.ischecked = checked;
                                    }
                                })
                                formik.values.categories = modified;
                                console.log(checked)
                                console.log(value)
                            }

                            const handleTypeOfItem = async (event) => {
                                formik.values.typeOfItem = event.target.value;
                            }


                            return (
                                <Form>
                                    <div className='form-group mb-3'>
                                        <label htmlFor='prodName'>Name</label>
                                        <Field name="prodName">
                                            {(props) => {
                                                const { field, meta } = props;
                                                return (
                                                    <>
                                                        <input className='form-control' type="text" id="prodName" {...field} />
                                                        {meta.touched && meta.error ? <p className='text-danger'>{meta.error}</p> : null}
                                                    </>
                                                )
                                            }}
                                        </Field>
                                    </div>
                                    <div className='form-group mb-3'>
                                        <label htmlFor='price'>Price</label>
                                        <Field name="price">
                                            {(props) => {
                                                const { field, meta } = props;
                                                return (
                                                    <>
                                                        <input className='form-control' type="number" id="price" {...field} />
                                                        {meta.touched && meta.error ? <p className='text-danger'>{meta.error}</p> : null}
                                                    </>
                                                )
                                            }}
                                        </Field>
                                    </div>
                                    <div className='form-group mb-3'>
                                        <label htmlFor='priceId'>PriceId</label>
                                        <Field name="priceId">
                                            {(props) => {
                                                const { field, meta } = props;
                                                return (
                                                    <>
                                                        <input className='form-control' type="text" id="priceId" {...field} />
                                                        {meta.touched && meta.error ? <p className='text-danger'>{meta.error}</p> : null}
                                                    </>
                                                )
                                            }}
                                        </Field>
                                    </div>
                                    <div className='form-group mb-3'>
                                        <label htmlFor='coupon'>Coupon</label>
                                        <Field name="coupon">
                                            {(props) => {
                                                const { field, meta } = props;
                                                return (
                                                    <>
                                                        <input className='form-control' type="number" id="coupon" {...field} />
                                                    </>
                                                )
                                            }}
                                        </Field>
                                    </div>
                                    <div className='form-group mb-3'>
                                        <label htmlFor='stockQty'>StockQty</label>
                                        <Field name="stockQty">
                                            {(props) => {
                                                const { field, meta } = props;
                                                return (
                                                    <>
                                                        <input className='form-control' type="number" id="stockQty" {...field} />
                                                    </>
                                                )
                                            }}
                                        </Field>
                                    </div>
                                    <div className='form-group mb-3'>
                                        <label htmlFor='des'>Description</label>
                                        <Field name="des">
                                            {(props) => {
                                                const { field, meta } = props;
                                                return (
                                                    <>
                                                        <input className='form-control' type="text" id="des" {...field} />
                                                        {meta.touched && meta.error ? <p className='text-danger'>{meta.error}</p> : null}
                                                    </>
                                                )
                                            }}
                                        </Field>
                                    </div>
                                    <div className='form-group mb-4'>
                                        <label htmlFor='imageUrl'>ImageUrl</label>
                                        <Field name="imageUrl">
                                            {(props) => {
                                                const { field, meta } = props;
                                                return (
                                                    <>
                                                        <input className='form-control' type="text" id="imageUrl" {...field} />
                                                        {meta.touched && meta.error ? <p className='text-danger'>{meta.error}</p> : null}
                                                    </>
                                                )
                                            }}
                                        </Field>
                                    </div>
                                    <div className='form-group mb-4'>
                                        <label className='me-2' htmlFor='typeOfItem'>TypeOfItem :</label>
                                        <Field name="typeOfItem">
                                            {(props) => {
                                                const { field, meta } = props;
                                                const arr = ["select", "regular", "subscription"]

                                                return (
                                                    <>
                                                        <select onChange={(e) => handleTypeOfItem(e)} id="typeOfItem">
                                                            {arr.map((t, i) => {
                                                                return (
                                                                    <option key={i} value={t}>{t}</option>
                                                                )
                                                            })}
                                                        </select>
                                                        {meta.touched && meta.error ? <p className='text-danger'>{meta.error}</p> : null}
                                                    </>
                                                )
                                            }}
                                        </Field>
                                    </div>
                                    <div className='form-check mb-3'>
                                        {categoryArray.map((cat, i) => {
                                            return (
                                                <div key={i}>
                                                    <input className="form-check-input me-2" type="checkbox" id={cat.catName} defaultChecked={cat.ischecked} onChange={(e) => handleCategory(e)} value={cat.catName} />
                                                    <label htmlFor={cat.catName}>{cat.catName}</label>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div className='text-center'>
                                        <button className='btn btn-primary rounded-0 shadow px-3 fw-semibold' type='submit'>Submit</button>
                                    </div>
                                </Form>
                            )
                        }}
                    </Formik>
                </div>
                <div className='col-lg-3'></div>
            </div>
        </div>
    );
};

export default ProductFormData;