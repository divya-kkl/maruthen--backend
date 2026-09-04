import { gql } from "apollo-server-express";

export const ProductType = gql`
  type Variant {
    color: String!
    size: String!
    stock: Float!
  }

  type Product {
    id: ID!
    name: String!
    price: Float!
    mrp: Float!
    discountPercentage: Float
    images: [String]!
    brand: String!
    hasSize: Boolean
    isFeatured: Boolean
    productCategoriesID: String
    productCategoriesCode: String
    productCategories: ProductCategory
    productSubCategoriesID: String
    productSubCategoriesCode: String
    productSubCategories: SubCategory
    tags: [Tag]
    variants: [Variant]!
    description: String
    material: String
    embellishment: String
    neck: String
    sleeves: String
    closure: String
    lining: String
    washCare: String
    ironCare: String
    metalColor: String
    weight: String
    metalPurity: String
    stoneType: String
    couponCode: String
    createdAt: String
    updatedAt: String
    rating: Float
    numReviews: Int
  }

  input VariantInput {
    color: String!
    size: String!
    stock: Float!
  }

  input CreateProductInput {
    name: String!
    price: Float!
    mrp: Float!
    discountPercentage: Float
    images: [String]!
    brand: String!
    hasSize: Boolean
    isFeatured: Boolean
    productCategoriesID: String!
    productCategoriesCode: String!
    productSubCategoriesID: String
    productSubCategoriesCode: String
    tags: [ID]
    variants: [VariantInput]!
    description: String
    material: String
    embellishment: String
    neck: String
    sleeves: String
    closure: String
    lining: String
    washCare: String
    ironCare: String
    metalColor: String
    weight: String
    metalPurity: String
    stoneType: String
    couponCode: String
  }

  input UpdateProductInput {
    name: String
    price: Float
    mrp: Float
    discountPercentage: Float
    images: [String]
    brand: String
    hasSize: Boolean
    isFeatured: Boolean
    productCategoriesID: String
    productCategoriesCode: String
    productSubCategoriesID: String
    productSubCategoriesCode: String
    tags: [ID]
    variants: [VariantInput]
    description: String
    material: String
    embellishment: String
    neck: String
    sleeves: String
    closure: String
    lining: String
    washCare: String
    ironCare: String
    metalColor: String
    weight: String
    metalPurity: String
    stoneType: String
    couponCode: String
  }

  type FilterOption {
    name: String!
    count: Int!
  }

  type DynamicFilter {
    name: String!
    options: [FilterOption]!
  }

  type PriceRange {
    min: Float!
    max: Float!
  }

  type StockFilter {
    inStock: Int!
    outOfStock: Int!
  }

  type CategoryFilters {
    sizes: [FilterOption]!
    colors: [FilterOption]!
    brands: [FilterOption]!
    stock: StockFilter!
    price: PriceRange!
    dynamicFilters: [DynamicFilter]!
  }

  type CategoryProductsResponse {
    products: [Product]!
    filters: CategoryFilters!
    totalCount: Int
  }

  input PriceRangeInput {
    min: Float
    max: Float
  }

  input DynamicFilterInput {
    name: String!
    values: [String]!
  }

  input ProductFilterInput {
    sizes: [String]
    colors: [String]
    brands: [String]
    stock: [String]
    price: PriceRangeInput
    dynamicFilters: [DynamicFilterInput]
  }

  type ProductResponse {
    products: [Product]
    totalCount: Int
    categories: [ProductCategory]
  }

  type Query {
    getAllProducts(search: String, page: Int, limit: Int, filters: ProductFilterInput): ProductResponse

    getProductById(id: ID!): Product
    getProduct(search: String, page: Int, limit: Int): ProductResponse
    getProductsByCategoryCode(code: String!, search: String, page: Int, limit: Int, sort: String, filters: ProductFilterInput): CategoryProductsResponse
    getProductsByTagCode(code: String!, search: String, page: Int, limit: Int, sort: String, filters: ProductFilterInput): CategoryProductsResponse
    getCategoryFilters(code: String!): CategoryFilters
    getTagFilters(code: String!): CategoryFilters
    getRelatedProducts(productId: ID!, limit: Int): [Product]!
    searchProducts(search: String, page: Int, limit: Int, filters: ProductFilterInput): ProductResponse
  }

  type Mutation {
    createProduct(input: CreateProductInput!): Product!
    updateProduct(id: ID!, input: UpdateProductInput!): Product!
    deleteProduct(id: ID!): String!
    addProductSize(productId: ID!, input: VariantInput!): Product!
  }


`;
// Trigger reload
