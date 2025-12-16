import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Temporary type definitions until schema is updated
export type Award = {
  id: string;
  name: string;
  year: string;
  organization: string;
  category: string;
  description?: string;
  image?: string;
  displayOrder: string;
  createdAt: Date;
  updatedAt: Date;
};

export type InsertAward = Omit<Award, "id" | "createdAt" | "updatedAt">;

// Fetch all awards
export function useAwards() {
  return useQuery<Award[]>({
    queryKey: ["/api/awards"],
  });
}

// Fetch single award
export function useAward(id: string) {
  return useQuery<Award>({
    queryKey: [`/api/awards/${id}`],
    enabled: !!id,
  });
}

// Create award
export function useCreateAward() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertAward) => {
      const response = await apiRequest("POST", "/api/awards", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/awards"] });
    },
  });
}

// Update award
export function useUpdateAward() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertAward> }) => {
      const response = await apiRequest("PUT", `/api/awards/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/awards"] });
    },
  });
}

// Delete award
export function useDeleteAward() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/awards/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/awards"] });
    },
  });
}