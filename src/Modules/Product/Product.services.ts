import { productModel } from "../../DB/MongoDB/Product/Product.js";

export const ProductService = {
    async getAllProducts(search?: string, page?: number, limit?: number, filters?: any) {
        let filter: any = {};
        if (search) {
            const regex = new RegExp(search, 'i');
            filter = {
                $or: [
                    { name: { $regex: regex } },
                    { brand: { $regex: regex } }
                ]
            };
        }

        if (filters) {
            const andConditions: any[] = [];

            if (filters.sizes && filters.sizes.length > 0) {
                andConditions.push({ "variants.size": { $in: filters.sizes } });
            }
            if (filters.colors && filters.colors.length > 0) {
                andConditions.push({ "variants.color": { $in: filters.colors } });
            }
            if (filters.brands && filters.brands.length > 0) {
                andConditions.push({ brand: { $in: filters.brands } });
            }
            if (filters.stock && filters.stock.length > 0) {
                const stockConditions = [];
                if (filters.stock.includes("In stock")) {
                    stockConditions.push({ "variants.stock": { $gt: 0 } });
                }
                if (filters.stock.includes("Out of stock")) {
                    stockConditions.push({ "variants.stock": { $lte: 0 } });
                }
                if (stockConditions.length > 0) {
                    andConditions.push({ $or: stockConditions });
                }
            }
            if (filters.price && (filters.price.min > 0 || filters.price.max > 0)) {
                const priceQuery: any = {};
                if (filters.price.min >= 0) priceQuery.$gte = filters.price.min;
                if (filters.price.max > 0) priceQuery.$lte = filters.price.max;
                andConditions.push({ price: priceQuery });
            }
            if (filters.dynamicFilters && filters.dynamicFilters.length > 0) {
                filters.dynamicFilters.forEach((df: any) => {
                    if (df.name === "Material" && df.values.length > 0) {
                        andConditions.push({ material: { $in: df.values } });
                    }
                });
            }

            if (andConditions.length > 0) {
                if (Object.keys(filter).length > 0) {
                    filter = { $and: [filter, ...andConditions] };
                } else {
                    filter = { $and: andConditions };
                }
            }
        }

        let totalCount = await productModel.countDocuments(filter);
        let query = productModel.find(filter).populate("productCategoriesID").populate("productSubCategoriesID").populate("tags").sort({ updatedAt: -1, createdAt: -1 });
        if (page && limit) {
            const skip = (page - 1) * limit;
            query = query.skip(skip).limit(limit);
        }

        const products = await query;
        const mappedProducts = products.map((product) => ({
            id: product._id,
            name: product.name,
            price: product.price,
            mrp: product.mrp,
            discountPercentage: product.discountPercentage,
            images: product.images,
            brand: product.brand,
            hasSize: product.hasSize,
            isFeatured: product.isFeatured,
            productCategoriesID: (product.productCategoriesID as any)?._id?.toString() || product.productCategoriesID?.toString() || "",
            productCategoriesCode: (product.productCategoriesID as any)?.code || "",
            productCategories: product.productCategoriesID,
            productSubCategoriesID: (product.productSubCategoriesID as any)?._id?.toString() || product.productSubCategoriesID?.toString() || "",
            productSubCategoriesCode: (product.productSubCategoriesID as any)?.code || "",
            productSubCategories: product.productSubCategoriesID,
            tags: product.tags,
            variants: product.variants,
            description: product.description,
            material: product.material,
            embellishment: product.embellishment,
            neck: product.neck,
            sleeves: product.sleeves,
            closure: product.closure,
            lining: product.lining,
            washCare: product.washCare,
            ironCare: product.ironCare,
            couponCode: product.couponCode,
            rating: product.rating || 0,
            numReviews: product.numReviews || 0,
            createdAt: product.createdAt?.toString(),
            updatedAt: (product as any).updatedAt?.toString()
        }));

        const { productCategoryMOdel } = await import("../../DB/MongoDB/ProductCategories/ProductCategories.js");
        const categoriesRaw = await productCategoryMOdel.find().sort({ createdTime: 1 });
        const categoriesList = categoriesRaw.map((category: any) => ({
            id: category._id,
            name: category.name,
            code: category.code,
            description: category.description,
            imageUrl: category.imageUrl,
            status: category.status,
            parentCategoryId: category.parentCategoryId?.toString(),
            createdTime: category.createdTime?.toString()
        }));

        return {
            products: mappedProducts,
            totalCount,
            categories: categoriesList
        };
    },



    async searchProducts(search?: string, page?: number, limit?: number, filters?: any) {
        let filter: any = {};
        if (search) {
            const regex = new RegExp(search, 'i');
            filter = {
                $or: [
                    { name: { $regex: regex } },
                    { brand: { $regex: regex } }
                ]
            };
        }

        if (filters) {
            const andConditions: any[] = [];

            if (filters.sizes && filters.sizes.length > 0) {
                andConditions.push({ "variants.size": { $in: filters.sizes } });
            }
            if (filters.colors && filters.colors.length > 0) {
                andConditions.push({ "variants.color": { $in: filters.colors } });
            }
            if (filters.brands && filters.brands.length > 0) {
                andConditions.push({ brand: { $in: filters.brands } });
            }
            if (filters.stock && filters.stock.length > 0) {
                const stockConditions = [];
                if (filters.stock.includes("In stock")) {
                    stockConditions.push({ "variants.stock": { $gt: 0 } });
                }
                if (filters.stock.includes("Out of stock")) {
                    stockConditions.push({ "variants.stock": { $lte: 0 } });
                }
                if (stockConditions.length > 0) {
                    andConditions.push({ $or: stockConditions });
                }
            }
            if (filters.price && (filters.price.min > 0 || filters.price.max > 0)) {
                const priceQuery: any = {};
                if (filters.price.min >= 0) priceQuery.$gte = filters.price.min;
                if (filters.price.max > 0) priceQuery.$lte = filters.price.max;
                andConditions.push({ price: priceQuery });
            }
            if (filters.dynamicFilters && filters.dynamicFilters.length > 0) {
                filters.dynamicFilters.forEach((df: any) => {
                    if (df.name === "Material" && df.values.length > 0) {
                        andConditions.push({ material: { $in: df.values } });
                    }
                });
            }

            if (andConditions.length > 0) {
                if (Object.keys(filter).length > 0) {
                    filter = { $and: [filter, ...andConditions] };
                } else {
                    filter = { $and: andConditions };
                }
            }
        }

        let totalCount = await productModel.countDocuments(filter);
        let query = productModel.find(filter).populate("productCategoriesID").populate("productSubCategoriesID").populate("tags").sort({ updatedAt: -1, createdAt: -1 });
        if (page && limit) {
            const skip = (page - 1) * limit;
            query = query.skip(skip).limit(limit);
        }

        const products = await query;
        const mappedProducts = products.map((product) => ({
            id: product._id,
            name: product.name,
            price: product.price,
            mrp: product.mrp,
            discountPercentage: product.discountPercentage,
            images: product.images,
            brand: product.brand,
            hasSize: product.hasSize,
            isFeatured: product.isFeatured,
            productCategoriesID: (product.productCategoriesID as any)?._id?.toString() || product.productCategoriesID?.toString() || "",
            productCategoriesCode: (product.productCategoriesID as any)?.code || "",
            productCategories: product.productCategoriesID,
            productSubCategoriesID: (product.productSubCategoriesID as any)?._id?.toString() || product.productSubCategoriesID?.toString() || "",
            productSubCategoriesCode: (product.productSubCategoriesID as any)?.code || "",
            productSubCategories: product.productSubCategoriesID,
            tags: product.tags,
            variants: product.variants,
            description: product.description,
            material: product.material,
            embellishment: product.embellishment,
            neck: product.neck,
            sleeves: product.sleeves,
            closure: product.closure,
            lining: product.lining,
            washCare: product.washCare,
            ironCare: product.ironCare,
            couponCode: product.couponCode,
            rating: product.rating || 0,
            numReviews: product.numReviews || 0,
            createdAt: product.createdAt?.toString(),
            updatedAt: (product as any).updatedAt?.toString()
        }));

        const { productCategoryMOdel } = await import("../../DB/MongoDB/ProductCategories/ProductCategories.js");
        const categoriesRaw = await productCategoryMOdel.find().sort({ createdTime: 1 });
        const categoriesList = categoriesRaw.map((category: any) => ({
            id: category._id,
            name: category.name,
            code: category.code,
            description: category.description,
            imageUrl: category.imageUrl,
            status: category.status,
            parentCategoryId: category.parentCategoryId?.toString(),
            createdTime: category.createdTime?.toString()
        }));

        return {
            products: mappedProducts,
            totalCount,
            categories: categoriesList
        };
    },




    async getProduct(search?: string, page?: number, limit?: number) {
        return ProductService.getAllProducts(search, page, limit);
    },

    async getProductsByCategoryCode(code: string, search?: string, page?: number, limit?: number, sort?: string, filters?: any) {
        const { productCategoryMOdel } = await import("../../DB/MongoDB/ProductCategories/ProductCategories.js");
        const category = await productCategoryMOdel.findOne({ code: { $regex: new RegExp(`^${code}$`, 'i') } });

        if (!category) {
            return [];
        }

        let filter: any = {
            $or: [
                { productCategoriesID: category._id },
                { productCategoriesCode: { $regex: new RegExp(`^${code}$`, 'i') } }
            ]
        };

        if (search) {
            const regex = new RegExp(search, 'i');
            filter = {
                $and: [
                    filter,
                    {
                        $or: [
                            { name: { $regex: regex } },
                            { brand: { $regex: regex } }
                        ]
                    }
                ]
            };
        }

        if (filters) {
            const andConditions: any[] = [];

            if (filters.sizes && filters.sizes.length > 0) {
                andConditions.push({ "variants.size": { $in: filters.sizes } });
            }
            if (filters.colors && filters.colors.length > 0) {
                andConditions.push({ "variants.color": { $in: filters.colors } });
            }
            if (filters.brands && filters.brands.length > 0) {
                andConditions.push({ brand: { $in: filters.brands } });
            }
            if (filters.stock && filters.stock.length > 0) {
                const stockConditions = [];
                if (filters.stock.includes("In stock")) {
                    stockConditions.push({ "variants.stock": { $gt: 0 } });
                }
                if (filters.stock.includes("Out of stock")) {
                    stockConditions.push({ "variants.stock": { $lte: 0 } }); // or no stock
                }
                if (stockConditions.length > 0) {
                    andConditions.push({ $or: stockConditions });
                }
            }
            if (filters.price && (filters.price.min > 0 || filters.price.max > 0)) {
                const priceQuery: any = {};
                if (filters.price.min >= 0) priceQuery.$gte = filters.price.min;
                if (filters.price.max > 0) priceQuery.$lte = filters.price.max;
                andConditions.push({ price: priceQuery });
            }
            if (filters.dynamicFilters && filters.dynamicFilters.length > 0) {
                filters.dynamicFilters.forEach((df: any) => {
                    if (df.name === "Material" && df.values.length > 0) {
                        const regexes = df.values.map((v: string) => new RegExp(`^${v.trim()}$`, 'i'));
                        andConditions.push({ material: { $in: regexes } });
                    }
                });
            }

            if (andConditions.length > 0) {
                if (filter.$and) {
                    filter.$and.push(...andConditions);
                } else {
                    filter.$and = andConditions;
                }
            }
        }

        let sortOption: any = { updatedAt: -1, createdAt: -1 };
        let useCollation = false;
        if (sort) {
            switch (sort) {
                case 'price-low':
                    sortOption = { price: 1 };
                    break;
                case 'price-high':
                    sortOption = { price: -1 };
                    break;
                case 'atoz':
                    sortOption = { name: 1 };
                    useCollation = true;
                    break;
                case 'ztoa':
                    sortOption = { name: -1 };
                    useCollation = true;
                    break;
                case 'features':
                    sortOption = { isFeatured: -1, updatedAt: -1, createdAt: -1 };
                    break;
                case 'bestselling':
                case 'most-relevant':
                default:
                    sortOption = { updatedAt: -1, createdAt: -1 };
                    break;
            }
        }

        const totalCount = await productModel.countDocuments(filter);

        let query = productModel.find(filter).populate("productCategoriesID").populate("productSubCategoriesID").populate("tags").sort(sortOption);
        if (useCollation) {
            query = query.collation({ locale: 'en', strength: 2 });
        }
        if (page && limit) {
            const skip = (page - 1) * limit;
            query = query.skip(skip).limit(limit);
        }
        const products = await query;
        const mappedProducts = products.map((product) => ({
            id: product._id,
            name: product.name,
            price: product.price,
            mrp: product.mrp,
            discountPercentage: product.discountPercentage,
            images: product.images,
            brand: product.brand,
            hasSize: product.hasSize,
            isFeatured: product.isFeatured,
            productCategoriesID: (product.productCategoriesID as any)?._id?.toString() || product.productCategoriesID?.toString() || "",
            productCategoriesCode: (product.productCategoriesID as any)?.code || "",
            productCategories: product.productCategoriesID,
            productSubCategoriesID: (product.productSubCategoriesID as any)?._id?.toString() || product.productSubCategoriesID?.toString() || "",
            productSubCategoriesCode: (product.productSubCategoriesID as any)?.code || "",
            productSubCategories: product.productSubCategoriesID,
            tags: product.tags,
            variants: product.variants,
            description: product.description,
            material: product.material,
            embellishment: product.embellishment,
            neck: product.neck,
            sleeves: product.sleeves,
            closure: product.closure,
            lining: product.lining,
            washCare: product.washCare,
            ironCare: product.ironCare,
            rating: product.rating || 0,
            numReviews: product.numReviews || 0,
            createdAt: product.createdAt?.toString(),
            updatedAt: (product as any).updatedAt?.toString()
        }));

        const categoryFilters = await ProductService.getCategoryFilters(code);

        return {
            products: mappedProducts,
            filters: categoryFilters,
            totalCount
        };
    },

    async getCategoryFilters(code: string) {
        const { productCategoryMOdel } = await import("../../DB/MongoDB/ProductCategories/ProductCategories.js");
        const category = await productCategoryMOdel.findOne({ code: { $regex: new RegExp(`^${code}$`, 'i') } });

        let filter: any = {
            $or: [
                { productCategoriesCode: { $regex: new RegExp(`^${code}$`, 'i') } }
            ]
        };

        if (category) {
            filter.$or.push({ productCategoriesID: category._id });
        }

        const products = await productModel.find(filter);

        const sizes: any = {};
        const colors: any = {};
        const brands: any = {};
        const materials: any = {};
        let inStock = 0;
        let outOfStock = 0;
        let minPrice = Infinity;
        let maxPrice = -Infinity;

        products.forEach(p => {
            const hasStock = p.variants?.some(v => v.stock > 0);
            if (hasStock) inStock++;
            else outOfStock++;

            if (p.price < minPrice) minPrice = p.price;
            if (p.price > maxPrice) maxPrice = p.price;

            if (p.brand) {
                brands[p.brand] = (brands[p.brand] || 0) + 1;
            }

            if (p.material) {
                const normalizedMaterial = p.material.trim().split(/\s+/).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
                materials[normalizedMaterial] = (materials[normalizedMaterial] || 0) + 1;
            }

            p.variants?.forEach(v => {
                if (v.size) sizes[v.size] = (sizes[v.size] || 0) + 1;
                if (v.color) colors[v.color] = (colors[v.color] || 0) + 1;
            });
        });

        if (minPrice === Infinity) minPrice = 0;
        if (maxPrice === -Infinity) maxPrice = 0;

        const dynamicFilters = [];
        if (Object.keys(materials).length > 0) {
            dynamicFilters.push({
                name: "Material",
                options: Object.entries(materials).map(([name, count]) => ({ name, count: count as number })).sort((a, b) => b.count - a.count)
            });
        }

        return {
            sizes: Object.entries(sizes).map(([name, count]) => ({ name, count: count as number })).sort((a, b) => b.count - a.count),
            colors: Object.entries(colors).map(([name, count]) => ({ name, count: count as number })).sort((a, b) => b.count - a.count),
            brands: Object.entries(brands).map(([name, count]) => ({ name, count: count as number })).sort((a, b) => b.count - a.count),
            stock: { inStock, outOfStock },
            price: { min: minPrice, max: maxPrice },
            dynamicFilters
        };
    },

    async getTagFilters(code: string) {
        const { tagModel } = await import("../../DB/MongoDB/Tag/Tag.js");
        const tag = await tagModel.findOne({ code: { $regex: new RegExp(`^${code}$`, 'i') } });

        if (!tag) {
            return {
                sizes: [], colors: [], brands: [],
                stock: { inStock: 0, outOfStock: 0 },
                price: { min: 0, max: 0 },
                dynamicFilters: []
            };
        }

        const filter: any = { tags: tag._id };
        const products = await productModel.find(filter);

        const sizes: any = {};
        const colors: any = {};
        const brands: any = {};
        const materials: any = {};
        let inStock = 0;
        let outOfStock = 0;
        let minPrice = Infinity;
        let maxPrice = -Infinity;

        products.forEach(p => {
            const hasStock = p.variants?.some(v => v.stock > 0);
            if (hasStock) inStock++;
            else outOfStock++;

            if (p.price < minPrice) minPrice = p.price;
            if (p.price > maxPrice) maxPrice = p.price;

            if (p.brand) {
                brands[p.brand] = (brands[p.brand] || 0) + 1;
            }

            if (p.material) {
                const normalizedMaterial = p.material.trim().split(/\s+/).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
                materials[normalizedMaterial] = (materials[normalizedMaterial] || 0) + 1;
            }

            p.variants?.forEach(v => {
                if (v.size) sizes[v.size] = (sizes[v.size] || 0) + 1;
                if (v.color) colors[v.color] = (colors[v.color] || 0) + 1;
            });
        });

        if (minPrice === Infinity) minPrice = 0;
        if (maxPrice === -Infinity) maxPrice = 0;

        const dynamicFilters = [];
        if (Object.keys(materials).length > 0) {
            dynamicFilters.push({
                name: "Material",
                options: Object.entries(materials).map(([name, count]) => ({ name, count: count as number })).sort((a, b) => b.count - a.count)
            });
        }

        return {
            sizes: Object.entries(sizes).map(([name, count]) => ({ name, count: count as number })).sort((a, b) => b.count - a.count),
            colors: Object.entries(colors).map(([name, count]) => ({ name, count: count as number })).sort((a, b) => b.count - a.count),
            brands: Object.entries(brands).map(([name, count]) => ({ name, count: count as number })).sort((a, b) => b.count - a.count),
            stock: { inStock, outOfStock },
            price: { min: minPrice, max: maxPrice },
            dynamicFilters
        };
    },

    async getProductById(id: string) {
        const product = await productModel.findById(id).populate("productCategoriesID").populate("productSubCategoriesID").populate("tags");
        if (!product) {
            throw new Error("Product not found");
        }
        return {
            id: product._id,
            name: product.name,
            price: product.price,
            mrp: product.mrp,
            discountPercentage: product.discountPercentage,
            images: product.images,
            brand: product.brand,
            hasSize: product.hasSize,
            isFeatured: product.isFeatured,
            productCategoriesID: (product.productCategoriesID as any)?._id?.toString() || product.productCategoriesID?.toString() || "",
            productCategoriesCode: (product.productCategoriesID as any)?.code || "",
            productCategories: product.productCategoriesID,
            productSubCategoriesID: (product.productSubCategoriesID as any)?._id?.toString() || product.productSubCategoriesID?.toString() || "",
            productSubCategoriesCode: (product.productSubCategoriesID as any)?.code || "",
            productSubCategories: product.productSubCategoriesID,
            tags: product.tags,
            variants: product.variants,
            description: product.description,
            material: product.material,
            embellishment: product.embellishment,
            neck: product.neck,
            sleeves: product.sleeves,
            closure: product.closure,
            lining: product.lining,
            washCare: product.washCare,
            ironCare: product.ironCare,
            couponCode: product.couponCode,
            rating: product.rating || 0,
            numReviews: product.numReviews || 0,
            createdAt: product.createdAt?.toString(),
            updatedAt: (product as any).updatedAt?.toString()
        };
    },

    async createProduct(input: any) {
        if (input.mrp !== undefined) {
            const discount = input.discountPercentage || 0;
            if (input.price === undefined) {
                input.price = input.mrp - (input.mrp * (discount / 100));
            }
        }
        let newProduct = await productModel.create(input);
        newProduct = await newProduct.populate([{ path: "productCategoriesID" }, { path: "productSubCategoriesID" }, { path: "tags" }]);
        return {
            id: newProduct._id,
            name: newProduct.name,
            price: newProduct.price,
            mrp: newProduct.mrp,
            discountPercentage: newProduct.discountPercentage,
            images: newProduct.images,
            brand: newProduct.brand,
            hasSize: newProduct.hasSize,
            isFeatured: newProduct.isFeatured,
            productCategoriesID: (newProduct.productCategoriesID as any)?._id?.toString() || newProduct.productCategoriesID?.toString() || "",
            productCategoriesCode: (newProduct.productCategoriesID as any)?.code || "",
            productCategories: newProduct.productCategoriesID,
            productSubCategoriesID: (newProduct.productSubCategoriesID as any)?._id?.toString() || newProduct.productSubCategoriesID?.toString() || "",
            productSubCategoriesCode: (newProduct.productSubCategoriesID as any)?.code || "",
            productSubCategories: newProduct.productSubCategoriesID,
            tags: newProduct.tags,
            variants: newProduct.variants,
            description: newProduct.description,
            material: newProduct.material,
            embellishment: newProduct.embellishment,
            neck: newProduct.neck,
            sleeves: newProduct.sleeves,
            closure: newProduct.closure,
            lining: newProduct.lining,
            washCare: newProduct.washCare,
            ironCare: newProduct.ironCare,
            couponCode: newProduct.couponCode,
            rating: newProduct.rating || 0,
            numReviews: newProduct.numReviews || 0,
            createdAt: newProduct.createdAt?.toString(),
            updatedAt: (newProduct as any).updatedAt?.toString()
        };
    },

    async updateProduct(id: string, input: any) {
        if (input.mrp !== undefined || input.discountPercentage !== undefined) {
            const product = await productModel.findById(id);
            if (product) {
                const mrp = input.mrp !== undefined ? input.mrp : product.mrp;
                const discount = input.discountPercentage !== undefined ? input.discountPercentage : product.discountPercentage;
                if (input.price === undefined) {
                    input.price = mrp - (mrp * (discount / 100));
                }
            }
        }
        let updatedProduct = await productModel.findByIdAndUpdate(id, input, { new: true });
        if (!updatedProduct) {
            throw new Error("Product not found");
        }
        updatedProduct = await updatedProduct.populate([{ path: "productCategoriesID" }, { path: "productSubCategoriesID" }, { path: "tags" }]);
        return {
            id: updatedProduct._id,
            name: updatedProduct.name,
            price: updatedProduct.price,
            mrp: updatedProduct.mrp,
            discountPercentage: updatedProduct.discountPercentage,
            images: updatedProduct.images,
            brand: updatedProduct.brand,
            hasSize: updatedProduct.hasSize,
            isFeatured: updatedProduct.isFeatured,
            productCategoriesID: (updatedProduct.productCategoriesID as any)?._id?.toString() || updatedProduct.productCategoriesID?.toString() || "",
            productCategoriesCode: (updatedProduct.productCategoriesID as any)?.code || "",
            productCategories: updatedProduct.productCategoriesID,
            productSubCategoriesID: (updatedProduct.productSubCategoriesID as any)?._id?.toString() || updatedProduct.productSubCategoriesID?.toString() || "",
            productSubCategoriesCode: (updatedProduct.productSubCategoriesID as any)?.code || "",
            productSubCategories: updatedProduct.productSubCategoriesID,
            tags: updatedProduct.tags,
            variants: updatedProduct.variants,
            description: updatedProduct.description,
            material: updatedProduct.material,
            embellishment: updatedProduct.embellishment,
            neck: updatedProduct.neck,
            sleeves: updatedProduct.sleeves,
            closure: updatedProduct.closure,
            lining: updatedProduct.lining,
            washCare: updatedProduct.washCare,
            ironCare: updatedProduct.ironCare,
            couponCode: updatedProduct.couponCode,
            rating: updatedProduct.rating || 0,
            numReviews: updatedProduct.numReviews || 0,
            createdAt: updatedProduct.createdAt?.toString(),
            updatedAt: (updatedProduct as any).updatedAt?.toString()
        };
    },

    async deleteProduct(id: string) {
        const deletedProduct = await productModel.findByIdAndDelete(id);
        if (!deletedProduct) {
            throw new Error("Product not found");
        }
        return "Product deleted successfully";
    },

    async addProductSize(productId: string, input: any) {
        const product = await productModel.findById(productId);
        if (!product) {
            throw new Error("Product not found");
        }

        // Add the new variant
        product.variants.push(input);

        let updatedProduct = await product.save();
        updatedProduct = await updatedProduct.populate([{ path: "productCategoriesID" }, { path: "productSubCategoriesID" }, { path: "tags" }]);

        return {
            id: updatedProduct._id,
            name: updatedProduct.name,
            price: updatedProduct.price,
            mrp: updatedProduct.mrp,
            discountPercentage: updatedProduct.discountPercentage,
            images: updatedProduct.images,
            brand: updatedProduct.brand,
            hasSize: updatedProduct.hasSize,
            isFeatured: updatedProduct.isFeatured,
            productCategoriesID: (updatedProduct.productCategoriesID as any)?._id?.toString() || updatedProduct.productCategoriesID?.toString() || "",
            productCategoriesCode: (updatedProduct.productCategoriesID as any)?.code || "",
            productCategories: updatedProduct.productCategoriesID,
            productSubCategoriesID: (updatedProduct.productSubCategoriesID as any)?._id?.toString() || updatedProduct.productSubCategoriesID?.toString() || "",
            productSubCategoriesCode: (updatedProduct.productSubCategoriesID as any)?.code || "",
            productSubCategories: updatedProduct.productSubCategoriesID,
            tags: updatedProduct.tags,
            variants: updatedProduct.variants,
            description: updatedProduct.description,
            material: updatedProduct.material,
            embellishment: updatedProduct.embellishment,
            neck: updatedProduct.neck,
            sleeves: updatedProduct.sleeves,
            closure: updatedProduct.closure,
            lining: updatedProduct.lining,
            washCare: updatedProduct.washCare,
            ironCare: updatedProduct.ironCare,
            couponCode: updatedProduct.couponCode,
            rating: updatedProduct.rating || 0,
            numReviews: updatedProduct.numReviews || 0,
            createdAt: updatedProduct.createdAt?.toString(),
            updatedAt: (updatedProduct as any).updatedAt?.toString()
        };
    },
    async getProductsByTagCode(code: string, search?: string, page?: number, limit?: number, sort?: string, filters?: any) {
        const { tagModel } = await import("../../DB/MongoDB/Tag/Tag.js");
        const tag = await tagModel.findOne({ code: { $regex: new RegExp(`^${code}$`, 'i') } });

        if (!tag) {
            return { products: [], totalCount: 0, categories: [] };
        }

        let filter: any = {
            tags: tag._id
        };

        if (search) {
            const regex = new RegExp(search, 'i');
            filter = {
                $and: [
                    filter,
                    {
                        $or: [
                            { name: { $regex: regex } },
                            { brand: { $regex: regex } }
                        ]
                    }
                ]
            };
        }

        if (filters) {
            const andConditions: any[] = [];
            if (filters.sizes && filters.sizes.length > 0) {
                andConditions.push({ "variants.size": { $in: filters.sizes } });
            }
            if (filters.colors && filters.colors.length > 0) {
                andConditions.push({ "variants.color": { $in: filters.colors } });
            }
            if (filters.brands && filters.brands.length > 0) {
                andConditions.push({ brand: { $in: filters.brands } });
            }
            if (filters.stock && filters.stock.length > 0) {
                const stockConditions = [];
                if (filters.stock.includes("In stock")) {
                    stockConditions.push({ "variants.stock": { $gt: 0 } });
                }
                if (filters.stock.includes("Out of stock")) {
                    stockConditions.push({ "variants.stock": { $lte: 0 } });
                }
                if (stockConditions.length > 0) {
                    andConditions.push({ $or: stockConditions });
                }
            }
            if (filters.price && (filters.price.min > 0 || filters.price.max > 0)) {
                const priceQuery: any = {};
                if (filters.price.min >= 0) priceQuery.$gte = filters.price.min;
                if (filters.price.max > 0) priceQuery.$lte = filters.price.max;
                andConditions.push({ price: priceQuery });
            }
            if (filters.dynamicFilters && filters.dynamicFilters.length > 0) {
                filters.dynamicFilters.forEach((df: any) => {
                    if (df.name === "Material" && df.values.length > 0) {
                        andConditions.push({ material: { $in: df.values } });
                    }
                });
            }

            if (andConditions.length > 0) {
                if (filter.$and) {
                    filter.$and.push(...andConditions);
                } else {
                    filter.$and = andConditions;
                }
            }
        }

        let sortOption: any = { updatedAt: -1, createdAt: -1 };
        let useCollation = false;
        if (sort) {
            switch (sort) {
                case 'price-low': sortOption = { price: 1 }; break;
                case 'price-high': sortOption = { price: -1 }; break;
                case 'atoz': sortOption = { name: 1 }; useCollation = true; break;
                case 'ztoa': sortOption = { name: -1 }; useCollation = true; break;
                case 'features': sortOption = { isFeatured: -1, updatedAt: -1, createdAt: -1 }; break;
                default: sortOption = { updatedAt: -1, createdAt: -1 }; break;
            }
        }

        const { productModel } = await import("../../DB/MongoDB/Product/Product.js");
        const totalCount = await productModel.countDocuments(filter);

        let query = productModel.find(filter).populate("productCategoriesID").populate("productSubCategoriesID").populate("tags").sort(sortOption);
        if (useCollation) {
            query = query.collation({ locale: 'en', strength: 2 });
        }
        if (page && limit) {
            const skip = (page - 1) * limit;
            query = query.skip(skip).limit(limit);
        }
        const products = await query;
        const mappedProducts = products.map((product) => ({
            id: product._id,
            name: product.name,
            price: product.price,
            mrp: product.mrp,
            discountPercentage: product.discountPercentage,
            images: product.images,
            brand: product.brand,
            hasSize: product.hasSize,
            isFeatured: product.isFeatured,
            productCategoriesID: (product.productCategoriesID as any)?._id?.toString() || product.productCategoriesID?.toString() || "",
            productCategoriesCode: (product.productCategoriesID as any)?.code || "",
            productCategories: product.productCategoriesID,
            productSubCategoriesID: (product.productSubCategoriesID as any)?._id?.toString() || product.productSubCategoriesID?.toString() || "",
            productSubCategoriesCode: (product.productSubCategoriesID as any)?.code || "",
            productSubCategories: product.productSubCategoriesID,
            tags: product.tags,
            variants: product.variants,
            description: product.description,
            createdAt: product.createdAt?.toString(),
            updatedAt: (product as any).updatedAt?.toString()
        }));

        const { productCategoryMOdel } = await import("../../DB/MongoDB/ProductCategories/ProductCategories.js");
        const categoriesRaw = await productCategoryMOdel.find().sort({ createdTime: 1 });
        const categoriesList = categoriesRaw.map((category: any) => ({
            id: category._id,
            name: category.name,
            code: category.code
        }));

        const tagFilters = await ProductService.getTagFilters(code);

        return {
            products: mappedProducts,
            filters: tagFilters,
            totalCount,
            categories: categoriesList
        };
    },

    async getRelatedProducts(productId: string, limit: number = 4) {
        
        
        const currentProduct = await productModel.findById(productId);
        if (!currentProduct) {
            throw new Error("Product not found");
        }

        const filter: any = {
            _id: { $ne: productId },
            $or: [
                { productCategoriesID: currentProduct.productCategoriesID }
            ]
        };

        if (currentProduct.tags && currentProduct.tags.length > 0) {
            filter.$or.push({ tags: { $in: currentProduct.tags } });
        }

        const products = await productModel.find(filter)
            .populate("productCategoriesID").populate("productSubCategoriesID")
            .populate("tags")
            .limit(limit)
            .sort({ updatedAt: -1, createdAt: -1 });

        return products.map((p) => ({
            id: p._id,
            name: p.name,
            price: p.price,
            mrp: p.mrp,
            discountPercentage: p.discountPercentage,
            images: p.images,
            brand: p.brand,
            hasSize: p.hasSize,
            isFeatured: p.isFeatured,
            productCategoriesID: (p.productCategoriesID as any)?._id?.toString() || p.productCategoriesID?.toString() || "",
            productCategoriesCode: (p.productCategoriesID as any)?.code || "",
            productCategories: p.productCategoriesID,
            productSubCategoriesID: (p.productSubCategoriesID as any)?._id?.toString() || p.productSubCategoriesID?.toString() || "",
            productSubCategoriesCode: (p.productSubCategoriesID as any)?.code || "",
            productSubCategories: p.productSubCategoriesID,
            tags: p.tags,
            variants: p.variants,
            description: p.description,
            material: p.material,
            embellishment: p.embellishment,
            neck: p.neck,
            sleeves: p.sleeves,
            closure: p.closure,
            lining: p.lining,
            washCare: p.washCare,
            ironCare: p.ironCare,
            couponCode: p.couponCode,
            rating: p.rating || 0,
            numReviews: p.numReviews || 0,
            createdAt: p.createdAt?.toString(),
            updatedAt: (p as any).updatedAt?.toString()
        }));
    }
};