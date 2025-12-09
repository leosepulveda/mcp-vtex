# Usage Examples - MCP VTEX Server

Real-world examples of using MCP VTEX to manage your e-commerce operations.

---

## 📦 Catalog Management

### Creating a Complete Product

```plaintext
Create a new product:
- Name: "Premium Organic Cotton T-Shirt"
- Category ID: 5
- Brand ID: 10
- Description: "Comfortable and eco-friendly t-shirt made from 100% organic cotton"
- Make it active and visible
```

### Bulk Product Updates

```plaintext
For all products in category 5:
1. List them first
2. Update their descriptions to include "Free shipping"
3. Make sure they're all active
```

### Creating SKUs with Specifications

```plaintext
Create a SKU for product 123:
- Name: "T-Shirt - Blue - Large"
- RefId: "TSHIRT-BLUE-L"
- Dimensions: 30cm x 40cm x 2cm
- Weight: 0.3kg
- Mark it as active
```

### Managing Categories

```plaintext
Create a category hierarchy:
1. Parent: "Clothing" (root category)
2. Child: "T-Shirts" (under Clothing)
3. Child: "Premium" (under T-Shirts)
Make all categories active and visible
```

---

## 💰 Pricing Operations

### Setting Up Prices

```plaintext
Set pricing for SKU 456:
- Base price: $29.99
- List price: $39.99 (original price)
- Cost price: $15.00
Calculate the markup
```

### Checking Computed Prices

```plaintext
What's the final price customers will pay for SKU 789?
Include all active promotions and taxes
Show me the breakdown
```

### Bulk Price Updates

```plaintext
For all SKUs in category "Summer Sale":
1. Get current prices
2. Apply 20% discount
3. Update the base prices
4. Keep the list prices unchanged
```

---

## 📊 Inventory Management

### Checking Stock Levels

```plaintext
Show me the inventory status for SKU 101:
- Total quantity across all warehouses
- Reserved quantity
- Available quantity
- Warehouse breakdown
```

### Updating Inventory

```plaintext
Update inventory:
- SKU: 202
- Warehouse: "Main Warehouse"
- Set quantity to 100 units
- Remove unlimited quantity flag
```

### Multi-Warehouse Inventory

```plaintext
I need to redistribute inventory for SKU 303:
1. Current warehouse "WH-A" has 50 units
2. Move 20 units to warehouse "WH-B"
3. Show me the final distribution
```

### Low Stock Alert

```plaintext
Show me all SKUs with less than 10 units in stock
across all warehouses. List them by product name.
```

---

## 🎯 Promotions & Discounts

### Creating a Percentage Discount

```plaintext
Create a Black Friday promotion:
- Name: "Black Friday 2024 - 30% Off"
- Start: November 24, 2024 00:00
- End: November 26, 2024 23:59
- Discount: 30%
- Apply to category ID: 5
- Make it active
```

### Creating a Buy X Get Y Promotion

```plaintext
Create a "Buy 2 Get 1 Free" promotion for products in category 10
Starting today and ending in 30 days
```

### Generating Coupon Codes

```plaintext
Create 5 coupon codes:
- Format: WELCOME10, WELCOME11, ... WELCOME14
- Max 1 use per customer
- Link them to the welcome promotion
```

### Managing Active Promotions

```plaintext
Show me all active promotions for the Christmas season
Sort by discount percentage (highest first)
```

---

## 🛒 Order Management

### Viewing Recent Orders

```plaintext
Show me all orders from the last 7 days
Filter for status "ready-for-handling"
Show: order ID, customer name, total value, and status
```

### Processing an Order

```plaintext
For order v12345-01:
1. Start handling
2. Add invoice number INV-2024-001
3. Invoice value: $129.99
4. Add tracking: TRACK-XYZ-789
5. Tracking URL: https://tracking.example.com/TRACK-XYZ-789
```

### Bulk Order Updates

```plaintext
For all orders with status "ready-for-handling" from yesterday:
1. Start handling each one
2. Export a list with order IDs and customer emails
```

### Order Analytics

```plaintext
For orders in the last 30 days:
- Total number of orders
- Total revenue
- Average order value
- Top 5 customers by order value
```

---

## 🏪 Marketplace Operations

### Managing Sellers

```plaintext
List all sellers in the marketplace
Show their IDs, names, and active status
```

### Approving Seller SKUs

```plaintext
I need to review pending SKU approvals from seller "SELLER-123"
Show me the first 10 pending SKUs
For SKU "SELLER-SKU-001", approve it
```

### Setting Up Commission Structure

```plaintext
Set up commission for category 5:
- Product commission: 15%
- Freight commission: 10%
Apply to all sellers
```

### Inviting New Sellers

```plaintext
Invite a new seller:
- Name: "Premium Electronics Store"
- Email: seller@premiumelectronics.com
- Sales Channel: 1
Send the invitation
```

---

## 🚚 Logistics Configuration

### Creating a Warehouse

```plaintext
Create a new warehouse:
- Name: "West Coast Distribution Center"
- Link it to dock "DOCK-01"
- Dock time: 2 days
- Dock cost: $5.00
```

### Managing Docks

```plaintext
Create a loading dock:
- Name: "Express Dock"
- Priority: 1 (highest)
- Processing time: 1 day
```

### Checking Logistics Network

```plaintext
Show me the complete logistics setup:
1. All warehouses with their names and IDs
2. All docks with their priorities
3. The connections between them
```

---

## 🔄 Complex Workflows

### New Product Launch

```plaintext
I'm launching a new product. Help me with:
1. Create brand "EcoStyle" if it doesn't exist
2. Create category "Sustainable Fashion" under "Clothing"
3. Create product "Recycled Denim Jacket"
4. Create 3 SKUs (Small, Medium, Large)
5. Set price $79.99 for all SKUs
6. Set inventory 50 units per SKU in main warehouse
7. Create a launch promotion: 15% off for first week
```

### Season End Clearance

```plaintext
End of summer clearance:
1. List all products in "Summer Collection" category
2. Apply 40% discount to all
3. Update product names to include "CLEARANCE"
4. Create coupon "SUMMER40" for additional 10% off
5. Set promotion to expire in 2 weeks
```

### Inventory Reconciliation

```plaintext
Inventory audit for warehouse "WH-MAIN":
1. List all SKUs with their quantities
2. Export to a table format
3. Identify SKUs with 0 quantity
4. Identify SKUs with unlimited quantity
5. Show total SKU count
```

### Order Fulfillment Batch

```plaintext
Process morning orders:
1. Get all orders with status "payment-approved" from today
2. For each order:
   - Start handling
   - Note the order ID for printing labels
3. Export a CSV with: order ID, customer name, address, items
```

---

## 📊 Reporting & Analytics

### Sales Performance

```plaintext
Monthly sales report:
1. Get all completed orders from last month
2. Calculate: total orders, total revenue, average order value
3. Group by: day of week
4. Show top 10 best-selling products
```

### Inventory Health Check

```plaintext
Inventory health report:
1. Total SKUs in catalog
2. SKUs with zero inventory
3. SKUs with low stock (< 10 units)
4. Products with multiple warehouses
5. Estimated total inventory value (quantity × cost price)
```

### Promotion Effectiveness

```plaintext
Analyze current promotions:
1. List all active promotions
2. For each, show: name, discount %, dates
3. Which products/categories are included
4. Sort by newest first
```

---

## 🎨 Custom Use Cases

### Flash Sale Setup

```plaintext
Set up a 2-hour flash sale:
- Category: "Electronics"
- Discount: 25%
- Start: Today at 12:00 PM
- End: Today at 2:00 PM
- Create coupon "FLASH25" for email campaign
- Make sure all products in category are active
```

### Product Migration

```plaintext
Move all products from old category to new category:
1. List products in category 50 (old)
2. Update each product's CategoryId to 55 (new)
3. Verify all products moved successfully
4. Deactivate the old category
```

### Marketplace Onboarding

```plaintext
Onboard new marketplace seller:
1. Invite seller "TechGadgets Pro" (tech@gadgets.com)
2. Set commission: 12% products, 8% shipping
3. Prepare checklist of first steps for seller
```

---

## 💡 Pro Tips

1. **Chain operations**: Ask for multiple steps in one request
2. **Use filters**: Be specific about what data you want
3. **Export data**: Ask for tables, CSV, or JSON formats
4. **Verify first**: For bulk operations, review a sample first
5. **Ask for summaries**: Request counts and totals for large datasets

---

## 🆘 Need More Help?

- Check the [Full API Reference](README.md#available-tools) for all available tools
- See [Quick Start Guide](QUICKSTART.md) for setup help
- Visit [VTEX Developer Docs](https://developers.vtex.com/) for API details

---

**Have a use case not covered here? [Open a discussion](https://github.com/leosepulveda/mcp-vtex/discussions) and share your workflow!**



