import { APIRequestContext, APIResponse } from '@playwright/test';
import { Board, RequestOptionsNoBody, RequestOptionsWithBody } from '../types';

export default class TestApiUtils {
    readonly request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    private get: CrudRequest = async (url, options = {}) => {
        return await this.request.get(url, { failOnStatusCode: !options.rawResponse, ...options });
    };

    private post: CrudRequest = async (url, options = {}) => {
        return await this.request.post(url, { failOnStatusCode: !options.rawResponse, ...options });
    };

    private put: CrudRequest = async (url, options = {}) => {
        return await this.request.put(url, { failOnStatusCode: !options.rawResponse, ...options });
    };

    private delete: CrudRequest = async (url, options = {}) => {
        return await this.request.delete(url, { failOnStatusCode: !options.rawResponse, ...options });
    };

    getBoards: AsyncGetFn<Board[]> = async (options?) => {
        const response = await this.get('/api/boards', options);
        return options?.rawResponse ? response : await response.json();
    };

    getBoard: AsyncGetFnWithParam<Board> = async (uuid: string, options?) => {
        const response = await this.get(`/api/boards/${uuid}`, options);
        return options?.rawResponse ? response : await response.json();
    };

    createBoard: AsyncPostFn<{ name: string }, Board> = async (payload, options?) => {
        const response = await this.post('/api/boards', { data: payload, ...options });
        return options?.rawResponse ? response : await response.json();
    };

    deleteBoard: AsyncDeleteFn = async (uuid, options?) => {
        return await this.delete(`/api/boards/${uuid}`, options);
    };
}

type CrudRequest = (url: string, options?: RequestOptionsWithBody & { rawResponse?: boolean }) => Promise<APIResponse>;

type InferType<T> = T extends infer U ? U : never;

type AsyncPostFn<Payload, ReturnType> = <R extends boolean>(
    payload: Payload,
    options?: RequestOptionsWithBody & {
        /**
         * Whether to return APIResponse instead of parsed response.
         * If true, failOnStatusCode will be false by default.
         */
        rawResponse?: R;
    }
) => Promise<InferType<R> extends true ? APIResponse : ReturnType>;

type AsyncDeleteFn = (id: string, options?: RequestOptionsNoBody) => Promise<APIResponse>;

type AsyncGetFn<ReturnType> = <R extends boolean>(
    options?: RequestOptionsNoBody & {
        /**
         * Whether to return APIResponse instead of parsed response.
         * If true, failOnStatusCode will be false by default.
         */
        rawResponse?: R;
    }
) => Promise<InferType<R> extends true ? APIResponse : ReturnType>;

type AsyncGetFnWithParam<ReturnType> = <R extends boolean>(
    param: string,
    options?: RequestOptionsNoBody & {
        /**
         * Whether to return APIResponse instead of parsed response.
         * If true, failOnStatusCode will be false by default.
         */
        rawResponse?: R;
    }
) => Promise<InferType<R> extends true ? APIResponse : ReturnType>;

type AsyncPutFn = (param: string, payload: object, options?: RequestOptionsNoBody) => Promise<APIResponse>;
