export interface Item {
    id: string;
    name: string;
    type: string;
    amount: number;
  }
  
  export interface CreateItemRequest {
    name: string;
    type: string;
    amount: number;
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
  }
  
  export type ItemsResponse = ApiResponse<Item[]>;
  export type ItemResponse = ApiResponse<Item>;