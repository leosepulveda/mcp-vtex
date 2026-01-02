#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { VtexClient } from './vtex-client.js';
import { z } from 'zod';

const server = new Server(
  {
    name: 'mcp-vtex',
    version: '1.6.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Get config from environment variables
const VTEX_ACCOUNT_NAME = process.env.VTEX_ACCOUNT_NAME;
const VTEX_ENVIRONMENT = process.env.VTEX_ENVIRONMENT || 'vtexcommercestable';
const VTEX_APP_KEY = process.env.VTEX_APP_KEY;
const VTEX_APP_TOKEN = process.env.VTEX_APP_TOKEN;
const VTEX_MCP_PROFILE = process.env.VTEX_MCP_PROFILE || 'essential'; // 'essential' or 'full'

if (!VTEX_ACCOUNT_NAME || !VTEX_APP_KEY || !VTEX_APP_TOKEN) {
  console.error('Error: VTEX_ACCOUNT_NAME, VTEX_APP_KEY and VTEX_APP_TOKEN environment variables are required');
  process.exit(1);
}

const vtexClient = new VtexClient({
  accountName: VTEX_ACCOUNT_NAME,
  environment: VTEX_ENVIRONMENT,
  appKey: VTEX_APP_KEY,
  appToken: VTEX_APP_TOKEN,
});

// ========== PROFILE CONFIGURATION ==========

const EXCLUDED_TOOLS_IN_ESSENTIAL = new Set([
  // Specifications (too technical, rarely used)
  'vtex_create_specification', 'vtex_get_sku_specifications', 'vtex_assign_sku_specification_value',
  'vtex_list_category_specifications', 'vtex_create_specification_field', 'vtex_create_specification_group',
  'vtex_list_specification_groups', 'vtex_get_specification_field', 'vtex_create_specification_field_value',
  'vtex_list_specification_field_values',
  
  // Marketplace/Sellers (not all stores have marketplace)
  'vtex_get_seller_commissions', 'vtex_update_seller_commission', 'vtex_get_sku_approval_status',
  'vtex_approve_sku', 'vtex_deny_sku', 'vtex_invite_seller', 'vtex_list_sellers',
  
  // Cart Management (frontend, not backend automation)
  'vtex_get_orderform', 'vtex_simulate_shipping', 'vtex_add_item_to_cart',
  'vtex_remove_item_from_cart', 'vtex_update_item_quantity', 'vtex_add_coupon_to_cart', 'vtex_clear_cart',
  
  // Reviews & Ratings (not core for operations)
  'vtex_create_review', 'vtex_get_review', 'vtex_list_reviews', 'vtex_delete_review',
  'vtex_moderate_review', 'vtex_get_product_rating',
  
  // Payment Gateway (not needed for automation)
  'vtex_create_payment', 'vtex_get_payment', 'vtex_cancel_payment', 'vtex_capture_payment',
  'vtex_refund_payment', 'vtex_list_payment_methods',
  
  // Session Manager (not relevant for MCP)
  'vtex_create_session', 'vtex_get_session', 'vtex_update_session',
  
  // Subscriptions (very specific feature)
  'vtex_create_subscription', 'vtex_get_subscription', 'vtex_list_subscriptions',
  'vtex_update_subscription', 'vtex_pause_subscription', 'vtex_cancel_subscription',
  
  // CMS (content management, not operations)
  'vtex_list_cms_templates', 'vtex_get_cms_template', 'vtex_create_cms_template', 'vtex_delete_cms_template',
  
  // VTEX ID / Auth (not relevant for MCP)
  'vtex_authenticate_user', 'vtex_get_user_profile', 'vtex_validate_token',
  'vtex_create_app_token', 'vtex_list_app_tokens',
  
  // Gift Card Providers (only need gift card CRUD, not providers)
  'vtex_list_gift_card_providers',
]);

function shouldIncludeTool(toolName: string): boolean {
  if (VTEX_MCP_PROFILE === 'full') {
    return true;
  }
  return !EXCLUDED_TOOLS_IN_ESSENTIAL.has(toolName);
}

// ========== LIST TOOLS ==========

server.setRequestHandler(ListToolsRequestSchema, async () => {
  const allTools = [
      // ========== CATALOG - PRODUCTS ==========
      {
        name: 'vtex_create_product',
        description: 'Create a new product in VTEX catalog',
        inputSchema: {
          type: 'object',
          properties: {
            Name: { type: 'string', description: 'Product name' },
            CategoryId: { type: 'number', description: 'Category ID' },
            BrandId: { type: 'number', description: 'Brand ID' },
            LinkId: { type: 'string', description: 'Product URL slug' },
            RefId: { type: 'string', description: 'Product reference ID' },
            Description: { type: 'string', description: 'Product description' },
            IsVisible: { type: 'boolean', description: 'Product visibility', default: true },
            IsActive: { type: 'boolean', description: 'Product active status', default: true },
          },
          required: ['Name', 'CategoryId', 'BrandId'],
        },
      },
      {
        name: 'vtex_get_product',
        description: 'Get product details by ID',
        inputSchema: {
          type: 'object',
          properties: {
            productId: { type: 'string', description: 'Product ID' },
          },
          required: ['productId'],
        },
      },
      {
        name: 'vtex_update_product',
        description: 'Update an existing product',
        inputSchema: {
          type: 'object',
          properties: {
            productId: { type: 'string', description: 'Product ID' },
            Name: { type: 'string', description: 'Product name' },
            Description: { type: 'string', description: 'Product description' },
            IsVisible: { type: 'boolean', description: 'Product visibility' },
            IsActive: { type: 'boolean', description: 'Product active status' },
          },
          required: ['productId'],
        },
      },
      {
        name: 'vtex_delete_product',
        description: 'Delete a product',
        inputSchema: {
          type: 'object',
          properties: {
            productId: { type: 'string', description: 'Product ID to delete' },
          },
          required: ['productId'],
        },
      },
      {
        name: 'vtex_list_products',
        description: 'List products with pagination',
        inputSchema: {
          type: 'object',
          properties: {
            page: { type: 'number', description: 'Page number', default: 1 },
            pageSize: { type: 'number', description: 'Items per page', default: 50 },
          },
        },
      },

      // ========== CATALOG - SKUS ==========
      {
        name: 'vtex_create_sku',
        description: 'Create a new SKU for a product',
        inputSchema: {
          type: 'object',
          properties: {
            ProductId: { type: 'number', description: 'Product ID' },
            Name: { type: 'string', description: 'SKU name' },
            RefId: { type: 'string', description: 'SKU reference ID' },
            IsActive: { type: 'boolean', description: 'SKU active status', default: true },
            Height: { type: 'number', description: 'Height in cm' },
            Length: { type: 'number', description: 'Length in cm' },
            Width: { type: 'number', description: 'Width in cm' },
            WeightKg: { type: 'number', description: 'Weight in kg' },
          },
          required: ['ProductId', 'Name'],
        },
      },
      {
        name: 'vtex_get_sku',
        description: 'Get SKU details by ID',
        inputSchema: {
          type: 'object',
          properties: {
            skuId: { type: 'string', description: 'SKU ID' },
          },
          required: ['skuId'],
        },
      },
      {
        name: 'vtex_get_sku_by_refid',
        description: 'Get SKU details by reference ID',
        inputSchema: {
          type: 'object',
          properties: {
            refId: { type: 'string', description: 'SKU reference ID' },
          },
          required: ['refId'],
        },
      },
      {
        name: 'vtex_update_sku',
        description: 'Update an existing SKU',
        inputSchema: {
          type: 'object',
          properties: {
            skuId: { type: 'string', description: 'SKU ID' },
            Name: { type: 'string', description: 'SKU name' },
            IsActive: { type: 'boolean', description: 'SKU active status' },
            Height: { type: 'number', description: 'Height in cm' },
            Length: { type: 'number', description: 'Length in cm' },
            Width: { type: 'number', description: 'Width in cm' },
            WeightKg: { type: 'number', description: 'Weight in kg' },
          },
          required: ['skuId'],
        },
      },
      {
        name: 'vtex_list_skus',
        description: 'List SKUs, optionally filtered by product',
        inputSchema: {
          type: 'object',
          properties: {
            productId: { type: 'string', description: 'Filter by Product ID' },
          },
        },
      },

      // ========== CATALOG - SPECIFICATIONS ==========
      {
        name: 'vtex_create_specification',
        description: 'Create a new specification field in VTEX catalog',
        inputSchema: {
          type: 'object',
          properties: {
            FieldId: { type: 'number', description: 'Field ID' },
            FieldValueId: { type: 'number', description: 'Field Value ID' },
            Text: { type: 'string', description: 'Specification text value' },
          },
          required: ['FieldId', 'FieldValueId'],
        },
      },
      {
        name: 'vtex_get_sku_specifications',
        description: 'Get all specifications for a specific SKU',
        inputSchema: {
          type: 'object',
          properties: {
            skuId: { type: 'string', description: 'SKU ID' },
          },
          required: ['skuId'],
        },
      },
      {
        name: 'vtex_assign_sku_specification_value',
        description: 'Assign specification values to a SKU',
        inputSchema: {
          type: 'object',
          properties: {
            skuId: { type: 'string', description: 'SKU ID' },
            specifications: {
              type: 'array',
              description: 'Array of specification assignments',
              items: {
                type: 'object',
                properties: {
                  FieldId: { type: 'number', description: 'Specification Field ID' },
                  FieldValueId: { type: 'number', description: 'Specification Field Value ID' },
                },
                required: ['FieldId', 'FieldValueId'],
              },
            },
          },
          required: ['skuId', 'specifications'],
        },
      },
      {
        name: 'vtex_list_category_specifications',
        description: 'List all specification fields configured for a category',
        inputSchema: {
          type: 'object',
          properties: {
            categoryId: { type: 'string', description: 'Category ID' },
          },
          required: ['categoryId'],
        },
      },
      {
        name: 'vtex_create_specification_field',
        description: 'Create a new specification field for a category',
        inputSchema: {
          type: 'object',
          properties: {
            CategoryId: { type: 'number', description: 'Category ID' },
            FieldTypeId: { type: 'number', description: 'Field type: 1=Text, 2=MultiLine, 4=Number, 5=Combo, 7=Radio, 8=CheckBox, 9=Indexed Text, 10=Large Text' },
            Name: { type: 'string', description: 'Field name (e.g., "Año del Vehículo")' },
            Description: { type: 'string', description: 'Field description' },
            IsRequired: { type: 'boolean', description: 'Is required', default: false },
            IsActive: { type: 'boolean', description: 'Is active', default: true },
            IsStockKeepingUnit: { type: 'boolean', description: 'Is SKU level (true) or Product level (false)', default: true },
            IsFilter: { type: 'boolean', description: 'Show in filter', default: false },
            IsOnProductDetails: { type: 'boolean', description: 'Show on product page', default: true },
          },
          required: ['CategoryId', 'FieldTypeId', 'Name'],
        },
      },
      {
        name: 'vtex_create_specification_group',
        description: 'Create a new specification group for a category',
        inputSchema: {
          type: 'object',
          properties: {
            CategoryId: { type: 'number', description: 'Category ID' },
            Name: { type: 'string', description: 'Group name' },
            Position: { type: 'number', description: 'Display position', default: 1 },
          },
          required: ['CategoryId', 'Name'],
        },
      },
      {
        name: 'vtex_list_specification_groups',
        description: 'List all specification groups for a category',
        inputSchema: {
          type: 'object',
          properties: {
            categoryId: { type: 'string', description: 'Category ID' },
          },
          required: ['categoryId'],
        },
      },
      {
        name: 'vtex_get_specification_field',
        description: 'Get details of a specification field by ID',
        inputSchema: {
          type: 'object',
          properties: {
            fieldId: { type: 'string', description: 'Specification Field ID' },
          },
          required: ['fieldId'],
        },
      },
      {
        name: 'vtex_create_specification_field_value',
        description: 'Create a new value for a specification field',
        inputSchema: {
          type: 'object',
          properties: {
            fieldId: { type: 'string', description: 'Specification Field ID' },
            FieldValueName: { type: 'string', description: 'Value name (e.g., "2016", "Mazda 2")' },
            Position: { type: 'number', description: 'Display position', default: 1 },
            IsActive: { type: 'boolean', description: 'Is active', default: true },
          },
          required: ['fieldId', 'FieldValueName'],
        },
      },
      {
        name: 'vtex_list_specification_field_values',
        description: 'List all values for a specification field',
        inputSchema: {
          type: 'object',
          properties: {
            fieldId: { type: 'string', description: 'Specification Field ID' },
          },
          required: ['fieldId'],
        },
      },

      // ========== CATALOG - CATEGORIES ==========
      {
        name: 'vtex_create_category',
        description: 'Create a new category',
        inputSchema: {
          type: 'object',
          properties: {
            Name: { type: 'string', description: 'Category name' },
            FatherCategoryId: { type: 'number', description: 'Parent category ID (null for root)' },
            Title: { type: 'string', description: 'Category title' },
            Description: { type: 'string', description: 'Category description' },
            IsActive: { type: 'boolean', description: 'Category active status', default: true },
          },
          required: ['Name'],
        },
      },
      {
        name: 'vtex_get_category',
        description: 'Get category details by ID',
        inputSchema: {
          type: 'object',
          properties: {
            categoryId: { type: 'string', description: 'Category ID' },
          },
          required: ['categoryId'],
        },
      },
      {
        name: 'vtex_update_category',
        description: 'Update an existing category',
        inputSchema: {
          type: 'object',
          properties: {
            categoryId: { type: 'string', description: 'Category ID' },
            Name: { type: 'string', description: 'Category name' },
            Description: { type: 'string', description: 'Category description' },
            IsActive: { type: 'boolean', description: 'Category active status' },
          },
          required: ['categoryId'],
        },
      },
      {
        name: 'vtex_delete_category',
        description: 'Delete a category',
        inputSchema: {
          type: 'object',
          properties: {
            categoryId: { type: 'string', description: 'Category ID to delete' },
          },
          required: ['categoryId'],
        },
      },
      {
        name: 'vtex_list_categories',
        description: 'List all categories in a tree structure',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },

      // ========== CATALOG - BRANDS ==========
      {
        name: 'vtex_create_brand',
        description: 'Create a new brand',
        inputSchema: {
          type: 'object',
          properties: {
            Name: { type: 'string', description: 'Brand name' },
            Text: { type: 'string', description: 'Brand description' },
            Keywords: { type: 'string', description: 'Brand keywords' },
            Active: { type: 'boolean', description: 'Brand active status', default: true },
          },
          required: ['Name'],
        },
      },
      {
        name: 'vtex_get_brand',
        description: 'Get brand details by ID',
        inputSchema: {
          type: 'object',
          properties: {
            brandId: { type: 'string', description: 'Brand ID' },
          },
          required: ['brandId'],
        },
      },
      {
        name: 'vtex_update_brand',
        description: 'Update an existing brand',
        inputSchema: {
          type: 'object',
          properties: {
            brandId: { type: 'string', description: 'Brand ID' },
            Name: { type: 'string', description: 'Brand name' },
            Text: { type: 'string', description: 'Brand description' },
            Active: { type: 'boolean', description: 'Brand active status' },
          },
          required: ['brandId'],
        },
      },
      {
        name: 'vtex_delete_brand',
        description: 'Delete a brand',
        inputSchema: {
          type: 'object',
          properties: {
            brandId: { type: 'string', description: 'Brand ID to delete' },
          },
          required: ['brandId'],
        },
      },
      {
        name: 'vtex_list_brands',
        description: 'List all brands',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },

      // ========== PRICING API ==========
      {
        name: 'vtex_get_price',
        description: 'Get price information for a SKU',
        inputSchema: {
          type: 'object',
          properties: {
            skuId: { type: 'string', description: 'SKU ID' },
          },
          required: ['skuId'],
        },
      },
      {
        name: 'vtex_create_or_update_price',
        description: 'Create or update price for a SKU',
        inputSchema: {
          type: 'object',
          properties: {
            skuId: { type: 'string', description: 'SKU ID (itemId)' },
            basePrice: { type: 'number', description: 'Base price' },
            listPrice: { type: 'number', description: 'List price (before discount)' },
            costPrice: { type: 'number', description: 'Cost price' },
            markup: { type: 'number', description: 'Markup percentage' },
          },
          required: ['skuId', 'basePrice'],
        },
      },
      {
        name: 'vtex_delete_price',
        description: 'Delete price for a SKU',
        inputSchema: {
          type: 'object',
          properties: {
            skuId: { type: 'string', description: 'SKU ID' },
          },
          required: ['skuId'],
        },
      },
      {
        name: 'vtex_list_prices',
        description: 'List all prices with pagination',
        inputSchema: {
          type: 'object',
          properties: {
            page: { type: 'number', description: 'Page number', default: 1 },
            pageSize: { type: 'number', description: 'Items per page', default: 100 },
          },
        },
      },
      {
        name: 'vtex_get_computed_price',
        description: 'Get computed price for a SKU (includes promotions and taxes)',
        inputSchema: {
          type: 'object',
          properties: {
            skuId: { type: 'string', description: 'SKU ID' },
            tradePolicy: { type: 'string', description: 'Trade policy (sales channel)' },
            regionId: { type: 'string', description: 'Region ID for regional pricing' },
          },
          required: ['skuId'],
        },
      },

      // ========== INVENTORY API ==========
      {
        name: 'vtex_get_inventory',
        description: 'Get inventory information for a SKU',
        inputSchema: {
          type: 'object',
          properties: {
            skuId: { type: 'string', description: 'SKU ID' },
          },
          required: ['skuId'],
        },
      },
      {
        name: 'vtex_update_inventory',
        description: 'Update inventory quantity for a SKU in a warehouse',
        inputSchema: {
          type: 'object',
          properties: {
            skuId: { type: 'string', description: 'SKU ID' },
            warehouseId: { type: 'string', description: 'Warehouse ID' },
            quantity: { type: 'number', description: 'Quantity to set' },
            unlimitedQuantity: { type: 'boolean', description: 'Set unlimited quantity', default: false },
          },
          required: ['skuId', 'warehouseId', 'quantity'],
        },
      },
      {
        name: 'vtex_list_inventory_by_warehouse',
        description: 'List all inventory items in a warehouse',
        inputSchema: {
          type: 'object',
          properties: {
            warehouseId: { type: 'string', description: 'Warehouse ID' },
            page: { type: 'number', description: 'Page number', default: 1 },
          },
          required: ['warehouseId'],
        },
      },

      // ========== LOGISTICS - WAREHOUSES ==========
      {
        name: 'vtex_create_warehouse',
        description: 'Create a new warehouse',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Warehouse name' },
            warehouseDocks: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  dockId: { type: 'string' },
                  name: { type: 'string' },
                  time: { type: 'string' },
                  cost: { type: 'number' },
                },
              },
              description: 'Associated docks',
            },
          },
          required: ['name'],
        },
      },
      {
        name: 'vtex_get_warehouse',
        description: 'Get warehouse details by ID',
        inputSchema: {
          type: 'object',
          properties: {
            warehouseId: { type: 'string', description: 'Warehouse ID' },
          },
          required: ['warehouseId'],
        },
      },
      {
        name: 'vtex_list_warehouses',
        description: 'List all warehouses',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'vtex_update_warehouse',
        description: 'Update an existing warehouse',
        inputSchema: {
          type: 'object',
          properties: {
            warehouseId: { type: 'string', description: 'Warehouse ID' },
            name: { type: 'string', description: 'Warehouse name' },
          },
          required: ['warehouseId'],
        },
      },
      {
        name: 'vtex_delete_warehouse',
        description: 'Delete a warehouse',
        inputSchema: {
          type: 'object',
          properties: {
            warehouseId: { type: 'string', description: 'Warehouse ID to delete' },
          },
          required: ['warehouseId'],
        },
      },

      // ========== LOGISTICS - DOCKS ==========
      {
        name: 'vtex_create_dock',
        description: 'Create a new dock (loading dock)',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Dock name' },
            priority: { type: 'number', description: 'Dock priority' },
            dockTimeCost: { type: 'string', description: 'Time cost (format: 00:00:00)' },
          },
          required: ['name'],
        },
      },
      {
        name: 'vtex_get_dock',
        description: 'Get dock details by ID',
        inputSchema: {
          type: 'object',
          properties: {
            dockId: { type: 'string', description: 'Dock ID' },
          },
          required: ['dockId'],
        },
      },
      {
        name: 'vtex_list_docks',
        description: 'List all docks',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'vtex_update_dock',
        description: 'Update an existing dock',
        inputSchema: {
          type: 'object',
          properties: {
            dockId: { type: 'string', description: 'Dock ID' },
            name: { type: 'string', description: 'Dock name' },
            priority: { type: 'number', description: 'Dock priority' },
          },
          required: ['dockId'],
        },
      },
      {
        name: 'vtex_delete_dock',
        description: 'Delete a dock',
        inputSchema: {
          type: 'object',
          properties: {
            dockId: { type: 'string', description: 'Dock ID to delete' },
          },
          required: ['dockId'],
        },
      },

      // ========== PROMOTIONS API ==========
      {
        name: 'vtex_create_promotion',
        description: 'Create a new promotion',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Promotion name' },
            beginDateUtc: { type: 'string', description: 'Start date (ISO 8601)' },
            endDateUtc: { type: 'string', description: 'End date (ISO 8601)' },
            description: { type: 'string', description: 'Promotion description' },
            isActive: { type: 'boolean', description: 'Promotion active status', default: true },
            type: {
              type: 'string',
              enum: ['regular', 'combo', 'progressive', 'buyAndWin'],
              description: 'Promotion type',
            },
            percentualDiscountValue: { type: 'number', description: 'Percentage discount' },
            nominalDiscountValue: { type: 'number', description: 'Fixed amount discount' },
          },
          required: ['name', 'beginDateUtc', 'endDateUtc'],
        },
      },
      {
        name: 'vtex_get_promotion',
        description: 'Get promotion details by ID',
        inputSchema: {
          type: 'object',
          properties: {
            promotionId: { type: 'string', description: 'Promotion ID' },
          },
          required: ['promotionId'],
        },
      },
      {
        name: 'vtex_list_promotions',
        description: 'List all promotions',
        inputSchema: {
          type: 'object',
          properties: {
            archived: { type: 'boolean', description: 'Include archived promotions', default: false },
          },
        },
      },
      {
        name: 'vtex_update_promotion',
        description: 'Update an existing promotion',
        inputSchema: {
          type: 'object',
          properties: {
            promotionId: { type: 'string', description: 'Promotion ID' },
            name: { type: 'string', description: 'Promotion name' },
            isActive: { type: 'boolean', description: 'Promotion active status' },
            description: { type: 'string', description: 'Promotion description' },
          },
          required: ['promotionId'],
        },
      },
      {
        name: 'vtex_archive_promotion',
        description: 'Archive a promotion',
        inputSchema: {
          type: 'object',
          properties: {
            promotionId: { type: 'string', description: 'Promotion ID to archive' },
          },
          required: ['promotionId'],
        },
      },
      {
        name: 'vtex_unarchive_promotion',
        description: 'Unarchive a promotion',
        inputSchema: {
          type: 'object',
          properties: {
            promotionId: { type: 'string', description: 'Promotion ID to unarchive' },
          },
          required: ['promotionId'],
        },
      },

      // ========== COUPONS API ==========
      {
        name: 'vtex_create_coupon',
        description: 'Create a new coupon',
        inputSchema: {
          type: 'object',
          properties: {
            couponCode: { type: 'string', description: 'Coupon code' },
            maxItemsPerClient: { type: 'number', description: 'Max uses per customer' },
          },
          required: ['couponCode'],
        },
      },
      {
        name: 'vtex_get_coupon',
        description: 'Get coupon details by code',
        inputSchema: {
          type: 'object',
          properties: {
            couponCode: { type: 'string', description: 'Coupon code' },
          },
          required: ['couponCode'],
        },
      },
      {
        name: 'vtex_list_coupons',
        description: 'List all coupons',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'vtex_archive_coupon',
        description: 'Archive a coupon',
        inputSchema: {
          type: 'object',
          properties: {
            couponCode: { type: 'string', description: 'Coupon code to archive' },
          },
          required: ['couponCode'],
        },
      },

      // ========== ORDERS API ==========
      {
        name: 'vtex_get_order',
        description: 'Get order details by ID',
        inputSchema: {
          type: 'object',
          properties: {
            orderId: { type: 'string', description: 'Order ID' },
          },
          required: ['orderId'],
        },
      },
      {
        name: 'vtex_list_orders',
        description: 'List orders with filters',
        inputSchema: {
          type: 'object',
          properties: {
            f_creationDate: {
              type: 'string',
              description: 'Filter by creation date (format: creationDate:[2019-01-01T00:00:00.000Z TO 2019-01-31T23:59:59.999Z])',
            },
            f_status: { type: 'string', description: 'Filter by status' },
            page: { type: 'number', description: 'Page number', default: 1 },
            per_page: { type: 'number', description: 'Items per page', default: 15 },
          },
        },
      },
      {
        name: 'vtex_start_handling',
        description: 'Start handling an order (change status to handling)',
        inputSchema: {
          type: 'object',
          properties: {
            orderId: { type: 'string', description: 'Order ID' },
          },
          required: ['orderId'],
        },
      },
      {
        name: 'vtex_cancel_order',
        description: 'Cancel an order',
        inputSchema: {
          type: 'object',
          properties: {
            orderId: { type: 'string', description: 'Order ID' },
            reason: { type: 'string', description: 'Cancellation reason' },
          },
          required: ['orderId'],
        },
      },
      {
        name: 'vtex_invoice_order',
        description: 'Add invoice to an order',
        inputSchema: {
          type: 'object',
          properties: {
            orderId: { type: 'string', description: 'Order ID' },
            invoiceNumber: { type: 'string', description: 'Invoice number' },
            invoiceValue: { type: 'number', description: 'Invoice value' },
            invoiceUrl: { type: 'string', description: 'Invoice URL' },
            trackingNumber: { type: 'string', description: 'Tracking number' },
            trackingUrl: { type: 'string', description: 'Tracking URL' },
          },
          required: ['orderId', 'invoiceNumber', 'invoiceValue'],
        },
      },

      // ========== MARKETPLACE API ==========
      {
        name: 'vtex_get_seller_commissions',
        description: 'Get all seller commissions',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'vtex_update_seller_commission',
        description: 'Update seller commission configuration',
        inputSchema: {
          type: 'object',
          properties: {
            categoryId: { type: 'string', description: 'Category ID' },
            productId: { type: 'string', description: 'Product ID' },
            skuId: { type: 'string', description: 'SKU ID' },
            freightCommissionPercentage: { type: 'number', description: 'Freight commission %' },
            productCommissionPercentage: { type: 'number', description: 'Product commission %' },
          },
        },
      },
      {
        name: 'vtex_get_sku_approval_status',
        description: 'Get SKU approval status from a seller',
        inputSchema: {
          type: 'object',
          properties: {
            sellerId: { type: 'string', description: 'Seller ID' },
            sellerSkuId: { type: 'string', description: 'Seller SKU ID' },
          },
          required: ['sellerId', 'sellerSkuId'],
        },
      },
      {
        name: 'vtex_approve_sku',
        description: 'Approve a seller SKU',
        inputSchema: {
          type: 'object',
          properties: {
            sellerId: { type: 'string', description: 'Seller ID' },
            sellerSkuId: { type: 'string', description: 'Seller SKU ID' },
          },
          required: ['sellerId', 'sellerSkuId'],
        },
      },
      {
        name: 'vtex_deny_sku',
        description: 'Deny a seller SKU',
        inputSchema: {
          type: 'object',
          properties: {
            sellerId: { type: 'string', description: 'Seller ID' },
            sellerSkuId: { type: 'string', description: 'Seller SKU ID' },
            reason: { type: 'string', description: 'Denial reason' },
          },
          required: ['sellerId', 'sellerSkuId'],
        },
      },
      {
        name: 'vtex_invite_seller',
        description: 'Invite a new seller to the marketplace',
        inputSchema: {
          type: 'object',
          properties: {
            sellerName: { type: 'string', description: 'Seller name' },
            sellerEmail: { type: 'string', description: 'Seller email' },
            salesChannel: { type: 'string', description: 'Sales channel' },
          },
          required: ['sellerName', 'sellerEmail'],
        },
      },
      {
        name: 'vtex_list_sellers',
        description: 'List all sellers in the marketplace',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },

      // ========== CHECKOUT API ==========
      {
        name: 'vtex_get_orderform',
        description: 'Get order form (cart) details by ID',
        inputSchema: {
          type: 'object',
          properties: {
            orderFormId: { type: 'string', description: 'Order Form ID' },
          },
          required: ['orderFormId'],
        },
      },
      {
        name: 'vtex_simulate_shipping',
        description: 'Simulate shipping options for items',
        inputSchema: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  quantity: { type: 'number' },
                  seller: { type: 'string' },
                },
              },
              description: 'Items to simulate',
            },
            postalCode: { type: 'string', description: 'Postal code for delivery' },
            country: { type: 'string', description: 'Country code (e.g., BRA, USA)' },
          },
          required: ['items', 'country'],
        },
      },
      {
        name: 'vtex_add_item_to_cart',
        description: 'Add items to cart (order form)',
        inputSchema: {
          type: 'object',
          properties: {
            orderFormId: { type: 'string', description: 'Order Form ID' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', description: 'SKU ID' },
                  quantity: { type: 'number', description: 'Quantity' },
                  seller: { type: 'string', description: 'Seller ID' },
                },
              },
            },
          },
          required: ['orderFormId', 'items'],
        },
      },
      {
        name: 'vtex_remove_item_from_cart',
        description: 'Remove an item from cart',
        inputSchema: {
          type: 'object',
          properties: {
            orderFormId: { type: 'string', description: 'Order Form ID' },
            itemIndex: { type: 'number', description: 'Item index in cart' },
          },
          required: ['orderFormId', 'itemIndex'],
        },
      },
      {
        name: 'vtex_update_item_quantity',
        description: 'Update item quantity in cart',
        inputSchema: {
          type: 'object',
          properties: {
            orderFormId: { type: 'string', description: 'Order Form ID' },
            itemIndex: { type: 'number', description: 'Item index in cart' },
            quantity: { type: 'number', description: 'New quantity' },
          },
          required: ['orderFormId', 'itemIndex', 'quantity'],
        },
      },
      {
        name: 'vtex_add_coupon_to_cart',
        description: 'Add a coupon code to cart',
        inputSchema: {
          type: 'object',
          properties: {
            orderFormId: { type: 'string', description: 'Order Form ID' },
            couponCode: { type: 'string', description: 'Coupon code' },
          },
          required: ['orderFormId', 'couponCode'],
        },
      },
      {
        name: 'vtex_clear_cart',
        description: 'Clear all items from cart',
        inputSchema: {
          type: 'object',
          properties: {
            orderFormId: { type: 'string', description: 'Order Form ID' },
          },
          required: ['orderFormId'],
        },
      },

      // ========== MASTER DATA API ==========
      {
        name: 'vtex_create_document',
        description: 'Create a document in Master Data entity',
        inputSchema: {
          type: 'object',
          properties: {
            entity: { type: 'string', description: 'Entity acronym (e.g., CL for clients)' },
            document: { type: 'object', description: 'Document data' },
          },
          required: ['entity', 'document'],
        },
      },
      {
        name: 'vtex_get_document',
        description: 'Get a document from Master Data',
        inputSchema: {
          type: 'object',
          properties: {
            entity: { type: 'string', description: 'Entity acronym' },
            documentId: { type: 'string', description: 'Document ID' },
            fields: {
              type: 'array',
              items: { type: 'string' },
              description: 'Fields to retrieve',
            },
          },
          required: ['entity', 'documentId'],
        },
      },
      {
        name: 'vtex_update_document',
        description: 'Update a Master Data document',
        inputSchema: {
          type: 'object',
          properties: {
            entity: { type: 'string', description: 'Entity acronym' },
            documentId: { type: 'string', description: 'Document ID' },
            document: { type: 'object', description: 'Updated data' },
          },
          required: ['entity', 'documentId', 'document'],
        },
      },
      {
        name: 'vtex_delete_document',
        description: 'Delete a Master Data document',
        inputSchema: {
          type: 'object',
          properties: {
            entity: { type: 'string', description: 'Entity acronym' },
            documentId: { type: 'string', description: 'Document ID' },
          },
          required: ['entity', 'documentId'],
        },
      },
      {
        name: 'vtex_search_documents',
        description: 'Search documents in Master Data',
        inputSchema: {
          type: 'object',
          properties: {
            entity: { type: 'string', description: 'Entity acronym' },
            fields: {
              type: 'array',
              items: { type: 'string' },
              description: 'Fields to return',
            },
            where: { type: 'string', description: 'Filter condition (e.g., email=test@example.com)' },
            size: { type: 'number', description: 'Number of results', default: 10 },
            page: { type: 'number', description: 'Page number', default: 1 },
            sort: { type: 'string', description: 'Sort field' },
          },
          required: ['entity'],
        },
      },
      {
        name: 'vtex_get_client_by_email',
        description: 'Get client data by email',
        inputSchema: {
          type: 'object',
          properties: {
            email: { type: 'string', description: 'Client email' },
          },
          required: ['email'],
        },
      },

      // ========== SEARCH API ==========
      {
        name: 'vtex_search_products',
        description: 'Search products in catalog',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search query' },
            category: { type: 'string', description: 'Category name or path' },
            brand: { type: 'string', description: 'Brand name' },
            orderBy: {
              type: 'string',
              enum: ['OrderByTopSaleDESC', 'OrderByReleaseDateDESC', 'OrderByBestDiscountDESC', 'OrderByPriceDESC', 'OrderByPriceASC', 'OrderByNameASC', 'OrderByNameDESC', 'OrderByScoreDESC'],
              description: 'Sort order',
            },
            from: { type: 'number', description: 'Starting index', default: 0 },
            to: { type: 'number', description: 'Ending index', default: 9 },
            map: { type: 'string', description: 'Query mapping' },
            fq: { type: 'string', description: 'Filter query' },
          },
        },
      },
      {
        name: 'vtex_get_product_by_identifier',
        description: 'Get product by ID, EAN, Reference ID, or SKU',
        inputSchema: {
          type: 'object',
          properties: {
            field: {
              type: 'string',
              enum: ['id', 'ean', 'reference', 'sku'],
              description: 'Field type to search',
            },
            value: { type: 'string', description: 'Value to search' },
          },
          required: ['field', 'value'],
        },
      },
      {
        name: 'vtex_get_product_and_sku_ids',
        description: 'Get all product and SKU IDs (useful for indexing)',
        inputSchema: {
          type: 'object',
          properties: {
            categoryId: { type: 'string', description: 'Filter by category' },
            brandId: { type: 'string', description: 'Filter by brand' },
          },
        },
      },
      {
        name: 'vtex_get_facets',
        description: 'Get facets and filters for search',
        inputSchema: {
          type: 'object',
          properties: {
            categoryId: { type: 'string', description: 'Category ID for facets' },
          },
        },
      },
      {
        name: 'vtex_autocomplete',
        description: 'Get autocomplete suggestions for search',
        inputSchema: {
          type: 'object',
          properties: {
            searchTerm: { type: 'string', description: 'Search term for autocomplete' },
          },
          required: ['searchTerm'],
        },
      },

      // ========== REVIEWS AND RATINGS API ==========
      {
        name: 'vtex_create_review',
        description: 'Create a product review',
        inputSchema: {
          type: 'object',
          properties: {
            productId: { type: 'string', description: 'Product ID' },
            rating: { type: 'number', description: 'Rating (1-5)', minimum: 1, maximum: 5 },
            title: { type: 'string', description: 'Review title' },
            text: { type: 'string', description: 'Review text' },
            reviewerName: { type: 'string', description: 'Reviewer name' },
            shopperId: { type: 'string', description: 'Shopper ID (optional)' },
          },
          required: ['productId', 'rating', 'text'],
        },
      },
      {
        name: 'vtex_get_review',
        description: 'Get a review by ID',
        inputSchema: {
          type: 'object',
          properties: {
            reviewId: { type: 'string', description: 'Review ID' },
          },
          required: ['reviewId'],
        },
      },
      {
        name: 'vtex_list_reviews',
        description: 'List product reviews with filters',
        inputSchema: {
          type: 'object',
          properties: {
            productId: { type: 'string', description: 'Filter by product ID' },
            approved: { type: 'boolean', description: 'Filter by approval status' },
            orderBy: {
              type: 'string',
              enum: ['reviewDateTime:desc', 'reviewDateTime:asc', 'rating:desc', 'rating:asc'],
              description: 'Sort order',
            },
            page: { type: 'number', description: 'Page number', default: 1 },
            pageSize: { type: 'number', description: 'Items per page', default: 10 },
          },
        },
      },
      {
        name: 'vtex_update_review',
        description: 'Update a review',
        inputSchema: {
          type: 'object',
          properties: {
            reviewId: { type: 'string', description: 'Review ID' },
            updates: { type: 'object', description: 'Fields to update' },
          },
          required: ['reviewId', 'updates'],
        },
      },
      {
        name: 'vtex_delete_review',
        description: 'Delete a review',
        inputSchema: {
          type: 'object',
          properties: {
            reviewId: { type: 'string', description: 'Review ID to delete' },
          },
          required: ['reviewId'],
        },
      },
      {
        name: 'vtex_approve_review',
        description: 'Approve a review for display',
        inputSchema: {
          type: 'object',
          properties: {
            reviewId: { type: 'string', description: 'Review ID to approve' },
          },
          required: ['reviewId'],
        },
      },
      {
        name: 'vtex_get_review_summary',
        description: 'Get review summary and rating statistics for a product',
        inputSchema: {
          type: 'object',
          properties: {
            productId: { type: 'string', description: 'Product ID' },
          },
          required: ['productId'],
        },
      },

      // ========== PAYMENT GATEWAY API ==========
      {
        name: 'vtex_list_payment_providers',
        description: 'List all payment providers/gateways',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'vtex_get_payment_provider',
        description: 'Get payment provider configuration',
        inputSchema: {
          type: 'object',
          properties: {
            providerId: { type: 'string', description: 'Provider ID' },
          },
          required: ['providerId'],
        },
      },
      {
        name: 'vtex_create_payment_provider',
        description: 'Create a payment provider configuration',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Provider name' },
            connector: { type: 'string', description: 'Connector name' },
            configuration: { type: 'object', description: 'Provider configuration' },
          },
          required: ['name', 'connector', 'configuration'],
        },
      },
      {
        name: 'vtex_update_payment_provider',
        description: 'Update payment provider configuration',
        inputSchema: {
          type: 'object',
          properties: {
            providerId: { type: 'string', description: 'Provider ID' },
            provider: { type: 'object', description: 'Updated configuration' },
          },
          required: ['providerId', 'provider'],
        },
      },
      {
        name: 'vtex_delete_payment_provider',
        description: 'Delete a payment provider',
        inputSchema: {
          type: 'object',
          properties: {
            providerId: { type: 'string', description: 'Provider ID to delete' },
          },
          required: ['providerId'],
        },
      },
      {
        name: 'vtex_list_payment_methods',
        description: 'List all available payment methods',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'vtex_get_transaction',
        description: 'Get transaction details',
        inputSchema: {
          type: 'object',
          properties: {
            transactionId: { type: 'string', description: 'Transaction ID' },
          },
          required: ['transactionId'],
        },
      },

      // ========== SESSION MANAGER API ==========
      {
        name: 'vtex_get_session',
        description: 'Get session data for segmentation',
        inputSchema: {
          type: 'object',
          properties: {
            sessionToken: { type: 'string', description: 'Session token (optional)' },
          },
        },
      },
      {
        name: 'vtex_update_session',
        description: 'Update session data',
        inputSchema: {
          type: 'object',
          properties: {
            sessionToken: { type: 'string', description: 'Session token' },
            sessionData: { type: 'object', description: 'Session data to update' },
          },
          required: ['sessionToken', 'sessionData'],
        },
      },
      {
        name: 'vtex_get_segment',
        description: 'Get segment data (campaigns, UTM, location)',
        inputSchema: {
          type: 'object',
          properties: {
            sessionToken: { type: 'string', description: 'Session token (optional)' },
          },
        },
      },

      // ========== GIFT CARD API ==========
      {
        name: 'vtex_create_gift_card',
        description: 'Create a new gift card',
        inputSchema: {
          type: 'object',
          properties: {
            balance: { type: 'number', description: 'Gift card balance' },
            caption: { type: 'string', description: 'Gift card caption/description' },
            expiringDate: { type: 'string', description: 'Expiration date (ISO 8601)' },
            relationName: { type: 'string', description: 'Relation name' },
            profileId: { type: 'string', description: 'Profile ID' },
            restrictedToOwner: { type: 'boolean', description: 'Restrict to owner only' },
          },
          required: ['balance'],
        },
      },
      {
        name: 'vtex_get_gift_card',
        description: 'Get gift card by ID',
        inputSchema: {
          type: 'object',
          properties: {
            giftCardId: { type: 'string', description: 'Gift Card ID' },
          },
          required: ['giftCardId'],
        },
      },
      {
        name: 'vtex_list_gift_cards',
        description: 'List all gift cards',
        inputSchema: {
          type: 'object',
          properties: {
            page: { type: 'number', description: 'Page number', default: 1 },
            perPage: { type: 'number', description: 'Items per page', default: 30 },
          },
        },
      },
      {
        name: 'vtex_get_gift_card_by_code',
        description: 'Search gift card by redemption code',
        inputSchema: {
          type: 'object',
          properties: {
            redemptionCode: { type: 'string', description: 'Redemption code' },
          },
          required: ['redemptionCode'],
        },
      },
      {
        name: 'vtex_create_gift_card_transaction',
        description: 'Add transaction to gift card (credit or debit)',
        inputSchema: {
          type: 'object',
          properties: {
            giftCardId: { type: 'string', description: 'Gift Card ID' },
            value: { type: 'number', description: 'Transaction value' },
            operation: { type: 'string', enum: ['Credit', 'Debit'], description: 'Operation type' },
            description: { type: 'string', description: 'Transaction description' },
          },
          required: ['giftCardId', 'value', 'operation'],
        },
      },
      {
        name: 'vtex_list_gift_card_providers',
        description: 'List gift card providers',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },

      // ========== SUBSCRIPTIONS API ==========
      {
        name: 'vtex_create_subscription',
        description: 'Create a new subscription',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Subscription name' },
            skuId: { type: 'string', description: 'SKU ID' },
            subscriberId: { type: 'string', description: 'Subscriber ID' },
            frequency: {
              type: 'object',
              properties: {
                periodicity: { type: 'string', enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'] },
                interval: { type: 'number' },
              },
              description: 'Frequency configuration',
            },
          },
          required: ['name', 'skuId', 'subscriberId', 'frequency'],
        },
      },
      {
        name: 'vtex_get_subscription',
        description: 'Get subscription details',
        inputSchema: {
          type: 'object',
          properties: {
            subscriptionId: { type: 'string', description: 'Subscription ID' },
          },
          required: ['subscriptionId'],
        },
      },
      {
        name: 'vtex_list_subscriptions',
        description: 'List subscriptions with filters',
        inputSchema: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['ACTIVE', 'PAUSED', 'CANCELED'],
              description: 'Filter by status',
            },
            subscriberId: { type: 'string', description: 'Filter by subscriber' },
            page: { type: 'number', description: 'Page number' },
            perPage: { type: 'number', description: 'Items per page' },
          },
        },
      },
      {
        name: 'vtex_update_subscription',
        description: 'Update subscription details',
        inputSchema: {
          type: 'object',
          properties: {
            subscriptionId: { type: 'string', description: 'Subscription ID' },
            updates: { type: 'object', description: 'Fields to update' },
          },
          required: ['subscriptionId', 'updates'],
        },
      },
      {
        name: 'vtex_pause_subscription',
        description: 'Pause a subscription',
        inputSchema: {
          type: 'object',
          properties: {
            subscriptionId: { type: 'string', description: 'Subscription ID to pause' },
          },
          required: ['subscriptionId'],
        },
      },
      {
        name: 'vtex_cancel_subscription',
        description: 'Cancel a subscription',
        inputSchema: {
          type: 'object',
          properties: {
            subscriptionId: { type: 'string', description: 'Subscription ID to cancel' },
          },
          required: ['subscriptionId'],
        },
      },

      // ========== CMS API ==========
      {
        name: 'vtex_list_cms_templates',
        description: 'List all CMS templates',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'vtex_get_cms_template',
        description: 'Get CMS template by ID',
        inputSchema: {
          type: 'object',
          properties: {
            templateId: { type: 'string', description: 'Template ID' },
          },
          required: ['templateId'],
        },
      },
      {
        name: 'vtex_create_cms_template',
        description: 'Create a CMS template',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Template name' },
            html: { type: 'string', description: 'Template HTML content' },
            templateType: { type: 'string', enum: ['html', 'subtemplate'], description: 'Template type' },
          },
          required: ['name'],
        },
      },
      {
        name: 'vtex_delete_cms_template',
        description: 'Delete a CMS template',
        inputSchema: {
          type: 'object',
          properties: {
            templateId: { type: 'string', description: 'Template ID to delete' },
          },
          required: ['templateId'],
        },
      },

      // ========== MESSAGE CENTER API ==========
      {
        name: 'vtex_list_email_templates',
        description: 'List all email templates',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'vtex_get_email_template',
        description: 'Get email template by ID',
        inputSchema: {
          type: 'object',
          properties: {
            templateId: { type: 'string', description: 'Template ID' },
          },
          required: ['templateId'],
        },
      },
      {
        name: 'vtex_create_email_template',
        description: 'Create an email template',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Template name' },
            friendlyName: { type: 'string', description: 'Friendly name' },
            subject: { type: 'string', description: 'Email subject' },
            message: { type: 'string', description: 'Email message (HTML)' },
          },
          required: ['name'],
        },
      },
      {
        name: 'vtex_update_email_template',
        description: 'Update an email template',
        inputSchema: {
          type: 'object',
          properties: {
            templateId: { type: 'string', description: 'Template ID' },
            template: { type: 'object', description: 'Updated template data' },
          },
          required: ['templateId', 'template'],
        },
      },
      {
        name: 'vtex_send_email',
        description: 'Send an email using template',
        inputSchema: {
          type: 'object',
          properties: {
            templateName: { type: 'string', description: 'Template name' },
            jsonData: { type: 'object', description: 'Data for template variables' },
            providerName: { type: 'string', description: 'Email provider name' },
          },
          required: ['templateName', 'jsonData'],
        },
      },

      // ========== VTEX ID API ==========
      {
        name: 'vtex_authenticate_user',
        description: 'Authenticate user with credentials',
        inputSchema: {
          type: 'object',
          properties: {
            user: { type: 'string', description: 'Username or email' },
            password: { type: 'string', description: 'Password' },
          },
          required: ['user', 'password'],
        },
      },
      {
        name: 'vtex_get_user_profile',
        description: 'Get user profile by user ID',
        inputSchema: {
          type: 'object',
          properties: {
            userId: { type: 'string', description: 'User ID' },
          },
          required: ['userId'],
        },
      },
      {
        name: 'vtex_validate_token',
        description: 'Validate authentication token',
        inputSchema: {
          type: 'object',
          properties: {
            token: { type: 'string', description: 'Authentication token' },
          },
          required: ['token'],
        },
      },
      {
        name: 'vtex_create_app_token',
        description: 'Create a new app token',
        inputSchema: {
          type: 'object',
          properties: {
            label: { type: 'string', description: 'Token label/description' },
          },
          required: ['label'],
        },
      },
      {
        name: 'vtex_list_app_tokens',
        description: 'List all app tokens',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ];
  
  // Filter tools based on profile
  const filteredTools = allTools.filter(tool => shouldIncludeTool(tool.name));
  
  return {
    tools: filteredTools,
  };
});

// ========== CALL TOOL HANDLER ==========

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    // ========== CATALOG - PRODUCTS ==========
    if (name === 'vtex_create_product') {
      const result = await vtexClient.createProduct(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_get_product') {
      const result = await vtexClient.getProduct((args as any).productId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_update_product') {
      const { productId, ...updates } = args as any;
      const result = await vtexClient.updateProduct(productId, updates);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_delete_product') {
      const result = await vtexClient.deleteProduct((args as any).productId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_list_products') {
      const result = await vtexClient.listProducts(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    // ========== CATALOG - SKUS ==========
    if (name === 'vtex_create_sku') {
      const result = await vtexClient.createSKU(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_get_sku') {
      const result = await vtexClient.getSKU((args as any).skuId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_get_sku_by_refid') {
      const result = await vtexClient.getSKUByRefId((args as any).refId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_update_sku') {
      const { skuId, ...updates } = args as any;
      const result = await vtexClient.updateSKU(skuId, updates);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_list_skus') {
      const result = await vtexClient.listSKUs((args as any).productId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    // ========== CATALOG - SPECIFICATIONS ==========
    if (name === 'vtex_create_specification') {
      const result = await vtexClient.createSpecification(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_get_sku_specifications') {
      const result = await vtexClient.getSKUSpecifications((args as any).skuId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_assign_sku_specification_value') {
      const result = await vtexClient.assignSKUSpecificationValue(
        (args as any).skuId,
        (args as any).specifications
      );
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_list_category_specifications') {
      const result = await vtexClient.listCategorySpecifications((args as any).categoryId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_create_specification_field') {
      const result = await vtexClient.createSpecificationField(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_create_specification_group') {
      const result = await vtexClient.createSpecificationGroup(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_list_specification_groups') {
      const result = await vtexClient.listSpecificationGroups((args as any).categoryId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_get_specification_field') {
      const result = await vtexClient.getSpecificationField((args as any).fieldId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_create_specification_field_value') {
      const { fieldId, ...value } = args as any;
      const result = await vtexClient.createSpecificationFieldValue(fieldId, value);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_list_specification_field_values') {
      const result = await vtexClient.listSpecificationFieldValues((args as any).fieldId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    // ========== CATALOG - CATEGORIES ==========
    if (name === 'vtex_create_category') {
      const result = await vtexClient.createCategory(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_get_category') {
      const result = await vtexClient.getCategory((args as any).categoryId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_update_category') {
      const { categoryId, ...updates } = args as any;
      const result = await vtexClient.updateCategory(categoryId, updates);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_delete_category') {
      const result = await vtexClient.deleteCategory((args as any).categoryId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_list_categories') {
      const result = await vtexClient.listCategories();
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    // ========== CATALOG - BRANDS ==========
    if (name === 'vtex_create_brand') {
      const result = await vtexClient.createBrand(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_get_brand') {
      const result = await vtexClient.getBrand((args as any).brandId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_update_brand') {
      const { brandId, ...updates } = args as any;
      const result = await vtexClient.updateBrand(brandId, updates);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_delete_brand') {
      const result = await vtexClient.deleteBrand((args as any).brandId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_list_brands') {
      const result = await vtexClient.listBrands();
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    // ========== PRICING API ==========
    if (name === 'vtex_get_price') {
      const result = await vtexClient.getPrice((args as any).skuId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_create_or_update_price') {
      const { skuId, ...priceData } = args as any;
      const result = await vtexClient.createOrUpdatePrice(skuId, { itemId: skuId, ...priceData });
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_delete_price') {
      const result = await vtexClient.deletePrice((args as any).skuId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_list_prices') {
      const result = await vtexClient.listPrices((args as any).page, (args as any).pageSize);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_get_computed_price') {
      const result = await vtexClient.getComputedPrice(
        (args as any).skuId,
        (args as any).tradePolicy,
        (args as any).regionId
      );
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    // ========== INVENTORY API ==========
    if (name === 'vtex_get_inventory') {
      const result = await vtexClient.getInventoryBySKU((args as any).skuId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_update_inventory') {
      const { skuId, warehouseId, ...inventory } = args as any;
      const result = await vtexClient.updateInventory(skuId, warehouseId, inventory);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_list_inventory_by_warehouse') {
      const result = await vtexClient.listInventoryByWarehouse(
        (args as any).warehouseId,
        (args as any).page
      );
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    // ========== LOGISTICS - WAREHOUSES ==========
    if (name === 'vtex_create_warehouse') {
      const result = await vtexClient.createWarehouse(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_get_warehouse') {
      const result = await vtexClient.getWarehouse((args as any).warehouseId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_list_warehouses') {
      const result = await vtexClient.listWarehouses();
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_update_warehouse') {
      const { warehouseId, ...updates } = args as any;
      const result = await vtexClient.updateWarehouse(warehouseId, updates);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_delete_warehouse') {
      const result = await vtexClient.deleteWarehouse((args as any).warehouseId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    // ========== LOGISTICS - DOCKS ==========
    if (name === 'vtex_create_dock') {
      const result = await vtexClient.createDock(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_get_dock') {
      const result = await vtexClient.getDock((args as any).dockId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_list_docks') {
      const result = await vtexClient.listDocks();
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_update_dock') {
      const { dockId, ...updates } = args as any;
      const result = await vtexClient.updateDock(dockId, updates);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_delete_dock') {
      const result = await vtexClient.deleteDock((args as any).dockId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    // ========== PROMOTIONS API ==========
    if (name === 'vtex_create_promotion') {
      const result = await vtexClient.createPromotion(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_get_promotion') {
      const result = await vtexClient.getPromotion((args as any).promotionId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_list_promotions') {
      const result = await vtexClient.listPromotions((args as any).archived);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_update_promotion') {
      const { promotionId, ...updates } = args as any;
      const result = await vtexClient.updatePromotion(promotionId, updates);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_archive_promotion') {
      const result = await vtexClient.archivePromotion((args as any).promotionId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_unarchive_promotion') {
      const result = await vtexClient.unarchivePromotion((args as any).promotionId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    // ========== COUPONS API ==========
    if (name === 'vtex_create_coupon') {
      const result = await vtexClient.createCoupon(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_get_coupon') {
      const result = await vtexClient.getCoupon((args as any).couponCode);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_list_coupons') {
      const result = await vtexClient.listCoupons();
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_archive_coupon') {
      const result = await vtexClient.archiveCoupon((args as any).couponCode);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    // ========== ORDERS API ==========
    if (name === 'vtex_get_order') {
      const result = await vtexClient.getOrder((args as any).orderId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_list_orders') {
      const result = await vtexClient.listOrders(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_start_handling') {
      const result = await vtexClient.startHandling((args as any).orderId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_cancel_order') {
      const result = await vtexClient.cancelOrder((args as any).orderId, (args as any).reason);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_invoice_order') {
      const { orderId, ...invoiceData } = args as any;
      const result = await vtexClient.invoiceOrder(orderId, invoiceData);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    // ========== MARKETPLACE API ==========
    if (name === 'vtex_get_seller_commissions') {
      const result = await vtexClient.getSellerCommissions();
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_update_seller_commission') {
      const result = await vtexClient.updateSellerCommission(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_get_sku_approval_status') {
      const result = await vtexClient.getSKUApprovalStatus(
        (args as any).sellerId,
        (args as any).sellerSkuId
      );
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_approve_sku') {
      const result = await vtexClient.approveSKU((args as any).sellerId, (args as any).sellerSkuId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_deny_sku') {
      const result = await vtexClient.denySKU(
        (args as any).sellerId,
        (args as any).sellerSkuId,
        (args as any).reason
      );
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_invite_seller') {
      const result = await vtexClient.inviteSeller(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_list_sellers') {
      const result = await vtexClient.listSellers();
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    // ========== CHECKOUT API HANDLERS ==========
    if (name === 'vtex_get_orderform') {
      const result = await vtexClient.getOrderForm((args as any).orderFormId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_simulate_shipping') {
      const result = await vtexClient.simulateShipping(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_add_item_to_cart') {
      const { orderFormId, items } = args as any;
      const result = await vtexClient.addItemToCart(orderFormId, items);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_remove_item_from_cart') {
      const result = await vtexClient.removeItemFromCart(
        (args as any).orderFormId,
        (args as any).itemIndex
      );
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_update_item_quantity') {
      const result = await vtexClient.updateItemQuantity(
        (args as any).orderFormId,
        (args as any).itemIndex,
        (args as any).quantity
      );
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_add_coupon_to_cart') {
      const result = await vtexClient.addCouponToCart(
        (args as any).orderFormId,
        (args as any).couponCode
      );
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_clear_cart') {
      const result = await vtexClient.clearCart((args as any).orderFormId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    // ========== MASTER DATA API HANDLERS ==========
    if (name === 'vtex_create_document') {
      const result = await vtexClient.createDocument((args as any).entity, (args as any).document);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_get_document') {
      const result = await vtexClient.getDocument(
        (args as any).entity,
        (args as any).documentId,
        (args as any).fields
      );
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_update_document') {
      const result = await vtexClient.updateDocument(
        (args as any).entity,
        (args as any).documentId,
        (args as any).document
      );
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_delete_document') {
      const result = await vtexClient.deleteDocument(
        (args as any).entity,
        (args as any).documentId
      );
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_search_documents') {
      const { entity, ...searchParams } = args as any;
      const result = await vtexClient.searchDocuments(entity, searchParams);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_get_client_by_email') {
      const result = await vtexClient.getClientByEmail((args as any).email);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    // ========== SEARCH API HANDLERS ==========
    if (name === 'vtex_search_products') {
      const result = await vtexClient.searchProducts(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_get_product_by_identifier') {
      const result = await vtexClient.getProductByIdentifier(
        (args as any).field,
        (args as any).value
      );
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_get_product_and_sku_ids') {
      const result = await vtexClient.getProductAndSKUIds(
        (args as any).categoryId,
        (args as any).brandId
      );
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_get_facets') {
      const result = await vtexClient.getFacets((args as any).categoryId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_autocomplete') {
      const result = await vtexClient.autocomplete((args as any).searchTerm);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    // ========== REVIEWS AND RATINGS API HANDLERS ==========
    if (name === 'vtex_create_review') {
      const result = await vtexClient.createReview(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_get_review') {
      const result = await vtexClient.getReview((args as any).reviewId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_list_reviews') {
      const result = await vtexClient.listReviews(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_update_review') {
      const result = await vtexClient.updateReview(
        (args as any).reviewId,
        (args as any).updates
      );
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_delete_review') {
      const result = await vtexClient.deleteReview((args as any).reviewId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_approve_review') {
      const result = await vtexClient.approveReview((args as any).reviewId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_get_review_summary') {
      const result = await vtexClient.getReviewSummary((args as any).productId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    // ========== PAYMENT GATEWAY API HANDLERS ==========
    if (name === 'vtex_list_payment_providers') {
      const result = await vtexClient.listPaymentProviders();
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_get_payment_provider') {
      const result = await vtexClient.getPaymentProvider((args as any).providerId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_create_payment_provider') {
      const result = await vtexClient.createPaymentProvider(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_update_payment_provider') {
      const result = await vtexClient.updatePaymentProvider(
        (args as any).providerId,
        (args as any).provider
      );
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_delete_payment_provider') {
      const result = await vtexClient.deletePaymentProvider((args as any).providerId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_list_payment_methods') {
      const result = await vtexClient.listPaymentMethods();
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_get_transaction') {
      const result = await vtexClient.getTransaction((args as any).transactionId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    // ========== SESSION MANAGER API HANDLERS ==========
    if (name === 'vtex_get_session') {
      const result = await vtexClient.getSession((args as any).sessionToken);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_update_session') {
      const result = await vtexClient.updateSession((args as any).sessionToken, (args as any).sessionData);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_get_segment') {
      const result = await vtexClient.getSegment((args as any).sessionToken);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    // ========== GIFT CARD API HANDLERS ==========
    if (name === 'vtex_create_gift_card') {
      const result = await vtexClient.createGiftCard(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_get_gift_card') {
      const result = await vtexClient.getGiftCard((args as any).giftCardId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_list_gift_cards') {
      const result = await vtexClient.listGiftCards((args as any).page, (args as any).perPage);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_get_gift_card_by_code') {
      const result = await vtexClient.getGiftCardByCode((args as any).redemptionCode);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_create_gift_card_transaction') {
      const { giftCardId, ...transaction } = args as any;
      const result = await vtexClient.createGiftCardTransaction(giftCardId, transaction);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_list_gift_card_providers') {
      const result = await vtexClient.listGiftCardProviders();
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    // ========== SUBSCRIPTIONS API HANDLERS ==========
    if (name === 'vtex_create_subscription') {
      const result = await vtexClient.createSubscription(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_get_subscription') {
      const result = await vtexClient.getSubscription((args as any).subscriptionId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_list_subscriptions') {
      const result = await vtexClient.listSubscriptions(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_update_subscription') {
      const result = await vtexClient.updateSubscription((args as any).subscriptionId, (args as any).updates);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_pause_subscription') {
      const result = await vtexClient.pauseSubscription((args as any).subscriptionId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_cancel_subscription') {
      const result = await vtexClient.cancelSubscription((args as any).subscriptionId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    // ========== CMS API HANDLERS ==========
    if (name === 'vtex_list_cms_templates') {
      const result = await vtexClient.listCMSTemplates();
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_get_cms_template') {
      const result = await vtexClient.getCMSTemplate((args as any).templateId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_create_cms_template') {
      const result = await vtexClient.createCMSTemplate(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_delete_cms_template') {
      const result = await vtexClient.deleteCMSTemplate((args as any).templateId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    // ========== MESSAGE CENTER API HANDLERS ==========
    if (name === 'vtex_list_email_templates') {
      const result = await vtexClient.listEmailTemplates();
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_get_email_template') {
      const result = await vtexClient.getEmailTemplate((args as any).templateId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_create_email_template') {
      const result = await vtexClient.createEmailTemplate(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_update_email_template') {
      const result = await vtexClient.updateEmailTemplate((args as any).templateId, (args as any).template);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_send_email') {
      const result = await vtexClient.sendEmail(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    // ========== VTEX ID API HANDLERS ==========
    if (name === 'vtex_authenticate_user') {
      const result = await vtexClient.authenticateUser(args as any);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_get_user_profile') {
      const result = await vtexClient.getUserProfile((args as any).userId);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_validate_token') {
      const result = await vtexClient.validateToken((args as any).token);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_create_app_token') {
      const result = await vtexClient.createAppToken((args as any).label);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'vtex_list_app_tokens') {
      const result = await vtexClient.listAppTokens();
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    return {
      content: [{ type: 'text', text: `Unknown tool: ${name}` }],
      isError: true,
    };
  } catch (error: any) {
    return {
      content: [{ type: 'text', text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

// ========== START SERVER ==========

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`VTEX MCP Server running on stdio (Profile: ${VTEX_MCP_PROFILE})`);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

