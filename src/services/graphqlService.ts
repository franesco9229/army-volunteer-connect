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
    extensions?: any;
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
        variables,
        queryPreview: query.substring(0, 200) + '...'
      });

      const response = await fetch(GraphQLService.APPSYNC_ENDPOINT, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      });

      console.log('GraphQL response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('HTTP error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const result: GraphQLResponse<T> = await response.json();
      
      console.log('GraphQL response received:', {
        hasData: !!result.data,
        hasErrors: !!(result.errors && result.errors.length > 0),
        errors: result.errors
      });

      if (result.errors && result.errors.length > 0) {
        console.error('GraphQL errors:', result.errors);
        
        // Check for specific error patterns that might indicate resolver issues
        const errorMessages = result.errors.map(err => err.message).join(', ');
        
        if (errorMessages.includes('Value for field \'$[operation]\' not found')) {
          throw new Error('GraphQL resolver configuration error: The AppSync resolver appears to be misconfigured. Please check the resolver mapping templates in your AppSync API.');
        }
        
        throw new Error(`GraphQL error: ${errorMessages}`);
      }

      if (!result.data) {
        throw new Error('No data returned from GraphQL query');
      }

      return result.data;
    } catch (error) {
      console.error('GraphQL request failed:', error);
      
      // Provide more specific error messages based on the error type
      if (error instanceof Error) {
        if (error.message.includes('resolver configuration')) {
          throw error; // Re-throw resolver config errors as-is
        } else if (error.message.includes('Network')) {
          throw new Error('Network error: Unable to connect to the GraphQL API. Please check your internet connection.');
        } else if (error.message.includes('Authentication')) {
          throw new Error('Authentication error: Please sign in again.');
        }
      }
      
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
      console.log('Attempting to list projects...');
      const response = await GraphQLService.request<ListProjectsResponse>(query, {}, 'ListProjects');
      console.log('Successfully received projects:', response.listProjects?.length || 0);
      return response.listProjects || [];
    } catch (error) {
      console.error('Failed to list projects:', error);
      
      // Provide user-friendly error message
      if (error instanceof Error && error.message.includes('resolver configuration')) {
        throw new Error('GraphQL API configuration error. The backend resolver needs to be fixed by the developer.');
      }
      
      throw new Error('Failed to fetch projects. Please try again or contact support if the issue persists.');
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
