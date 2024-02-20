import type { AxiosRequestConfig, AxiosResponse } from 'axios';
export interface RequestInterceptors {

    //request interceptors

    requestInterceptor?:(config: AxiosRequestConfig)=>AxiosRequestConfig

    requestInterceptorCatch?:(err:any) => any

    //response interceptors

    responseInterceptor?:<T = AxiosRequestConfig>(config:T)=> T

    responseInterceptorCatch?:(err:any) => any
}
//Customizing incoming parameters
export interface RequestConfig extends AxiosRequestConfig {
    interceptors?: RequestInterceptors
}

export interface CancelRequestSource {
    [index: string]: () => void
  }