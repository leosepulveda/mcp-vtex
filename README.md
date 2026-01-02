# MCP VTEX Server

[![npm version](https://img.shields.io/npm/v/mcp-vtex.svg)](https://www.npmjs.com/package/mcp-vtex)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![VTEX](https://img.shields.io/badge/VTEX-compatible-purple.svg)](https://vtex.com)

**Complete VTEX API integration for Claude Desktop and Cursor** - Manage your entire e-commerce operation through AI conversations. Control catalog, inventory, pricing, promotions, orders, and marketplace operations with natural language.

---

## ✨ Features

### 📦 Catalog Management
- **Products**: Full CRUD operations for products
- **SKUs**: Create, update, and manage stock keeping units
- **Categories**: Hierarchical category management
- **Brands**: Brand creation and management
- **Specifications**: Product and SKU specifications

### 💰 Pricing & Promotions
- **Pricing API**: Base prices, list prices, cost prices, and markup
- **Computed Prices**: Get final prices including promotions and taxes
- **Promotions**: Create and manage all types of promotions
- **Coupons**: Generate and manage discount coupons

### 📊 Inventory & Logistics
- **Inventory**: Real-time stock management across warehouses
- **Warehouses**: Create and manage storage facilities
- **Docks**: Loading dock configuration
- **Shipping Policies**: Configure shipping methods and rules

### 🛒 Orders Management
- **Order Operations**: View, process, and update orders
- **Order Status**: Change order status through workflow
- **Invoicing**: Add invoices and tracking information
- **Cancellations**: Cancel orders with reasons

### 🏪 Marketplace Operations
- **Seller Management**: Invite and manage sellers
- **Commissions**: Configure seller commissions
- **SKU Approval**: Approve or deny seller SKUs
- **Multi-seller**: Full marketplace functionality

### 🛍️ Checkout & Cart (NEW!)
- **Order Form**: Complete cart management
- **Shipping Simulation**: Calculate shipping costs and delivery times
- **Cart Operations**: Add, remove, update items
- **Coupon Application**: Apply discount coupons to cart
- **Cart Management**: Clear cart and manage order form

### 👥 Customer Data (NEW!)
- **Master Data**: Full CRM functionality
- **Client Management**: Create, read, update, delete customer data
- **Document Management**: Handle custom data entities
- **Search & Filter**: Advanced query capabilities
- **Client Lookup**: Find customers by email and other fields

### 🔍 Product Search (NEW!)
- **Advanced Search**: Powerful product search with filters
- **Facets & Filters**: Dynamic filter generation
- **Autocomplete**: Search suggestions
- **Product Lookup**: Find by ID, EAN, Reference, SKU
- **Indexing**: Bulk product and SKU ID retrieval

### ⭐ Reviews & Ratings (NEW!)
- **Review Management**: Create, update, delete reviews
- **Approval Workflow**: Approve or reject customer reviews
- **Rating Statistics**: Get average ratings and distributions
- **Review Listing**: Filter and sort reviews
- **Social Proof**: Build customer trust with reviews

### 💳 Payment Configuration (NEW!)
- **Payment Providers**: Configure payment gateways
- **Payment Methods**: Manage available payment options
- **Transaction Tracking**: Monitor payment transactions
- **Provider Management**: Add, update, remove payment integrations
- **Payment Configuration**: Complete gateway setup

### 🎁 Gift Cards (NEW v1.5.0!)
- **Gift Card Creation**: Create custom gift cards with balance and expiration
- **Gift Card Lookup**: Retrieve by ID or redemption code
- **Transaction Management**: Add credits or debits to gift cards
- **Gift Card Listing**: View all gift cards with pagination
- **Restrictions**: Configure owner-only usage
- **Use Cases**: Loyalty programs, VIP reactivation, store credit, refunds

---

## 🚀 Quick Start

### Installation via npm (Recommended)

```bash
npm install -g mcp-vtex
```

### Configuration

1. **Get your VTEX API credentials**:
   - Navigate to your VTEX Admin → Account Settings → Account
   - Go to Security → Application Keys
   - Create a new App Key and App Token
   - Save both credentials securely

2. **Configure Claude Desktop**:

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (Mac/Linux) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

**Option A - Using global installation:**
```json
{
  "mcpServers": {
    "vtex": {
      "command": "mcp-vtex",
      "env": {
        "VTEX_ACCOUNT_NAME": "your-account-name",
        "VTEX_ENVIRONMENT": "vtexcommercestable",
        "VTEX_APP_KEY": "your-app-key",
        "VTEX_APP_TOKEN": "your-app-token"
      }
    }
  }
}
```

**Option B - Using npx (always latest version):**
```json
{
  "mcpServers": {
    "vtex": {
      "command": "npx",
      "args": ["-y", "mcp-vtex"],
      "env": {
        "VTEX_ACCOUNT_NAME": "your-account-name",
        "VTEX_ENVIRONMENT": "vtexcommercestable",
        "VTEX_APP_KEY": "your-app-key",
        "VTEX_APP_TOKEN": "your-app-token"
      }
    }
  }
}
```

3. **Configure Cursor**:

Add to Cursor MCP settings (Settings → Extensions → MCP):

```json
{
  "mcpServers": {
    "vtex": {
      "command": "npx",
      "args": ["-y", "mcp-vtex"],
      "env": {
        "VTEX_ACCOUNT_NAME": "your-account-name",
        "VTEX_ENVIRONMENT": "vtexcommercestable",
        "VTEX_APP_KEY": "your-app-key",
        "VTEX_APP_TOKEN": "your-app-token"
      }
    }
  }
}
```

4. **Restart Claude Desktop or Cursor**

---

## 💬 Usage Examples

Once configured, interact with VTEX using natural language:

### Catalog Management

```plaintext
"Create a new product called 'Premium T-Shirt' in category 5 with brand 10"
```

```plaintext
"List all active SKUs for product 123"
```

```plaintext
"Update the price of SKU 456 to $29.99"
```

### Inventory Operations

```plaintext
"Check inventory levels for SKU 789"
```

```plaintext
"Update inventory for SKU 101 in warehouse 1 to 50 units"
```

```plaintext
"List all warehouses"
```

### Promotions & Pricing

```plaintext
"Create a 20% discount promotion for Black Friday"
```

```plaintext
"Generate a coupon code 'WELCOME10' for new customers"
```

```plaintext
"Get the computed price for SKU 202 including all promotions"
```

### Order Management

```plaintext
"Get details for order v12345-01"
```

```plaintext
"List all orders from the last 7 days"
```

```plaintext
"Start handling order v12345-01"
```

```plaintext
"Add invoice 12345 with tracking ABC123 to order v12345-01"
```

### Marketplace Operations

```plaintext
"List all sellers in the marketplace"
```

```plaintext
"Approve SKU xyz from seller seller-123"
```

```plaintext
"Invite new seller 'Premium Store' with email seller@example.com"
```

---

## 🛠️ Available Tools (164 Tools)

### Catalog API (30 tools)
- **Products**: Create, Get, Update, Delete, List
- **SKUs**: Create, Get, Get by RefId, Update, List
- **Categories**: Create, Get, Update, Delete, List
- **Brands**: Create, Get, Update, Delete, List
- **Specifications**: Create Field, Create Spec, Get SKU Specs, Assign Values, List Category Specs

### Pricing API (5 tools)
- Get Price, Create/Update Price, Delete Price, List Prices, Get Computed Price

### Inventory API (3 tools)
- Get Inventory, Update Inventory, List Inventory by Warehouse

### Logistics API (10 tools)
- **Warehouses**: Create, Get, Update, Delete, List
- **Docks**: Create, Get, Update, Delete, List

### Promotions & Coupons API (10 tools)
- **Promotions**: Create, Get, Update, List, Archive, Unarchive
- **Coupons**: Create, Get, List, Archive

### Orders API (5 tools)
- Get Order, List Orders, Start Handling, Cancel Order, Invoice Order

### Marketplace API (7 tools)
- Get/Update Seller Commissions, Get SKU Approval Status, Approve SKU, Deny SKU, Invite Seller, List Sellers

### Checkout API (7 tools) 🆕
- Get Order Form, Simulate Shipping, Add Item to Cart, Remove Item, Update Quantity, Add Coupon, Clear Cart

### Master Data API (6 tools) 🆕
- Create Document, Get Document, Update Document, Delete Document, Search Documents, Get Client by Email

### Search API (5 tools) 🆕
- Search Products, Get Product by Identifier, Get Product & SKU IDs, Get Facets, Autocomplete

### Reviews and Ratings API (7 tools) 🆕
- Create Review, Get Review, List Reviews, Update Review, Delete Review, Approve Review, Get Review Summary

### Payment Gateway API (7 tools) 🆕
- List Providers, Get Provider, Create Provider, Update Provider, Delete Provider, List Payment Methods, Get Transaction

### Gift Card API (5 tools) 🎁 NEW in v1.5.0!
- Create Gift Card, Get Gift Card, List Gift Cards, Get Gift Card by Code, Create Gift Card Transaction

---

## 📁 Project Structure

```
mcp-vtex/
├── src/
│   ├── index.ts          # MCP server implementation
│   ├── vtex-client.ts    # VTEX API client
│   └── types.ts          # TypeScript definitions
├── dist/                 # Compiled output
├── package.json
├── tsconfig.json
├── README.md
├── CHANGELOG.md
└── LICENSE
```

---

## 🔧 Development

### Local Installation (For Development)

```bash
# Clone repository
git clone https://github.com/leosepulveda/mcp-vtex.git
cd mcp-vtex

# Install dependencies
npm install

# Build
npm run build

# Development with auto-rebuild
npm run watch
```

### Configure with Local Build

**For Claude Desktop**, add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "vtex": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-vtex/dist/index.js"],
      "env": {
        "VTEX_ACCOUNT_NAME": "your-account-name",
        "VTEX_ENVIRONMENT": "vtexcommercestable",
        "VTEX_APP_KEY": "your-app-key",
        "VTEX_APP_TOKEN": "your-app-token"
      }
    }
  }
}
```

---

## 📋 Requirements

- **Node.js**: 18 or higher
- **VTEX Store**: Active VTEX account
- **API Credentials**: App Key and App Token with appropriate permissions
- **AI IDE**: Claude Desktop or Cursor with MCP support

### Required VTEX Permissions

Your App Key needs the following permissions:
- Catalog - Full Access
- Pricing - Full Access
- Logistics - Full Access
- OMS - Full Access
- Promotions & Taxes - Full Access
- Marketplace - Full Access (if using marketplace features)

---

## 🔐 Security Best Practices

- **Never commit credentials** to version control
- Store API credentials in environment variables
- **Rotate API keys regularly** for security
- Use separate App Keys for development and production
- **Limit permissions** to only what's needed for each key
- Monitor API usage in VTEX Admin

---

## 📊 API Coverage

This MCP server covers the following VTEX APIs:

✅ **Catalog API** - Complete  
✅ **Pricing API** - Complete  
✅ **Inventory & Logistics API** - Complete  
✅ **Promotions & Taxes API** - Complete  
✅ **Orders Management API** - Core features  
✅ **Marketplace API** - Complete  

---

## 🐛 Troubleshooting

### Connection Issues

**Problem**: "Cannot connect to VTEX API"
- Verify `VTEX_ACCOUNT_NAME` is correct
- Check that App Key and App Token are valid
- Ensure your VTEX store is active
- Verify API credentials have necessary permissions

### Permission Errors

**Problem**: "Insufficient permissions" or "Access denied"
- Check App Key permissions in VTEX Admin
- Ensure the App Key has access to the specific API
- Some operations require admin-level permissions

### Rate Limiting

**Problem**: "Too many requests"
- VTEX has rate limits per API
- Implement delays between bulk operations
- Consider batching operations when possible

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[VTEX](https://vtex.com)** - E-commerce platform
- **[Anthropic](https://anthropic.com)** - Claude and Model Context Protocol
- **[Cursor](https://cursor.sh)** - AI-powered code editor

---

## 🔗 Resources

- [VTEX Developer Portal](https://developers.vtex.com/)
- [VTEX API Documentation](https://developers.vtex.com/docs/api-reference)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP Servers Registry](https://github.com/modelcontextprotocol/servers)

---

## 📧 Support

- **Issues**: [GitHub Issues](https://github.com/leosepulveda/mcp-vtex/issues)
- **Discussions**: [GitHub Discussions](https://github.com/leosepulveda/mcp-vtex/discussions)
- **VTEX Community**: [community.vtex.com](https://community.vtex.com/)

---

## ⚡ Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VTEX_ACCOUNT_NAME` | Yes | - | Your VTEX account name |
| `VTEX_ENVIRONMENT` | No | `vtexcommercestable` | VTEX environment (usually vtexcommercestable) |
| `VTEX_APP_KEY` | Yes | - | Your VTEX App Key |
| `VTEX_APP_TOKEN` | Yes | - | Your VTEX App Token |

---

<div align="center">

**[⬆ Back to Top](#mcp-vtex-server)**

</div>

