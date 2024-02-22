import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { getOrder } from '../../services/order.service'
import { totalBeforeTax, totalAfterTax } from './helper'
import { tokenRenewalHandler } from '../../utils/tokenRefresh';
import './OrderStore.css'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'react-toastify';

const Invoice = () => {
    const [order, setOrder] = useState({});
    const pdfRef = useRef();

    const params = useParams();
    const { sessionId } = params;

    const auth = useAuth();
    const { httptoken, getToken, setToken } = auth;

    const navigate = useNavigate();

    const handleDownloadInvoice = async (event) => {
        event.preventDefault();
        const input = pdfRef.current
        const canvas = await html2canvas(input);
        const imgData = canvas.toDataURL('img/png');
        const pdf = new jsPDF('p', 'mm', 'a4', true);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 30;
        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        pdf.save('invoice.pdf');
    }

    useEffect(() => {
        const token = getToken("access_token");
        getOrder(`/api/order-details/${sessionId}`, { headers: httptoken(token) }).then((res) => {
            if (res && res?.data.order) {
                console.log(res?.data.order)
                setOrder(res.data.order);
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

    }, [navigate, httptoken, getToken, setToken]);


    return (
        <div className='container' ref={pdfRef}>
            <div className='row mb-3'>
                <div className='col-lg-3'></div>
                <div className='col-lg-7'>
                    <h5><span className='fw-semibold'>Invoice for Order</span> {order.orderNumber}</h5>
                    <div className='m-0 text-center'>
                        <button className="btn btn-white p-0 px-3 border me-1 " onClick={(e) => handleDownloadInvoice(e)}><small> Download invoice </small></button>
                    </div>
                </div>
                <div className='col-lg-2'>
                </div>
            </div>
            <div className='row mb-4'>
                <div className='col-lg-5'>
                    <div>
                        <span className='fw-semibold me-2'>Order placed:</span>
                        <span> {order.orderplaced} </span>
                    </div>
                    <div>
                        <span className='fw-semibold me-2'>Invoice number:</span>
                        <span> {order.orderNumber} </span>
                    </div>
                    <div>
                        <span className='fw-semibold me-2'>Order total:</span>
                        <span className='fw-semibold'> ${order.orderTotal} </span>
                    </div>
                </div>
                <div className='col-lg-5'></div>
                <div className='col-lg-2'></div>
            </div>
            <div className='row mb-3'>
                <div className='col-lg-3'></div>
                <div className='col-lg-7'>
                    <h5 className='fw-semibold'> Details of Items Bought </h5>
                </div>
                <div className='col-lg-2'>
                </div>
            </div>
            {order.cartItems?.map((item, i) => {
                return (
                    <React.Fragment key={i}>
                        <div className='row mb-3'>
                            <div className='col-lg-2'></div>
                            <div className='col-lg-6'>
                                <div className='mb-1'>
                                    <span className='fw-semibold me-2'>Item name:</span>
                                    <span className='ms-2'> {item.prodName} </span>
                                </div>
                                <div className='mb-1'>
                                    <span className='fw-semibold me-2'>Description:</span>
                                    <span className='ms-2'>{item.des}</span>
                                </div>
                                <div className='mb-1'>
                                    <span className='fw-semibold me-4'>Quantity:</span>
                                    <span className='ms-4'>{item.quantity}</span>
                                </div>
                            </div>
                            <div className='col-lg-2'>
                                <span className='fw-bold'> Unit price </span>
                                <p>${item.newPrice}</p>
                            </div>
                            <div className='col-lg-2'>
                                <span className='fw-bold'> Amount </span>
                                <p className='fw-semibold'>${(item.newPrice * item.quantity).toFixed(2)}</p>
                            </div>
                        </div>
                    </React.Fragment>
                )
            })}
            <div className='row mb-3'>
                <div className='col-lg-2'></div>
                <div className='col-lg-8'>
                    <div className='mb-2'>
                        <span className='fw-semibold me-4'>Shipping Address:</span>
                        <p className='m-0'>{order.customerAddress?.postalcode}</p>
                    </div>
                    <div className='mb-2'>
                        <span className='fw-semibold me-4'>Shipping Speed:</span>
                        <p className='m-0'>Standard Shipping</p>
                    </div>
                </div>
                <div className='col-lg-2'></div>
            </div>
            <div className='row mb-3'>
                <div className='col-lg-3'></div>
                <div className='col-lg-7'>
                    <h5 className='fw-semibold'> Payment Information </h5>
                </div>
                <div className='col-lg-2'>
                </div>
            </div>
            <div className='row'>
                <div className='col-lg-2'></div>
                <div className='col-lg-8'>
                    <div className='mb-2'>
                        <span className='fw-semibold me-4'>Payment Method:</span>
                        <p className='m-0'>Visa ending in {order.last4}</p>
                    </div>
                    <div className='mb-2'>
                        <span className='fw-semibold me-4'>Billing Address:</span>
                        <p className='m-0'>{order.customerAddress?.postalcode}</p>
                    </div>
                </div>
                <div className='col-lg-2'>
                    <div>
                        <span className='fw-bold'> Subtotal:</span>
                        <p className='fw-semibold'>${order.orderTotal}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Invoice;