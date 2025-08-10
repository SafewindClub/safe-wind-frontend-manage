export interface UserInfoDetail {
  nickname: string;
  avatar: string;
  grade: string;
  speciality: string;
  faculty: string;
  name: string;
  sex: number;
  className: string;
}

export interface Role {
  roleName: string;
  roleKey: string;
}

export interface Dept {
  deptId: number;
  name: string;
}

export interface UserInfo {
  userId: number;
  studentId: string;
  email: string;
  userInfo: UserInfoDetail;
  roleKeys: string[];
  roles:Role[];
  dept: Dept;
  permissions: string[];
  isAdmin: boolean;
}
