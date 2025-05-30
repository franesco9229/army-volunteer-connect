
import { Auth } from './auth';

interface GraphQLRequest {
  query: string;
  variables?: Record<string, any>;
  operationName?: string;
}

interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
  }>;
}

interface Project {
  id: string;
  name: string;
  description?: string;
}

interface ListProjectsResponse {
  listProjects: Project[];
}

interface CreateProjectResponse {
  createProject: Project;
}

export class GraphQLService {
  private static readonly APPSYNC_ENDPOINT = 'https://mxd7o3seznfajn6qxcvqnczzsm.appsync-api.eu-west-2.amazonaws.com/graphql';

  private static async getAuthHeaders(): Promise<Record<string, string>> {
    try {
      const token = await Auth.getCurrentSession();
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
    } catch (error) {
      console.error('Error getting auth headers:', error);
      throw new Error('Authentication required to access GraphQL API');
    }
  }

  private static async request<T = any>(
    query: string, 
    variables?: Record<string, any>, 
    operationName?: string
  ): Promise<T> {
    try {
      const headers = await GraphQLService.getAuthHeaders();
      
      const requestBody: GraphQLRequest = {
        query,
        variables,
        operationName
      };

      console.log('Making GraphQL request:', {
        endpoint: GraphQLService.APPSYNC_ENDPOINT,
        operation: operationName || 'unknown',
        variables
      });

      const response = await fetch(GraphQLService.APPSYNC_ENDPOINT, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: GraphQLResponse<T> = await response.json();

      if (result.errors && result.errors.length > 0) {
        console.error('GraphQL errors:', result.errors);
        throw new Error(`GraphQL error: ${result.errors[0].message}`);
      }

      if (!result.data) {
        throw new Error('No data returned from GraphQL query');
      }

      return result.data;
    } catch (error) {
      console.error('GraphQL request failed:', error);
      throw error;
    }
  }

  // Query to list all projects
  static async listProjects(): Promise<Project[]> {
    const query = `
      query ListProjects {
        listProjects {
          id
          name
          description
        }
      }
    `;

    try {
      const response = await GraphQLService.request<ListProjectsResponse>(query, {}, 'ListProjects');
      return response.listProjects || [];
    } catch (error) {
      console.error('Failed to list projects:', error);
      throw new Error('Failed to fetch projects. Please try again.');
    }
  }

  // Mutation to create a new project
  static async createProject(name: string, description?: string): Promise<Project> {
    const mutation = `
      mutation CreateProject($name: String!, $description: String) {
        createProject(name: $name, description: $description) {
          id
          name
          description
        }
      }
    `;

    const variables = {
      name,
      description
    };

    try {
      const response = await GraphQLService.request<CreateProjectResponse>(
        mutation, 
        variables, 
        'CreateProject'
      );
      return response.createProject;
    } catch (error) {
      console.error('Failed to create project:', error);
      throw new Error('Failed to create project. Please try again.');
    }
  }

  // Mutation to update a project
  static async updateProject(id: string, name?: string, description?: string): Promise<Project> {
    const mutation = `
      mutation UpdateProject($id: ID!, $name: String, $description: String) {
        updateProject(id: $id, name: $name, description: $description) {
          id
          name
          description
        }
      }
    `;

    const variables = {
      id,
      name,
      description
    };

    try {
      const response = await GraphQLService.request<{ updateProject: Project }>(
        mutation, 
        variables, 
        'UpdateProject'
      );
      return response.updateProject;
    } catch (error) {
      console.error('Failed to update project:', error);
      throw new Error('Failed to update project. Please try again.');
    }
  }

  // Mutation to delete a project
  static async deleteProject(id: string): Promise<boolean> {
    const mutation = `
      mutation DeleteProject($id: ID!) {
        deleteProject(id: $id) {
          id
        }
      }
    `;

    const variables = { id };

    try {
      await GraphQLService.request<{ deleteProject: { id: string } }>(
        mutation, 
        variables, 
        'DeleteProject'
      );
      return true;
    } catch (error) {
      console.error('Failed to delete project:', error);
      throw new Error('Failed to delete project. Please try again.');
    }
  }

  // Query to get a single project by ID
  static async getProject(id: string): Promise<Project | null> {
    const query = `
      query GetProject($id: ID!) {
        getProject(id: $id) {
          id
          name
          description
        }
      }
    `;

    const variables = { id };

    try {
      const response = await GraphQLService.request<{ getProject: Project }>(
        query, 
        variables, 
        'GetProject'
      );
      return response.getProject || null;
    } catch (error) {
      console.error('Failed to get project:', error);
      throw new Error('Failed to fetch project. Please try again.');
    }
  }
}

// Export types for use in components
export type { Project };
