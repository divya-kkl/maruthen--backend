import RateHistory from "../../DB/MongoDB/Rate/RateHistory.js";
import Rate from "../../DB/MongoDB/Rate/Rate.js";

export const RateService = {
  createRate: async (input: any) => {
    try {
      if (input.isCurrent) {
         // Instead of updating, copy existing to RateHistory and delete
         const existingRates = await Rate.find({ type: input.type, isCurrent: true });
         for (const existingRate of existingRates) {
           const historyData: any = existingRate.toObject();
           delete historyData._id;
           delete historyData.id;
           delete historyData.createdAt;
           delete historyData.updatedAt;
           delete historyData.__v;
           historyData.isCurrent = false;
           await new RateHistory(historyData).save();
         }
         await Rate.deleteMany({ type: input.type, isCurrent: true });
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

  getRateHistory: async (type?: string) => {
    try {
      const query = type ? { type } : {};
      console.log("[DEBUG] getRateHistory querying RateHistory with:", query);
      const rates = await RateHistory.find(query).sort({ createdAt: -1 });
      console.log("[DEBUG] RateHistory rates found:", rates.length);
      return rates;
    } catch (error: any) {
      throw new Error(`Failed to fetch rate history: ${error.message}`);
    }
  },

  updateRate: async (id: string, input: any) => {
    try {
      console.log(`[DEBUG] updateRate called for id: ${id}`);
      const existingRate = await Rate.findById(id);
      if (!existingRate) {
        throw new Error("Rate not found");
      }

      // 1. பழைய டேட்டாவை `RateHistory` Collection-ல் சேமிப்பது
      const oldRateData: any = existingRate.toObject();
      delete oldRateData._id;
      delete oldRateData.id; 
      delete oldRateData.createdAt;
      delete oldRateData.updatedAt;
      delete oldRateData.__v;
      oldRateData.isCurrent = false;

      const historyRate = new RateHistory(oldRateData);
      await historyRate.save();
      console.log(`[DEBUG] Saved old data to RateHistory collection`);

      // 2. `Rate` Collection-ல் உள்ள பழைய டேட்டாவையே புதிய Amount-க்கு Overwrite செய்வது
      const updatedRate = await Rate.findByIdAndUpdate(id, { ...input, isCurrent: true }, { new: true });
      console.log(`[DEBUG] Updated Rate collection successfully`);
      return updatedRate;
    } catch (error: any) {
      console.error(`[DEBUG] Error in updateRate:`, error);
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
