const INITIAL_DB = {
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
  processingLogs: [] as any[],
  production: [] as any[],
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

function getLocalDB() {
  if (typeof window === 'undefined') return INITIAL_DB;
  const stored = localStorage.getItem('arcenol_db');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error reading arcenol_db from localstorage, resetting:", e);
    }
  }
  localStorage.setItem('arcenol_db', JSON.stringify(INITIAL_DB));
  return INITIAL_DB;
}

function saveLocalDB(db: any) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('arcenol_db', JSON.stringify(db));
}

async function handleMockRequest(urlStr: string, init?: RequestInit): Promise<Response> {
  const db = getLocalDB();
  const options = init || {};
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body as string) : null;

  let responseData: any = { success: true };
  let status = 200;

  try {
    if (urlStr.includes('/api/data')) {
      responseData = db;
    } else if (urlStr.includes('/api/notifications/clear')) {
      db.notifications = db.notifications.map((n: any) => ({ ...n, status: 'READ' }));
      saveLocalDB(db);
    } else if (urlStr.includes('/api/leads/convert/')) {
      const id = urlStr.split('/api/leads/convert/')[1];
      const lead = db.leads.find((l: any) => l.id === id);
      if (lead) {
        lead.status = 'CONVERTED';
        const dealerId = `D-${Date.now()}`;
        db.dealers.push({
          id: dealerId,
          company: lead.company,
          category: 'Tier 1 Dealer',
          gstin: '24GSTIN' + Math.floor(100000 + Math.random() * 900000) + 'A1Z5',
          phone: lead.phone,
          email: `${lead.contactPerson.toLowerCase().replace(/\s+/g, '')}@${lead.company.toLowerCase().replace(/[^a-z]/g, '')}.com`,
          location: lead.location,
          city: lead.location.split(',')[0] || lead.location,
          state: lead.location.split(',')[1]?.trim() || 'Gujarat',
          region: 'West',
          contactPerson: lead.contactPerson,
          status: 'ACTIVE',
          bankDetails: 'N/A',
          rankingScore: 80,
          joinDate: new Date().toISOString().split('T')[0]
        });
        saveLocalDB(db);
      }
    } else if (urlStr.includes('/api/leads/')) {
      const id = urlStr.split('/api/leads/')[1];
      if (method === 'DELETE') {
        db.leads = db.leads.filter((l: any) => l.id !== id);
      } else if (method === 'PUT' && body) {
        db.leads = db.leads.map((l: any) => l.id === id ? { ...l, ...body } : l);
      }
      saveLocalDB(db);
    } else if (urlStr.includes('/api/leads')) {
      if (method === 'POST' && body) {
        const newLead = { ...body, id: `l-${Date.now()}` };
        db.leads.push(newLead);
        saveLocalDB(db);
        responseData = newLead;
      }
    } else if (urlStr.includes('/api/dealers/')) {
      const id = urlStr.split('/api/dealers/')[1];
      if (method === 'DELETE') {
        db.dealers = db.dealers.filter((d: any) => d.id !== id);
      }
      saveLocalDB(db);
    } else if (urlStr.includes('/api/dealers')) {
      if (method === 'POST' && body) {
        const newDealer = { 
          ...body, 
          id: `D-${Date.now()}`,
          rankingScore: 75,
          joinDate: new Date().toISOString().split('T')[0]
        };
        db.dealers.push(newDealer);
        saveLocalDB(db);
        responseData = newDealer;
      }
    } else if (urlStr.includes('/api/invoices')) {
      if (method === 'POST' && body) {
        const total = body.items.reduce((acc: number, item: any) => acc + (item.qty * item.price), 0);
        const newInvoice = {
          id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
          date: new Date().toISOString().split('T')[0],
          dealerId: body.dealerId,
          items: body.items,
          total: total,
          status: 'UNPAID',
          tax: Math.round(total * 0.18)
        };
        db.invoices.push(newInvoice);
        saveLocalDB(db);
        responseData = newInvoice;
      }
    } else if (urlStr.includes('/api/complaints/')) {
      const id = urlStr.split('/api/complaints/')[1];
      if (method === 'PUT' && body) {
        db.complaints = db.complaints.map((c: any) => c.id === id ? { ...c, ...body } : c);
        saveLocalDB(db);
      }
    } else if (urlStr.includes('/api/complaints')) {
      if (method === 'POST' && body) {
        const newComplaint = {
          ...body,
          id: `C-${Math.floor(1001 + Math.random() * 8999)}`,
          status: 'OPEN',
          stage: 'REGISTERED',
          date: new Date().toISOString().split('T')[0],
          resolvedDate: '',
          engineer: 'Unassigned'
        };
        db.complaints.push(newComplaint);
        saveLocalDB(db);
        responseData = newComplaint;
      }
    } else if (urlStr.includes('/api/production/wip/start')) {
      if (method === 'POST' && body) {
        const { planId } = body;
        const plan = db.productionPlans.find((p: any) => p.id === planId);
        if (plan) {
          plan.status = 'STARTED';
          saveLocalDB(db);
          responseData = plan;
        }
      }
    } else if (urlStr.includes('/api/production/complete')) {
      if (method === 'POST' && body) {
        const { planId, warehouse, rack } = body;
        const plan = db.productionPlans.find((p: any) => p.id === planId);
        if (plan && plan.status !== 'COMPLETED') {
          // Consume items if in RESERVE mode
          if (plan.allocationMode === 'RESERVE') {
            plan.materials.forEach((reqm: any) => {
              const invItem = db.inventory.find((i: any) => i.id === reqm.matId);
              if (invItem) {
                invItem.reservedQty = Math.max(0, invItem.reservedQty - reqm.total);
                invItem.qty = Math.max(0, invItem.qty - reqm.total);
              }
            });
          }
          const serials: string[] = [];
          for (let i = 0; i < plan.qty; i++) {
            const serial = `ARC-${plan.modelId}-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
            serials.push(serial);
            db.finishedGoods.push({
              id: `fg-${Date.now()}-${i}`,
              model: plan.modelId,
              serial,
              batch: `BATCH-${plan.id}`,
              warehouse: warehouse || 'Main Warehouse',
              rack: rack || 'BIN-01',
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
          saveLocalDB(db);
          responseData = plan;
        }
      }
    } else if (urlStr.includes('/api/processing')) {
      if (method === 'POST' && body) {
        const { inputId, outputBatches, processingDegree } = body;
        db.processingLogs.push({
          id: `log-${Date.now()}`,
          inputId,
          outputBatches,
          processingDegree,
          timestamp: new Date().toISOString()
        });
        saveLocalDB(db);
      }
    } else if (urlStr.includes('/api/products/duplicate')) {
      if (method === 'POST' && body) {
        const { sourceId, newId, newName } = body;
        const source = db.products.find((p: any) => p.id === sourceId);
        if (source) {
          const clone = JSON.parse(JSON.stringify(source));
          clone.id = newId;
          clone.name = newName;
          db.products.push(clone);
          saveLocalDB(db);
          responseData = clone;
        }
      }
    } else if (urlStr.includes('/api/mrp/plan')) {
      if (method === 'POST' && body) {
        const { modelId, qty, mode } = body;
        const product = db.products.find((p: any) => p.id === modelId);
        if (product) {
          const multiplier = Number(qty);
          const requirements = product.bom.map((item: any) => ({
            ...item,
            total: item.qty * (1 + ((item.wastage || 0) / 100)) * multiplier
          }));

          // Deduct from inventory
          requirements.forEach((reqm: any) => {
            const invItem = db.inventory.find((i: any) => i.id === reqm.matId);
            if (invItem) {
              if (mode === 'CONSUME') {
                invItem.qty = Math.max(0, invItem.qty - reqm.total);
              } else {
                invItem.reservedQty += reqm.total;
              }
            }
          });

          const plan = {
            id: `PLAN-${Date.now()}`,
            modelId,
            modelName: product.name,
            qty: multiplier,
            status: mode === 'CONSUME' ? 'STARTED' : 'PLANNED',
            allocationMode: mode,
            materials: requirements,
            date: new Date().toISOString()
          };
          db.productionPlans.push(plan);
          saveLocalDB(db);
          responseData = plan;
        }
      }
    }
  } catch (error) {
    console.error("Local mock server error handling request:", error);
    status = 500;
    responseData = { error: "MOCK_SERVER_ERR", message: String(error) };
  }

  return new Response(JSON.stringify(responseData), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
// Automatically intercept standard fetches in browser environments
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;

  // Check if we are on a static host with NO backend server (like Vercel, Netlify, GitHub Pages)
  const isStaticHosting = 
    window.location.hostname.includes('vercel.app') ||
    window.location.hostname.includes('netlify.app') ||
    window.location.hostname.includes('github.io') ||
    window.location.hostname.includes('surge.sh') ||
    // If the hostname is not GCP Cloud Run (*.run.app) and not local development
    (!window.location.hostname.includes('run.app') && 
     !window.location.hostname.includes('localhost') && 
     !window.location.hostname.includes('127.0.0.1') && 
     !window.location.port);

  const customFetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const urlStr = typeof input === 'string' ? input : (input instanceof URL ? input.toString() : input.url);
    if (urlStr.includes('/api/')) {
      // If on static hosting, bypass network entirely to avoid latency or HTML fallbacks (Index.html 404 overrides)
      if (isStaticHosting) {
        return await handleMockRequest(urlStr, init);
      }

      try {
        const response = await originalFetch(input, init);
        const contentType = response.headers.get('content-type') || '';
        if (response.ok && !contentType.includes('text/html')) {
          if (urlStr.includes('/api/data') && !urlStr.includes('/api/data/')) {
            try {
              const clone = response.clone();
              const data = await clone.json();
              localStorage.setItem('arcenol_db', JSON.stringify(data));
            } catch (err) {
              // Ignore json parse error of clone
            }
          }
          return response;
        }
        // If it returns an error (404, etc.) or HTML layout fallback, use client interceptor
        return await handleMockRequest(urlStr, init);
      } catch (err) {
        return await handleMockRequest(urlStr, init);
      }
    }
    return originalFetch(input, init);
  };

  try {
    Object.defineProperty(window, 'fetch', {
      value: customFetch,
      configurable: true,
      writable: true
    });
  } catch (err) {
    console.error("Failed to redefine window.fetch with Object.defineProperty, trying on Window.prototype", err);
    try {
      Object.defineProperty(Window.prototype, 'fetch', {
        value: customFetch,
        configurable: true,
        writable: true
      });
    } catch (errProto) {
      console.error("Failed to redefine on Window.prototype too, falling back to assignment", errProto);
      try {
        (window as any).fetch = customFetch;
      } catch (errAssign) {
        console.error("Failed standard assignment, using globalThis", errAssign);
        try {
          (globalThis as any).fetch = customFetch;
        } catch (errGlobal) {
          console.error("Failed globalThis configuration", errGlobal);
        }
      }
    }
  }
}

export {};
