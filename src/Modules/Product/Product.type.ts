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
    isFeatured: Boolean
    productCategoriesID: String
    productCategoriesCode: String
    productCategories: ProductCategory
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
    isFeatured: Boolean
    productCategoriesID: String!
    productCategoriesCode: String!
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
    couponCode: String
  }

  input UpdateProductInput {
    name: String
    price: Float
    mrp: Float
    discountPercentage: Float
    images: [String]
    brand: String
    isFeatured: Boolean
    productCategoriesID: String
    productCategoriesCode: String
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
    couponCode: String
  }

  type FilterOption {
    name: String!
    count: Int!
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

  input ProductFilterInput {
    sizes: [String]
    colors: [String]
    brands: [String]
    stock: [String]
    price: PriceRangeInput
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
    getCategoryFilters(code: String!): CategoryFilters
  }

  type Mutation {
    createProduct(input: CreateProductInput!): Product!
    updateProduct(id: ID!, input: UpdateProductInput!): Product!
    deleteProduct(id: ID!): String!
    addProductSize(productId: ID!, input: VariantInput!): Product!
  }


`;