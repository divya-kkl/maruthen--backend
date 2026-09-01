import { RateService } from "./Rate.services.js";

export const RateResolver = {
  Rate: {
    date: (parent: any) => parent.date ? new Date(parent.date).toISOString() : null,
    createdAt: (parent: any) => parent.createdAt ? new Date(parent.createdAt).toISOString() : null,
    updatedAt: (parent: any) => parent.updatedAt ? new Date(parent.updatedAt).toISOString() : null,
  },
  Query: {
    getAllRates: async () => {
      return await RateService.getAllRates();
    },
    getRateById: async (_: any, { id }: { id: string }) => {
      return await RateService.getRateById(id);
    },
    getCurrentRates: async () => {
      return await RateService.getCurrentRates();
    }
  },
  Mutation: {
    createRate: async (_: any, { input }: { input: any }) => {
      return await RateService.createRate(input);
    },
    updateRate: async (_: any, { id, input }: { id: string; input: any }) => {
      return await RateService.updateRate(id, input);
    },
    deleteRate: async (_: any, { id }: { id: string }) => {
      return await RateService.deleteRate(id);
    }
  }
};
