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
        errors: result.errors,
        dataContent: result.data,
        fullResponse: result
      });

      if (result.errors && result.errors.length > 0) {
        console.error('GraphQL errors detailed:', result.errors);
        
        // Check for specific error patterns that might indicate resolver issues
        const errorMessages = result.errors.map(err => err.message).join(', ');
        
        console.error('DETAILED RESOLVER DEBUG:', {
          errorMessages,
          errorTypes: result.errors.map(err => err.extensions?.errorType || 'undefined'),
          errorCodes: result.errors.map(err => err.extensions?.errorCode || 'undefined'),
          paths: result.errors.map(err => err.path),
          locations: result.errors.map(err => err.locations),
          fullErrors: result.errors,
          rawErrorData: JSON.stringify(result.errors, null, 2)
        });
        
        // Check for VTL syntax errors
        if (errorMessages.includes('Unsupported element') || errorMessages.includes('$[')) {
          throw new Error(`VTL SYNTAX ERROR DETECTED: Your AppSync resolver contains VTL template syntax.

ERROR: "${errorMessages}"

This means your resolver is still using VTL syntax like $[operation] or $[tableName] instead of pure JavaScript.

IMMEDIATE STEPS TO FIX:
1. Go to AWS AppSync Console
2. Navigate to your API → Schema → Resolvers
3. Find the "listProjects" resolver on Query type
4. Click on it to open the resolver editor
5. Verify the runtime is set to "JavaScript" (not VTL/Apache Velocity)
6. Make sure the code contains ONLY JavaScript, no VTL syntax like $[...] 
7. The request function should return a plain JavaScript object

Your request function should look exactly like this:
export function request(ctx) {
    return {
        "version": "2017-02-28",
        "operation": "Scan",
        "tableName": "YourActualTableName"
    };
}

NO VTL syntax like $[operation] or $[tableName] should be present!`);
        }
        
        // Check for field not found errors (indicates VTL parsing issues)
        if (errorMessages.includes('Value for field') && errorMessages.includes('not found')) {
          throw new Error(`RESOLVER FIELD ERROR: The error "${errorMessages}" suggests your resolver is trying to parse VTL template variables.

DIAGNOSIS: Your resolver appears to contain VTL syntax like $[operation] which AppSync is trying to process as template variables.

SOLUTION:
1. Open AWS AppSync Console
2. Go to your API → Schema → Data Sources
3. Check that your resolver is attached to the correct DynamoDB data source
4. Verify the resolver runtime is "JavaScript" not "VTL"
5. Ensure your resolver code contains NO dollar signs followed by brackets: $[...]
6. Replace any $[tableName] with the actual table name as a string
7. Replace any $[operation] with the actual operation like "Scan"

The resolver should return pure JavaScript objects, not VTL templates.`);
        }
        
        if (errorMessages.includes('resolver configuration')) {
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
        if (error.message.includes('VTL SYNTAX ERROR') || error.message.includes('RESOLVER FIELD ERROR')) {
          throw error; // Re-throw VTL/resolver errors with full debugging info
        } else if (error.message.includes('resolver configuration')) {
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
      if (error instanceof Error && (error.message.includes('VTL SYNTAX ERROR') || error.message.includes('RESOLVER FIELD ERROR'))) {
        throw error; // Re-throw with full debugging info
      } else if (error instanceof Error && error.message.includes('resolver configuration')) {
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
