import Request from './index';

const request = new Request({
    baseURL: import.meta.env.BASE_URL,
    timeout: 1000 * 60 * 5,
    interceptors: {
      // 请求拦截器
      requestInterceptors: config => {
        console.log('实例请求拦截器')
  
        return config
      },
      // 响应拦截器
      responseInterceptors: result => {
        console.log('实例响应拦截器')
        return result
      },
    },
  })