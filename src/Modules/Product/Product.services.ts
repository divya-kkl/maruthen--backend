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

            if (andConditions.length > 0) {
                if (Object.keys(filter).length > 0) {
                    filter = { $and: [filter, ...andConditions] };
                } else {
                    filter = { $and: andConditions };
                }
            }
        }

        let totalCount = await productModel.countDocuments(filter);
        let query = productModel.find(filter).populate("productCategoriesID").sort({ createdAt: -1 });
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
            isFeatured: product.isFeatured,
            productCategoriesID: (product.productCategoriesID as any)?._id?.toString() || product.productCategoriesID?.toString() || "",
            productCategoriesCode: (product.productCategoriesID as any)?.code || "",
            productCategories: product.productCategoriesID,
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
        // First find the category by code
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

            if (andConditions.length > 0) {
                if (filter.$and) {
                    filter.$and.push(...andConditions);
                } else {
                    filter.$and = andConditions;
                }
            }
        }

        let sortOption: any = { createdAt: -1 };
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
                    sortOption = { isFeatured: -1, createdAt: -1 };
                    break;
                case 'bestselling':
                case 'most-relevant':
                default:
                    sortOption = { createdAt: -1 };
                    break;
            }
        }

        const totalCount = await productModel.countDocuments(filter);

        let query = productModel.find(filter).populate("productCategoriesID").sort(sortOption);
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
            isFeatured: product.isFeatured,
            productCategoriesID: (product.productCategoriesID as any)?._id?.toString() || product.productCategoriesID?.toString() || "",
            productCategoriesCode: (product.productCategoriesID as any)?.code || "",
            productCategories: product.productCategoriesID,
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

            p.variants?.forEach(v => {
                if (v.size) sizes[v.size] = (sizes[v.size] || 0) + 1;
                if (v.color) colors[v.color] = (colors[v.color] || 0) + 1;
            });
        });

        if (minPrice === Infinity) minPrice = 0;
        if (maxPrice === -Infinity) maxPrice = 0;

        return {
            sizes: Object.entries(sizes).map(([name, count]) => ({ name, count: count as number })).sort((a, b) => b.count - a.count),
            colors: Object.entries(colors).map(([name, count]) => ({ name, count: count as number })).sort((a, b) => b.count - a.count),
            brands: Object.entries(brands).map(([name, count]) => ({ name, count: count as number })).sort((a, b) => b.count - a.count),
            stock: { inStock, outOfStock },
            price: { min: minPrice, max: maxPrice }
        };
    },

    async getProductById(id: string) {
        const product = await productModel.findById(id).populate("productCategoriesID");
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
            isFeatured: product.isFeatured,
            productCategoriesID: (product.productCategoriesID as any)?._id?.toString() || product.productCategoriesID?.toString() || "",
            productCategoriesCode: (product.productCategoriesID as any)?.code || "",
            productCategories: product.productCategoriesID,
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
        newProduct = await newProduct.populate("productCategoriesID");
        return {
            id: newProduct._id,
            name: newProduct.name,
            price: newProduct.price,
            mrp: newProduct.mrp,
            discountPercentage: newProduct.discountPercentage,
            images: newProduct.images,
            brand: newProduct.brand,
            isFeatured: newProduct.isFeatured,
            productCategoriesID: (newProduct.productCategoriesID as any)?._id?.toString() || newProduct.productCategoriesID?.toString() || "",
            productCategoriesCode: (newProduct.productCategoriesID as any)?.code || "",
            productCategories: newProduct.productCategoriesID,
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
        updatedProduct = await updatedProduct.populate("productCategoriesID");
        return {
            id: updatedProduct._id,
            name: updatedProduct.name,
            price: updatedProduct.price,
            mrp: updatedProduct.mrp,
            discountPercentage: updatedProduct.discountPercentage,
            images: updatedProduct.images,
            brand: updatedProduct.brand,
            isFeatured: updatedProduct.isFeatured,
            productCategoriesID: (updatedProduct.productCategoriesID as any)?._id?.toString() || updatedProduct.productCategoriesID?.toString() || "",
            productCategoriesCode: (updatedProduct.productCategoriesID as any)?.code || "",
            productCategories: updatedProduct.productCategoriesID,
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
        updatedProduct = await updatedProduct.populate("productCategoriesID");

        return {
            id: updatedProduct._id,
            name: updatedProduct.name,
            price: updatedProduct.price,
            mrp: updatedProduct.mrp,
            discountPercentage: updatedProduct.discountPercentage,
            images: updatedProduct.images,
            brand: updatedProduct.brand,
            isFeatured: updatedProduct.isFeatured,
            productCategoriesID: (updatedProduct.productCategoriesID as any)?._id?.toString() || updatedProduct.productCategoriesID?.toString() || "",
            productCategoriesCode: (updatedProduct.productCategoriesID as any)?.code || "",
            productCategories: updatedProduct.productCategoriesID,
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
    }
};