import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory data store (Simulating a database)
  const db = {
    inventory: [
      { id: "RM-LEAD", name: "Lead Alloy", code: "LA-001", category: "RAW_MATERIAL", supplier: "Global Metals", batch: "GM-001", qty: 25000, reservedQty: 0, minStock: 2000, reorderLevel: 5000, warehouse: "Raw Hub", rack: "L1", grn: "GRN-R-01", date: "2024-05-01", price: 180, unit: "Kg", qcStatus: "APPROVED" },
      { id: "RM-OXIDE", name: "Lead Oxide", code: "LO-002", category: "RAW_MATERIAL", supplier: "Global Metals", batch: "GM-002", qty: 12000, reservedQty: 0, minStock: 1000, reorderLevel: 2500, warehouse: "Raw Hub", rack: "L2", grn: "GRN-R-02", date: "2024-05-01", price: 210, unit: "Kg", qcStatus: "APPROVED" },
      { id: "RM-ACID", name: "Sulfuric Acid", code: "SA-092", category: "RAW_MATERIAL", supplier: "Chemical Ltd", batch: "CH-92", qty: 10000, reservedQty: 0, minStock: 800, reorderLevel: 1500, warehouse: "Raw Hub", rack: "A1", grn: "GRN-R-03", date: "2024-05-02", price: 45, unit: "Ltr", qcStatus: "APPROVED" },
      { id: "RM-SEP-PE", name: "Separator (PE)", code: "SPE-01", category: "RAW_MATERIAL", supplier: "PlateTech", batch: "PT-01", qty: 15000, reservedQty: 0, minStock: 1000, reorderLevel: 3000, warehouse: "Raw Hub", rack: "S1", grn: "GRN-R-04", date: "2024-05-03", price: 8, unit: "Pcs", qcStatus: "APPROVED" },
      { id: "RM-CELLS", name: "Lithium Cells (3.7V 3Ah)", code: "CELL-3.7", category: "Cells", supplier: "Energy Plus", batch: "EP-2024", qty: 50000, reservedQty: 0, minStock: 5000, reorderLevel: 10000, warehouse: "Raw Hub", rack: "C1", grn: "GRN-R-14", date: "2024-05-18", price: 250, unit: "Pcs", qcStatus: "APPROVED" },
      { id: "RM-BMS-72V", name: "Smart BMS (72V 50A)", code: "BMS-72S", category: "Electronics", supplier: "TechCircuit", batch: "TC-72", qty: 1000, reservedQty: 0, minStock: 50, reorderLevel: 100, warehouse: "Raw Hub", rack: "B1", grn: "GRN-R-15", date: "2024-05-18", price: 2500, unit: "Pcs", qcStatus: "APPROVED" },
    ],
    gradedInventory: [
      { id: "g1", serial: "CELL-A-001", name: "3.2V 102Ah", supplier: "Energy Plus", grade: "A", voltage: 3.32, ir: 6.2, capacity: 6100, cycleCount: 0, temp: 24.5, date: "2024-05-18", engineer: "Suresh P.", usage: "Premium Products" },
      { id: "g2", serial: "CELL-B-002", name: "3.2V 102Ah", supplier: "Energy Plus", grade: "B", voltage: 3.28, ir: 7.1, capacity: 5800, cycleCount: 0, temp: 25.0, date: "2024-05-18", engineer: "Suresh P.", usage: "Economy Products" },
    ],
    wipInventory: [
      { id: "wip-01", name: "Cell Pack Assembly", type: "Semi-Finished", qty: 12, stage: "WELDING", lastUpdate: "2024-05-18", components: [{ matId: "RM-CELLS", qty: 2400 }] },
      { id: "wip-02", name: "BMS Mounted Pack", type: "Semi-Finished", qty: 5, stage: "BMS_MOUNTING", lastUpdate: "2024-05-18", components: [{ matId: "RM-CELLS", qty: 1000 }, { matId: "RM-BMS-72V", qty: 5 }] },
    ],
    processingLogs: [],
    production: [],
    productionPlans: [] as any[],
    finishedGoods: [
      { id: "fg1", model: "72V30A", serial: "ARC-72V30A-2024-000101", batch: "BATCH-A1", warehouse: "Ahmedabad Warehouse", rack: "BIN-01", date: "2024-05-10", status: "READY" },
      { id: "fg2", model: "72V30A", serial: "ARC-72V30A-2024-000102", batch: "BATCH-A1", warehouse: "Main Warehouse", rack: "BIN-01", date: "2024-05-11", status: "READY" },
      { id: "fg3", model: "72V30A", serial: "ARC-72V30A-2024-000103", batch: "BATCH-A1", warehouse: "Main Warehouse", rack: "BIN-10", date: "2024-05-12", status: "HOLD" },
      { id: "fg4", model: "72V30A", serial: "ARC-72V30A-2024-000104", batch: "BATCH-A2", warehouse: "Ahmedabad Warehouse", rack: "BIN-15", date: "2024-05-13", status: "DAMAGED" },
      { id: "fg5", model: "72V30A", serial: "ARC-72V30A-2024-000105", batch: "BATCH-A2", warehouse: "Service Warehouse", rack: "S-01", date: "2024-05-14", status: "RETURNED" },
      { id: "fg6", model: "BAT-AUTO-35", serial: "ARC-AUTO-2024-112233", batch: "BATCH-B1", warehouse: "Main Warehouse", rack: "BIN-05", date: "2024-05-15", status: "DISPATCH_READY" },
      { id: "fg7", model: "BAT-INV-150", serial: "ARC-INV-2024-445566", batch: "BATCH-C1", warehouse: "Main Warehouse", rack: "BIN-06", date: "2024-05-16", status: "READY" },
      { id: "fg8", model: "BAT-VRLA-100", serial: "ARC-VRLA-2024-778899", batch: "BATCH-D1", warehouse: "Ahmedabad Warehouse", rack: "BIN-20", date: "2024-05-17", status: "READY" },
    ],
    productionHistory: [
      { id: "ph1", model: "72V30A", qty: 2, serials: ["ARC-72V30A-2024-000101", "ARC-72V30A-2024-000102"], date: "2024-05-10", status: "COMPLETED" }
    ],
    warehouses: ["Main Warehouse", "Ahmedabad Warehouse", "Dealer Warehouse", "Service Warehouse", "Raw Hub"],
    notifications: [
      { id: "n1", type: "FOLLOW_UP", title: "Upcoming Follow-up", message: "Dealer: Green Motors Ahmedabad at 11:00 AM", date: new Date().toISOString(), status: "UNREAD", channel: "WHATSAPP" },
      { id: "n2", type: "LOW_STOCK", title: "Low Stock Alert: Cells", message: "Current stock: 450 units. Reorder point: 1000.", date: new Date().toISOString(), status: "UNREAD", channel: "SYSTEM" }
    ],
    leads: [
      { id: "l1", company: "Green Motors Ahmedabad", category: "Dealer", location: "Ahmedabad, GJ", contactPerson: "Rajesh Shah", phone: "9876543210", leadSource: "Website", requirement: "72V Battery Packs x 50", status: "QUOTATION_SENT", followUpDate: "2024-05-20", followUpTime: "11:00", notes: "Negotiating on bulk discount." },
      { id: "l2", company: "EV Solutions Delhi", category: "Distributor", location: "New Delhi, DL", contactPerson: "Aman Varma", phone: "9123456789", leadSource: "Exhibition", requirement: "Li-ion Cells Bulk Purchase", status: "INTERESTED", followUpDate: "2024-05-18", followUpTime: "15:30", notes: "Interested in the new smart BMS feature." },
    ],
    dealers: [
       { id: "D-101", company: "Elite Power Ahmedabad", category: "Tier 1 Dealer", gstin: "24AAAAA0000A1Z5", phone: "9988776655", email: "contact@elitepower.com", location: "Navrangpura", city: "Ahmedabad", state: "Gujarat", region: "West", contactPerson: "Amit Mehta", status: "ACTIVE", bankDetails: "HDFC A/C: 50100234...", rankingScore: 92, joinDate: "2023-01-15" },
       { id: "D-102", company: "Spark EV Rajkot", category: "Certified Service Center", gstin: "24BBBBB1111B1Z2", phone: "9900112233", email: "info@sparkev.in", location: "Metoda GIDC", city: "Rajkot", state: "Gujarat", region: "West", contactPerson: "Suresh Bhai", status: "ACTIVE", bankDetails: "ICICI A/C: 0023101...", rankingScore: 85, joinDate: "2023-03-20" },
       { id: "D-103", company: "Metro Batteries Delhi", category: "Tier 1 Dealer", gstin: "07AAAAA0000A1Z5", phone: "9811223344", email: "delhi@metro.com", location: "Okhla Industrial Area", city: "New Delhi", state: "Delhi", region: "North", contactPerson: "Vikram Singh", status: "ACTIVE", bankDetails: "SBI A/C: 334455...", rankingScore: 78, joinDate: "2023-06-10" },
       { id: "D-104", company: "South Solar Chennai", category: "Tier 2 Dealer", gstin: "33AAAAA0000A1Z5", phone: "9844556677", email: "sales@southsolar.com", location: "Adyar", city: "Chennai", state: "Tamil Nadu", region: "South", contactPerson: "Karthik R.", status: "ACTIVE", bankDetails: "Axis A/C: 998877...", rankingScore: 88, joinDate: "2023-02-05" },
       { id: "D-105", company: "East Energy Kolkata", category: "Distributor", gstin: "19AAAAA0000A1Z5", phone: "9833445566", email: "info@eastenergy.com", location: "Salt Lake", city: "Kolkata", state: "West Bengal", region: "East", contactPerson: "Pranab M.", status: "ACTIVE", bankDetails: "HDFC A/C: 112233...", rankingScore: 72, joinDate: "2023-11-25" },
    ],
    engagement: {
       stats: {
          activeAppUsers: 4280,
          qrScans30d: 12450,
          claimRequests: 142,
          avgRating: 4.8
       },
       funnel: [
          { label: "Unique QR Scans", value: 45200, percentage: 100 },
          { label: "App Download", value: 32400, percentage: 71 },
          { label: "Product Registration", value: 28800, percentage: 63 },
          { label: "Recurring Engagement", value: 12100, percentage: 26 }
       ],
       recentScans: [
          { id: "s1", model: "BAT-INV-150", user: "Ravi K.", location: "Mumbai", time: "2 mins ago" },
          { id: "s2", model: "BAT-AUTO-35", user: "Anonymous", location: "Pune", time: "5 mins ago" },
          { id: "s3", model: "BAT-VRLA-100", user: "Sonal S.", location: "Delhi", time: "12 mins ago" }
       ]
    },
    invoices: [
      { id: "INV-1001", date: "2024-05-12", dealerId: "l1", items: [{ model: "72V30A", qty: 1, serials: ["ARC-72V30A-2024-000101"], price: 35000 }], total: 35000, status: "PAID", tax: 6300 },
      { id: "INV-1002", date: "2024-05-13", dealerId: "D-101", items: [{ model: "BAT-INV-150", qty: 5, serials: [], price: 18500 }], total: 92500, status: "UNPAID", tax: 16650 },
      { id: "INV-1003", date: "2024-05-14", dealerId: "D-102", items: [{ model: "72V30A", qty: 10, serials: [], price: 45000 }], total: 450000, status: "UNPAID", tax: 81000 },
      { id: "INV-1004", date: "2024-05-15", dealerId: "l1", items: [{ model: "BAT-AUTO-35", qty: 20, serials: [], price: 4500 }], total: 90000, status: "PAID", tax: 16200 },
    ],
    warranty: [
      { id: "w1", serial: "ARC-72V30A-2024-000101", dealerId: "l1", startDate: "2024-05-12", durationMonths: 36, status: "ACTIVE", history: [] },
      { id: "w2", serial: "ARC-72V30A-2024-000102", dealerId: "l1", startDate: "2024-05-12", durationMonths: 36, status: "ACTIVE", history: [] },
    ],
    complaints: [
      { id: "C-1001", serial: "ARC-72V30A-2024-000101", type: "Low Range", stage: "CLOSED", status: "RESOLVED", date: "2024-05-10", resolvedDate: "2024-05-14", notes: "BMS firmware updated.", rootCause: "BMS Failure", engineer: "Suresh P.", inspectionResult: "Firmware drift detected" },
      { id: "C-1002", serial: "ARC-72V30A-2024-000102", type: "Dead on Arrival", stage: "REGISTERED", status: "OPEN", date: "2024-05-15", resolvedDate: "", notes: "Unit not turning on.", engineer: "Unassigned" },
      { id: "C-1003", serial: "ARC-72V30A-2024-000103", type: "Voltage Drop", stage: "UNDER_INSPECTION", status: "OPEN", date: "2024-05-16", resolvedDate: "", notes: "Sudden power cut.", engineer: "Ramesh K." },
      { id: "C-1004", serial: "ARC-AUTO-2024-112233", type: "No Backup", stage: "READY_FOR_DISPATCH", status: "OPEN", date: "2024-05-14", resolvedDate: "", notes: "Aging cells.", engineer: "Suresh P.", rootCause: "Cell Failure" },
      { id: "C-1005", serial: "ARC-INV-2024-445566", type: "High Temp", stage: "REPAIR_STARTED", status: "OPEN", date: "2024-05-12", resolvedDate: "", notes: "Fan not working.", engineer: "Anita D." },
      { id: "C-1006", serial: "OLD-GEN-BATT-9900", type: "Water Damage", stage: "CLOSED", status: "RESOLVED", date: "2024-05-08", resolvedDate: "2024-05-11", notes: "Seal leaked.", engineer: "Ramesh K.", rootCause: "Water Damage" },
    ],
    engineers: [
      { id: "E1", name: "Suresh P.", casesSolved: 42, avgTat: 3.2, rating: 4.8 },
      { id: "E2", name: "Ramesh K.", casesSolved: 38, avgTat: 4.1, rating: 4.5 },
      { id: "E3", name: "Anita D.", casesSolved: 25, avgTat: 3.8, rating: 4.9 },
      { id: "E4", name: "Vikram R.", casesSolved: 12, avgTat: 5.5, rating: 4.2 },
    ],
    serviceStages: [
      "REGISTERED", "RECEIVED", "UNDER_INSPECTION", "REPAIR_STARTED", "WAITING_FOR_PARTS", "TESTING", "QC_PASSED", "READY_FOR_DISPATCH", "DELIVERED", "CLOSED"
    ],
    failureCategories: ["Cell Failure", "BMS Failure", "Charger Failure", "Water Damage", "Voltage Drop"],
    products: [
      { 
        id: "72V30A", 
        name: "72V 30Ah Battery", 
        type: "Lithium-ion Pack",
        price: 45000, 
        bom: [
          { matId: "RM-CELLS", name: "Lithium Cells", qty: 200, unit: "Pcs", wastage: 1, subBom: [
            { name: "Cathode Active Material", qty: 0.5, unit: "kg" },
            { name: "Anode Active Material", qty: 0.3, unit: "kg" },
            { name: "Electrolyte", qty: 0.1, unit: "L" },
            { name: "Separator", qty: 2, unit: "m2" }
          ]},
          { matId: "RM-BMS-72V", name: "BMS", qty: 1, unit: "Pcs", wastage: 0 },
          { matId: "RM-NICKEL", name: "Nickel Strip", qty: 12, unit: "m", wastage: 5 },
          { matId: "RM-WIRES", name: "Wires", qty: 2, unit: "m", wastage: 2 },
          { matId: "RM-FOAM", name: "Foam", qty: 1, unit: "Pcs", wastage: 0 },
          { matId: "RM-FUSE", name: "Fuse", qty: 1, unit: "Pcs", wastage: 0 },
          { matId: "RM-CASING", name: "Casing", qty: 1, unit: "Pcs", wastage: 0 },
          { matId: "RM-CONNECTOR-XT", name: "Connectors", qty: 2, unit: "Pcs", wastage: 0 }
        ]
      },
      { 
        id: "BAT-AUTO-35", 
        name: "Automotive Battery (12V 35Ah)", 
        type: "Flat Plate Battery",
        price: 4500, 
        bom: [
          { matId: "RM-LEAD", name: "Lead Alloy", qty: 6.50, unit: "Kg", wastage: 2 },
          { matId: "RM-OXIDE", name: "Lead Oxide", qty: 2.20, unit: "Kg", wastage: 2 },
          { matId: "RM-ACID", name: "Sulfuric Acid", qty: 1.80, unit: "Ltr", wastage: 1 },
          { matId: "RM-SEP-PE", name: "Separator (PE)", qty: 12, unit: "Pcs", wastage: 1 },
          { matId: "RM-PLATE-P", name: "Positive Plates", qty: 6, unit: "Pcs", wastage: 1 },
          { matId: "RM-PLATE-N", name: "Negative Plates", qty: 6, unit: "Pcs", wastage: 1 },
          { matId: "RM-CONT-AUTO", name: "Battery Container", qty: 1, unit: "Pcs", wastage: 0 },
          { matId: "RM-TERM", name: "Terminals", qty: 2, unit: "Pcs", wastage: 0 },
          { matId: "RM-VENT", name: "Vent Plugs", qty: 6, unit: "Pcs", wastage: 1 },
          { matId: "RM-CONN", name: "Intercell Connectors", qty: 5, unit: "Pcs", wastage: 1 }
        ]
      },
      { 
        id: "BAT-INV-150", 
        name: "Inverter Battery (12V 150Ah Tubular)", 
        type: "Tubular Battery",
        price: 18500, 
        bom: [
          { matId: "RM-LEAD", name: "Lead Alloy", qty: 18.00, unit: "Kg", wastage: 2 },
          { matId: "RM-OXIDE", name: "Lead Oxide", qty: 6.50, unit: "Kg", wastage: 2 },
          { matId: "RM-ACID", name: "Sulfuric Acid", qty: 5.50, unit: "Ltr", wastage: 1 },
          { matId: "RM-PLATE-TP", name: "Tubular Positive Plates", qty: 6, unit: "Pcs", wastage: 1 },
          { matId: "RM-PLATE-N", name: "Negative Plates", qty: 6, unit: "Pcs", wastage: 1 },
          { matId: "RM-SEP-PE", name: "Separator", qty: 14, unit: "Pcs", wastage: 1 },
          { matId: "RM-CONT-TALL", name: "Container (Tall)", qty: 1, unit: "Pcs", wastage: 0 },
          { matId: "RM-TERM", name: "Terminals", qty: 2, unit: "Pcs", wastage: 0 },
          { matId: "RM-VENT", name: "Vent Plugs", qty: 6, unit: "Pcs", wastage: 1 },
          { matId: "RM-CONN", name: "Intercell Connectors", qty: 5, unit: "Pcs", wastage: 1 }
        ]
      },
      { 
        id: "BAT-VRLA-100", 
        name: "VRLA / SMF Battery (12V 100Ah)", 
        type: "Sealed Maintenance-Free",
        price: 14000, 
        bom: [
          { matId: "RM-LEAD", name: "Lead Calcium Alloy", qty: 14.00, unit: "Kg", wastage: 2 },
          { matId: "RM-OXIDE", name: "Lead Oxide", qty: 5.00, unit: "Kg", wastage: 2 },
          { matId: "RM-ACID", name: "Sulfuric Acid", qty: 4.20, unit: "Ltr", wastage: 1 },
          { matId: "RM-SEP-AGM", name: "AGM Separator", qty: 12, unit: "Pcs", wastage: 1 },
          { matId: "RM-PLATE-P", name: "Positive Plates", qty: 6, unit: "Pcs", wastage: 1 },
          { matId: "RM-PLATE-N", name: "Negative Plates", qty: 6, unit: "Pcs", wastage: 1 },
          { matId: "RM-CONT-TALL", name: "Container (Sealed)", qty: 1, unit: "Pcs", wastage: 0 },
          { matId: "RM-TERM", name: "Terminals", qty: 2, unit: "Pcs", wastage: 0 },
          { matId: "RM-VENT", name: "Safety Valves", qty: 6, unit: "Pcs", wastage: 1 },
          { matId: "RM-CONN", name: "Intercell Connectors", qty: 5, unit: "Pcs", wastage: 1 }
        ]
      }
    ]
  };

  // API Routes
  app.get("/api/data", (req, res) => {
    res.json(db);
  });

  // MRP Calculation Endpoint
  app.get("/api/mrp/calculate", (req, res) => {
    const { modelId, qty } = req.query;
    const product = db.products.find(p => p.id === modelId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const multiplier = Number(qty);
    const requirements = product.bom.map(item => {
      const perUnit = item.qty * (1 + ((item.wastage || 0) / 100));
      const total = perUnit * multiplier;
      const invItem = db.inventory.find(i => i.id === item.matId);
      
      return {
        ...item,
        perUnit,
        requiredTotal: total,
        available: invItem ? invItem.qty - invItem.reservedQty : 0,
        deficient: Math.max(0, total - (invItem ? invItem.qty - invItem.reservedQty : 0))
      };
    });

    res.json({ modelId, modelName: product.name, qty: multiplier, requirements });
  });

  // Product Management Endpoints
  app.post("/api/products", (req, res) => {
    const { id, name, type, price, bom } = req.body;
    if (db.products.find(p => p.id === id)) {
      return res.status(400).json({ error: "Product ID already exists" });
    }
    const newProduct = { id, name, type, price, bom };
    db.products.push(newProduct);
    res.json(newProduct);
  });

  app.put("/api/products/:id", (req, res) => {
    const { id } = req.params;
    const index = db.products.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ error: "Product not found" });
    db.products[index] = { ...db.products[index], ...req.body, id }; // Ensure ID hasn't changed
    res.json(db.products[index]);
  });

  app.delete("/api/products/:id", (req, res) => {
    const { id } = req.params;
    db.products = db.products.filter(p => p.id !== id);
    res.json({ success: true });
  });

  app.post("/api/products/duplicate", (req, res) => {
    const { sourceId, newId, newName } = req.body;
    const source = db.products.find(p => p.id === sourceId);
    if (!source) return res.status(404).json({ error: "Source product not found" });
    if (db.products.find(p => p.id === newId)) return res.status(400).json({ error: "Target ID exists" });

    const clone = JSON.parse(JSON.stringify(source));
    clone.id = newId;
    clone.name = newName;
    db.products.push(clone);
    res.json(clone);
  });

  // Create Production Plan with Allocation
  app.post("/api/mrp/plan", (req, res) => {
    const { modelId, qty, mode } = req.body; // mode: 'RESERVE' or 'CONSUME'
    const product = db.products.find(p => p.id === modelId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const multiplier = Number(qty);
    const requirements = product.bom.map(item => ({
      ...item,
      total: item.qty * (1 + ((item.wastage || 0) / 100)) * multiplier
    }));

    // Check for blocking unavailability
    const criticalMissing = requirements.filter(reqm => {
      const invItem = db.inventory.find(i => i.id === reqm.matId);
      return !invItem || (invItem.qty - invItem.reservedQty) < reqm.total;
    });

    if (criticalMissing.length > 0) {
      return res.status(403).json({ 
        error: "MATERIAL_UNAVAILABLE", 
        message: "Insufficient raw materials to start production.",
        missing: criticalMissing.map(m => ({ name: m.name, required: m.total }))
      });
    }

    // Allocate materials
    requirements.forEach(reqm => {
      const invItem = db.inventory.find(i => i.id === reqm.matId);
      if (invItem) {
        if (mode === 'CONSUME') {
          invItem.qty -= reqm.total;
        } else {
          invItem.reservedQty += reqm.total;
        }
      }
    });

    const planId = `PLAN-${Date.now()}`;
    const plan = {
      id: planId,
      modelId,
      modelName: product.name,
      qty: multiplier,
      status: mode === 'CONSUME' ? 'STARTED' : 'PLANNED',
      allocationMode: mode,
      materials: requirements,
      date: new Date().toISOString()
    };

    db.productionPlans.push(plan);
    res.json(plan);
  });

  app.post("/api/mrp/complete-plan", (req, res) => {
    const { planId, warehouse, rack } = req.body;
    const planIndex = db.productionPlans.findIndex(p => p.id === planId);
    if (planIndex === -1) return res.status(404).json({ error: "Plan not found" });

    const plan = db.productionPlans[planIndex];
    if (plan.status === 'COMPLETED') return res.status(400).json({ error: "Plan already completed" });

    // If was in reserve mode, now consume it
    if (plan.allocationMode === 'RESERVE') {
      plan.materials.forEach((reqm: any) => {
        const invItem = db.inventory.find(i => i.id === reqm.matId);
        if (invItem) {
          invItem.reservedQty -= reqm.total;
          invItem.qty -= reqm.total;
        }
      });
    }

    // Generate finished goods
    const serials = [];
    for (let i = 0; i < plan.qty; i++) {
        const serial = `ARC-${plan.modelId}-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
        serials.push(serial);
        db.finishedGoods.push({
            id: `fg-${Date.now()}-${i}`,
            model: plan.modelId,
            serial,
            batch: `BATCH-${plan.id}`,
            warehouse,
            rack,
            date: new Date().toISOString().split('T')[0],
            status: "READY"
        });
    }

    plan.status = 'COMPLETED';
    db.productionHistory.push({
        id: `ph-${Date.now()}`,
        model: plan.modelId,
        qty: plan.qty,
        serials,
        date: new Date().toISOString().split('T')[0],
        status: "COMPLETED"
    });

    res.json({ status: "success", plan });
  });

  app.post("/api/invoices", (req, res) => {
    const { dealerId, items, total, tax } = req.body;
    const invId = `INV-${1000 + db.invoices.length + 1}`;
    
    // Find Dealer for Regional Analysis
    const dealer = db.dealers.find(d => d.id === dealerId || d.company === dealerId);
    
    const invoice = {
      id: invId,
      date: new Date().toISOString().split('T')[0],
      dealerId: dealer ? dealer.id : dealerId,
      items,
      total,
      tax,
      status: "UNPAID"
    };

    db.invoices.push(invoice);

    // Update Dealer Stats
    if (dealer) {
        dealer.rankingScore = Math.min(100, (dealer.rankingScore || 50) + 1);
        // Add more logic here for growth etc.
    }

    // Trigger Notification: New Sale
    db.notifications.push({
      id: `n-${Date.now()}`,
      type: "PAYMENT",
      title: "New Invoice Generated",
      message: `Invoice ${invId} for ${dealer?.company || dealerId} - Amount: ${total}`,
      date: new Date().toISOString(),
      status: "UNREAD",
      channel: "SYSTEM"
    });

    // Process each item to update stock and activate warranty
    items.forEach((item: any) => {
      item.serials.forEach((serial: string) => {
        // 1. Update Finished Goods Status
        const fgItem = db.finishedGoods.find(fg => fg.serial === serial);
        if (fgItem) fgItem.status = "SOLD";

        // 2. Activate Warranty
        db.warranty.push({
          id: `W-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          serial,
          dealerId: dealer ? dealer.id : dealerId,
          startDate: invoice.date,
          durationMonths: 36, // Default 3 years
          status: "ACTIVE",
          history: []
        });
      });
    });

    res.json(invoice);
  });

  app.post("/api/inventory", (req, res) => {
    const item = { id: Date.now().toString(), category: "PURCHASED", ...req.body };
    db.inventory.push(item);
    
    // Check for Low Stock (Demo logic: if qty < 100 trigger alert)
    if (item.qty < 100) {
      db.notifications.push({
        id: `n-${Date.now()}`,
        type: "LOW_STOCK",
        title: `Low Stock Alert: ${item.name}`,
        message: `Current inventory level for ${item.name} is ${item.qty}. Need reorder.`,
        date: new Date().toISOString(),
        status: "UNREAD",
        channel: "WHATSAPP"
      });
    }

    res.json(item);
  });

  app.post("/api/processing", (req, res) => {
    const { inputId, outputBatches, processingDegree } = req.body;
    const rawItem = db.inventory.find(i => i.id === inputId);
    
    if (!rawItem) return res.status(404).json({ error: "Raw material not found" });

    const totalOutputQty = outputBatches.reduce((acc: number, b: any) => acc + b.qty, 0);
    rawItem.qty -= totalOutputQty;

    outputBatches.forEach((batch: any) => {
      db.gradedInventory.push({
        id: `g-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        parentId: inputId,
        name: `${batch.grade} Graded - ${rawItem.name}`,
        processingDegree,
        ...batch,
        date: new Date().toISOString().split('T')[0]
      });
    });

    db.processingLogs.push({
      id: Date.now().toString(),
      inputId,
      processingDegree,
      outputBatches,
      date: new Date().toISOString()
    });

    res.json({ status: "success" });
  });

  app.post("/api/production", (req, res) => {
    const entry = { id: Date.now().toString(), ...req.body };
    // Auto-update stock logic could go here
    db.production.push(entry);
    res.json(entry);
  });

  app.post("/api/production/complete", (req, res) => {
    const { model, qty, warehouse, rack } = req.body;
    const serials = [];
    const batch = `BATCH-${new Date().toISOString().slice(0, 10)}`;
    
    // Generate serials and add to finished goods
    for (let i = 0; i < qty; i++) {
      const serial = `ARC-${model}-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      serials.push(serial);
      db.finishedGoods.push({
        id: `fg-${Date.now()}-${i}`,
        model,
        serial,
        batch,
        warehouse,
        rack,
        date: new Date().toISOString().split('T')[0],
        status: "READY"
      });
    }

    // Record in history
    db.productionHistory.push({
      id: `ph-${Date.now()}`,
      model,
      qty,
      serials,
      date: new Date().toISOString().split('T')[0],
      status: "COMPLETED"
    });

    // Auto-deduct Logic (Precise identification)
    const product = db.products.find(p => p.id === model);
    if (product) {
      product.bom.forEach(bomItem => {
        const invItem = db.inventory.find(inv => inv.id === bomItem.matId);
        if (invItem) {
          const totalQty = (bomItem.qty * (1 + (bomItem.wastage || 0) / 100)) * qty;
          invItem.qty -= totalQty;
        }
      });
    }

    res.json({ status: "success", serials });
  });

  app.post("/api/leads", (req, res) => {
    const lead = { id: Date.now().toString(), status: 'NEW', ...req.body };
    db.leads.push(lead);

    // Trigger Lead Notification
    db.notifications.push({
        id: `n-${Date.now()}`,
        type: "FOLLOW_UP",
        title: "New Opportunity captured",
        message: `${lead.company} is interested in ${lead.requirement}. Follow up set for ${lead.followUpDate}.`,
        date: new Date().toISOString(),
        status: "UNREAD",
        channel: "SMS"
    });

    res.json(lead);
  });

  app.put("/api/leads/:id", (req, res) => {
    const { id } = req.params;
    const index = db.leads.findIndex(l => l.id === id);
    if (index !== -1) {
      db.leads[index] = { ...db.leads[index], ...req.body };
      res.json(db.leads[index]);
    } else {
      res.status(404).json({ error: "Lead not found" });
    }
  });

  app.delete("/api/leads/:id", (req, res) => {
    const { id } = req.params;
    db.leads = db.leads.filter(l => l.id !== id);
    res.json({ success: true });
  });

  app.post("/api/dealers", (req, res) => {
    const dealer = { id: `D-${Math.floor(100 + Math.random() * 900)}`, status: 'ACTIVE', ...req.body };
    db.dealers.push(dealer);
    res.json(dealer);
  });

  app.delete("/api/dealers/:id", (req, res) => {
    const { id } = req.params;
    db.dealers = db.dealers.filter(d => d.id !== id);
    res.json({ success: true });
  });

  app.post("/api/leads/convert/:id", (req, res) => {
    const { id } = req.params;
    const leadIndex = db.leads.findIndex(l => l.id === id);
    if (leadIndex === -1) return res.status(404).json({ error: "Lead not found" });
    const lead = db.leads[leadIndex];
    
    // Create dealer
    const dealer = {
      id: `D-${Math.floor(100 + Math.random() * 900)}`,
      company: lead.company,
      category: lead.category === 'Dealer' ? 'Tier 1 Dealer' : lead.category,
      phone: lead.phone,
      email: `${lead.company.toLowerCase().replace(/\s/g, '')}@partner.com`,
      location: lead.location.split(',')[0],
      city: lead.location.split(',')[0],
      state: lead.location.split(',')[1]?.trim() || 'Gujarat',
      region: 'West', // Default
      contactPerson: lead.contactPerson,
      status: 'ACTIVE',
      gstin: 'PENDING_REGISTRATION',
      bankDetails: 'Not Provided',
      rankingScore: 50, // Initial score
      joinDate: new Date().toISOString().split('T')[0]
    };
    
    db.dealers.push(dealer);
    lead.status = 'CONVERTED';
    
    res.json({ success: true, dealer });
  });

  app.post("/api/complaints", (req, res) => {
    const { serial, type, notes } = req.body;
    const complaint = {
      id: `C-${1000 + db.complaints.length + 1}`,
      serial,
      type,
      notes,
      date: new Date().toISOString().split('T')[0],
      stage: "REGISTERED" as string,
      status: "OPEN",
      engineer: "Unassigned",
      rootCause: "",
      inspectionResult: "",
      resolvedDate: ""
    };
    db.complaints.push(complaint);
    
    // Add to warranty history if exists
    const warranty = db.warranty.find(w => w.serial === serial);
    if (warranty) {
      if (!warranty.history) warranty.history = [];
      warranty.history.push({ 
        date: complaint.date, 
        type: "CLAIM_FILED", 
        description: `${type}: ${notes}` 
      });
    }
    
    res.json(complaint);
  });

  app.patch("/api/complaints/:id", (req, res) => {
    const { id } = req.params;
    const index = db.complaints.findIndex(c => c.id === id);
    if (index !== -1) {
      db.complaints[index] = { ...db.complaints[index], ...req.body };
      
      // Notify on significant stage changes
      if (['QC_PASSED', 'CLOSED'].includes(req.body.stage)) {
        db.notifications.push({
          id: `n-${Date.now()}`,
          type: "SERVICE_DELAY",
          title: `Service Update: ${id}`,
          message: `Unit ${db.complaints[index].serial} is now in stage ${req.body.stage}.`,
          date: new Date().toISOString(),
          status: "UNREAD",
          channel: "WHATSAPP"
        });
      }

      // If status is closed, update warranty history
      if (req.body.stage === 'CLOSED' || req.body.status === 'RESOLVED') {
          const serial = db.complaints[index].serial;
          const warranty = db.warranty.find(w => w.serial === serial);
          if (warranty && warranty.history) {
              warranty.history.push({
                  date: new Date().toISOString().split('T')[0],
                  type: "CLAIM_RESOLVED",
                  description: `Fixed: ${db.complaints[index].rootCause}`
              });
          }
      }
      res.json(db.complaints[index]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  app.post("/api/cells/grade", (req, res) => {
    const { parentId, cellData } = req.body;
    const rawItem = db.inventory.find(i => i.id === parentId);
    if (!rawItem) return res.status(404).json({ error: "Inventory node not found" });

    // Deduct from raw stock
    rawItem.qty -= 1;

    const entry = {
      id: `g-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      parentId,
      name: rawItem.name,
      supplier: rawItem.supplier,
      date: new Date().toISOString().split('T')[0],
      ...cellData
    };

    db.gradedInventory.push(entry);
    res.json(entry);
  });

  app.get("/api/production/wip", (req, res) => {
    res.json(db.wipInventory);
  });

  app.post("/api/production/wip/start", (req, res) => {
    const { name, qty, components } = req.body;
    
    // Deduct components from inventory
    components.forEach((comp: any) => {
      const invItem = db.inventory.find(i => i.id === comp.matId);
      if (invItem) invItem.qty -= comp.qty;
    });

    const wip = {
      id: `wip-${Date.now()}`,
      name,
      type: "Semi-Finished",
      qty,
      stage: "PROCESSING_STARTED",
      lastUpdate: new Date().toISOString().split('T')[0],
      components
    };

    db.wipInventory.push(wip);
    res.json(wip);
  });

  app.post("/api/notifications/clear", (req, res) => {
    db.notifications.forEach(n => n.status = 'READ');
    res.json({ status: "success" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
