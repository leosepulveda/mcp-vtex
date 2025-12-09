# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2024-12-09

### Added - Specification Field Creation! 🏗️

#### Catalog Specifications API (1 new tool)
- **vtex_create_specification_field**: Create new specification fields for categories with full configuration options

### Enhanced
- Complete specification field creation with all parameters:
  - Field types: Text, MultiLine, Number, Combo, Radio, CheckBox, Indexed Text, Large Text
  - Configuration options: IsRequired, IsActive, IsStockKeepingUnit, IsFilter, IsOnProductDetails
  - Support for both SKU-level and Product-level specifications
- Improved specification management workflow from discovery to creation to assignment

### Use Cases
- Create custom specification fields for categories (e.g., "Año del Vehículo", "Talla", "Color")
- Define field types and validation rules
- Configure field visibility and filtering options
- Build complete product variation systems
- Implement custom product attributes for specific categories

### Statistics
- **Total Tools**: Increased from 158 to 159
- **Specification Tools**: Now 5 complete tools for full lifecycle management

---

## [1.3.0] - 2024-12-09

### Added - Specifications Management Tools! 🏷️

#### Catalog Specifications API (4 tools)
- **vtex_create_specification**: Create new specification fields in the catalog
- **vtex_get_sku_specifications**: Retrieve all specifications for a specific SKU
- **vtex_assign_sku_specification_value**: Assign specification values to SKUs
- **vtex_list_category_specifications**: List all specification fields configured for a category

### Enhanced
- Complete specification field management workflow
- Category-based specification discovery
- SKU specification assignment and retrieval
- Support for custom product attributes and variations

### Use Cases
- Query which specifications exist in a category
- Create new specification fields if they don't exist
- Assign specification values to SKUs
- Retrieve current specifications of any SKU
- Manage product variations and attributes

## [1.2.0] - 2024-12-08

### Added - 6 Additional Major APIs! 🎯

#### Session Manager API (3 tools)
- Get session data for personalization
- Update session information
- Get segment data (UTM, campaigns, location)
- User segmentation capabilities

#### Gift Card API (6 tools)
- Create gift cards with balance
- Get gift card by ID or redemption code
- List all gift cards with pagination
- Create transactions (credit/debit)
- List gift card providers
- Complete gift card lifecycle management

#### Subscriptions API (6 tools)
- Create recurring subscriptions
- Get subscription details
- List subscriptions with filters
- Update subscription configuration
- Pause subscriptions
- Cancel subscriptions

#### CMS API (4 tools)
- List all CMS templates
- Get template by ID
- Create new templates
- Delete templates
- Portal/Legacy CMS management

#### Message Center API (5 tools)
- List email templates
- Get email template details
- Create new email templates
- Update existing templates
- Send emails using templates
- SMTP configuration support

#### VTEX ID API (5 tools)
- Authenticate users
- Get user profiles
- Validate authentication tokens
- Create app tokens
- List app tokens
- Identity and access management

### Statistics
- **Total Tools**: Increased from 110+ to 145+
- **API Coverage**: Expanded from 11 to 17 major VTEX APIs
- **Type Definitions**: Added 40+ new interfaces
- **Lines of Code**: Increased from 4,220 to 5,558 (+32%)

### Improved
- Complete user authentication flow
- Subscription-based business support
- Email automation capabilities
- Content management integration
- Gift card and loyalty programs

---

## [1.1.0] - 2024-12-08

### Added - 5 New Major APIs! 🚀

#### Checkout API (7 tools)
- Get order form (cart) details
- Simulate shipping costs and delivery times
- Add items to cart
- Remove items from cart
- Update item quantities
- Apply coupon codes
- Clear cart completely

#### Master Data API (6 tools)
- Create documents in any data entity
- Get documents with field selection
- Update existing documents
- Delete documents
- Advanced search with filters and pagination
- Get client data by email (CRM integration)

#### Search API (5 tools)
- Advanced product search with filters
- Product lookup by ID, EAN, Reference, or SKU
- Bulk product and SKU ID retrieval
- Get facets and filters for category
- Autocomplete search suggestions

#### Reviews and Ratings API (7 tools)
- Create product reviews
- Get review by ID
- List reviews with filters and pagination
- Update existing reviews
- Delete reviews
- Approve reviews for display
- Get review summary and rating statistics

#### Payment Gateway API (7 tools)
- List all payment providers
- Get payment provider configuration
- Create new payment provider
- Update provider settings
- Delete payment provider
- List available payment methods
- Get transaction details

### Statistics
- **Total Tools**: Increased from 70+ to 110+
- **API Coverage**: Expanded from 6 to 11 major VTEX APIs
- **Type Definitions**: Added 30+ new interfaces
- **Lines of Code**: Increased from 2,539 to 4,220 (+66%)

### Improved
- Enhanced error handling for new endpoints
- Better TypeScript type coverage
- Comprehensive documentation updates

---

## [1.0.0] - 2024-12-08

### Added
- Initial release of MCP VTEX Server
- Complete Catalog API integration
  - Products CRUD operations
  - SKUs management
  - Categories management
  - Brands management
  - Specifications support
- Pricing API integration
  - Base price management
  - List price and cost price
  - Computed prices with promotions
  - Fixed prices support
- Inventory & Logistics API integration
  - Real-time inventory management
  - Warehouse operations
  - Dock configuration
  - Multi-warehouse support
- Promotions & Taxes API integration
  - All promotion types support
  - Coupon generation and management
  - Promotion archiving
- Orders Management API integration
  - Order retrieval and listing
  - Order status management
  - Invoice and tracking updates
  - Order cancellation
- Marketplace API integration
  - Seller management
  - Commission configuration
  - SKU approval workflow
  - Seller invitations
- TypeScript support with full type definitions
- Comprehensive error handling
- Environment-based configuration
- MCP SDK integration for Claude Desktop and Cursor

### Documentation
- Comprehensive README with usage examples
- API reference for all 70+ tools
- Security best practices guide
- Troubleshooting section
- Development setup instructions

### Developer Experience
- Auto-rebuild with watch mode
- Type-safe API client
- Modular architecture
- Easy local development setup

---

## Roadmap

### [1.1.0] - Planned
- [ ] Add Checkout API integration
- [ ] Add Customer Data API (Master Data)
- [ ] Add Search API integration
- [ ] Batch operations support
- [ ] Enhanced error messages with suggestions
- [ ] Performance optimizations for bulk operations

### [1.2.0] - Planned
- [ ] Add CMS API integration
- [ ] Add Payment Gateway API
- [ ] Add Subscriptions API
- [ ] Webhook management
- [ ] Advanced filtering and search
- [ ] Export/Import operations

### [2.0.0] - Future
- [ ] GraphQL API support
- [ ] Real-time inventory sync
- [ ] Advanced marketplace analytics
- [ ] Multi-account management
- [ ] Automated testing suite
- [ ] Performance benchmarks

---

## Contributing

We welcome contributions! Please see our contributing guidelines for more details.

## Support

For issues, feature requests, or questions:
- GitHub Issues: https://github.com/leosepulveda/mcp-vtex/issues
- GitHub Discussions: https://github.com/leosepulveda/mcp-vtex/discussions

