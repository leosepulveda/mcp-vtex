# Quick Start Guide - MCP VTEX Server

Get started with MCP VTEX in 5 minutes!

## 📋 Prerequisites

- Node.js 18 or higher
- A VTEX store account
- VTEX App Key and App Token
- Claude Desktop or Cursor IDE

## 🚀 Installation Steps

### Step 1: Install the Package

Choose one of these options:

**Option A: Global Installation (Recommended)**
```bash
npm install -g mcp-vtex
```

**Option B: Use directly with npx (Always latest version)**
No installation needed! Just configure and run.

### Step 2: Get VTEX Credentials

1. Log in to your VTEX Admin Panel
2. Navigate to: **Account Settings** → **Account** → **Security** → **Application Keys**
3. Click **+ Generate access key**
4. Save your **App Key** and **App Token** securely
5. Configure the following permissions:
   - ✅ Catalog - Full Access
   - ✅ Pricing - Full Access
   - ✅ Logistics - Full Access
   - ✅ OMS - Full Access
   - ✅ Promotions & Taxes - Full Access
   - ✅ Marketplace - Full Access (optional)

### Step 3: Configure Your AI IDE

#### For Claude Desktop

**Mac/Linux:**
Edit `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows:**
Edit `%APPDATA%\Claude\claude_desktop_config.json`

**Using npx (recommended):**
```json
{
  "mcpServers": {
    "vtex": {
      "command": "npx",
      "args": ["-y", "mcp-vtex"],
      "env": {
        "VTEX_ACCOUNT_NAME": "your-store-name",
        "VTEX_ENVIRONMENT": "vtexcommercestable",
        "VTEX_APP_KEY": "vtexappkey-your-app-key",
        "VTEX_APP_TOKEN": "your-app-token"
      }
    }
  }
}
```

**Using global installation:**
```json
{
  "mcpServers": {
    "vtex": {
      "command": "mcp-vtex",
      "env": {
        "VTEX_ACCOUNT_NAME": "your-store-name",
        "VTEX_ENVIRONMENT": "vtexcommercestable",
        "VTEX_APP_KEY": "vtexappkey-your-app-key",
        "VTEX_APP_TOKEN": "your-app-token"
      }
    }
  }
}
```

#### For Cursor

Go to: **Settings** → **Extensions** → **MCP**

Add this configuration:

```json
{
  "mcpServers": {
    "vtex": {
      "command": "npx",
      "args": ["-y", "mcp-vtex"],
      "env": {
        "VTEX_ACCOUNT_NAME": "your-store-name",
        "VTEX_ENVIRONMENT": "vtexcommercestable",
        "VTEX_APP_KEY": "vtexappkey-your-app-key",
        "VTEX_APP_TOKEN": "your-app-token"
      }
    }
  }
}
```

### Step 4: Restart Your IDE

- **Claude Desktop**: Quit and reopen the application
- **Cursor**: Reload the window (Cmd/Ctrl + R)

### Step 5: Test the Connection

Try these commands in your AI IDE:

```plaintext
"List all brands in my VTEX store"
```

```plaintext
"Show me the first 10 products"
```

```plaintext
"Get inventory for SKU 123"
```

If you get responses with data from your VTEX store, you're all set! 🎉

---

## 🎯 Common First Tasks

### 1. Explore Your Catalog

```plaintext
"List all categories in my store"
"Show me all brands"
"How many products do I have?"
```

### 2. Check Inventory

```plaintext
"Show inventory levels for SKU 456"
"List all warehouses"
```

### 3. View Orders

```plaintext
"Show me orders from today"
"Get details for order v12345-01"
```

### 4. Manage Prices

```plaintext
"What's the price of SKU 789?"
"Show me the computed price for SKU 789 including promotions"
```

### 5. Check Promotions

```plaintext
"List all active promotions"
"Show me all coupons"
```

---

## 🐛 Troubleshooting

### Issue: "Server not found" or "Connection failed"

**Solution:**
1. Check that your credentials are correct in the config file
2. Verify your VTEX account name (without .com or .br)
3. Restart your IDE
4. Check the IDE logs for detailed error messages

### Issue: "Permission denied" or "Access denied"

**Solution:**
1. Verify your App Key has the necessary permissions
2. Check that App Key and App Token are correctly copied
3. Ensure there are no extra spaces in your credentials
4. Try generating a new App Key with all permissions

### Issue: "Invalid environment" error

**Solution:**
1. Most VTEX stores use `vtexcommercestable`
2. If you have a different environment, check with VTEX support
3. Common values: `vtexcommercestable`, `vtexcommercebeta`

### Issue: Rate limiting errors

**Solution:**
1. Wait a few moments before retrying
2. Avoid making too many requests in quick succession
3. Use pagination for large data sets

---

## 📚 Next Steps

Now that you're set up, explore more:

- **[Full README](README.md)** - Complete documentation
- **[Examples](EXAMPLES.md)** - Real-world use cases
- **[API Reference](API_REFERENCE.md)** - Detailed tool documentation
- **[VTEX Docs](https://developers.vtex.com/)** - Official VTEX documentation

---

## 💡 Pro Tips

1. **Use natural language** - The AI understands context
2. **Be specific** - Include IDs when you know them
3. **Ask for help** - The AI can guide you through complex operations
4. **Batch operations** - You can ask for multiple operations at once
5. **Export data** - Ask to format responses as CSV, JSON, or markdown tables

---

## 🆘 Getting Help

- **GitHub Issues**: [Report bugs or request features](https://github.com/leosepulveda/mcp-vtex/issues)
- **Discussions**: [Ask questions](https://github.com/leosepulveda/mcp-vtex/discussions)
- **VTEX Community**: [community.vtex.com](https://community.vtex.com/)

---

**Ready to manage your VTEX store with AI? Let's go! 🚀**





