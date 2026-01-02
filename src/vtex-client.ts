import axios, { AxiosInstance } from 'axios';
import type {
  VtexConfig,
  Product,
  SKU,
  Category,
  Brand,
  Specification,
  SpecificationGroup,
  SpecificationField,
  SpecificationValue,
  SKUSpecificationAssignment,
  Price,
  PriceModification,
  InventoryBySKU,
  UpdateInventory,
  Warehouse,
  Dock,
  Promotion,
  Coupon,
  Order,
  OrderFilters,
  CatalogFilters,
  SellerCommission,
  SKUApproval,
  SellerInvitation,
  ShippingPolicy,
  FreightValue,
  ApiResponse,
} from './types.js';

export class VtexClient {
  private catalogClient: AxiosInstance;
  private pricingClient: AxiosInstance;
  private inventoryClient: AxiosInstance;
  private promotionsClient: AxiosInstance;
  private ordersClient: AxiosInstance;
  private logisticsClient: AxiosInstance;
  private accountName: string;
  private environment: string;

  constructor(config: VtexConfig) {
    this.accountName = config.accountName;
    this.environment = config.environment;

    const baseHeaders = {
      'X-VTEX-API-AppKey': config.appKey,
      'X-VTEX-API-AppToken': config.appToken,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    const baseUrl = `https://${config.accountName}.${config.environment}.com.br`;

    // Catalog API Client
    this.catalogClient = axios.create({
      baseURL: `${baseUrl}/api/catalog`,
      headers: baseHeaders,
    });

    // Pricing API Client
    this.pricingClient = axios.create({
      baseURL: `${baseUrl}/api/pricing`,
      headers: baseHeaders,
    });

    // Inventory & Logistics API Client
    this.inventoryClient = axios.create({
      baseURL: `${baseUrl}/api/logistics`,
      headers: baseHeaders,
    });

    // Logistics API Client (same base as inventory)
    this.logisticsClient = axios.create({
      baseURL: `${baseUrl}/api/logistics`,
      headers: baseHeaders,
    });

    // Promotions & Taxes API Client
    this.promotionsClient = axios.create({
      baseURL: `${baseUrl}/api/rnb`,
      headers: baseHeaders,
    });

    // OMS (Orders) API Client
    this.ordersClient = axios.create({
      baseURL: `${baseUrl}/api/oms`,
      headers: baseHeaders,
    });
  }

  // ========== CATALOG API - PRODUCTS ==========

  async createProduct(product: Product): Promise<ApiResponse> {
    try {
      const response = await this.catalogClient.post('/pvt/product', product);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async getProduct(productId: string): Promise<ApiResponse> {
    try {
      const response = await this.catalogClient.get(`/pvt/product/${productId}`);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async updateProduct(productId: string, product: Partial<Product>): Promise<ApiResponse> {
    try {
      const response = await this.catalogClient.put(`/pvt/product/${productId}`, product);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async deleteProduct(productId: string): Promise<ApiResponse> {
    try {
      const response = await this.catalogClient.delete(`/pvt/product/${productId}`);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async listProducts(filters?: CatalogFilters): Promise<ApiResponse> {
    try {
      const response = await this.catalogClient.get('/pvt/product/search', { params: filters });
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  // ========== CATALOG API - SKUS ==========

  async createSKU(sku: SKU): Promise<ApiResponse> {
    try {
      const response = await this.catalogClient.post('/pvt/stockkeepingunit', sku);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async getSKU(skuId: string): Promise<ApiResponse> {
    try {
      const response = await this.catalogClient.get(`/pvt/stockkeepingunit/${skuId}`);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async updateSKU(skuId: string, sku: Partial<SKU>): Promise<ApiResponse> {
    try {
      const response = await this.catalogClient.put(`/pvt/stockkeepingunit/${skuId}`, sku);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async listSKUs(productId?: string): Promise<ApiResponse> {
    try {
      const url = productId
        ? `/pvt/stockkeepingunit?productId=${productId}`
        : '/pvt/stockkeepingunit';
      const response = await this.catalogClient.get(url);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async getSKUByRefId(refId: string): Promise<ApiResponse> {
    try {
      const response = await this.catalogClient.get(`/pvt/stockkeepingunit?refId=${refId}`);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  // ========== CATALOG API - CATEGORIES ==========

  async createCategory(category: Category): Promise<ApiResponse> {
    try {
      const response = await this.catalogClient.post('/pvt/category', category);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async getCategory(categoryId: string): Promise<ApiResponse> {
    try {
      const response = await this.catalogClient.get(`/pvt/category/${categoryId}`);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async updateCategory(categoryId: string, category: Partial<Category>): Promise<ApiResponse> {
    try {
      const response = await this.catalogClient.put(`/pvt/category/${categoryId}`, category);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async deleteCategory(categoryId: string): Promise<ApiResponse> {
    try {
      const response = await this.catalogClient.delete(`/pvt/category/${categoryId}`);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async listCategories(): Promise<ApiResponse> {
    try {
      const response = await this.catalogClient.get('/pvt/category/tree/1');
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  // ========== CATALOG API - BRANDS ==========

  async createBrand(brand: Brand): Promise<ApiResponse> {
    try {
      const response = await this.catalogClient.post('/pvt/brand', brand);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async getBrand(brandId: string): Promise<ApiResponse> {
    try {
      const response = await this.catalogClient.get(`/pvt/brand/${brandId}`);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async updateBrand(brandId: string, brand: Partial<Brand>): Promise<ApiResponse> {
    try {
      const response = await this.catalogClient.put(`/pvt/brand/${brandId}`, brand);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async deleteBrand(brandId: string): Promise<ApiResponse> {
    try {
      const response = await this.catalogClient.delete(`/pvt/brand/${brandId}`);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async listBrands(): Promise<ApiResponse> {
    try {
      const response = await this.catalogClient.get('/pvt/brand/list');
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  // ========== CATALOG API - SPECIFICATIONS ==========

  async createSpecification(specification: Specification): Promise<ApiResponse> {
    try {
      const response = await this.catalogClient.post('/pvt/specification', specification);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async getSKUSpecifications(skuId: string): Promise<ApiResponse> {
    try {
      const response = await this.catalogClient.get(`/pvt/stockkeepingunit/${skuId}/specification`);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async assignSKUSpecificationValue(
    skuId: string,
    specifications: SKUSpecificationAssignment[]
  ): Promise<ApiResponse> {
    try {
      // VTEX API expects one specification at a time, not an array
      const results = [];
      for (const spec of specifications) {
        const response = await this.catalogClient.post(
          `/pvt/stockkeepingunit/${skuId}/specification`,
          spec  // Send single object, not array
        );
        results.push(response.data);
      }
      return { data: results };
    } catch (error: any) {
      return { 
        error: error.response?.data?.message || error.response?.data || error.message,
        status: error.response?.status,
        details: error.response?.data
      };
    }
  }

  async listCategorySpecifications(categoryId: string): Promise<ApiResponse> {
    try {
      const baseUrl = this.catalogClient.defaults.baseURL?.replace('/api/catalog', '');
      const url = `${baseUrl}/api/catalog_system/pub/specification/field/listByCategoryId/${categoryId}`;
      
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
          'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken']
        }
      });
      return { data: response.data };
    } catch (error: any) {
      return { 
        error: error.response?.data?.message || error.message,
        status: error.response?.status,
        details: error.response?.data
      };
    }
  }

  async createSpecificationField(field: SpecificationField): Promise<ApiResponse> {
    try {
      // Use catalog_system endpoint instead of catalog
      const baseUrl = this.catalogClient.defaults.baseURL?.replace('/api/catalog', '');
      const url = `${baseUrl}/api/catalog_system/pvt/specification/field`;
      
      // Add required defaults
      const fieldData = {
        ...field,
        FieldGroupId: field.FieldGroupId || field.CategoryId,
        Description: field.Description || field.Name || '',
        Position: field.Position || 1
      };
      
      const response = await axios.post(url, fieldData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
          'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken']
        }
      });
      return { data: response.data };
    } catch (error: any) {
      return { 
        error: error.response?.data?.message || error.response?.data || error.message,
        status: error.response?.status,
        details: error.response?.data
      };
    }
  }

  async createSpecificationGroup(group: SpecificationGroup): Promise<ApiResponse> {
    try {
      const baseUrl = this.catalogClient.defaults.baseURL?.replace('/api/catalog', '');
      const url = `${baseUrl}/api/catalog_system/pvt/specification/group`;
      
      const response = await axios.post(url, group, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
          'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken']
        }
      });
      return { data: response.data };
    } catch (error: any) {
      return { 
        error: error.response?.data?.message || error.response?.data || error.message,
        status: error.response?.status,
        details: error.response?.data
      };
    }
  }

  async listSpecificationGroups(categoryId: string): Promise<ApiResponse> {
    try {
      const baseUrl = this.catalogClient.defaults.baseURL?.replace('/api/catalog', '');
      const url = `${baseUrl}/api/catalog_system/pvt/specification/groupbycategory/${categoryId}`;
      
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
          'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken']
        }
      });
      return { data: response.data };
    } catch (error: any) {
      return { 
        error: error.response?.data?.message || error.response?.data || error.message,
        status: error.response?.status,
        details: error.response?.data
      };
    }
  }

  async getSpecificationField(fieldId: string): Promise<ApiResponse> {
    try {
      const baseUrl = this.catalogClient.defaults.baseURL?.replace('/api/catalog', '');
      const url = `${baseUrl}/api/catalog_system/pvt/specification/${fieldId}`;
      
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
          'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken']
        }
      });
      return { data: response.data };
    } catch (error: any) {
      return { 
        error: error.response?.data?.message || error.response?.data || error.message,
        status: error.response?.status,
        details: error.response?.data
      };
    }
  }

  async createSpecificationFieldValue(fieldId: string, value: { FieldValueName: string; Position?: number; IsActive?: boolean }): Promise<ApiResponse> {
    try {
      const baseUrl = this.catalogClient.defaults.baseURL?.replace('/api/catalog', '');
      const url = `${baseUrl}/api/catalog_system/pvt/specification/fieldValue`;
      
      const valueData = {
        FieldId: parseInt(fieldId),
        Name: value.FieldValueName,
        Position: value.Position || 1,
        IsActive: value.IsActive !== undefined ? value.IsActive : true
      };
      
      const response = await axios.post(url, valueData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
          'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken']
        }
      });
      return { data: response.data };
    } catch (error: any) {
      return { 
        error: error.response?.data?.message || error.response?.data || error.message,
        status: error.response?.status,
        details: error.response?.data
      };
    }
  }

  async listSpecificationFieldValues(fieldId: string): Promise<ApiResponse> {
    try {
      const baseUrl = this.catalogClient.defaults.baseURL?.replace('/api/catalog', '');
      const url = `${baseUrl}/api/catalog_system/pvt/specification/field/${fieldId}/value`;
      
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
          'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken']
        }
      });
      return { data: response.data };
    } catch (error: any) {
      return { 
        error: error.response?.data?.message || error.response?.data || error.message,
        status: error.response?.status,
        details: error.response?.data
      };
    }
  }

  // ========== PRICING API ==========

  async getPrice(skuId: string): Promise<ApiResponse> {
    try {
      const response = await this.pricingClient.get(`/prices/${skuId}`);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async createOrUpdatePrice(skuId: string, price: PriceModification): Promise<ApiResponse> {
    try {
      const response = await this.pricingClient.put(`/prices/${skuId}`, price);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async deletePrice(skuId: string): Promise<ApiResponse> {
    try {
      const response = await this.pricingClient.delete(`/prices/${skuId}`);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async listPrices(page: number = 1, pageSize: number = 100): Promise<ApiResponse> {
    try {
      const response = await this.pricingClient.get('/prices', {
        params: { page, pageSize },
      });
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async getComputedPrice(
    skuId: string,
    tradePolicy?: string,
    regionId?: string
  ): Promise<ApiResponse> {
    try {
      const params: any = {};
      if (tradePolicy) params.sc = tradePolicy;
      if (regionId) params.regionId = regionId;

      const response = await this.pricingClient.get(`/computed/${skuId}`, { params });
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  // ========== INVENTORY API ==========

  async getInventoryBySKU(skuId: string): Promise<ApiResponse> {
    try {
      const response = await this.inventoryClient.get(`/pvt/inventory/skus/${skuId}`);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async updateInventory(
    skuId: string,
    warehouseId: string,
    inventory: UpdateInventory
  ): Promise<ApiResponse> {
    try {
      const response = await this.inventoryClient.put(
        `/pvt/inventory/skus/${skuId}/warehouses/${warehouseId}`,
        inventory
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async listInventoryByWarehouse(warehouseId: string, page: number = 1): Promise<ApiResponse> {
    try {
      const response = await this.inventoryClient.get(
        `/pvt/inventory/items/warehouse/${warehouseId}`,
        { params: { page } }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  // ========== LOGISTICS API - WAREHOUSES ==========

  async createWarehouse(warehouse: Warehouse): Promise<ApiResponse> {
    try {
      const response = await this.logisticsClient.post('/pvt/configuration/warehouses', warehouse);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async getWarehouse(warehouseId: string): Promise<ApiResponse> {
    try {
      const response = await this.logisticsClient.get(
        `/pvt/configuration/warehouses/${warehouseId}`
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async listWarehouses(): Promise<ApiResponse> {
    try {
      const response = await this.logisticsClient.get('/pvt/configuration/warehouses');
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async updateWarehouse(warehouseId: string, warehouse: Partial<Warehouse>): Promise<ApiResponse> {
    try {
      const response = await this.logisticsClient.put(
        `/pvt/configuration/warehouses/${warehouseId}`,
        warehouse
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async deleteWarehouse(warehouseId: string): Promise<ApiResponse> {
    try {
      const response = await this.logisticsClient.delete(
        `/pvt/configuration/warehouses/${warehouseId}`
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  // ========== LOGISTICS API - DOCKS ==========

  async createDock(dock: Dock): Promise<ApiResponse> {
    try {
      const response = await this.logisticsClient.post('/pvt/configuration/docks', dock);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async getDock(dockId: string): Promise<ApiResponse> {
    try {
      const response = await this.logisticsClient.get(`/pvt/configuration/docks/${dockId}`);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async listDocks(): Promise<ApiResponse> {
    try {
      const response = await this.logisticsClient.get('/pvt/configuration/docks');
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async updateDock(dockId: string, dock: Partial<Dock>): Promise<ApiResponse> {
    try {
      const response = await this.logisticsClient.put(
        `/pvt/configuration/docks/${dockId}`,
        dock
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async deleteDock(dockId: string): Promise<ApiResponse> {
    try {
      const response = await this.logisticsClient.delete(`/pvt/configuration/docks/${dockId}`);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  // ========== LOGISTICS API - SHIPPING POLICIES ==========

  async createShippingPolicy(policy: ShippingPolicy): Promise<ApiResponse> {
    try {
      const response = await this.logisticsClient.post(
        '/pvt/shipping-policies',
        policy
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async getShippingPolicy(policyId: string): Promise<ApiResponse> {
    try {
      const response = await this.logisticsClient.get(`/pvt/shipping-policies/${policyId}`);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async listShippingPolicies(): Promise<ApiResponse> {
    try {
      const response = await this.logisticsClient.get('/pvt/shipping-policies');
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async updateShippingPolicy(
    policyId: string,
    policy: Partial<ShippingPolicy>
  ): Promise<ApiResponse> {
    try {
      const response = await this.logisticsClient.put(
        `/pvt/shipping-policies/${policyId}`,
        policy
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async deleteShippingPolicy(policyId: string): Promise<ApiResponse> {
    try {
      const response = await this.logisticsClient.delete(`/pvt/shipping-policies/${policyId}`);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  // ========== PROMOTIONS & TAXES API ==========

  async createPromotion(promotion: Promotion): Promise<ApiResponse> {
    try {
      const response = await this.promotionsClient.post('/api/rnb/pvt/benefits/calculatorconfiguration', promotion);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async getPromotion(promotionId: string): Promise<ApiResponse> {
    try {
      const response = await this.promotionsClient.get(
        `/api/rnb/pvt/benefits/calculatorconfiguration/${promotionId}`
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async listPromotions(archived: boolean = false): Promise<ApiResponse> {
    try {
      const response = await this.promotionsClient.get(
        '/api/rnb/pvt/benefits/calculatorconfiguration',
        { params: { isArchived: archived } }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async updatePromotion(promotionId: string, promotion: Partial<Promotion>): Promise<ApiResponse> {
    try {
      const response = await this.promotionsClient.put(
        `/api/rnb/pvt/benefits/calculatorconfiguration/${promotionId}`,
        promotion
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async archivePromotion(promotionId: string): Promise<ApiResponse> {
    try {
      const response = await this.promotionsClient.post(
        `/api/rnb/pvt/benefits/calculatorconfiguration/${promotionId}/archive`
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async unarchivePromotion(promotionId: string): Promise<ApiResponse> {
    try {
      const response = await this.promotionsClient.post(
        `/api/rnb/pvt/benefits/calculatorconfiguration/${promotionId}/unarchive`
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  // ========== PROMOTIONS & TAXES API - COUPONS ==========

  async createCoupon(coupon: Coupon): Promise<ApiResponse> {
    try {
      const response = await this.promotionsClient.post('/api/rnb/pvt/coupon', coupon);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async getCoupon(couponCode: string): Promise<ApiResponse> {
    try {
      const response = await this.promotionsClient.get(`/api/rnb/pvt/coupon/${couponCode}`);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async listCoupons(): Promise<ApiResponse> {
    try {
      const response = await this.promotionsClient.get('/api/rnb/pvt/coupon');
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async archiveCoupon(couponCode: string): Promise<ApiResponse> {
    try {
      const response = await this.promotionsClient.post(`/api/rnb/pvt/coupon/${couponCode}/archive`);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  // ========== ORDERS API ==========

  async getOrder(orderId: string): Promise<ApiResponse> {
    try {
      const response = await this.ordersClient.get(`/pvt/orders/${orderId}`);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async listOrders(filters?: OrderFilters): Promise<ApiResponse> {
    try {
      const response = await this.ordersClient.get('/pvt/orders', { params: filters });
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async startHandling(orderId: string): Promise<ApiResponse> {
    try {
      const response = await this.ordersClient.post(`/pvt/orders/${orderId}/start-handling`);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async cancelOrder(orderId: string, reason?: string): Promise<ApiResponse> {
    try {
      const response = await this.ordersClient.post(`/pvt/orders/${orderId}/cancel`, {
        reason: reason || 'Cancellation requested',
      });
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async invoiceOrder(orderId: string, invoiceData: any): Promise<ApiResponse> {
    try {
      const response = await this.ordersClient.post(`/pvt/orders/${orderId}/invoice`, invoiceData);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async updateOrderTracking(orderId: string, trackingData: any): Promise<ApiResponse> {
    try {
      const response = await this.ordersClient.put(
        `/pvt/orders/${orderId}/invoice`,
        trackingData
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  // ========== MARKETPLACE API ==========

  async getSellerCommissions(): Promise<ApiResponse> {
    try {
      const response = await this.catalogClient.get('/pvt/seller/commission');
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async updateSellerCommission(commission: SellerCommission): Promise<ApiResponse> {
    try {
      const response = await this.catalogClient.post('/pvt/seller/commission', commission);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async getSKUApprovalStatus(sellerId: string, sellerSkuId: string): Promise<ApiResponse> {
    try {
      const response = await this.catalogClient.get(
        `/pvt/skuseller/${sellerId}/${sellerSkuId}`
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async approveSKU(sellerId: string, sellerSkuId: string): Promise<ApiResponse> {
    try {
      const response = await this.catalogClient.put(`/pvt/skuseller/${sellerId}/${sellerSkuId}`, {
        approvalStatus: 'approved',
      });
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async denySKU(sellerId: string, sellerSkuId: string, reason?: string): Promise<ApiResponse> {
    try {
      const response = await this.catalogClient.put(`/pvt/skuseller/${sellerId}/${sellerSkuId}`, {
        approvalStatus: 'denied',
        reason: reason || 'SKU denied',
      });
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async inviteSeller(invitation: SellerInvitation): Promise<ApiResponse> {
    try {
      const response = await this.catalogClient.post('/pvt/seller/invite', invitation);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async listSellers(): Promise<ApiResponse> {
    try {
      const response = await this.catalogClient.get('/pvt/seller/list');
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  // ========== CHECKOUT API ==========

  async getOrderForm(orderFormId: string): Promise<ApiResponse> {
    try {
      const response = await axios.get(
        `https://${this.accountName}.${this.environment}.com.br/api/checkout/pub/orderForm/${orderFormId}`,
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async simulateShipping(simulation: any): Promise<ApiResponse> {
    try {
      const response = await axios.post(
        `https://${this.accountName}.${this.environment}.com.br/api/checkout/pub/orderForms/simulation`,
        simulation,
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async addItemToCart(orderFormId: string, items: any[]): Promise<ApiResponse> {
    try {
      const response = await axios.post(
        `https://${this.accountName}.${this.environment}.com.br/api/checkout/pub/orderForm/${orderFormId}/items`,
        { orderItems: items },
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async removeItemFromCart(orderFormId: string, itemIndex: number): Promise<ApiResponse> {
    try {
      const response = await axios.post(
        `https://${this.accountName}.${this.environment}.com.br/api/checkout/pub/orderForm/${orderFormId}/items/${itemIndex}/quantity/0`,
        {},
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async updateItemQuantity(orderFormId: string, itemIndex: number, quantity: number): Promise<ApiResponse> {
    try {
      const response = await axios.patch(
        `https://${this.accountName}.${this.environment}.com.br/api/checkout/pub/orderForm/${orderFormId}/items/${itemIndex}/quantity/${quantity}`,
        {},
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async addCouponToCart(orderFormId: string, couponCode: string): Promise<ApiResponse> {
    try {
      const response = await axios.post(
        `https://${this.accountName}.${this.environment}.com.br/api/checkout/pub/orderForm/${orderFormId}/coupons`,
        { text: couponCode },
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async clearCart(orderFormId: string): Promise<ApiResponse> {
    try {
      const response = await axios.post(
        `https://${this.accountName}.${this.environment}.com.br/api/checkout/pub/orderForm/${orderFormId}/items/removeAll`,
        {},
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  // ========== MASTER DATA API ==========

  async createDocument(entity: string, document: any): Promise<ApiResponse> {
    try {
      const response = await axios.post(
        `https://${this.accountName}.${this.environment}.com.br/api/dataentities/${entity}/documents`,
        document,
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async getDocument(entity: string, documentId: string, fields?: string[]): Promise<ApiResponse> {
    try {
      const params: any = {};
      if (fields && fields.length > 0) {
        params._fields = fields.join(',');
      }
      const response = await axios.get(
        `https://${this.accountName}.${this.environment}.com.br/api/dataentities/${entity}/documents/${documentId}`,
        {
          params,
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async updateDocument(entity: string, documentId: string, document: any): Promise<ApiResponse> {
    try {
      const response = await axios.patch(
        `https://${this.accountName}.${this.environment}.com.br/api/dataentities/${entity}/documents/${documentId}`,
        document,
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async deleteDocument(entity: string, documentId: string): Promise<ApiResponse> {
    try {
      const response = await axios.delete(
        `https://${this.accountName}.${this.environment}.com.br/api/dataentities/${entity}/documents/${documentId}`,
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async searchDocuments(entity: string, searchParams: any): Promise<ApiResponse> {
    try {
      const params: any = {};
      if (searchParams.fields) params._fields = searchParams.fields.join(',');
      if (searchParams.where) params._where = searchParams.where;
      if (searchParams.size) params._size = searchParams.size;
      if (searchParams.page) params._page = searchParams.page;
      if (searchParams.sort) params._sort = searchParams.sort;

      const response = await axios.get(
        `https://${this.accountName}.${this.environment}.com.br/api/dataentities/${entity}/search`,
        {
          params,
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async getClientByEmail(email: string): Promise<ApiResponse> {
    try {
      const response = await axios.get(
        `https://${this.accountName}.${this.environment}.com.br/api/dataentities/CL/search`,
        {
          params: {
            _fields: 'id,email,firstName,lastName,document,phone',
            _where: `email=${email}`,
          },
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  // ========== SEARCH API ==========

  async searchProducts(searchParams: any): Promise<ApiResponse> {
    try {
      const params: any = {};
      if (searchParams.from !== undefined) params._from = searchParams.from;
      if (searchParams.to !== undefined) params._to = searchParams.to;
      if (searchParams.orderBy) params.O = searchParams.orderBy;
      if (searchParams.map) params.map = searchParams.map;
      if (searchParams.fq) params.fq = searchParams.fq;

      let url = `https://${this.accountName}.${this.environment}.com.br/api/catalog_system/pub/products/search`;
      
      if (searchParams.query) {
        url = `https://${this.accountName}.${this.environment}.com.br/api/catalog_system/pub/products/search/${encodeURIComponent(searchParams.query)}`;
      } else if (searchParams.category) {
        url = `https://${this.accountName}.${this.environment}.com.br/api/catalog_system/pub/products/search/${encodeURIComponent(searchParams.category)}`;
      }

      const response = await axios.get(url, {
        params,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async getProductByIdentifier(field: 'id' | 'ean' | 'reference' | 'sku', value: string): Promise<ApiResponse> {
    try {
      const fieldMap: Record<string, string> = {
        id: 'fq=productId',
        ean: 'fq=ean',
        reference: 'fq=alternateIds_RefId',
        sku: 'fq=skuId',
      };

      const response = await axios.get(
        `https://${this.accountName}.${this.environment}.com.br/api/catalog_system/pub/products/search?${fieldMap[field]}:${value}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async getProductAndSKUIds(categoryId?: string, brandId?: string): Promise<ApiResponse> {
    try {
      const params: any = {};
      if (categoryId) params.categoryId = categoryId;
      if (brandId) params.brandId = brandId;

      const response = await axios.get(
        `https://${this.accountName}.${this.environment}.com.br/api/catalog_system/pvt/products/GetProductAndSkuIds`,
        {
          params,
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async getFacets(categoryId?: string): Promise<ApiResponse> {
    try {
      let url = `https://${this.accountName}.${this.environment}.com.br/api/catalog_system/pub/facets/search`;
      if (categoryId) {
        url += `/${categoryId}`;
      }

      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async autocomplete(searchTerm: string): Promise<ApiResponse> {
    try {
      const response = await axios.get(
        `https://${this.accountName}.${this.environment}.com.br/api/catalog_system/pub/products/search/autocomplete`,
        {
          params: { productNameContains: searchTerm },
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  // ========== REVIEWS AND RATINGS API ==========

  async createReview(review: any): Promise<ApiResponse> {
    try {
      const response = await axios.post(
        `https://${this.accountName}.${this.environment}.com.br/api/reviews-and-ratings/api/review`,
        review,
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async getReview(reviewId: string): Promise<ApiResponse> {
    try {
      const response = await axios.get(
        `https://${this.accountName}.${this.environment}.com.br/api/reviews-and-ratings/api/review/${reviewId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async listReviews(filters: any): Promise<ApiResponse> {
    try {
      const params: any = {};
      if (filters.productId) params.product_id = filters.productId;
      if (filters.approved !== undefined) params.status = filters.approved ? 'true' : 'false';
      if (filters.orderBy) params.order_by = filters.orderBy;
      if (filters.page) params.page = filters.page;
      if (filters.pageSize) params.page_size = filters.pageSize;

      const response = await axios.get(
        `https://${this.accountName}.${this.environment}.com.br/api/reviews-and-ratings/api/reviews`,
        {
          params,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async updateReview(reviewId: string, updates: any): Promise<ApiResponse> {
    try {
      const response = await axios.patch(
        `https://${this.accountName}.${this.environment}.com.br/api/reviews-and-ratings/api/review/${reviewId}`,
        updates,
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async deleteReview(reviewId: string): Promise<ApiResponse> {
    try {
      const response = await axios.delete(
        `https://${this.accountName}.${this.environment}.com.br/api/reviews-and-ratings/api/review/${reviewId}`,
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async approveReview(reviewId: string): Promise<ApiResponse> {
    try {
      const response = await axios.patch(
        `https://${this.accountName}.${this.environment}.com.br/api/reviews-and-ratings/api/review/${reviewId}`,
        { approved: true },
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async getReviewSummary(productId: string): Promise<ApiResponse> {
    try {
      const response = await axios.get(
        `https://${this.accountName}.${this.environment}.com.br/api/reviews-and-ratings/api/rating/${productId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  // ========== PAYMENT GATEWAY API ==========

  async listPaymentProviders(): Promise<ApiResponse> {
    try {
      const response = await axios.get(
        `https://${this.accountName}.${this.environment}.com.br/api/pvt/payment-gateways`,
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async getPaymentProvider(providerId: string): Promise<ApiResponse> {
    try {
      const response = await axios.get(
        `https://${this.accountName}.${this.environment}.com.br/api/pvt/payment-gateways/${providerId}`,
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async createPaymentProvider(provider: any): Promise<ApiResponse> {
    try {
      const response = await axios.post(
        `https://${this.accountName}.${this.environment}.com.br/api/pvt/payment-gateways`,
        provider,
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async updatePaymentProvider(providerId: string, provider: any): Promise<ApiResponse> {
    try {
      const response = await axios.put(
        `https://${this.accountName}.${this.environment}.com.br/api/pvt/payment-gateways/${providerId}`,
        provider,
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async deletePaymentProvider(providerId: string): Promise<ApiResponse> {
    try {
      const response = await axios.delete(
        `https://${this.accountName}.${this.environment}.com.br/api/pvt/payment-gateways/${providerId}`,
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async listPaymentMethods(): Promise<ApiResponse> {
    try {
      const response = await axios.get(
        `https://${this.accountName}.${this.environment}.com.br/api/pvt/payments/payment-systems`,
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async getTransaction(transactionId: string): Promise<ApiResponse> {
    try {
      const response = await axios.get(
        `https://${this.accountName}.${this.environment}.com.br/api/pvt/transactions/${transactionId}`,
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  // ========== SESSION MANAGER API ==========

  async getSession(sessionToken?: string): Promise<ApiResponse> {
    try {
      const headers: any = {
        'Content-Type': 'application/json',
      };
      if (sessionToken) {
        headers['Cookie'] = `vtex_session=${sessionToken}`;
      }
      const response = await axios.get(
        `https://${this.accountName}.${this.environment}.com.br/api/sessions`,
        { headers }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async updateSession(sessionToken: string, sessionData: any): Promise<ApiResponse> {
    try {
      const response = await axios.post(
        `https://${this.accountName}.${this.environment}.com.br/api/sessions`,
        sessionData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Cookie': `vtex_session=${sessionToken}`,
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async getSegment(sessionToken?: string): Promise<ApiResponse> {
    try {
      const headers: any = {
        'Content-Type': 'application/json',
      };
      if (sessionToken) {
        headers['Cookie'] = `vtex_session=${sessionToken}`;
      }
      const response = await axios.get(
        `https://${this.accountName}.${this.environment}.com.br/api/segments`,
        { headers }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  // ========== GIFT CARD API ==========

  async createGiftCard(giftCard: any): Promise<ApiResponse> {
    try {
      const response = await axios.post(
        `https://${this.accountName}.${this.environment}.com.br/api/gift-card-system/pvt/giftcards`,
        giftCard,
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async getGiftCard(giftCardId: string): Promise<ApiResponse> {
    try {
      const response = await axios.get(
        `https://${this.accountName}.${this.environment}.com.br/api/gift-card-system/pvt/giftcards/${giftCardId}`,
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async listGiftCards(page: number = 1, perPage: number = 30): Promise<ApiResponse> {
    try {
      const response = await axios.get(
        `https://${this.accountName}.${this.environment}.com.br/api/gift-card-system/pvt/giftcards`,
        {
          params: { _page: page, _perPage: perPage },
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async getGiftCardByCode(redemptionCode: string): Promise<ApiResponse> {
    try {
      const response = await axios.get(
        `https://${this.accountName}.${this.environment}.com.br/api/gift-card-system/pvt/giftcards/_search`,
        {
          params: { redemptionCode },
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async createGiftCardTransaction(giftCardId: string, transaction: any): Promise<ApiResponse> {
    try {
      const response = await axios.post(
        `https://${this.accountName}.${this.environment}.com.br/api/gift-card-system/pvt/giftcards/${giftCardId}/transactions`,
        transaction,
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async listGiftCardProviders(): Promise<ApiResponse> {
    try {
      const response = await axios.get(
        `https://${this.accountName}.${this.environment}.com.br/api/gift-card-system/pvt/providers`,
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  // ========== SUBSCRIPTIONS API ==========

  async createSubscription(subscription: any): Promise<ApiResponse> {
    try {
      const response = await axios.post(
        `https://${this.accountName}.${this.environment}.com.br/api/rns/pvt/subscriptions`,
        subscription,
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async getSubscription(subscriptionId: string): Promise<ApiResponse> {
    try {
      const response = await axios.get(
        `https://${this.accountName}.${this.environment}.com.br/api/rns/pvt/subscriptions/${subscriptionId}`,
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async listSubscriptions(filters?: any): Promise<ApiResponse> {
    try {
      const response = await axios.get(
        `https://${this.accountName}.${this.environment}.com.br/api/rns/pvt/subscriptions`,
        {
          params: filters,
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async updateSubscription(subscriptionId: string, updates: any): Promise<ApiResponse> {
    try {
      const response = await axios.patch(
        `https://${this.accountName}.${this.environment}.com.br/api/rns/pvt/subscriptions/${subscriptionId}`,
        updates,
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async pauseSubscription(subscriptionId: string): Promise<ApiResponse> {
    try {
      const response = await axios.post(
        `https://${this.accountName}.${this.environment}.com.br/api/rns/pvt/subscriptions/${subscriptionId}/pause`,
        {},
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<ApiResponse> {
    try {
      const response = await axios.delete(
        `https://${this.accountName}.${this.environment}.com.br/api/rns/pvt/subscriptions/${subscriptionId}`,
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  // ========== CMS API ==========

  async listCMSTemplates(): Promise<ApiResponse> {
    try {
      const response = await axios.get(
        `https://${this.accountName}.${this.environment}.com.br/api/template/pvt/templates`,
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async getCMSTemplate(templateId: string): Promise<ApiResponse> {
    try {
      const response = await axios.get(
        `https://${this.accountName}.${this.environment}.com.br/api/template/pvt/templates/${templateId}`,
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async createCMSTemplate(template: any): Promise<ApiResponse> {
    try {
      const response = await axios.put(
        `https://${this.accountName}.${this.environment}.com.br/api/template/pvt/templates/${template.name}`,
        template,
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async deleteCMSTemplate(templateId: string): Promise<ApiResponse> {
    try {
      const response = await axios.delete(
        `https://${this.accountName}.${this.environment}.com.br/api/template/pvt/templates/${templateId}`,
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  // ========== MESSAGE CENTER API ==========

  async listEmailTemplates(): Promise<ApiResponse> {
    try {
      const response = await axios.get(
        `https://${this.accountName}.${this.environment}.com.br/api/mail-service/pvt/templates`,
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async getEmailTemplate(templateId: string): Promise<ApiResponse> {
    try {
      const response = await axios.get(
        `https://${this.accountName}.${this.environment}.com.br/api/mail-service/pvt/templates/${templateId}`,
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async createEmailTemplate(template: any): Promise<ApiResponse> {
    try {
      const response = await axios.post(
        `https://${this.accountName}.${this.environment}.com.br/api/mail-service/pvt/templates`,
        template,
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async updateEmailTemplate(templateId: string, template: any): Promise<ApiResponse> {
    try {
      const response = await axios.put(
        `https://${this.accountName}.${this.environment}.com.br/api/mail-service/pvt/templates/${templateId}`,
        template,
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async sendEmail(emailData: any): Promise<ApiResponse> {
    try {
      const response = await axios.post(
        `https://${this.accountName}.${this.environment}.com.br/api/mail-service/pvt/sendmail`,
        emailData,
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  // ========== VTEX ID API ==========

  async authenticateUser(credentials: any): Promise<ApiResponse> {
    try {
      const response = await axios.post(
        `https://vtexid.vtex.com.br/api/vtexid/pub/authentication/classic/validate`,
        credentials,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async getUserProfile(userId: string): Promise<ApiResponse> {
    try {
      const response = await axios.get(
        `https://vtexid.vtex.com.br/api/vtexid/pub/user/${userId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async validateToken(token: string): Promise<ApiResponse> {
    try {
      const response = await axios.get(
        `https://vtexid.vtex.com.br/api/vtexid/pub/authenticated/user`,
        {
          headers: {
            'VtexIdclientAutCookie': token,
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async createAppToken(label: string): Promise<ApiResponse> {
    try {
      const response = await axios.post(
        `https://${this.accountName}.${this.environment}.com.br/api/vtexid/apptoken`,
        { label },
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }

  async listAppTokens(): Promise<ApiResponse> {
    try {
      const response = await axios.get(
        `https://${this.accountName}.${this.environment}.com.br/api/vtexid/apptoken`,
        {
          headers: {
            'X-VTEX-API-AppKey': this.catalogClient.defaults.headers['X-VTEX-API-AppKey'],
            'X-VTEX-API-AppToken': this.catalogClient.defaults.headers['X-VTEX-API-AppToken'],
            'Content-Type': 'application/json',
          },
        }
      );
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  }
}

