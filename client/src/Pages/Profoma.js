import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { EyeOutlined } from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { Modal, Button, Table, Card } from "antd";
import DefaultLayout from "../Components/DefaultLayout";
import logo from '../assets/zealtech.png';
import "../styles/InvoiceStyles.css";


const Profomas = () => {
    const componentRef = useRef();
    const dispatch = useDispatch();
    const [profomaData, setProfomaData] = useState([]);
    const [popupModal, setPopupModal] = useState(false);
    const [selectedProfoma, setSelectedProfoma] = useState(null);

    // Function to fetch all invoices
    const getAllProfomas = async () => {
        try {
            dispatch({ type: "SHOW_LOADING" });
            const { data } = await axios.get("/api/profomas/get-profoma");
            setProfomaData(data);
            dispatch({ type: "HIDE_LOADING" });
        } catch (error) {
            dispatch({ type: "HIDE_LOADING" });
            console.log(error);
        }
    };

    // Load invoices on component mount
    useEffect(() => {
        getAllProfomas();
        //eslint-disable-next-line
    }, []);

    // Function to handle printing
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    // Table columns configuration
    const columns = [
        { title: "ID", dataIndex: "_id" },
        { title: "Profoma#", dataIndex: "profomaNumber" },
        { title: "Customer Name", dataIndex: "customerName" },
        { title: "Contact No", dataIndex: "customerNumber" },
        { title: "Subtotal(Tshs)", dataIndex: "subTotal" },
        { title: "VAT", dataIndex: "tax" },
        { title: "Total Amount(Tshs)", dataIndex: "totalAmount" },
        {
            title: "Actions",
            dataIndex: "_id",
            render: (id, record) => (
                <EyeOutlined
                    style={{ cursor: "pointer", color: 'green' }}
                    onClick={() => {
                        setSelectedProfoma(record);
                        setPopupModal(true);
                    }}
                />
            ),
        },
    ];

    return (
        <DefaultLayout>
            <Card
                title="Profoma List"
                style={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', background: '#f0f2f5' }}
                headStyle={{ background: '#000', color: '#fff', fontWeight: 'bold', fontSize: '25px' }}>

                <Table columns={columns} dataSource={profomaData} bordered />
            </Card>

            {/* Modal to display invoice details */}
            {popupModal && (
                <Modal
                    width={700}
                    pagination={false}
                    title="Profoma Details"
                    open={popupModal}
                    onCancel={() => {
                        setPopupModal(false);
                    }}
                    footer={false}
                >
                    <div id="invoice-POS" ref={componentRef} className="invoice-container">
                        <center id="top">
                            <div className="logo" >
                                <img className="logo" src={logo} alt="logo" />
                            </div>
                            <div className="info">
                                <h2>ZealTech Company Ltd</h2>
                                <p> P.O. BOX 38036, Dar es salaam,Tanzania| Victoria New Bagamoyo Road Plot39A Block205 (Old BMTL House) 2nd floor.<br />
                                    Call Us: +255719100800 & +255747262626<br />www.zealtech.co.tz | sales@zealtech.co.tz<br />
                                    <b>TIN: 140-985-538 , VRN: 40-314371-L</b></p>

                            </div>
                            {/*End Info*/}
                        </center>
                        {/*End InvoiceTop*/}
                        <div id="mid">
                            <div className="mt-2">
                                <p> Profoma#: <b>{selectedProfoma.profomaNumber}</b>
                                    <br />
                                    Customer Name : <b>{selectedProfoma.customerName}</b>
                                    <br />
                                    Phone No : <b>{selectedProfoma.customerNumber}</b>
                                    <br />
                                    Date : <b>{selectedProfoma.date.toString().substring(0, 10)}</b>
                                    <br />
                                    Due Date: <b>{selectedProfoma.dueDate}</b>
                                </p>
                                <hr style={{ margin: "5px" }} />
                            </div>
                        </div>
                        {/*End Invoice Mid*/}
                        <div id="bot">
                            <div id="table">
                                <table >
                                    <tbody>
                                        <tr className="tabletitle">
                                            <td className="item" style={{ paddingRight: '10px' }}>
                                                <h2>Item</h2>
                                            </td>
                                            <td className="Hours" style={{ paddingRight: '10px' }}>
                                                <h2>Description</h2>
                                            </td>
                                            <td className="Hours" style={{ paddingRight: '10px' }}>
                                                <h2>Qty</h2>
                                            </td>

                                            <td className="Rate" style={{ paddingRight: '10px' }} >
                                                <h2>Price(Tshs)</h2>
                                            </td>
                                            <td className="Rate" style={{ paddingRight: '10px' }} >
                                                <h2>Total(Tshs)</h2>
                                            </td>
                                        </tr>
                                        {selectedProfoma.cartItems.map((item) => (
                                            <>
                                                <tr className="service">
                                                    <td className="tableitem" style={{ paddingRight: '10px' }} >
                                                        <p className="itemtext">{item.name}</p>
                                                    </td>
                                                    <td className="tableitem" style={{ paddingRight: '10px' }}>
                                                        <p className="itemtext">{item.description}</p>
                                                    </td>
                                                    <td className="tableitem" style={{ paddingRight: '10px' }}>
                                                        <p className="itemtext">{item.quantity}</p>
                                                    </td>
                                                    <td className="tableitem" style={{ paddingRight: '10px' }} >
                                                        <p className="itemtext">{item.price}</p>
                                                    </td>
                                                    <td className="tableitem" style={{ paddingRight: '10px' }}>
                                                        <p className="itemtext">
                                                            {item.quantity * item.price}
                                                        </p>
                                                    </td>
                                                </tr>
                                            </>
                                        ))}

                                        <tr className="tabletitle">
                                            <td />
                                            <td />
                                            <td />
                                            <td className="Rate" >
                                                <h2>Vat Total:</h2>
                                            </td>
                                            <td className="payment">
                                                <h2>Tshs:{selectedProfoma.tax}</h2>
                                            </td>
                                        </tr>
                                        <tr className="tabletitle">
                                            <td />
                                            <td />
                                            <td />
                                            <td className="Rate">
                                                <h2>Total VAT Incl:</h2>
                                            </td>
                                            <td className="payment">
                                                <h2>
                                                    <b>Tshs:{selectedProfoma.totalAmount}</b>
                                                </h2>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            {/*End Table*/}
                            <div id="legalcopy">
                                <p className="legal">
                                    <h2 style={{ backgroundColor: 'lightskyblue', color: 'black' }}>PAYMENTS AND BANK DETAILS</h2>
                                    <strong>All Payments Should be Done through:<br />Account Name:ZEALTECH COMPANY LIMITED<br />
                                        Account Number: 0150766033700 CRDB<br />KIJITONYAMA BRANCH</strong><br /> If you have any question about this quotation, please contact<br />
                                    <b> 0713545494</b>
                                </p>
                            </div>
                        </div>
                        {/*End InvoiceBot*/}
                    </div>
                    {/*End Invoice*/}

                    <div className="d-flex justify-content-end mt-3">
                        <Button type="primary" onClick={handlePrint}>
                            Print
                        </Button>
                    </div>
                </Modal>
            )}
        </DefaultLayout>
    );
};

export default Profomas;
