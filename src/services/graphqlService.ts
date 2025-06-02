import { getCognitoConfig } from './cognitoConfig';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

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
      // Check if we have Cognito config
      const config = getCognitoConfig();
      
      if (!config) {
        throw new Error('No Cognito configuration found. Please configure AWS Cognito first.');
      }

      // Get current user to verify authentication
      const currentUser = await getCurrentUser();
      console.log('Current user:', currentUser);

      // Get the auth session with tokens
      const session = await fetchAuthSession();
      console.log('Session details:', {
        hasIdToken: !!session.tokens?.idToken,
        hasAccessToken: !!session.tokens?.accessToken,
        tokenPreview: session.tokens?.idToken?.toString().substring(0, 50) + '...'
      });

      // AppSync typically expects either the ID token or Access token
      const idToken = session.tokens?.idToken?.toString();
      const accessToken = session.tokens?.accessToken?.toString();

      if (!idToken && !accessToken) {
        throw new Error('No valid authentication tokens found');
      }

      // Use ID token for AppSync (this is the most common format)
      const authToken = idToken || accessToken;

      return {
        'Authorization': authToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
    } catch (error) {
      console.error('Error getting auth headers:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('not authenticated') || error.message.includes('No current user')) {
          throw new Error('Please sign in to access this feature');
        }
      }
      
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
        queryPreview: query.substring(0, 200) + '...',
        authHeaderPreview: headers.Authorization?.substring(0, 50) + '...'
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
        
        if (response.status === 401) {
          throw new Error('Authentication failed. Please sign in again.');
        }
        
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const result: GraphQLResponse<T> = await response.json();
      
      console.log('GraphQL response received:', {
        hasData: !!result.data,
        hasErrors: !!(result.errors && result.errors.length > 0),
        errors: result.errors,
        dataContent: result.data
      });

      if (result.errors && result.errors.length > 0) {
        console.error('GraphQL errors detailed:', result.errors);
        
        const errorMessages = result.errors.map(err => err.message).join(', ');
        throw new Error(`GraphQL error: ${errorMessages}`);
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
      throw new Error('Failed to fetch projects. Please try again or contact support if the issue persists.');
    }
  }

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

export type { Project };
