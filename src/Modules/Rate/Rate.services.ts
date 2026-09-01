import Rate from "../../DB/MongoDB/Rate/Rate.js";

export const RateService = {
  createRate: async (input: any) => {
    try {
      if (input.isCurrent) {
         await Rate.updateMany({ type: input.type, isCurrent: true }, { isCurrent: false });
      }
      const newRate = new Rate(input);
      return await newRate.save();
    } catch (error: any) {
      throw new Error(`Failed to create rate: ${error.message}`);
    }
  },

  getAllRates: async () => {
    try {
      return await Rate.find().sort({ createdAt: -1 });
    } catch (error: any) {
      throw new Error(`Failed to fetch rates: ${error.message}`);
    }
  },

  getRateById: async (id: string) => {
    try {
      return await Rate.findById(id);
    } catch (error: any) {
      throw new Error(`Failed to fetch rate: ${error.message}`);
    }
  },

  getCurrentRates: async () => {
    try {
      return await Rate.find({ isCurrent: true }).sort({ createdAt: -1 });
    } catch (error: any) {
      throw new Error(`Failed to fetch current rates: ${error.message}`);
    }
  },

  updateRate: async (id: string, input: any) => {
    try {
      if (input.isCurrent && input.type) {
         await Rate.updateMany({ type: input.type, isCurrent: true }, { isCurrent: false });
      } else if (input.isCurrent) {
         const existingRate = await Rate.findById(id);
         if (existingRate) {
           const query = existingRate.type ? { type: existingRate.type, isCurrent: true } : { isCurrent: true };
           await Rate.updateMany(query, { isCurrent: false });
         }
      }
      return await Rate.findByIdAndUpdate(id, input, { new: true });
    } catch (error: any) {
      throw new Error(`Failed to update rate: ${error.message}`);
    }
  },

  deleteRate: async (id: string) => {
    try {
      await Rate.findByIdAndDelete(id);
      return "Rate deleted successfully";
    } catch (error: any) {
      throw new Error(`Failed to delete rate: ${error.message}`);
    }
  }
};
