import Request from "./index";

import type { RequestConfig } from "./request/types";
interface YWZRequestConfig<T> extends RequestConfig {
    data?: T;
}
interface YWZResponse<T> {
    code: number;
    message: string;
    data: T;
}

const ywzRequest = <D, T = any>(config: YWZRequestConfig<D>) => {
    const { method = "GET" } = config;
    if (method === "get" || method === "GET") {
        config.params = config.data;
    }
    return Request.request<YWZResponse<T>>(config);
};

export default ywzRequest;
