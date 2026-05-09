import React, { useState, useEffect, useMemo } from 'react';
import { Container, Table, Button, Modal, Form, Alert, Row, Col } from 'react-bootstrap';
import { getAllOrders, updateOrder, confirmOrder } from '../../api/apiClient';

const styles = {
  page: { padding: '20px', background: '#f8f9fa', minHeight: '100vh', overflowY: 'auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { fontSize: '1.8rem', fontWeight: 700, color: '#1a1a2e' },
  filters: { display: 'flex', gap: '15px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' },
  searchInput: { padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', width: '220px' },
  select: { padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' },
  table: { background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  tableHeader: { background: '#1a1a2e', color: '#fff', fontWeight: 600 },
  statusBadge: { padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 },
  actionBtn: { marginRight: '5px', fontSize: '12px' },
  modalBody: { padding: '20px' },
  formGroup: { marginBottom: '15px' },
  label: { display: 'block', fontWeight: 600, marginBottom: '5px', color: '#333' },
  input: { width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' },
  textarea: { width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', minHeight: '80px' },
  modalFooter: { padding: '15px 20px', borderTop: '1px solid #eee' },
};

const statusColors = {
  PENDING: { bg: '#ffc107', color: '#000' },
  CONFIRMED: { bg: '#17a2b8', color: '#fff' },
  PROCESSING: { bg: '#007bff', color: '#fff' },
  SHIPPED: { bg: '#6c757d', color: '#fff' },
  DELIVERED: { bg: '#28a745', color: '#fff' },
  CANCELLED: { bg: '#dc3545', color: '#fff' }
};

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [updateData, setUpdateData] = useState({
    status: '',
    customerName: '',
    phone: '',
    address: '',
    notes: ''
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getAllOrders();
      setOrders(res.data);
      setError('');
    } catch {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      if (searchTerm) {
        const s = searchTerm.toLowerCase();
        if (
          !order.orderNumber?.toLowerCase().includes(s) &&
          !order.customerName?.toLowerCase().includes(s)
        ) return false;
      }
      if (statusFilter && order.status !== statusFilter) return false;
      return true;
    });
  }, [orders, searchTerm, statusFilter]);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setUpdateData({
      status: order.status,
      customerName: order.customerName,
      phone: order.phone || '',
      address: order.address || '',
      notes: order.notes || ''
    });
    setShowModal(true);
  };

  const handleUpdateOrder = async () => {
    await updateOrder(selectedOrder.id, updateData);
    fetchOrders();
    setShowModal(false);
  };

  const handleConfirmOrder = async (id) => {
    await confirmOrder(id);
    fetchOrders();
  };

  const formatDate = (d) => new Date(d).toLocaleString('en-IN');
  const formatPrice = (p) => `₹${parseFloat(p).toFixed(2)}`;

  if (loading) return <div>Loading...</div>;

  return (
    <div style={styles.page}>
      <Container fluid>

        <div style={styles.header}>
          <h1 style={styles.title}>Order Management</h1>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {/* Filters */}
        <div style={styles.filters}>
          <input
            style={styles.searchInput}
            placeholder="Search by order number or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select style={styles.select} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>

        {/* Table */}
        <Table style={styles.table} striped bordered hover>
          <thead style={styles.tableHeader}>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td>{order.orderNumber}</td>
                <td>{order.customerName}</td>
                <td>{formatDate(order.orderDate)}</td>
                <td>{formatPrice(order.totalAmount)}</td>
                <td>
                  <span style={{
                    ...styles.statusBadge,
                    background: statusColors[order.status]?.bg,
                    color: statusColors[order.status]?.color
                  }}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <Button style={styles.actionBtn} variant="primary" size="sm" onClick={() => handleViewOrder(order)}>View</Button>
                  {order.status === 'PENDING' && (
                    <Button style={styles.actionBtn} variant="success" size="sm" onClick={() => handleConfirmOrder(order.id)}>Confirm</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton style={{ background: '#1a1a2e', color: '#fff' }}>
            <Modal.Title>Order Details - {selectedOrder?.orderNumber}</Modal.Title>
          </Modal.Header>

          <Modal.Body style={styles.modalBody}>
            {selectedOrder && (
              <Row>
                <Col md={6}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Customer Name</label>
                    <input
                      style={styles.input}
                      value={updateData.customerName}
                      onChange={(e) => setUpdateData({ ...updateData, customerName: e.target.value })}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Phone</label>
                    <input
                      style={styles.input}
                      value={updateData.phone}
                      onChange={(e) => setUpdateData({ ...updateData, phone: e.target.value })}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Address</label>
                    <textarea
                      style={styles.textarea}
                      value={updateData.address}
                      onChange={(e) => setUpdateData({ ...updateData, address: e.target.value })}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Status</label>
                    <select
                      style={styles.input}
                      value={updateData.status}
                      onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Notes</label>
                    <textarea
                      style={styles.textarea}
                      value={updateData.notes}
                      onChange={(e) => setUpdateData({ ...updateData, notes: e.target.value })}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Order Date</label>
                    <p>{formatDate(selectedOrder.orderDate)}</p>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Total Amount</label>
                    <p style={{ fontSize: '18px', fontWeight: 600, color: '#e94560' }}>{formatPrice(selectedOrder.totalAmount)}</p>
                  </div>
                </Col>
              </Row>
            )}
          </Modal.Body>

          <Modal.Footer style={styles.modalFooter}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
            <Button variant="primary" onClick={handleUpdateOrder}>Save Changes</Button>
          </Modal.Footer>
        </Modal>

      </Container>
    </div>
  );
};

export default OrderManagement;