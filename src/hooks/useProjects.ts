
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GraphQLService, Project } from '@/services/graphqlService';
import { toast } from '@/components/ui/sonner';

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: GraphQLService.listProjects,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => GraphQLService.getProject(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, description }: { name: string; description?: string }) =>
      GraphQLService.createProject(name, description),
    onSuccess: (newProject) => {
      // Invalidate and refetch projects list
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success(`Project "${newProject.name}" created successfully!`);
    },
    onError: (error) => {
      console.error('Create project error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create project');
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name, description }: { id: string; name?: string; description?: string }) =>
      GraphQLService.updateProject(id, name, description),
    onSuccess: (updatedProject) => {
      // Invalidate projects list and the specific project
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', updatedProject.id] });
      toast.success(`Project "${updatedProject.name}" updated successfully!`);
    },
    onError: (error) => {
      console.error('Update project error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update project');
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: GraphQLService.deleteProject,
    onSuccess: () => {
      // Invalidate projects list
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted successfully!');
    },
    onError: (error) => {
      console.error('Delete project error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete project');
    },
  });
}
