import useSWR from 'swr';
import { useState } from 'react';
import { fetcher, poster, putter, deleter } from '@/lib/axios';
import type { 
  Penilaian, 
  CreatePenilaianData, 
  UpdatePenilaianData, 
  GradingPermissionResponse,
  ApiResponse 
} from '@/types/proyek';

// Hook to check grading permission for a project
export function useGradingPermission(proyekId: number | string) {
  const { data, error, isLoading, mutate } = useSWR<GradingPermissionResponse>(
    proyekId ? `/penilaians/check-permission` : null,
    (url) => poster(url, { proyek_id: proyekId }),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000
    }
  );

  return {
    permission: data,
    isLoading,
    isError: error,
    mutate
  };
}

// Hook to get penilaian by ID
export function usePenilaian(penilaianId: number | string) {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Penilaian>>(
    penilaianId ? `/penilaians/${penilaianId}` : null,
    fetcher
  );

  return {
    penilaian: data?.data,
    isLoading,
    isError: error,
    mutate
  };
}

// Hook to get all penilaians for current teacher
export function usePenilaians() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Penilaian[]>>(
    '/penilaians',
    fetcher
  );

  return {
    penilaians: data?.data || [],
    isLoading,
    isError: error,
    mutate
  };
}

// Hook for creating new penilaian
export function useCreatePenilaian() {
  const [isCreating, setIsCreating] = useState(false);

  const createPenilaian = async (data: CreatePenilaianData) => {
    setIsCreating(true);
    try {
      const response = await poster('/penilaians', data);
      return response;
    } catch (error) {
      console.error('Error creating penilaian:', error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createPenilaian,
    isCreating
  };
}

// Hook for updating penilaian
export function useUpdatePenilaian() {
  const [isUpdating, setIsUpdating] = useState(false);

  const updatePenilaian = async (penilaianId: number | string, data: UpdatePenilaianData) => {
    setIsUpdating(true);
    try {
      const response = await putter(`/penilaians/${penilaianId}`, data);
      return response;
    } catch (error) {
      console.error('Error updating penilaian:', error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updatePenilaian,
    isUpdating
  };
}

// Hook for deleting penilaian
export function useDeletePenilaian() {
  const [isDeleting, setIsDeleting] = useState(false);

  const deletePenilaian = async (penilaianId: number | string) => {
    setIsDeleting(true);
    try {
      const response = await deleter(`/penilaians/${penilaianId}`);
      return response;
    } catch (error) {
      console.error('Error deleting penilaian:', error);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deletePenilaian,
    isDeleting
  };
}

// Combined hook for penilaian mutations
export function usePenilaianMutations() {
  const { createPenilaian, isCreating } = useCreatePenilaian();
  const { updatePenilaian, isUpdating } = useUpdatePenilaian();
  const { deletePenilaian, isDeleting } = useDeletePenilaian();

  return {
    createPenilaian,
    updatePenilaian,
    deletePenilaian,
    isCreating,
    isUpdating,
    isDeleting,
    isMutating: isCreating || isUpdating || isDeleting
  };
}