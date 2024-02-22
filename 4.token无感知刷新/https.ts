// 最大重发次数

import refreshToken from './refreshToken'
export default async (error: AxiosError<ResponseDataType>) => {
  const statusCode = error.response?.status;
  const clearAuth = () => {
    console.log('身份过期，请重新登录');
    window.location.replace('/login');
    // 清空数据
    sessionStorage.clear();
    return Promise.reject(error);
  };
  // 为了节省多余的代码，这里仅展示处理状态码为401的情况
  if (statusCode === 401) {
    refreshToken()
  }
  return Promise.reject(error);
};