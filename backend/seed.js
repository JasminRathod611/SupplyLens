import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

import User from './models/User.js';
import Product from './models/Product.js';
import Supplier from './models/Supplier.js';
import PurchaseOrder from './models/PurchaseOrder.js';
import StockMovement from './models/StockMovement.js';
import Notification from './models/Notification.js';

dotenv.config();

const ORG_NAME = 'Demo Corp';

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    console.log('Clearing old demo data...');
    // Clear only Demo Corp data so we don't nuke actual user data
    await User.deleteMany({ organization: ORG_NAME });
    await Product.deleteMany({ organization: ORG_NAME });
    await Supplier.deleteMany({ organization: ORG_NAME });
    await PurchaseOrder.deleteMany({ organization: ORG_NAME });
    await StockMovement.deleteMany({ organization: ORG_NAME });
    await Notification.deleteMany({ organization: ORG_NAME });

    console.log('Creating demo admin user...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const adminUser = await User.create({
      name: 'Demo Admin',
      email: 'admin@demo.com',
      password: hashedPassword,
      role: 'admin',
      organization: ORG_NAME
    });

    console.log('Creating suppliers...');
    const s1 = await Supplier.create({
      name: 'Hindustan Distributors Ltd',
      contactPerson: 'Amit Sharma',
      email: 'amit@hindustandist.com',
      phone: '9876543210',
      address: 'Plot 45, Sector 18, Gurugram, Haryana',
      averageDeliveryDays: 3,
      reliabilityScore: 96,
      organization: ORG_NAME,
      user: adminUser._id
    });

    const s2 = await Supplier.create({
      name: 'Saraswati Electronics',
      contactPerson: 'Priya Patel',
      email: 'priya@saraswatielec.co.in',
      phone: '8765432109',
      address: '102 SP Road, Bengaluru, Karnataka',
      averageDeliveryDays: 5,
      reliabilityScore: 92,
      organization: ORG_NAME,
      user: adminUser._id
    });

    const s3 = await Supplier.create({
      name: 'Apex Packaging & Logistics',
      contactPerson: 'Vikram Singh',
      email: 'vikram@apexlogistics.com',
      phone: '7654321098',
      address: 'GIDC Industrial Estate, Vadodara, Gujarat',
      averageDeliveryDays: 2,
      reliabilityScore: 98,
      organization: ORG_NAME,
      user: adminUser._id
    });

    console.log('Creating products...');
    
    // Groceries Category
    const p1 = await Product.create({
      name: 'Basmati Rice Premium (25kg)',
      sku: 'GROC-BAS-001',
      category: 'Groceries',
      description: 'Aged long grain premium Basmati Rice',
      price: 1850.00,
      currentStock: 150,
      reorderPoint: 40,
      safetyStock: 30,
      supplier: s1._id,
      organization: ORG_NAME,
      user: adminUser._id
    });

    const p2 = await Product.create({
      name: 'Refined Sunflower Oil (15L)',
      sku: 'GROC-SUN-002',
      category: 'Groceries',
      description: 'Double filtered healthy cooking sunflower oil',
      price: 1650.00,
      currentStock: 12, // Low stock on purpose
      reorderPoint: 25,
      safetyStock: 15,
      supplier: s1._id,
      organization: ORG_NAME,
      user: adminUser._id
    });

    const p3 = await Product.create({
      name: 'Organic Wheat Flour (10kg)',
      sku: 'GROC-WHT-003',
      category: 'Groceries',
      description: '100% whole wheat stone-ground chakki fresh atta',
      price: 460.00,
      currentStock: 220,
      reorderPoint: 50,
      safetyStock: 40,
      supplier: s1._id,
      organization: ORG_NAME,
      user: adminUser._id
    });

    // Electronics Category
    const p4 = await Product.create({
      name: 'Logitech Wireless Keyboard & Mouse',
      sku: 'ELEC-LOG-001',
      category: 'Electronics',
      description: 'Ergonomic multi-device silent wireless keyboard combo',
      price: 2499.00,
      currentStock: 85,
      reorderPoint: 20,
      safetyStock: 15,
      supplier: s2._id,
      organization: ORG_NAME,
      user: adminUser._id
    });

    const p5 = await Product.create({
      name: 'Braided Fast Charging USB-C Cable (2m)',
      sku: 'ELEC-CAB-002',
      category: 'Electronics',
      description: 'Heavy duty 100W PD nylon braided charging cable',
      price: 499.00,
      currentStock: 8, // Low stock on purpose
      reorderPoint: 30,
      safetyStock: 20,
      supplier: s2._id,
      organization: ORG_NAME,
      user: adminUser._id
    });

    const p6 = await Product.create({
      name: 'Dell 24" IPS Full HD Monitor',
      sku: 'ELEC-DEL-003',
      category: 'Electronics',
      description: 'Professional monitor with height-adjustable stand',
      price: 11499.00,
      currentStock: 40,
      reorderPoint: 10,
      safetyStock: 8,
      supplier: s2._id,
      organization: ORG_NAME,
      user: adminUser._id
    });

    // Office Supplies Category
    const p7 = await Product.create({
      name: 'Premium A4 Copier Paper (500 Sheets)',
      sku: 'OFFC-PAP-001',
      category: 'Office Supplies',
      description: 'High brightness 75GSM multipurpose copier paper',
      price: 320.00,
      currentStock: 450,
      reorderPoint: 100,
      safetyStock: 80,
      supplier: s3._id,
      organization: ORG_NAME,
      user: adminUser._id
    });

    const p8 = await Product.create({
      name: 'Heavy Duty Stapler & Pin Set',
      sku: 'OFFC-STP-002',
      category: 'Office Supplies',
      description: 'All-metal desk stapler with reload indicator and 5000 staples',
      price: 650.00,
      currentStock: 5, // Low stock on purpose
      reorderPoint: 15,
      safetyStock: 10,
      supplier: s3._id,
      organization: ORG_NAME,
      user: adminUser._id
    });

    console.log('Creating purchase orders...');
    
    // PO 1: Delivered (Increases delivered count for Success Rate)
    await PurchaseOrder.create({
      supplier: s1._id,
      items: [
        { product: p1._id, quantity: 100, unitPrice: 1800.00 },
        { product: p3._id, quantity: 150, unitPrice: 440.00 }
      ],
      totalAmount: 246000.00,
      status: 'delivered',
      expectedDeliveryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Delivered 5 days ago
      organization: ORG_NAME,
      user: adminUser._id
    });

    // PO 2: Delivered (Increases delivered count for Success Rate)
    await PurchaseOrder.create({
      supplier: s3._id,
      items: [
        { product: p7._id, quantity: 200, unitPrice: 300.00 }
      ],
      totalAmount: 60000.00,
      status: 'delivered',
      expectedDeliveryDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // Delivered 10 days ago
      organization: ORG_NAME,
      user: adminUser._id
    });

    // PO 3: Delivered (Increases delivered count for Success Rate)
    await PurchaseOrder.create({
      supplier: s2._id,
      items: [
        { product: p6._id, quantity: 20, unitPrice: 11000.00 }
      ],
      totalAmount: 220000.00,
      status: 'delivered',
      expectedDeliveryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Delivered 2 days ago
      organization: ORG_NAME,
      user: adminUser._id
    });

    // PO 4: Shipped (In Transit)
    await PurchaseOrder.create({
      supplier: s1._id,
      items: [
        { product: p2._id, quantity: 50, unitPrice: 1600.00 }
      ],
      totalAmount: 80000.00,
      status: 'shipped',
      expectedDeliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Arriving in 2 days
      organization: ORG_NAME,
      user: adminUser._id
    });

    // PO 5: Pending (Needs Approval)
    await PurchaseOrder.create({
      supplier: s2._id,
      items: [
        { product: p5._id, quantity: 150, unitPrice: 450.00 }
      ],
      totalAmount: 67500.00,
      status: 'pending',
      expectedDeliveryDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // Scheduled in 6 days
      organization: ORG_NAME,
      user: adminUser._id
    });

    console.log('Creating stock movements...');
    await StockMovement.create({
      product: p1._id,
      type: 'in',
      quantity: 100,
      previousStock: 50,
      newStock: 150,
      reason: 'Inbound PO Shipment #PO-1029',
      user: adminUser._id,
      organization: ORG_NAME
    });

    await StockMovement.create({
      product: p4._id,
      type: 'out',
      quantity: 15,
      previousStock: 100,
      newStock: 85,
      reason: 'Bulk Office Sale Invoice #SL-9932',
      user: adminUser._id,
      organization: ORG_NAME
    });

    await StockMovement.create({
      product: p8._id,
      type: 'out',
      quantity: 10,
      previousStock: 15,
      newStock: 5,
      reason: 'Internal Inventory Allocation',
      user: adminUser._id,
      organization: ORG_NAME
    });

    console.log('Creating notifications...');
    await Notification.create({
      type: 'LOW_STOCK',
      priority: 'HIGH',
      message: 'Refined Sunflower Oil (15L) has dropped below reorder threshold (12 < 25).',
      productId: p2._id,
      read: false,
      organization: ORG_NAME
    });

    await Notification.create({
      type: 'LOW_STOCK',
      priority: 'HIGH',
      message: 'Braided Fast Charging USB-C Cable (2m) has reached critical level (8 < 30).',
      productId: p5._id,
      read: false,
      organization: ORG_NAME
    });

    await Notification.create({
      type: 'LOW_STOCK',
      priority: 'MEDIUM',
      message: 'Heavy Duty Stapler & Pin Set is close to stockout (5 < 15).',
      productId: p8._id,
      read: true,
      organization: ORG_NAME
    });

    console.log('Demo data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDatabase();
