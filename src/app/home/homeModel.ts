export interface CategoryInterestDto {
  CategoryId: number;
  SubCategoryId: number;
}

export interface UserRegisterDto {
  FullName: string;
  Email: string;
  PhoneNumber: string;
  Password: string;
  ConfirmPassword: string;
  RolesId: number | null;
}

  
  export interface UserDetails {
    userId: number;
    fullName: string;
    email: string;
    role: string;
  }
  

  export interface ForgotPasswordResponse {
    message: string; // Ensure this matches the response from the API
  }
  
  export interface ForgotPasswordPayload {
    email: string; // The payload you are sending in the request
  }
  