import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { PortfolioItem, InsertPortfolioItem } from "@shared/schema";

// Fetch all portfolio items
export function usePortfolio() {
  return useQuery<PortfolioItem[]>({
    queryKey: ["/api/portfolio"],
  });
}

// Fetch single portfolio item by slug
export function usePortfolioItem(slug: string) {
  return useQuery<PortfolioItem>({
    queryKey: [`/api/portfolio/${slug}`],
    enabled: !!slug,
  });
}

// Create portfolio item
export function useCreatePortfolio() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertPortfolioItem) => {
      const response = await apiRequest("POST", "/api/portfolio", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
    },
  });
}

// Update portfolio item
export function useUpdatePortfolio() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertPortfolioItem> }) => {
      const response = await apiRequest("PUT", `/api/portfolio/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
    },
  });
}

// Delete portfolio item
export function useDeletePortfolio() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/portfolio/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
    },
  });
}