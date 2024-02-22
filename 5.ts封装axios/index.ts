import axios from 'axios'

import type {AxiosInstance, AxiosRequestConfig,AxiosResopnse} from 'axios'
import { RequestInterceptors, CancelRequestSource } from './types';

import type { RequestConfig,RequestInterceptors } from './types'

class Request {
    //axios 实例
    instance:AxiosInstance

    // interceptors Instance
    interceptorsObj?:RequestInterceptors

    // cancelrequest list 
    cancelRequestSourceList?:CancelRequestSource[]

    //request list
    requestUrlList?:string[]

    constructor(config: RequestConfig){

        this.instance = axios.create(config);
        
        this.requestUrlList = [];
        this.cancelRequestSourceList = [];
        
        this.interceptorsObj = config.interceptors;

        this.instance.interceptors.request.use((res:AxiosRequestConfig)=>{
            console.log("全局请求拦截器");
            return res
        },(err:any)=>err);
        
        // use request interceptors
        this.instance.interceptors.request.use(
            this.interceptorsObj?.requestInterceptor,
            this.interceptorsObj?.requestInterceptorCatch
        )

        // use response interceptors
        this.instance.interceptors.response.use(
            this.interceptorsObj?.responseInterceptor,
            this.interceptorsObj?.responseInterceptorCatch
        )

        this.instance.interceptors.response.use((res:AxiosResopnse)=>{
            console.log("全局响应拦截器");
            return res.data
        },(err:any)=>err);
    }

    //search request url
    private getSourceIndex(url:string):number{
        return this.cancelRequestSourceList?.findIndex((item:CancelRequestSource)=>{
            return Object.keys(item)[0] === url
        },) as number
    }

    //del url

    private delUrl(url:string){
       const urlIndex = this.requestUrlList?.findIndex(u=>u === url);
       const sourceIndex = this.getSourceIndex(url);
       //del url 和cancel fn
       urlIndex !== -1 && this.requestUrlList?.splice(urlIndex as number,1);
       sourceIndex !== -1 && this.cancelRequestSourceList?.splice(sourceIndex as number , 1);
    }

    cancelALLRequest(){
        this.cancelRequestSourceList?.forEach(source =>{
            const key = Object.keys(source)[0];
            source[key]('key')
        })
    }

    cancelRequest(url:string | string[]){
        if(typeof url === 'string'){
           const sourceIndex =this.getSourceIndex(url);
           sourceIndex >= 0 && this.cancelRequestSourceList?.[sourceIndex][url]('sourceIndex][url');
        }else{
            url.forEach(u=>{
                const sourceIndex = this.getsourceIndex(u);
                sourceIndex >=0 && this.cancelRequestSourceList?.[sourceIndex][u]('sourceIndex][u');
            })
           
        }
    }

    request<T>(config:AxiosRequestConfig):Promise<T>{
        return new Promise((resolve,reject)=>{

            if(config.interceptor?.requestInterceptors){
                config = config.interceptors.requestInterceptors(config);
            }

            const url = config.url;
            
            if(url){
                this.requestUrlList?.push(url);
                config.cancelToken = new axios.CancelToken((c)=>{
                    this.cancelRequestSourceList?.push({[url]:c});
                })  
            }
            
            this.instance.request<any,T>(config).then(res=>{
                if(config.interceptors?.responseInterceptors){
                    res = config.interceptors.responseInterceptors<T>(res);
                }
                resolve(res);
            }).catch((err:any)=>{
                reject(err);
            }).finally(() => {     
                url && this.delUrl(url)
            })
        })
    }
}
export default Request