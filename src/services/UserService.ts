import { ApiResponse } from "@/types/api";
import api from "@/utils/api";

export interface UserProfile {
  username: string;
  name: string;
  role: string;
  operatorId?: number | null;
  operator?: {
    id: number;
    nik: string;
    name: string;
  };
}

export interface UpdateProfilePayload {
  name?: string;
  current_password?: string;
  new_password?: string;
}

const getCurrentUser = async (): Promise<ApiResponse<UserProfile>> => {
  const response = await api.get<ApiResponse<UserProfile>>("users/current");
  return response.data;
};

const updateProfile = async (payload: UpdateProfilePayload): Promise<ApiResponse<UserProfile>> => {
  const response = await api.patch<ApiResponse<UserProfile>>("users/current", payload);
  return response.data;
};

const UserService = {
  getCurrentUser,
  updateProfile,
};

export default UserService;
