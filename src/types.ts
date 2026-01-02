// ========== CONFIG ==========

export interface VtexConfig {
  accountName: string;
  environment: string;
  appKey: string;
  appToken: string;
}

export interface ApiResponse {
  data?: any;
  error?: string;
  status?: number;
  details?: any;
}

// ========== CATALOG API ==========

export interface Product {
  Id?: number;
  Name: string;
  DepartmentId?: number;
  CategoryId?: number;
  BrandId?: number;
  LinkId?: string;
  RefId?: string;
  IsVisible?: boolean;
  Description?: string;
  DescriptionShort?: string;
  ReleaseDate?: string;
  KeyWords?: string;
  Title?: string;
  IsActive?: boolean;
  TaxCode?: string;
  MetaTagDescription?: string;
  ShowWithoutStock?: boolean;
  Score?: number;
}

export interface SKU {
  Id?: number;
  ProductId: number;
  IsActive?: boolean;
  Name: string;
  RefId?: string;
  PackagedHeight?: number;
  PackagedLength?: number;
  PackagedWidth?: number;
  PackagedWeightKg?: number;
  Height?: number;
  Length?: number;
  Width?: number;
  WeightKg?: number;
  CubicWeight?: number;
  IsKit?: boolean;
  CreationDate?: string;
  RewardValue?: number;
  EstimatedDateArrival?: string;
  ManufacturerCode?: string;
  CommercialConditionId?: number;
  MeasurementUnit?: string;
  UnitMultiplier?: number;
  ModalType?: string;
  KitItensSellApart?: boolean;
  Videos?: string[];
}

export interface Category {
  Id?: number;
  Name: string;
  FatherCategoryId?: number;
  Title?: string;
  Description?: string;
  Keywords?: string;
  IsActive?: boolean;
  LomadeeCampaignCode?: string;
  AdWordsRemarketingCode?: string;
  ShowInStoreFront?: boolean;
  ShowBrandFilter?: boolean;
  ActiveStoreFrontLink?: boolean;
  GlobalCategoryId?: number;
  StockKeepingUnitSelectionMode?: string;
  Score?: number;
}

export interface Brand {
  Id?: number;
  Name: string;
  Text?: string;
  Keywords?: string;
  SiteTitle?: string;
  Active?: boolean;
  MenuHome?: boolean;
  AdWordsRemarketingCode?: string;
  LomadeeCampaignCode?: string;
  Score?: number;
}

export interface Specification {
  Id?: number;
  FieldId: number;
  FieldValueId: number;
  Text?: string;
}

export interface SpecificationField {
  Id?: number;
  CategoryId?: number;
  FieldGroupId?: number;
  Name: string;
  Description?: string;
  Position?: number;
  IsFilter?: boolean;
  IsRequired?: boolean;
  IsOnProductDetails?: boolean;
  IsStockKeepingUnit?: boolean;
  IsActive?: boolean;
  IsTopMenuLinkActive?: boolean;
  IsSideMenuLinkActive?: boolean;
  DefaultValue?: string;
  FieldTypeId?: number;
  FieldTypeName?: string;
}

export interface SpecificationGroup {
  Id?: number;
  CategoryId: number;
  Name: string;
  Position?: number;
}

export interface SpecificationValue {
  FieldId: number;
  FieldValueId?: number;
  Value: string;
  IsActive?: boolean;
  Position?: number;
}

export interface SKUSpecificationAssignment {
  FieldId: number;
  FieldValueId: number;
}

// ========== PRICING API ==========

export interface Price {
  itemId: string;
  listPrice?: number;
  costPrice?: number;
  markup?: number;
  basePrice: number;
  fixedPrices?: FixedPrice[];
}

export interface FixedPrice {
  tradePolicyId: string;
  value: number;
  listPrice?: number;
  minQuantity?: number;
  dateRange?: {
    from: string;
    to: string;
  };
}

export interface PriceModification {
  itemId: string;
  costPrice?: number;
  markup?: number;
  basePrice?: number;
  listPrice?: number;
  fixedPrices?: FixedPrice[];
}

// ========== INVENTORY API ==========

export interface InventoryBySKU {
  skuId: string;
  balance: Array<{
    warehouseId: string;
    warehouseName: string;
    totalQuantity: number;
    reservedQuantity: number;
    hasUnlimitedQuantity: boolean;
  }>;
}

export interface UpdateInventory {
  quantity: number;
  unlimitedQuantity?: boolean;
  dateUtcOnBalanceSystem?: string;
}

export interface Warehouse {
  id?: string;
  name: string;
  warehouseDocks?: Array<{
    dockId: string;
    name: string;
    time: string;
    cost: number;
  }>;
}

export interface Dock {
  id?: string;
  name: string;
  priority?: number;
  dockTimeCost?: string;
  freightTableIds?: string[];
}

// ========== PROMOTIONS API ==========

export interface Promotion {
  id?: string;
  name: string;
  beginDateUtc: string;
  endDateUtc: string;
  lastModifiedUtc?: string;
  description?: string;
  isActive?: boolean;
  origin?: string;
  isArchived?: boolean;
  isFeatured?: boolean;
  disableable?: boolean;
  offset?: number;
  limit?: number;
  cumulative?: boolean;
  type?:
    | 'regular'
    | 'combo'
    | 'forThePriceOf'
    | 'progressive'
    | 'buyAndWin'
    | 'campaignBenefit'
    | 'maxValuePerItem'
    | 'nominall'
    | 'percentual';
  percentualDiscountValue?: number;
  nominalDiscountValue?: number;
  percentualShippingDiscountValue?: number;
  nominalShippingDiscountValue?: number;
  absoluteShippingDiscountValue?: number;
  percentualTax?: number;
  nominalTax?: number;
  utmSource?: string;
  utmCampaign?: string;
  collections?: Array<{ id: string }>;
  products?: Array<{ id: string }>;
  categories?: Array<{ id: string }>;
  brands?: Array<{ id: string }>;
}

export interface Coupon {
  couponCode: string;
  isArchived?: boolean;
  maxItemsPerClient?: number;
  expirationIntervalPerUse?: string;
}

// ========== ORDERS API ==========

export interface Order {
  orderId?: string;
  sequence?: string;
  marketplaceOrderId?: string;
  marketplaceServicesEndpoint?: string;
  sellerOrderId?: string;
  origin?: string;
  affiliateId?: string;
  salesChannel?: string;
  merchantName?: string;
  status?: string;
  statusDescription?: string;
  value?: number;
  creationDate?: string;
  lastChange?: string;
  orderGroup?: string;
  totals?: Array<{
    id: string;
    name: string;
    value: number;
  }>;
  items?: OrderItem[];
  marketplaceItems?: any[];
  clientProfileData?: ClientProfileData;
  giftRegistryData?: any;
  marketingData?: any;
  ratesAndBenefitsData?: any;
  shippingData?: ShippingData;
  paymentData?: PaymentData;
  packageAttachment?: PackageAttachment;
  sellers?: Seller[];
  callCenterOperatorData?: any;
  followUpEmail?: string;
  lastMessage?: string;
  hostname?: string;
  invoiceData?: any;
  changesAttachment?: any;
  openTextField?: any;
  roundingError?: number;
  orderFormId?: string;
  commercialConditionData?: any;
  isCompleted?: boolean;
  customData?: any;
  storePreferencesData?: any;
  allowCancellation?: boolean;
  allowEdition?: boolean;
  isCheckedIn?: boolean;
  marketplace?: any;
  authorizedDate?: string;
  invoicedDate?: string;
}

export interface OrderItem {
  uniqueId?: string;
  id: string;
  productId?: string;
  ean?: string;
  lockId?: string;
  itemAttachment?: any;
  attachments?: any[];
  quantity: number;
  seller?: string;
  name?: string;
  refId?: string;
  price: number;
  listPrice?: number;
  manualPrice?: any;
  priceTags?: any[];
  imageUrl?: string;
  detailUrl?: string;
  components?: any[];
  bundleItems?: any[];
  params?: any[];
  offerings?: any[];
  sellerSku?: string;
  priceValidUntil?: string;
  commission?: number;
  tax?: number;
  preSaleDate?: any;
  additionalInfo?: any;
  measurementUnit?: string;
  unitMultiplier?: number;
  sellingPrice?: number;
  isGift?: boolean;
  shippingPrice?: any;
  rewardValue?: number;
  freightCommission?: number;
  priceDefinitions?: any;
  taxCode?: string;
  parentItemIndex?: any;
  parentAssemblyBinding?: any;
  callCenterOperator?: any;
  serialNumbers?: any;
  assembliesOptions?: any;
}

export interface ClientProfileData {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  documentType?: string;
  document?: string;
  phone?: string;
  corporateName?: string;
  tradeName?: string;
  corporateDocument?: string;
  stateInscription?: string;
  corporatePhone?: string;
  isCorporate?: boolean;
  userProfileId?: string;
  customerClass?: string;
}

export interface ShippingData {
  address?: Address;
  logisticsInfo?: LogisticsInfo[];
  trackingHints?: any;
  selectedAddresses?: Address[];
}

export interface Address {
  addressType?: string;
  receiverName?: string;
  addressId?: string;
  postalCode?: string;
  city?: string;
  state?: string;
  country?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  complement?: string;
  reference?: string;
  geoCoordinates?: number[];
}

export interface LogisticsInfo {
  itemIndex?: number;
  selectedSla?: string;
  lockTTL?: string;
  price?: number;
  listPrice?: number;
  sellingPrice?: number;
  deliveryWindow?: any;
  deliveryCompany?: string;
  shippingEstimate?: string;
  shippingEstimateDate?: string;
  slas?: SLA[];
  shipsTo?: string[];
  deliveryIds?: DeliveryId[];
  deliveryChannel?: string;
  pickupStoreInfo?: PickupStoreInfo;
}

export interface SLA {
  id: string;
  name?: string;
  shippingEstimate?: string;
  deliveryWindow?: any;
  price?: number;
  deliveryChannel?: string;
  pickupStoreInfo?: PickupStoreInfo;
  polygonName?: string;
  lockTTL?: string;
  pickupPointId?: string;
  transitTime?: string;
}

export interface DeliveryId {
  courierId?: string;
  courierName?: string;
  dockId?: string;
  quantity?: number;
  warehouseId?: string;
  accountCarrierName?: string;
}

export interface PickupStoreInfo {
  isPickupStore?: boolean;
  friendlyName?: string;
  address?: Address;
  additionalInfo?: string;
  dockId?: string;
}

export interface PaymentData {
  giftCards?: any[];
  transactions?: Transaction[];
}

export interface Transaction {
  isActive?: boolean;
  transactionId?: string;
  merchantName?: string;
  payments?: Payment[];
}

export interface Payment {
  id?: string;
  paymentSystem?: string;
  paymentSystemName?: string;
  value?: number;
  installments?: number;
  referenceValue?: number;
  cardHolder?: string;
  cardNumber?: string;
  firstDigits?: string;
  lastDigits?: string;
  cvv2?: string;
  expireMonth?: string;
  expireYear?: string;
  url?: string;
  giftCardId?: string;
  giftCardName?: string;
  giftCardCaption?: string;
  redemptionCode?: string;
  group?: string;
  tid?: string;
  dueDate?: string;
  connectorResponses?: any;
}

export interface PackageAttachment {
  packages?: Package[];
}

export interface Package {
  items?: OrderItem[];
  courier?: string;
  invoiceNumber?: string;
  invoiceValue?: number;
  invoiceUrl?: string;
  issuanceDate?: string;
  trackingNumber?: string;
  invoiceKey?: string;
  trackingUrl?: string;
  embeddedInvoice?: string;
  type?: string;
  courierStatus?: any;
  cfop?: string;
  restitutions?: any;
  volumes?: number;
}

export interface Seller {
  id: string;
  name?: string;
  logo?: string;
  fulfillmentEndpoint?: string;
}

// ========== MARKETPLACE API ==========

export interface SellerCommission {
  categoryId?: string;
  categoryName?: string;
  productId?: string;
  skuId?: string;
  freightCommissionPercentage?: number;
  productCommissionPercentage?: number;
}

export interface SKUApproval {
  sellerId: string;
  sellerSkuId: string;
  approvalStatus?: 'approved' | 'pending' | 'denied';
}

export interface SellerInvitation {
  sellerId?: string;
  sellerName: string;
  sellerEmail: string;
  salesChannel?: string;
}

// ========== LOGISTICS API ==========

export interface ShippingPolicy {
  id?: string;
  name: string;
  shippingMethod?: string;
  weekendAndHolidays?: {
    saturday: boolean;
    sunday: boolean;
    holiday: boolean;
  };
  carrierSchedule?: Array<{
    dayOfWeek: number;
    openingTime: string;
    closingTime: string;
  }>;
  maxDimension?: {
    maxSumDimension?: number;
    cubicWeight?: number;
    weight?: number;
    width?: number;
    height?: number;
    length?: number;
  };
  deliveryChannel?: string;
  pickupStoreInfo?: {
    isPickupStore: boolean;
    storeId?: string;
    friendlyName?: string;
    address?: Address;
    additionalInfo?: string;
    dockId?: string;
  };
}

export interface FreightValue {
  country: string;
  zipCodeStart: string;
  zipCodeEnd: string;
  weightStart?: number;
  weightEnd?: number;
  absoluteMoneyCost: number;
  pricePercent?: number;
  pricePercentByWeight?: number;
  maxVolume?: number;
  timeCost?: string;
  polygon?: string;
}

// ========== FILTERS AND PARAMS ==========

export interface OrderFilters {
  orderId?: string;
  f_creationDate?: string;
  f_status?: string;
  page?: number;
  per_page?: number;
  orderBy?: string;
}

export interface CatalogFilters {
  page?: number;
  pageSize?: number;
}

export interface PricingFilters {
  an?: string;
}

// ========== CHECKOUT API ==========

export interface OrderForm {
  orderFormId?: string;
  salesChannel?: string;
  loggedIn?: boolean;
  isCheckedIn?: boolean;
  storeId?: string;
  checkedInPickupPointId?: string;
  allowManualPrice?: boolean;
  canEditData?: boolean;
  userProfileId?: string;
  userType?: string;
  ignoreProfileData?: boolean;
  value?: number;
  messages?: any[];
  items?: OrderFormItem[];
  selectableGifts?: any[];
  totalizers?: Totalizer[];
  shippingData?: OrderFormShippingData;
  clientProfileData?: OrderFormClientProfileData;
  paymentData?: OrderFormPaymentData;
  marketingData?: OrderFormMarketingData;
  sellers?: any[];
  clientPreferencesData?: any;
  commercialConditionData?: any;
  storePreferencesData?: any;
  giftRegistryData?: any;
  openTextField?: any;
  invoiceData?: any;
  customData?: any;
  itemMetadata?: any;
  hooksData?: any;
  ratesAndBenefitsData?: any;
  subscriptionData?: any;
  itemsOrdination?: any;
}

export interface OrderFormItem {
  uniqueId?: string;
  id: string;
  productId?: string;
  productRefId?: string;
  refId?: string;
  ean?: string;
  name?: string;
  skuName?: string;
  modalType?: any;
  parentItemIndex?: any;
  parentAssemblyBinding?: any;
  assemblies?: any[];
  priceValidUntil?: string;
  tax?: number;
  price?: number;
  listPrice?: number;
  manualPrice?: any;
  manualPriceAppliedBy?: any;
  sellingPrice?: number;
  rewardValue?: number;
  isGift?: boolean;
  additionalInfo?: any;
  preSaleDate?: any;
  productCategoryIds?: string;
  productCategories?: any;
  quantity: number;
  seller?: string;
  sellerChain?: string[];
  imageUrl?: string;
  detailUrl?: string;
  components?: any[];
  bundleItems?: any[];
  attachments?: any[];
  attachmentOfferings?: any[];
  offerings?: any[];
  priceTags?: any[];
  availability?: string;
  measurementUnit?: string;
  unitMultiplier?: number;
}

export interface Totalizer {
  id: string;
  name: string;
  value: number;
}

export interface OrderFormShippingData {
  address?: Address;
  logisticsInfo?: any[];
  selectedAddresses?: Address[];
  availableAddresses?: Address[];
  pickupPoints?: any[];
}

export interface OrderFormClientProfileData {
  email?: string;
  firstName?: string;
  lastName?: string;
  document?: string;
  documentType?: string;
  phone?: string;
  corporateName?: string;
  tradeName?: string;
  corporateDocument?: string;
  stateInscription?: string;
  corporatePhone?: string;
  isCorporate?: boolean;
  profileCompleteOnLoading?: boolean;
  profileErrorOnLoading?: boolean;
  customerClass?: any;
}

export interface OrderFormPaymentData {
  installmentOptions?: any[];
  paymentSystems?: any[];
  payments?: any[];
  giftCards?: any[];
  giftCardMessages?: any[];
  availableAccounts?: any[];
  availableTokens?: any[];
}

export interface OrderFormMarketingData {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmiPage?: string;
  utmiPart?: string;
  utmiCampaign?: string;
  coupon?: string;
  marketingTags?: string[];
}

export interface ShippingSimulation {
  items: Array<{
    id: string;
    quantity: number;
    seller: string;
  }>;
  postalCode?: string;
  country: string;
}

// ========== MASTER DATA API ==========

export interface MasterDataEntity {
  id?: string;
  [key: string]: any;
}

export interface MasterDataDocument {
  id?: string;
  fields?: Record<string, any>;
}

export interface MasterDataSchema {
  name: string;
  fields: Record<string, MasterDataField>;
}

export interface MasterDataField {
  type: string;
  displayName?: string;
  nullable?: boolean;
  indexed?: boolean;
}

export interface MasterDataSearchParams {
  fields?: string[];
  where?: string;
  size?: number;
  page?: number;
  sort?: string;
}

export interface ClientData {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  document?: string;
  documentType?: string;
  phone?: string;
  corporateName?: string;
  tradeName?: string;
  corporateDocument?: string;
  stateInscription?: string;
  corporatePhone?: string;
  isCorporate?: boolean;
  addresses?: Address[];
  userProfileId?: string;
}

// ========== SEARCH API ==========

export interface SearchProduct {
  productId: string;
  productName: string;
  brand?: string;
  brandId?: number;
  brandImageUrl?: string;
  linkText?: string;
  productReference?: string;
  categoryId?: string;
  productTitle?: string;
  metaTagDescription?: string;
  releaseDate?: string;
  clusterHighlights?: any;
  productClusters?: any;
  searchableClusters?: any;
  categories?: string[];
  categoriesIds?: string[];
  link?: string;
  description?: string;
  items?: SearchSKU[];
  priceRange?: {
    sellingPrice: {
      highPrice: number;
      lowPrice: number;
    };
    listPrice: {
      highPrice: number;
      lowPrice: number;
    };
  };
}

export interface SearchSKU {
  itemId: string;
  name: string;
  nameComplete?: string;
  complementName?: string;
  ean?: string;
  referenceId?: Array<{ Key: string; Value: string }>;
  measurementUnit?: string;
  unitMultiplier?: number;
  modalType?: any;
  isKit?: boolean;
  images?: Array<{
    imageId: string;
    imageLabel: string;
    imageTag: string;
    imageUrl: string;
    imageText: string;
  }>;
  sellers?: Array<{
    sellerId: string;
    sellerName: string;
    addToCartLink: string;
    sellerDefault: boolean;
    commertialOffer: {
      DeliverySlaSamplesPerRegion?: any;
      Installments?: any[];
      DiscountHighLight?: any;
      GiftSkuIds?: any[];
      Teasers?: any[];
      BuyTogether?: any[];
      ItemMetadataAttachment?: any[];
      Price: number;
      ListPrice: number;
      PriceWithoutDiscount?: number;
      RewardValue?: number;
      PriceValidUntil?: string;
      AvailableQuantity: number;
      Tax?: number;
      DeliverySlaSamples?: any[];
      GetInfoErrorMessage?: any;
      CacheVersionUsedToCallCheckout?: string;
    };
  }>;
  Videos?: string[];
  estimatedDateArrival?: any;
}

export interface SearchParams {
  query?: string;
  category?: string;
  brand?: string;
  specificationFilters?: string[];
  priceRange?: string;
  salesChannel?: string;
  orderBy?: 'OrderByTopSaleDESC' | 'OrderByReleaseDateDESC' | 'OrderByBestDiscountDESC' | 'OrderByPriceDESC' | 'OrderByPriceASC' | 'OrderByNameASC' | 'OrderByNameDESC' | 'OrderByScoreDESC';
  from?: number;
  to?: number;
  map?: string;
  fq?: string;
}

export interface FacetSearchResult {
  departments?: SearchFacet[];
  brands?: SearchFacet[];
  specificationFilters?: Record<string, SearchFacet[]>;
  categoriesTrees?: CategoryTree[];
  priceRanges?: PriceRange[];
}

export interface SearchFacet {
  id?: string;
  quantity?: number;
  name?: string;
  link?: string;
  linkEncoded?: string;
  map?: string;
  value?: string;
}

export interface CategoryTree {
  id: string;
  name: string;
  hasChildren: boolean;
  url?: string;
  children?: CategoryTree[];
}

export interface PriceRange {
  slug: string;
  quantity: number;
  name: string;
  link: string;
  linkEncoded: string;
}

// ========== REVIEWS AND RATINGS API ==========

export interface Review {
  id?: string;
  productId: string;
  rating: number;
  title?: string;
  text?: string;
  reviewerName?: string;
  shopperId?: string;
  reviewDateTime?: string;
  verifiedPurchaser?: boolean;
  sku?: string;
  approved?: boolean;
  location?: string;
  locale?: string;
}

export interface ReviewSummary {
  productId: string;
  average: number;
  totalCount: number;
  distribution?: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface ReviewFilters {
  productId?: string;
  approved?: boolean;
  from?: string;
  to?: string;
  orderBy?: 'reviewDateTime:desc' | 'reviewDateTime:asc' | 'rating:desc' | 'rating:asc';
  page?: number;
  pageSize?: number;
}

// ========== PAYMENT GATEWAY API ==========

export interface PaymentProvider {
  id?: string;
  name: string;
  connector: string;
  isConnectorBeta?: boolean;
  configuration: Record<string, any>;
  affiliationId?: string;
}

export interface PaymentMethod {
  id?: string;
  name: string;
  paymentSystem?: string;
  allowIssuer?: boolean;
  isCustom?: boolean;
  requiresDocument?: boolean;
  implementation?: string;
  connectorResponses?: any;
}

export interface Transaction {
  id?: string;
  transactionId?: string;
  referenceKey?: string;
  referenceValue?: string;
  interactions?: any[];
}

export interface PaymentCondition {
  id?: string;
  name?: string;
  description?: string;
  paymentSystem: string;
  installments?: number;
  installmentsInterestRate?: number;
  installmentsValue?: number;
  validFrom?: string;
  validTo?: string;
  isDefault?: boolean;
}

// ========== SESSION MANAGER API ==========

export interface SessionData {
  id?: string;
  namespaces?: {
    account?: {
      accountName?: string;
      id?: string;
    };
    profile?: {
      email?: string;
      firstName?: string;
      lastName?: string;
      document?: string;
      id?: string;
      isAuthenticated?: boolean;
    };
    public?: {
      country?: string;
      postalCode?: string;
      geoCoordinates?: number[];
      utm_source?: string;
      utm_medium?: string;
      utm_campaign?: string;
      utmi_campaign?: string;
    };
    store?: {
      channel?: string;
      countryCode?: string;
      cultureInfo?: string;
      currencyCode?: string;
      currencySymbol?: string;
    };
  };
}

export interface SessionSegment {
  campaigns?: string[];
  utm_source?: string;
  utm_campaign?: string;
  utmi_campaign?: string;
  regionId?: string;
  postalCode?: string;
  geoCoordinates?: number[];
}

// ========== GIFT CARD API ==========

export interface GiftCard {
  id?: string;
  redemptionToken?: string;
  redemptionCode?: string;
  balance: number;
  relationName?: string;
  emissionDate?: string;
  expiringDate?: string;
  caption?: string;
  provider?: string;
  multipleCredits?: boolean;
  multipleRedemptions?: boolean;
  restrictedToOwner?: boolean;
  status?: 'active' | 'inactive' | 'expired';
  transactions?: GiftCardTransaction[];
}

export interface GiftCardTransaction {
  id?: string;
  redemptionToken?: string;
  value: number;
  date?: string;
  requestId?: string;
  settlementId?: string;
  operation: 'Credit' | 'Debit';
  description?: string;
  orderId?: string;
}

export interface CreateGiftCardRequest {
  relationName?: string;
  caption?: string;
  expiringDate?: string;
  profileId?: string;
  restrictedToOwner?: boolean;
  multipleCredits?: boolean;
  multipleRedemptions?: boolean;
  balance: number;
}

export interface GiftCardProvider {
  id?: string;
  serviceUrl: string;
  oauthProvider?: string;
  preAuthEnabled?: boolean;
  cancelEnabled?: boolean;
  appKey?: string;
  appToken?: string;
}

// ========== SUBSCRIPTIONS API ==========

export interface Subscription {
  id?: string;
  name?: string;
  planId?: string;
  skuId?: string;
  status?: 'ACTIVE' | 'PAUSED' | 'CANCELED';
  frequency?: {
    periodicity: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
    interval: number;
  };
  purchaseDay?: string;
  creationDate?: string;
  subscriberId?: string;
  addressId?: string;
  paymentMethodId?: string;
  nextPurchaseDate?: string;
  lastPurchaseDate?: string;
  items?: SubscriptionItem[];
}

export interface SubscriptionItem {
  id?: string;
  skuId: string;
  quantity: number;
  seller?: string;
  name?: string;
  price?: number;
  listPrice?: number;
}

export interface SubscriptionPlan {
  id?: string;
  name: string;
  frequency: {
    periodicity: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
    interval: number;
  };
  validity?: {
    begin: string;
    end?: string;
  };
  skus?: Array<{
    skuId: string;
    discount?: number;
  }>;
}

export interface SubscriptionFilters {
  status?: 'ACTIVE' | 'PAUSED' | 'CANCELED';
  subscriberId?: string;
  page?: number;
  perPage?: number;
}

// ========== CMS API ==========

export interface CMSTemplate {
  id?: string;
  name: string;
  templateType?: 'html' | 'subtemplate';
  html?: string;
  templates?: string[];
  isSiteEditor?: boolean;
}

export interface CMSLayout {
  id?: string;
  name: string;
  template?: string;
  placeholders?: Array<{
    name: string;
    controls?: Array<{
      id: string;
      properties?: Record<string, any>;
    }>;
  }>;
}

export interface CMSFile {
  id?: string;
  name: string;
  path: string;
  content?: string;
  encoding?: 'base64' | 'utf8';
}

export interface CMSPage {
  id?: string;
  name: string;
  urlPath: string;
  template?: string;
  layout?: string;
  description?: string;
  keywords?: string[];
  isActive?: boolean;
}

// ========== MESSAGE CENTER API ==========

export interface EmailTemplate {
  id?: string;
  name: string;
  templateId?: string;
  friendlyName?: string;
  description?: string;
  isDefaultTemplate?: boolean;
  accountName?: string;
  templates?: {
    email?: {
      to?: string;
      cc?: string;
      bcc?: string;
      subject?: string;
      message?: string;
      providerName?: string;
    };
    sms?: {
      to?: string;
      message?: string;
      providerName?: string;
    };
  };
  type?: string;
  applicationId?: string;
}

export interface EmailMessage {
  templateName: string;
  providerName?: string;
  jsonData: Record<string, any>;
}

export interface SMTPConfiguration {
  id?: string;
  name: string;
  host: string;
  port: number;
  username: string;
  password?: string;
  enableSsl?: boolean;
  isDefault?: boolean;
}

// ========== VTEX ID API ==========

export interface VTEXUser {
  id?: string;
  user: string;
  email?: string;
  userId?: string;
  accountId?: string;
  accountName?: string;
  authStatus?: 'Success' | 'WrongCredentials' | 'Blocked';
  token?: string;
  expires?: number;
}

export interface UserCredential {
  user: string;
  password: string;
}

export interface OAuthToken {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
}

export interface VTEXUserProfile {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  document?: string;
  documentType?: string;
  phone?: string;
  userId?: string;
  isAuthenticated?: boolean;
}

export interface AppToken {
  id?: string;
  label: string;
  appKey?: string;
  appToken?: string;
  createdAt?: string;
  expiresAt?: string;
}

