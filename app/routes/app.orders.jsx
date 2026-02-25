// ...existing code...
import React, { useEffect, useState } from "react";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        fetch("/api/orders")
            .then((res) => {
                if (!res.ok) throw new Error(res.statusText || "Fetch error");
                return res.json();
            })
            .then((data) => {
                if (!mounted) return;
                setOrders(Array.isArray(data) ? data : data.orders || []);
            })
            .catch((err) => {
                if (!mounted) return;
                setError(err.message);
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });
        return () => (mounted = false);
    }, []);

    if (loading) return <div>Loading orders...</div>;
    if (error) return <div>Error loading orders: {error}</div>;
    if (!orders.length) return <div>No orders found</div>;

    return (
        <div>
            <h2>Orders ({orders.length})</h2>
            <ul>
                {orders.map((order) => (
                    <li key={order.id || order.order_number}>
                        <strong>{order.name || `#${order.order_number || order.id}`}</strong>
                        {" — "}
                        {order.total_price ? `$${order.total_price}` : ""}
                        {" • "}
                        {order.created_at ? new Date(order.created_at).toLocaleString() : ""}
                        {order.line_items && order.line_items.length > 0 && (
                            <ul>
                                {order.line_items.map((li) => (
                                    <li key={li.id || li.variant_id}>
                                        {li.quantity}× {li.title} {li.price ? `@ $${li.price}` : ""}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
// ...existing code...