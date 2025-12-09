# Testing Guide - MCP VTEX Server

## 🧪 How to Test

### Prerequisites

Before testing, ensure you have:
- ✅ Valid VTEX credentials (App Key and App Token)
- ✅ A VTEX store with data (products, SKUs, etc.)
- ✅ Claude Desktop or Cursor IDE configured
- ✅ The MCP server installed and configured

## 🚀 Quick Test

### 1. Connection Test

**Test**: Verify the server can connect to VTEX

```plaintext
"List all brands in my VTEX store"
```

**Expected Result**: A list of brands from your catalog

**Validates**:
- ✅ Server is running
- ✅ Credentials are correct
- ✅ API connection works
- ✅ Catalog API access

---

### 2. Read Operations Test

**Test Catalog Read**:
```plaintext
"Show me the first 5 products"
```

**Test Pricing Read**:
```plaintext
"Get the price for SKU [your-sku-id]"
```

**Test Inventory Read**:
```plaintext
"Check inventory for SKU [your-sku-id]"
```

**Test Orders Read**:
```plaintext
"Show me orders from today"
```

**Expected Result**: Data from your VTEX store

**Validates**:
- ✅ Multiple API endpoints working
- ✅ Data retrieval and formatting
- ✅ Permission configuration

---

### 3. Write Operations Test

⚠️ **Warning**: These operations modify your store data. Test in a development/staging environment first!

**Test Product Creation**:
```plaintext
"Create a test product named 'TEST-DELETE-ME' in category [id] with brand [id]"
```

**Test Price Update**:
```plaintext
"Update the price of SKU [test-sku-id] to $9.99"
```

**Test Inventory Update**:
```plaintext
"Set inventory for SKU [test-sku-id] in warehouse [warehouse-id] to 10 units"
```

**Expected Result**: Successful creation/update confirmations

**Validates**:
- ✅ Write permissions
- ✅ Data modification works
- ✅ API responses handled correctly

---

## 🔍 Detailed Testing Checklist

### Catalog API Tests

- [ ] **Products**
  - [ ] List products
  - [ ] Get product by ID
  - [ ] Create product
  - [ ] Update product
  - [ ] Delete product

- [ ] **SKUs**
  - [ ] List SKUs
  - [ ] Get SKU by ID
  - [ ] Get SKU by RefId
  - [ ] Create SKU
  - [ ] Update SKU

- [ ] **Categories**
  - [ ] List categories
  - [ ] Get category by ID
  - [ ] Create category
  - [ ] Update category
  - [ ] Delete category

- [ ] **Brands**
  - [ ] List brands
  - [ ] Get brand by ID
  - [ ] Create brand
  - [ ] Update brand
  - [ ] Delete brand

### Pricing API Tests

- [ ] Get price for SKU
- [ ] Create/update price
- [ ] Delete price
- [ ] List all prices
- [ ] Get computed price

### Inventory API Tests

- [ ] Get inventory by SKU
- [ ] Update inventory
- [ ] List inventory by warehouse

### Logistics API Tests

- [ ] **Warehouses**
  - [ ] List warehouses
  - [ ] Get warehouse by ID
  - [ ] Create warehouse
  - [ ] Update warehouse
  - [ ] Delete warehouse

- [ ] **Docks**
  - [ ] List docks
  - [ ] Get dock by ID
  - [ ] Create dock
  - [ ] Update dock
  - [ ] Delete dock

### Promotions API Tests

- [ ] List promotions
- [ ] Get promotion by ID
- [ ] Create promotion
- [ ] Update promotion
- [ ] Archive promotion
- [ ] Unarchive promotion

### Coupons API Tests

- [ ] List coupons
- [ ] Get coupon by code
- [ ] Create coupon
- [ ] Archive coupon

### Orders API Tests

- [ ] Get order by ID
- [ ] List orders
- [ ] Start handling order
- [ ] Cancel order
- [ ] Invoice order

### Marketplace API Tests

- [ ] List sellers
- [ ] Get seller commissions
- [ ] Update seller commission
- [ ] Get SKU approval status
- [ ] Approve SKU
- [ ] Deny SKU
- [ ] Invite seller

---

## 🐛 Common Issues & Solutions

### Issue: "Permission Denied"

**Possible Causes**:
- App Key doesn't have required permissions
- Wrong API credentials

**Solution**:
1. Check App Key permissions in VTEX Admin
2. Verify App Token is correct
3. Ensure credentials match your account

### Issue: "SKU/Product Not Found"

**Possible Causes**:
- Using IDs from different account
- Item was deleted
- Wrong ID format

**Solution**:
1. List items first to get valid IDs
2. Use IDs from your own store
3. Check if item exists in VTEX Admin

### Issue: "Rate Limit Exceeded"

**Possible Causes**:
- Too many requests in short time
- Bulk operations without delays

**Solution**:
1. Wait a few moments
2. Reduce request frequency
3. Use pagination for large datasets

---

## 📊 Test Scenarios

### Scenario 1: New Product Launch

**Steps**:
1. Create a brand (if needed)
2. Create a category (if needed)
3. Create a product
4. Create SKUs for the product
5. Set prices for SKUs
6. Set inventory for SKUs
7. Create a launch promotion
8. Verify everything is visible

**Validates**: Complete product creation workflow

---

### Scenario 2: Inventory Management

**Steps**:
1. Check current inventory for a SKU
2. Update inventory quantity
3. Verify the update
4. Check inventory in multiple warehouses

**Validates**: Inventory operations across warehouses

---

### Scenario 3: Order Fulfillment

**Steps**:
1. Get an order by ID
2. Start handling the order
3. Add invoice and tracking
4. Verify order status changed

**Validates**: Order workflow management

---

### Scenario 4: Promotion Setup

**Steps**:
1. Create a percentage discount promotion
2. Set date range
3. Apply to specific categories
4. Create a coupon code
5. Verify promotion is active
6. Archive when done

**Validates**: Promotion lifecycle management

---

## 🔧 Developer Testing

### Running Local Tests

```bash
# Build the project
npm run build

# Test with Node directly
node dist/index.js

# Should show: "VTEX MCP Server running on stdio"
```

### Environment Variables Testing

Create a `.env` file for testing:

```bash
VTEX_ACCOUNT_NAME=your-test-account
VTEX_ENVIRONMENT=vtexcommercestable
VTEX_APP_KEY=vtexappkey-yourkey
VTEX_APP_TOKEN=yourtoken
```

### Testing Responses

All responses should:
- ✅ Return valid JSON
- ✅ Include data or error
- ✅ Have consistent structure
- ✅ Provide helpful error messages

---

## 📝 Test Documentation

When testing, document:
- What you tested
- Expected result
- Actual result
- Any errors encountered
- VTEX account used (dev/staging/prod)

---

## 🎯 Best Practices

1. **Always test in non-production first**
2. **Use test data** (products named "TEST-*")
3. **Clean up test data** after testing
4. **Document any issues** found
5. **Test one feature at a time**
6. **Verify permissions** before bulk operations
7. **Keep test credentials separate** from production

---

## 📞 Reporting Issues

If you find bugs:

1. **Check existing issues** on GitHub
2. **Gather information**:
   - Error message
   - Command/request used
   - Expected vs actual result
   - MCP version
   - VTEX API endpoint involved
3. **Create a new issue** with details
4. **Include sanitized logs** (remove credentials!)

---

## ✅ Pre-Release Checklist

Before releasing a new version:

- [ ] All catalog operations tested
- [ ] All pricing operations tested
- [ ] All inventory operations tested
- [ ] All logistics operations tested
- [ ] All promotions operations tested
- [ ] All orders operations tested
- [ ] All marketplace operations tested
- [ ] Error handling verified
- [ ] Documentation updated
- [ ] CHANGELOG updated
- [ ] Version number bumped

---

**Happy Testing! 🚀**

Remember: Testing helps ensure reliability for all users. Thank you for your diligence!





