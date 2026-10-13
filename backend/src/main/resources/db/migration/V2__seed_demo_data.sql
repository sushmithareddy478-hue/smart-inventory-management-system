-- V2__seed_demo_data.sql: Realistic seed data for demo and testing
-- BCrypt password hashes correspond to:
-- admin: admin123 ($2a$10$3Z.. standard BCrypt hash)
-- manager: manager123
-- staff: staff123

-- 1. Insert Initial Users
INSERT INTO users (id, username, email, password_hash, full_name, role, status) VALUES
(1, 'admin', 'admin@inventorypro.io', '$2a$10$j8dHQHszw9a0jG8tS9w2.OGl2Bw6xVdYF2uA1c9hR5K0m8q3v5p.K', 'System Administrator', 'ROLE_ADMIN', 'ACTIVE'),
(2, 'manager', 'manager@inventorypro.io', '$2a$10$j8dHQHszw9a0jG8tS9w2.OGl2Bw6xVdYF2uA1c9hR5K0m8q3v5p.K', 'Elena Rostova', 'ROLE_WAREHOUSE_MANAGER', 'ACTIVE'),
(3, 'staff', 'staff@inventorypro.io', '$2a$10$j8dHQHszw9a0jG8tS9w2.OGl2Bw6xVdYF2uA1c9hR5K0m8q3v5p.K', 'Alex Chen', 'ROLE_STAFF', 'ACTIVE')
ON DUPLICATE KEY UPDATE id=id;

-- 2. Insert Categories
INSERT INTO categories (id, name, code, description) VALUES
(1, 'Electronics & Components', 'CAT-ELEC', 'Semiconductors, motherboards, display units, sensors'),
(2, 'Storage & Networking', 'CAT-NET', 'NVMe SSDs, Routers, Cat6 cabling, switches'),
(3, 'Office Hardware', 'CAT-OFF', 'Keyboards, ergonomical mice, docking stations, monitors'),
(4, 'Packaging & Materials', 'CAT-PKG', 'Corrugated boxes, thermal labels, bubble cushions')
ON DUPLICATE KEY UPDATE id=id;

-- 3. Insert Suppliers
INSERT INTO suppliers (id, name, contact_person, email, phone, address, rating, lead_time_days, status) VALUES
(1, 'Apex Micro Systems Ltd', 'Marcus Vance', 'marcus@apexmicro.com', '+1-555-019-2831', '100 Silicon Way, San Jose, CA', 4.90, 5, 'ACTIVE'),
(2, 'Global Core Logistics Corp', 'Sarah Lin', 'slin@globalcorelog.com', '+1-555-018-9922', '450 Freight Blvd, Chicago, IL', 4.70, 7, 'ACTIVE'),
(3, 'Shenzhen Precision Parts', 'Wei Zhang', 'export@szprecision.cn', '+86-755-8821-3990', 'Building 4, Nanshan Tech Park, Shenzhen', 4.60, 14, 'ACTIVE'),
(4, 'Nordic Industrial Pack', 'Frederik Lind', 'orders@nordicpack.eu', '+45-33-91-20-40', 'Industrivej 12, Copenhagen, Denmark', 4.85, 4, 'ACTIVE')
ON DUPLICATE KEY UPDATE id=id;

-- 4. Insert Products with Barcodes & Realistic Stock Levels (Including Low Stock for alerts)
INSERT INTO products (id, sku, barcode, name, description, category_id, supplier_id, unit_price, cost_price, quantity_in_stock, min_threshold, reorder_point, location_rack, unit_of_measure, status) VALUES
(1, 'SKU-NVME-2TB', '890123456701', 'Samsung 990 PRO 2TB NVMe PCIe 4.0 SSD', 'High performance enterprise NVMe M.2 2280 drive', 2, 1, 179.99, 130.00, 48, 15, 30, 'RACK-B2-04', 'PCS', 'ACTIVE'),
(2, 'SKU-RTX-4080', '890123456702', 'GeForce RTX 4080 Super 16GB OC', 'Tri-fan cooling graphic accelerator for rendering workstations', 1, 1, 999.00, 840.00, 6, 8, 15, 'RACK-A1-02', 'PCS', 'ACTIVE'), -- LOW STOCK ALERT!
(3, 'SKU-SFP-10G', '890123456703', '10G SFP+ Optical Transceiver Module 850nm', '10Gbps Multi-mode fiber module, 300m LC duplex', 2, 2, 34.50, 21.00, 120, 25, 50, 'RACK-C1-11', 'PCS', 'ACTIVE'),
(4, 'SKU-MECH-KB', '890123456704', 'ProLogix Wireless Hot-Swap Mechanical Keyboard', 'Gateron Yellow linear switches with RGB backlight', 3, 3, 89.00, 52.00, 4, 10, 20, 'RACK-D4-09', 'PCS', 'ACTIVE'), -- CRITICAL LOW STOCK!
(5, 'SKU-CAT6A-305M', '890123456705', 'Shielded Cat6A Bulk Pure Copper Cable 305m Spool', '10GbE CMR riser rated shielded twisted pair', 2, 2, 185.00, 125.00, 22, 10, 18, 'RACK-E3-01', 'SPOOL', 'ACTIVE'),
(6, 'SKU-USB-HUB-7P', '890123456706', 'Industrial 7-Port USB 3.2 Gen 2 Hub with 36W Adapter', 'Metal casing ESD protected DIN rail mountable', 3, 3, 62.00, 38.00, 2, 6, 12, 'RACK-D1-05', 'PCS', 'ACTIVE'), -- CRITICAL LOW STOCK!
(7, 'SKU-CORR-BX-M', '890123456707', 'Heavy Duty Corrugated Shipping Boxes 12x12x10 (Bundle of 25)', '32 ECT single wall brown kraft shipping cartons', 4, 4, 38.00, 22.00, 95, 20, 40, 'RACK-W1-08', 'BUNDLE', 'ACTIVE'),
(8, 'SKU-THERM-LBL', '890123456708', 'Direct Thermal Shipping Labels 4x6 inch (4 Rolls / 1000 Labels)', 'High tack adhesive standard 1-inch core', 4, 4, 29.99, 16.50, 140, 30, 60, 'RACK-W2-02', 'PACK', 'ACTIVE')
ON DUPLICATE KEY UPDATE id=id;

-- 5. Insert Sample Purchase Orders
INSERT INTO purchase_orders (id, order_number, supplier_id, created_by_user_id, status, total_amount, expected_delivery_date, notes) VALUES
(1, 'PO-2026-001', 1, 2, 'APPROVED', 14985.00, '2026-10-15', 'Urgent batch restock for enterprise NVMe and GPU units'),
(2, 'PO-2026-002', 3, 2, 'PENDING', 2140.00, '2026-10-22', 'Q4 replenishment for hot-swap keyboards and USB hubs'),
(3, 'PO-2026-003', 4, 1, 'RECEIVED', 1980.00, '2026-10-02', 'Warehouse standard packaging supplies delivery fulfilled')
ON DUPLICATE KEY UPDATE id=id;

-- 6. Insert Purchase Order Line Items
INSERT INTO purchase_order_items (id, order_id, product_id, quantity, unit_price, received_quantity) VALUES
(1, 1, 1, 50, 130.00, 0),
(2, 1, 2, 10, 840.00, 0),
(3, 2, 4, 25, 52.00, 0),
(4, 2, 6, 20, 38.00, 0),
(5, 3, 7, 50, 22.00, 50),
(6, 3, 8, 55, 16.00, 55)
ON DUPLICATE KEY UPDATE id=id;

-- 7. Insert Historical Inventory Transactions (Enabling demand velocity calculation)
INSERT INTO inventory_transactions (id, transaction_type, product_id, quantity, previous_quantity, new_quantity, reference_id, reference_type, notes, performed_by_user_id, created_at) VALUES
(1, 'STOCK_IN', 1, 60, 0, 60, 'PO-2026-000', 'PURCHASE_ORDER', 'Initial warehouse stock ingestion', 1, '2026-09-01 10:00:00'),
(2, 'STOCK_OUT', 1, -12, 60, 48, 'SO-8812', 'SALES_ORDER', 'Dispatched to Datacenter customer Alpha', 3, '2026-09-18 14:30:00'),
(3, 'STOCK_OUT', 2, -14, 20, 6, 'SO-8901', 'SALES_ORDER', 'Fulfillment for high-demand AI compute lab', 2, '2026-09-25 11:15:00'),
(4, 'STOCK_OUT', 4, -16, 20, 4, 'SO-8920', 'SALES_ORDER', 'Retail bulk dispatch', 3, '2026-09-28 16:45:00'),
(5, 'STOCK_IN', 7, 50, 45, 95, 'PO-2026-003', 'PURCHASE_ORDER', 'Packaging receiving confirmed', 2, '2026-10-02 09:10:00')
ON DUPLICATE KEY UPDATE id=id;

-- 8. Insert Audit Logs
INSERT INTO audit_logs (id, entity_name, entity_id, action, user_email, ip_address, changes_json, created_at) VALUES
(1, 'Product', 2, 'STOCK_ADJUSTMENT', 'manager@inventorypro.io', '192.168.1.45', '{"sku": "SKU-RTX-4080", "delta": -14, "reason": "Dispatch SO-8901"}', '2026-09-25 11:15:00'),
(2, 'PurchaseOrder', 1, 'CREATE', 'manager@inventorypro.io', '192.168.1.45', '{"order_number": "PO-2026-001", "total": 14985.00, "status": "APPROVED"}', '2026-09-29 08:30:00'),
(3, 'Product', 4, 'STOCK_ADJUSTMENT', 'staff@inventorypro.io', '192.168.1.80', '{"sku": "SKU-MECH-KB", "delta": -16, "reason": "Dispatch SO-8920"}', '2026-09-28 16:45:00')
ON DUPLICATE KEY UPDATE id=id;
