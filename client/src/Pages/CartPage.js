import React, { useState, useEffect } from "react";
import DefaultLayout from "../Components/DefaultLayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
    DeleteOutlined,
    PlusCircleOutlined,
    MinusCircleOutlined,
} from "@ant-design/icons";
import { Table, Button, Modal, message, Form, Input, Select, DatePicker, Card } from "antd";

const CartPage = () => {
    const [subTotal, setSubTotal] = useState(0);
    const [invoicePopup, setInvoicePopup] = useState(false);
    const [profomaPopup, setProfomaPopup] = useState(false); // Fix typo here
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems } = useSelector((state) => state.rootReducer);

    //handle increment
    const handleIncrement = (record) => {
        dispatch({
            type: "UPDATE_CART",
            payload: { ...record, quantity: record.quantity + 1 },
        });
    };

    const handleDecrement = (record) => {
        if (record.quantity !== 1) {
            dispatch({
                type: "UPDATE_CART",
                payload: { ...record, quantity: record.quantity - 1 },
            });
        }
    };

    const columns = [
        { title: "Name", dataIndex: "name" },
        {
            title: "Image",
            dataIndex: "image",
            render: (image, record) => (
                <img src={image} alt={record.name} height="60" width="60" />
            ),
        },
        { title: "Price", dataIndex: "price" },
        {
            title: "Quantity",
            dataIndex: "_id",
            render: (id, record) => (
                <div>
                    <PlusCircleOutlined
                        className="mx-3"
                        style={{ cursor: "pointer", color: 'green' }}
                        onClick={() => handleIncrement(record)}
                    />
                    <b>{record.quantity}</b>
                    <MinusCircleOutlined
                        className="mx-3"
                        style={{ cursor: "pointer", color: 'orange' }}
                        onClick={() => handleDecrement(record)}
                    />
                </div>
            ),
        },
        {
            title: "Actions",
            dataIndex: "_id",
            render: (id, record) => (
                <DeleteOutlined
                    style={{ cursor: "pointer", color: 'red' }}
                    onClick={() =>
                        dispatch({
                            type: "DELETE_FROM_CART",
                            payload: record,
                        })
                    }
                />
            ),
        },
    ];

    useEffect(() => {
        let temp = 0;
        cartItems.forEach((item) => (temp = temp + item.price * item.quantity));
        setSubTotal(temp);
    }, [cartItems]);

    //handleSubmit for Invoice
    const handleInvoiceSubmit = async (value) => {
        try {
            const tax = Number(((subTotal / 100) * 18).toFixed(2));
            const totalAmount = Number(subTotal) + tax;
            const userId = JSON.parse(localStorage.getItem("auth"))._id;
            const newObject = {
                ...value,
                cartItems,
                subTotal,
                tax,
                totalAmount,
                userId,
            };
            await axios.post("/api/invoices/add-invoice", newObject);
            message.success("Invoice Generated Successfully");
            navigate("/invoices");
        } catch (error) {
            message.error("Something went wrong");
            console.log(error);
        }
    };

    //handleSubmit for Profoma
    const handleProfomaSubmit = async (value) => {
        try {
            const tax = Number(((subTotal / 100) * 18).toFixed(2));
            const totalAmount = Number(subTotal) + tax;
            const userId = JSON.parse(localStorage.getItem("auth"))._id;
            const newObject = {
                ...value,
                cartItems,
                subTotal,
                tax,
                totalAmount,
                userId,
            };
            await axios.post("/api/profomas/add-profoma", newObject); // Fix the endpoint URL
            message.success("Profoma Generated Successfully");
            navigate("/profoma");
        } catch (error) {
            message.error("Something went wrong");
            console.log(error);
        }
    };

    return (
        <DefaultLayout>
            <Card
                title="My Cart"
                style={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', background: '#f0f2f5' }}
                headStyle={{ background: '#000', color: '#fff', fontWeight: 'bold', fontSize: '25px' }}>

                <Table columns={columns} dataSource={cartItems} bordered />
                <div className="d-flex flex-column align-items-end">
                    <hr />
                    <h4>
                        SUB-TOTAL: Tsh: <b>{subTotal}</b> /-
                    </h4>
                    <div style={{ display: "flex", gap: "20px" }}>
                        <Button type="primary" onClick={() => setInvoicePopup(true)}>
                            Create Invoice
                        </Button>
                        <Button type="primary" onClick={() => setProfomaPopup(true)}>
                            Create Profoma
                        </Button>
                    </div>
                </div>
            </Card>

            <Modal
                title="Create Invoice"
                open={invoicePopup}
                onCancel={() => setInvoicePopup(false)}
                footer={null}
            >
                <Form layout="vertical" onFinish={handleInvoiceSubmit}>
                    <Form.Item name="invoiceNumber" label="Invoice Number">
                        <Input />
                    </Form.Item>
                    <Form.Item name="customerName" label="Customer Name">
                        <Input />
                    </Form.Item>
                    <Form.Item name="customerNumber" label="Contact Number">
                        <Input />
                    </Form.Item>
                    <Form.Item name="customerTin" label="Customer TIN">
                        <Input />
                    </Form.Item>
                    <Form.Item name="dueDate" label="Due Date">
                        <DatePicker />
                    </Form.Item>
                    <Form.Item name="status" label="Invoice Status">
                        <Select>
                            <Select.Option value="pending">Pending</Select.Option>
                            {/* <Select.Option value="card">P</Select.Option> */}
                        </Select>
                    </Form.Item>
                    <Form.Item name="paymentMode" label="Payment Method">
                        <Select>
                            <Select.Option value="cash">Cash</Select.Option>
                            <Select.Option value="card">Card</Select.Option>
                        </Select>
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                        Generate Invoice
                    </Button>
                </Form>
            </Modal>

            <Modal
                title="Create Profoma"
                open={profomaPopup}
                onCancel={() => setProfomaPopup(false)}
                footer={null}
            >
                <Form layout="vertical" onFinish={handleProfomaSubmit}>
                    <Form.Item name="profomaNumber" label="Profoma Number">
                        <Input />
                    </Form.Item>
                    <Form.Item name="customerName" label="Customer Name">
                        <Input />
                    </Form.Item>
                    <Form.Item name="customerNumber" label="Contact Number">
                        <Input />
                    </Form.Item>
                    <Form.Item name="dueDate" label="Due Date">
                        <DatePicker />
                    </Form.Item>
                    <Form.Item name="paymentMode" label="Payment Method">
                        <Select>
                            <Select.Option value="cash">Cash</Select.Option>
                            <Select.Option value="card">Card</Select.Option>
                        </Select>
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                        Generate Profoma
                    </Button>
                </Form>
            </Modal>
        </DefaultLayout>
    );
};

export default CartPage;
